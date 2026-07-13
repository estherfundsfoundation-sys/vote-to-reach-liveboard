/*
 * Server-side only. JOTFORM_API_KEY is read from Vercel's private environment
 * variables; it is never sent to the browser.
 */
const DEFAULT_FORM_IDS = ['261923509398165', '261923179002150'];
const PAID_STATUSES = new Set(['PAID', 'COMPLETED', 'COMPLETE', 'SUCCESS', 'SUCCEEDED', 'APPROVED', 'CAPTURED']);
const FAILED_PAYMENT_STATUSES = new Set(['UNPAID', 'PENDING', 'INCOMPLETE', 'FAILED', 'DECLINED', 'CANCELED', 'CANCELLED', 'VOIDED', 'REFUNDED']);
const DASH_SEPARATOR = /\s+(?:\u2014|\u2013|-)\s+/;

function send(res, status, body) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  // A 15-minute shared cache keeps a Jotform starter-plan key well below its daily call limit.
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=900, stale-while-revalidate=900');
  return res.status(status).json(body);
}

async function jotform(path, apiKey) {
  const response = await fetch(`https://api.jotform.com${path}`, { headers: { APIKEY: apiKey } });
  const envelope = await response.json().catch(() => ({}));
  if (!response.ok || String(envelope.responseCode) !== '200') {
    throw new Error(envelope.message || `Jotform returned ${response.status}`);
  }
  return envelope.content;
}

async function allSubmissions(formId, apiKey) {
  const all = [];
  const limit = 1000;
  for (let offset = 0; offset < 10000; offset += limit) {
    const page = await jotform(`/form/${encodeURIComponent(formId)}/submissions?limit=${limit}&offset=${offset}`, apiKey);
    const entries = Array.isArray(page) ? page : Object.values(page || {});
    all.push(...entries);
    if (entries.length < limit) break;
  }
  return all;
}

function parseJson(value) {
  if (typeof value !== 'string') return value;
  try { return JSON.parse(value); } catch { return value; }
}

function collectProductMap(value, output = new Map(), fallbackId = '') {
  value = parseJson(value);
  if (!value || typeof value !== 'object') return output;
  if (Array.isArray(value)) {
    value.forEach(item => collectProductMap(item, output, fallbackId));
    return output;
  }
  const label = value.name || value.productName || value.product_name || value.title || value.text || value.label;
  const id = value.id || value.productId || value.product_id || value.pid || fallbackId;
  if (label && id) output.set(String(id), String(label));
  for (const [key, child] of Object.entries(value)) collectProductMap(child, output, key);
  return output;
}

async function formProductMap(formId, apiKey) {
  const questions = await jotform(`/form/${encodeURIComponent(formId)}/questions`, apiKey);
  const products = new Map();
  for (const question of Object.values(questions || {})) {
    if (!/payment|product|vote/i.test(`${question.type || ''} ${question.name || ''} ${question.text || ''}`)) continue;
    collectProductMap(question.options, products);
    collectProductMap(question.paymentOptions, products);
    collectProductMap(question.products, products);
    collectProductMap(question.properties, products);
  }
  return products;
}

function deepStrings(value, key = '', output = []) {
  if (value === null || value === undefined) return output;
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    output.push({ key: String(key).toLowerCase(), value: String(value) });
    return output;
  }
  if (Array.isArray(value)) value.forEach(item => deepStrings(item, key, output));
  else if (typeof value === 'object') Object.entries(value).forEach(([childKey, childValue]) => deepStrings(childValue, childKey, output));
  return output;
}

function looksPaid(submission) {
  const fields = deepStrings(submission);
  return fields.some(field => /(payment|transaction|charge|order).*(status|state)|status.*(payment|transaction|charge|order)/.test(field.key) && PAID_STATUSES.has(field.value.trim().toUpperCase()));
}

