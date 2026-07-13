/*
 * Server-side only. JOTFORM_API_KEY is read from Vercel's private environment
 * variables; it is never sent to the browser.
 */
const DEFAULT_FORM_IDS = ['261923509398165', '261923179002150'];
const PAID_STATUSES = new Set(['PAID', 'COMPLETED', 'COMPLETE', 'SUCCESS', 'SUCCEEDED', 'APPROVED', 'CAPTURED']);
const FAILED_PAYMENT_STATUSES = new Set(['UNPAID', 'PENDING', 'INCOMPLETE', 'FAILED', 'DECLINED', 'CANCELED', 'CANCELLED', 'VOIDED', 'REFUNDED']);
const DASH_SEPARATOR = /\s+(?:\u2014|\u2013|-)\s+/;
const PRIVATE_PAYMENT_TEXT = /(?:transaction|order[_\s-]?id|payment[_\s-]?id|paymentarray|charge[_\s-]?id|receipt|client[_\s-]?secret|customer[_\s-]?id|stripe|paypal|\bpi_[a-z0-9]+)/i;
const PRIVATE_PAYMENT_KEY = /(?:transaction|order[_-]?id|payment[_-]?id|charge[_-]?id|receipt|client[_-]?secret|customer[_-]?id)/i;

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
  if (!cleaned || PRIVATE_PAYMENT_TEXT.test(cleaned) || /^\$?\d/.test(cleaned) || cleaned.length < 4) return null;
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

function sameLabel(left, right) {
  return String(left || '').replace(/\s+/g, ' ').trim().toLowerCase() === String(right || '').replace(/\s+/g, ' ').trim().toLowerCase();
}

function collectProductSelections(value, productMap, output, context = '', depth = 0) {
  if (depth > 8) return;
  value = parseJson(value);
  if (!value) return;
  if (Array.isArray(value)) {
    value.forEach(item => collectProductSelections(item, productMap, output, context, depth + 1));
    return;
  }
  if (typeof value !== 'object') return;

  const embeddedId = value.id || value.productId || value.product_id || value.pid || '';
  const explicitLabel = value.name || value.productName || value.product_name || value.title || value.label || '';
  const mappedLabel = productMap.get(String(embeddedId)) || [...productMap.values()].find(label => sameLabel(label, explicitLabel));
  const productContext = /product|item|cart|paymentarray|line/i.test(context);
  const hasProductIdentity = Boolean(value.pid || value.productId || value.product_id || value.item_id);
  const looksLikeSelectedProduct = hasProductIdentity && explicitLabel && (value.quantity || value.qty || value.price || value.selected);
  const label = mappedLabel || (looksLikeSelectedProduct || (productContext && explicitLabel && (value.quantity || value.qty || value.price || embeddedId)) ? explicitLabel : '');
  if (label && !PRIVATE_PAYMENT_TEXT.test(String(label))) {
    output.push({
      name: candidateNameFromText(label),
      school: schoolFromText(label),
      quantity: countQuantity(value.quantity ?? value.qty ?? value.value ?? 1)
    });
  }

  for (const [key, child] of Object.entries(value)) {
    if (PRIVATE_PAYMENT_KEY.test(key)) continue;
    const directLabel = productMap.get(String(key));
    if (directLabel) {
      output.push({
        name: candidateNameFromText(directLabel),
        school: schoolFromText(directLabel),
        quantity: countQuantity(child?.quantity ?? child?.qty ?? child?.value ?? child)
      });
      continue;
    }
    collectProductSelections(child, productMap, output, `${context}.${key}`, depth + 1);
  }
}

function voteSelections(submission, productMap) {
  const answers = submission.answers || {};
  const selections = [];
  for (const answer of Object.values(answers)) {
    const answerText = `${answer.text || ''} ${answer.name || ''} ${answer.type || ''}`.toLowerCase();
    const raw = answer.answer;
    if (!/vote|payment|product|candidate|scholarship/.test(answerText)) continue;
    const answerSelections = [];
    collectProductSelections(raw, productMap, answerSelections, 'paymentAnswer');
    const pretty = answer.prettyFormat || answer.value || '';
    if (typeof pretty === 'string') {
      for (const productLabel of new Set(productMap.values())) {
        if (!pretty.toLowerCase().includes(String(productLabel).toLowerCase())) continue;
        const nearby = pretty.slice(Math.max(0, pretty.toLowerCase().indexOf(String(productLabel).toLowerCase())), pretty.toLowerCase().indexOf(String(productLabel).toLowerCase()) + String(productLabel).length + 80);
        const multiplier = nearby.match(/(?:x|quantity\s*[:=])\s*(\d+)/i);
        answerSelections.push({ name: candidateNameFromText(productLabel), school: schoolFromText(productLabel), quantity: multiplier ? countQuantity(multiplier[1]) : 1 });
      }
    }
    const perAnswer = new Map();
    for (const selection of answerSelections.filter(item => item.name)) {
      const key = selection.name.toLowerCase();
      const previous = perAnswer.get(key);
      if (!previous || selection.quantity > previous.quantity) perAnswer.set(key, selection);
    }
    selections.push(...perAnswer.values());
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