function isVerifiedSubmission(submission, selections) {
  const fields = deepStrings(submission);
  const paymentStatuses = fields
    .filter(field => /(payment|transaction|charge|order).*(status|state)|status.*(payment|transaction|charge|order)/.test(field.key))
    .map(field => field.value.trim().toUpperCase());
  if (paymentStatuses.some(status => FAILED_PAYMENT_STATUSES.has(status))) return false;
  if (looksPaid(submission)) return true;

  /*
   * Jotform returns completed payment-form entries through the normal
   * submissions endpoint with status ACTIVE. Unpaid attempts live in its
   * separate Incomplete Payments area. Requiring both ACTIVE status and an
   * actual candidate/product selection keeps blank records off the board.
   */
  return String(submission.status || '').toUpperCase() === 'ACTIVE' && selections.length > 0;
}

function candidateNameFromText(value) {
  const cleaned = String(value || '').replace(/\s+/g, ' ').trim();
  if (!cleaned || /^\$?\d/.test(cleaned) || cleaned.length < 4) return null;
  // Product labels are formatted as “Name — School” in the official ballots.
  const name = cleaned.split(DASH_SEPARATOR)[0].trim();
  return name.length >= 3 && name.length < 100 ? name : null;
}

function schoolFromText(value) {
  const parts = String(value || '').split(DASH_SEPARATOR);
  return parts.length > 1 ? parts.slice(1).join(' — ').trim() : '';
}

function countQuantity(value) {
  const direct = Number(value);
  return Number.isFinite(direct) && direct > 0 ? direct : 1;
}

function voteSelections(submission, productMap) {
  const answers = submission.answers || {};
  const selections = [];
  for (const answer of Object.values(answers)) {
    const answerText = `${answer.text || ''} ${answer.name || ''}`.toLowerCase();
    const raw = answer.answer;
    // Payment answers normally include product labels and quantities in their answer object.
    if (!/vote|payment|product/.test(answerText) && !raw) continue;
    if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
      for (const [label, quantity] of Object.entries(raw)) {
        const productLabel = productMap.get(String(label)) || label;
        const name = candidateNameFromText(productLabel);
        if (name) selections.push({ name, school: schoolFromText(productLabel), quantity: countQuantity(quantity?.quantity ?? quantity?.value ?? quantity) });
      }
    }
    const pretty = answer.prettyFormat || answer.value || '';
    if (typeof pretty === 'string' && /[\u2014\u2013-]/.test(pretty)) {
      for (const item of pretty.split(/\n|<br\s*\/?>|\|/i)) {
        const name = candidateNameFromText(item);
        const multiplier = item.match(/(?:x|quantity\s*[:=])\s*(\d+)/i);
        if (name) selections.push({ name, school: schoolFromText(item), quantity: multiplier ? countQuantity(multiplier[1]) : 1 });
      }
    }
  }
  const merged = new Map();
  for (const selection of selections) {
    const key = selection.name.toLowerCase();
    const previous = merged.get(key) || { ...selection, quantity: 0 };
    previous.quantity += selection.quantity;
    merged.set(key, previous);
  }
  return [...merged.values()];
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return send(res, 405, { error: 'Method not allowed' });
  const apiKey = process.env.JOTFORM_API_KEY;
  if (!apiKey) return send(res, 503, { error: 'The secure vote connection is not configured yet.' });
  const formIds = (process.env.JOTFORM_FORM_IDS || DEFAULT_FORM_IDS.join(','))
    .split(',').map(value => value.trim()).filter(Boolean);
  try {
    const [batches, maps] = await Promise.all([
      Promise.all(formIds.map(id => allSubmissions(id, apiKey))),
      Promise.all(formIds.map(id => formProductMap(id, apiKey)))
    ]);
    const candidates = new Map();
    for (const [formIndex, submissions] of batches.entries()) for (const submission of submissions) {
      const selections = voteSelections(submission, maps[formIndex]);
      if (!isVerifiedSubmission(submission, selections)) continue;
      for (const selection of selections) {
        const key = selection.name.toLowerCase();
        const candidate = candidates.get(key) || { name: selection.name, school: selection.school, votes: 0 };
        candidate.votes += selection.quantity;
        if (!candidate.school && selection.school) candidate.school = selection.school;
        candidates.set(key, candidate);
      }
    }
    const values = [...candidates.values()].sort((a, b) => b.votes - a.votes || a.name.localeCompare(b.name));
    return send(res, 200, {
      statusMessage: 'Live verified rankings',
      updatedAt: new Date().toISOString(),
      totalVerifiedVotes: values.reduce((sum, candidate) => sum + candidate.votes, 0),
      candidates: values
    });
  } catch (error) {
    console.error('Vote board sync failed', error);
    return send(res, 503, { error: 'The secure vote counter is reconnecting. Please try again shortly.' });
  }
}
/*
 * Server-side only. JOTFORM_API_KEY is read from Vercel's private environment
 * variables; it is never sent to the browser.
 */
const DEFAULT_FORM_IDS = ['261923509398165', '261923179002150'];
const PAID_STATUSES = new Set(['PAID', 'COMPLETED', 'COMPLETE', 'SUCCESS', 'SUCCEEDED', 'APPROVED', 'CAPTURED']);

function send(res, status, body) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  // A 15-minute shared cache keeps a Jotform starter-plan key well below its daily call limit.
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=900, stale-while-revalidate=900');
  return res.status(status).json(body);
}

async function jotform(path, apiKey) {
  const response = await fetch(`https://api.jotform.com${path}`, { headers: { APIKEY: apiKey } });
  const envelope = await response.json().catch(() => ({}));
  if (!response.ok || String(envelope.responseCode) !== '200') {
    throw new Error(envelope.message || `Jotform returned ${response.status}`);
  }
  return envelope.content;
}

async function allSubmissions(formId, apiKey) {
  const all = [];
  const limit = 1000;
  for (let offset = 0; offset < 10000; offset += limit) {
    const page = await jotform(`/form/${encodeURIComponent(formId)}/submissions?limit=${limit}&offset=${offset}`, apiKey);
    const entries = Array.isArray(page) ? page : Object.values(page || {});
    all.push(...entries);
    if (entries.length < limit) break;
  }
  return all;
}

function parseJson(value) {
  if (typeof value !== 'string') return value;
  try { return JSON.parse(value); } catch { return value; }
}

function collectProductMap(value, output = new Map(), fallbackId = '') {
  value = parseJson(value);
  if (!value || typeof value !== 'object') return output;
  if (Array.isArray(value)) {
    value.forEach(item => collectProductMap(item, output, fallbackId));
    return output;
  }
  const label = value.name || value.productName || value.product_name || value.title || value.text || value.label;
  const id = value.id || value.productId || value.product_id || value.pid || fallbackId;
  if (label && id && /[—–-]/.test(String(label))) output.set(String(id), String(label));
  for (const [key, child] of Object.entries(value)) collectProductMap(child, output, key);
  return output;
}

async function formProductMap(formId, apiKey) {
  const questions = await jotform(`/form/${encodeURIComponent(formId)}/questions`, apiKey);
  const products = new Map();
  for (const question of Object.values(questions || {})) {
    if (!/payment|product|vote/i.test(`${question.type || ''} ${question.name || ''} ${question.text || ''}`)) continue;
    collectProductMap(question.options, products);
    collectProductMap(question.paymentOptions, products);
    collectProductMap(question.products, products);
    collectProductMap(question.properties, products);
  }
  return products;
}

function deepStrings(value, key = '', output = []) {
  if (value === null || value === undefined) return output;
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    output.push({ key: String(key).toLowerCase(), value: String(value) });
    return output;
  }
  if (Array.isArray(value)) value.forEach(item => deepStrings(item, key, output));
  else if (typeof value === 'object') Object.entries(value).forEach(([childKey, childValue]) => deepStrings(childValue, childKey, output));
  return output;
}

function looksPaid(submission) {
  const fields = deepStrings(submission);
  return fields.some(field => /(payment|transaction|charge|order).*(status|state)|status.*(payment|transaction|charge|order)/.test(field.key) && PAID_STATUSES.has(field.value.trim().toUpperCase()));
}

function candidateNameFromText(value) {
  const cleaned = String(value || '').replace(/\s+/g, ' ').trim();
  if (!cleaned || /^\$?\d/.test(cleaned) || cleaned.length < 4) return null;
  // Product labels are formatted as “Name — School” in the official ballots.
  const name = cleaned.split(/\s+[—–-]\s+/)[0].trim();
  return name.length >= 3 && name.length < 100 ? name : null;
}

function schoolFromText(value) {
  const parts = String(value || '').split(/\s+[—–-]\s+/);
  return parts.length > 1 ? parts.slice(1).join(' — ').trim() : '';
}

function countQuantity(value) {
  const direct = Number(value);
  return Number.isFinite(direct) && direct > 0 ? direct : 1;
}

function voteSelections(submission, productMap) {
  const answers = submission.answers || {};
  const selections = [];
  for (const answer of Object.values(answers)) {
    const answerText = `${answer.text || ''} ${answer.name || ''}`.toLowerCase();
    const raw = answer.answer;
    // Payment answers normally include product labels and quantities in their answer object.
    if (!/vote|payment|product/.test(answerText) && !raw) continue;
    if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
      for (const [label, quantity] of Object.entries(raw)) {
        const productLabel = productMap.get(String(label)) || label;
        const name = candidateNameFromText(productLabel);
        if (name) selections.push({ name, school: schoolFromText(productLabel), quantity: countQuantity(quantity?.quantity ?? quantity?.value ?? quantity) });
      }
    }
    const pretty = answer.prettyFormat || answer.value || '';
    if (typeof pretty === 'string' && /[—–-]/.test(pretty)) {
      for (const item of pretty.split(/\n|<br\s*\/?>|\|/i)) {
        const name = candidateNameFromText(item);
        const multiplier = item.match(/(?:x|quantity\s*[:=])\s*(\d+)/i);
        if (name) selections.push({ name, school: schoolFromText(item), quantity: multiplier ? countQuantity(multiplier[1]) : 1 });
      }
    }
  }
  const merged = new Map();
  for (const selection of selections) {
    const key = selection.name.toLowerCase();
    const previous = merged.get(key) || { ...selection, quantity: 0 };
    previous.quantity += selection.quantity;
    merged.set(key, previous);
  }
  return [...merged.values()];
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return send(res, 405, { error: 'Method not allowed' });
  const apiKey = process.env.JOTFORM_API_KEY;
  if (!apiKey) return send(res, 503, { error: 'The secure vote connection is not configured yet.' });
  const formIds = (process.env.JOTFORM_FORM_IDS || DEFAULT_FORM_IDS.join(','))
    .split(',').map(value => value.trim()).filter(Boolean);
  try {
    const [batches, maps] = await Promise.all([
      Promise.all(formIds.map(id => allSubmissions(id, apiKey))),
      Promise.all(formIds.map(id => formProductMap(id, apiKey)))
    ]);
    const candidates = new Map();
    for (const [formIndex, submissions] of batches.entries()) for (const submission of submissions) {
      if (!looksPaid(submission)) continue;
      for (const selection of voteSelections(submission, maps[formIndex])) {
        const key = selection.name.toLowerCase();
        const candidate = candidates.get(key) || { name: selection.name, school: selection.school, votes: 0 };
        candidate.votes += selection.quantity;
        if (!candidate.school && selection.school) candidate.school = selection.school;
        candidates.set(key, candidate);
      }
    }
    const values = [...candidates.values()].sort((a, b) => b.votes - a.votes || a.name.localeCompare(b.name));
    return send(res, 200, {
      statusMessage: 'Live verified rankings',
      updatedAt: new Date().toISOString(),
      totalVerifiedVotes: values.reduce((sum, candidate) => sum + candidate.votes, 0),
      candidates: values
    });
  } catch (error) {
    console.error('Vote board sync failed', error);
    return send(res, 503, { error: 'The secure vote counter is reconnecting. Please try again shortly.' });
  }
}
