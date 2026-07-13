<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#080713" />
    <meta name="description" content="The official Vote to REACH Scholarship Competition live rankings board." />
    <title>Vote to REACH | Live Rankings</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />
    <style>
:root{--ink:#080713;--ink-soft:#121024;--panel:rgba(19,15,42,.78);--line:rgba(209,184,255,.22);--text:#f8f5ff;--muted:#bdb5d5;--purple:#8d43ff;--cyan:#00e5ff;--pink:#ff2dc7;--gold:#ffe29a;--shadow:0 24px 80px rgba(0,0,0,.35)}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;min-width:320px;background:var(--ink);color:var(--text);font-family:"DM Sans",Arial,sans-serif;overflow-x:hidden}body:before{content:"";z-index:-3;position:fixed;inset:0;background:radial-gradient(circle at 18% 12%,rgba(112,28,225,.3),transparent 26rem),radial-gradient(circle at 89% 38%,rgba(0,198,255,.16),transparent 25rem),radial-gradient(circle at 50% 95%,rgba(255,36,194,.14),transparent 30rem)}.sky{pointer-events:none;position:fixed;z-index:-2;inset:0;opacity:.66;background-image:radial-gradient(circle at 11% 24%,#fff 0 1px,transparent 1.5px),radial-gradient(circle at 72% 12%,#f7e5ff 0 1px,transparent 1.5px),radial-gradient(circle at 52% 42%,#9eeeff 0 1px,transparent 1.5px),radial-gradient(circle at 32% 78%,#fff 0 1px,transparent 1.5px);background-size:337px 277px,411px 319px,247px 263px,381px 413px;animation:drift 35s linear infinite}.sky span{position:absolute;border-radius:50%;filter:blur(4px);opacity:.7}.sky span:first-child{width:15rem;height:15rem;left:-8rem;top:46%;background:#661df1}.sky span:nth-child(2){width:12rem;height:12rem;right:-4rem;top:15%;background:#00bede}.sky span:nth-child(3){width:9rem;height:9rem;left:61%;bottom:-3rem;background:#ee18c7}.orbit{pointer-events:none;position:absolute;z-index:-1;border:1px solid rgba(188,127,255,.2);border-radius:50%;filter:drop-shadow(0 0 12px rgba(141,67,255,.2));transform:rotate(-22deg)}.orbit-one{width:100rem;height:32rem;top:9rem;left:50%;margin-left:-50rem}.orbit-two{width:88rem;height:31rem;top:23rem;left:50%;margin-left:-44rem;border-color:rgba(0,229,255,.13)}
.site-header{width:min(1180px,calc(100% - 42px));margin:auto;padding:25px 0;display:flex;align-items:center;justify-content:space-between}.brand{display:grid;color:#fff;text-decoration:none;line-height:1}.brand-wordmark{display:block;font:700 clamp(1.35rem,2vw,1.72rem)/.9 "Space Grotesk",sans-serif;letter-spacing:-.1em}.brand-wordmark:after{content:"";display:block;width:100%;height:2px;margin-top:7px;background:linear-gradient(90deg,var(--pink),var(--purple),var(--cyan));box-shadow:0 0 8px var(--purple)}.brand-subtitle{margin-top:6px;text-transform:uppercase;font-size:.47rem;letter-spacing:.17em;color:#ddd2f4}.header-link{color:#e8deff;text-decoration:none;font-weight:700;font-size:.87rem}.header-link:hover{color:var(--cyan)}
.hero{width:min(900px,calc(100% - 42px));margin:0 auto;padding:95px 0 72px;text-align:center}.eyebrow{margin:0 0 13px;color:var(--cyan);font-size:.69rem;font-weight:700;letter-spacing:.16em}.hero h1,.section-heading h2,.vote-panel h2,.how-it-works h2{margin:0;font-family:"Space Grotesk",sans-serif;letter-spacing:-.065em}.hero h1{font-size:clamp(4rem,12vw,8.8rem);line-height:.85}.hero h1 span,.section-heading h2 span{background:linear-gradient(110deg,#f5c7ff,#9f5cff 40%,#28deff);-webkit-background-clip:text;background-clip:text;color:transparent}.hero-copy{max-width:650px;margin:27px auto 20px;color:#d5cde6;font-size:clamp(1rem,2vw,1.2rem);line-height:1.65}.live-status{display:inline-flex;align-items:center;gap:9px;border:1px solid rgba(0,229,255,.24);border-radius:100px;padding:9px 14px;background:rgba(0,229,255,.06);color:#d9fbff;font-size:.8rem;font-weight:700}.pulse{display:block;width:8px;height:8px;border-radius:50%;background:var(--cyan);box-shadow:0 0 0 0 rgba(0,229,255,.55);animation:pulse 1.8s infinite}.hero-actions{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:27px}.button{border-radius:12px;padding:14px 18px;text-decoration:none;font-size:.92rem;font-weight:700;transition:transform .18s ease,box-shadow .18s ease}.button:hover{transform:translateY(-3px)}.button-primary{color:#10061d;background:linear-gradient(110deg,#f3c6ff,#a25cff 50%,#51e7ff);box-shadow:0 12px 30px rgba(131,58,255,.32)}.button-secondary{color:#fbf8ff;border:1px solid var(--line);background:rgba(255,255,255,.05)}.refresh-note{color:#a99fc1;font-size:.75rem;margin:17px 0 0}
.stats{width:min(1050px,calc(100% - 42px));margin:0 auto;display:grid;grid-template-columns:repeat(3,1fr);border:1px solid var(--line);border-radius:20px;background:rgba(18,13,42,.64);backdrop-filter:blur(13px);box-shadow:var(--shadow)}.stats article{padding:23px 28px}.stats article+article{border-left:1px solid var(--line)}.stat-label{display:block;color:var(--muted);font-size:.76rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em}.stats strong{display:block;font:700 clamp(1.4rem,4vw,2.5rem)/1 "Space Grotesk",sans-serif;color:#fff;margin-top:9px}
.rankings{width:min(1180px,calc(100% - 42px));margin:120px auto}.section-heading{display:flex;justify-content:space-between;align-items:end;gap:28px;margin-bottom:35px}.section-heading h2{font-size:clamp(2.5rem,6vw,4.5rem);line-height:.94}.section-caption{max-width:350px;margin:0;color:var(--muted);font-size:.9rem;line-height:1.55}.podium{display:grid;grid-template-columns:repeat(3,1fr);gap:17px;margin-bottom:19px}.podium-card,.candidate-card{position:relative;overflow:hidden;border:1px solid var(--line);border-radius:22px;background:linear-gradient(145deg,rgba(34,25,68,.92),rgba(12,10,28,.92));box-shadow:0 12px 30px rgba(0,0,0,.15)}.podium-card:before,.candidate-card:before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 100% 0,rgba(0,229,255,.14),transparent 30%),radial-gradient(circle at 0 100%,rgba(255,45,199,.1),transparent 25%);pointer-events:none}.podium-card{padding:22px;min-height:235px;display:flex;flex-direction:column;justify-content:end}.podium-card[data-rank="1"]{border-color:rgba(255,226,154,.75);background:linear-gradient(145deg,rgba(70,46,83,.95),rgba(24,16,38,.95));transform:translateY(-13px)}.rank-mark{position:absolute;top:18px;right:20px;font:700 2.7rem/1 "Space Grotesk",sans-serif;color:rgba(255,255,255,.1)}.rank-label{display:inline-flex;align-self:flex-start;padding:5px 9px;border-radius:20px;background:rgba(255,255,255,.08);color:var(--gold);font-size:.68rem;font-weight:700;letter-spacing:.09em}.candidate-school{margin:7px 0 0;color:var(--muted);font-size:.76rem;line-height:1.35}.candidate-name{margin:13px 0 0;font:600 1.25rem/1.1 "Space Grotesk",sans-serif}.vote-count{margin-top:16px;color:var(--cyan);font-size:.86rem;font-weight:700}.candidate-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.candidate-card{display:flex;align-items:center;gap:14px;padding:17px}.candidate-card .rank-mark{position:static;min-width:28px;color:#a994d2;font:700 1.05rem "Space Grotesk",sans-serif}.candidate-card .candidate-name{margin:0;font-size:1rem}.candidate-card .candidate-school{margin:5px 0 0}.candidate-card .vote-count{margin:0 0 0 auto;white-space:nowrap;font-size:.78rem}.loading-card{grid-column:1/-1;min-height:240px;display:grid;place-content:center;justify-items:center;color:var(--muted);text-align:center;border:1px solid var(--line);border-radius:22px;background:rgba(255,255,255,.025)}.loader{width:30px;height:30px;border-radius:50%;border:3px solid rgba(255,255,255,.12);border-top-color:var(--cyan);animation:spin 1s linear infinite}.loading-card p{margin:13px 0 0}.empty-state{grid-column:1/-1;padding:50px 20px;text-align:center;border:1px solid var(--line);border-radius:22px;background:rgba(255,255,255,.025)}.empty-state h3{margin:0;font:600 1.3rem "Space Grotesk",sans-serif}.empty-state p{max-width:500px;margin:11px auto 0;color:var(--muted);line-height:1.55}
.vote-panel{width:min(1180px,calc(100% - 42px));margin:0 auto 112px;padding:50px;display:grid;grid-template-columns:.9fr 1.1fr;gap:45px;border:1px solid rgba(183,128,255,.34);border-radius:30px;background:linear-gradient(120deg,rgba(69,22,121,.84),rgba(15,17,56,.9) 70%,rgba(0,133,172,.44));box-shadow:var(--shadow)}.vote-panel h2{font-size:clamp(2.2rem,4vw,3.55rem);line-height:.98}.vote-panel p:not(.eyebrow){max-width:450px;color:#ded5ed;line-height:1.65}.ballot-actions{display:grid;gap:12px;align-content:center}.ballot-card{display:flex;align-items:center;gap:14px;padding:15px;border:1px solid rgba(255,255,255,.18);border-radius:15px;background:rgba(9,7,23,.38);text-decoration:none;color:#fff;transition:transform .18s ease,border-color .18s ease}.ballot-card:hover{transform:translateX(5px);border-color:var(--cyan)}.ballot-icon{display:grid;place-items:center;flex:0 0 43px;height:43px;border-radius:12px;color:#1a0830;background:linear-gradient(135deg,#eec8ff,#8c44fa,#34e7ff);font:700 .75rem "Space Grotesk",sans-serif}.ballot-card b,.ballot-card small{display:block}.ballot-card b{font-size:.93rem}.ballot-card small{margin-top:3px;color:#cbbfe4;font-size:.75rem}.ballot-card i{font-style:normal;margin-left:auto;color:var(--cyan);font-size:1.1rem}
.how-it-works{width:min(1050px,calc(100% - 42px));margin:0 auto 110px;display:grid;grid-template-columns:.75fr 1.25fr;gap:70px}.how-it-works h2{font-size:clamp(2rem,4vw,3.4rem);line-height:1}.how-it-works ol{display:grid;gap:22px;margin:0;padding:0;list-style:none}.how-it-works li{display:flex;gap:17px}.how-it-works li>span{display:grid;place-items:center;flex:0 0 34px;height:34px;border:1px solid rgba(0,229,255,.4);border-radius:50%;color:var(--cyan);font:700 .82rem "Space Grotesk",sans-serif}.how-it-works b{font-size:1rem}.how-it-works li p{margin:5px 0 0;color:var(--muted);line-height:1.5;font-size:.89rem}footer{width:min(1180px,calc(100% - 42px));margin:auto;padding:27px 0 34px;display:flex;justify-content:space-between;align-items:end;border-top:1px solid var(--line);color:#a69cbd;font-size:.77rem}footer .brand-wordmark{font-size:1.15rem;color:#fff}footer .brand-wordmark:after{height:1px;margin-top:4px}footer p{margin:8px 0 0}
@keyframes drift{to{background-position:337px 277px,411px 319px,247px 263px,381px 413px}}@keyframes pulse{70%{box-shadow:0 0 0 9px transparent}}@keyframes spin{to{transform:rotate(360deg)}}
@media(max-width:760px){.site-header{width:min(100% - 28px,1180px)}.header-link{display:none}.hero{width:min(100% - 30px,900px);padding:74px 0 52px}.stats{width:min(100% - 30px,1050px)}.stats article{padding:19px 13px}.stats strong{font-size:1.35rem}.rankings{width:min(100% - 30px,1180px);margin:85px auto}.section-heading,.how-it-works{display:block}.section-caption{margin-top:16px}.podium{grid-template-columns:1fr}.podium-card[data-rank="1"]{transform:none;order:-1}.candidate-grid{grid-template-columns:1fr}.vote-panel{width:min(100% - 30px,1180px);margin-bottom:80px;padding:32px 21px;grid-template-columns:1fr;gap:23px;border-radius:23px}.how-it-works{width:min(100% - 30px,1050px);margin-bottom:80px}.how-it-works ol{margin-top:32px}footer{width:min(100% - 30px,1180px);display:block}footer>p{margin-top:22px}.orbit-one{top:16rem}.orbit-two{top:26rem}}

    </style>
  </head>
  <body>
    <div class="sky" aria-hidden="true"><span></span><span></span><span></span></div>
    <div class="orbit orbit-one" aria-hidden="true"></div>
    <div class="orbit orbit-two" aria-hidden="true"></div>
    <header class="site-header">
      <a class="brand" href="#top" aria-label="Vote to REACH home">
        <span class="brand-wordmark">r.e.a.c.h.</span>
        <span class="brand-subtitle">by Esther Funds Foundation</span>
      </a>
      <a class="header-link" href="#how-it-works">How it works <span aria-hidden="true">↓</span></a>
    </header>

    <main id="top">
      <section class="hero" aria-labelledby="page-title">
        <p class="eyebrow">2026 SCHOLARSHIP COMPETITION</p>
        <h1 id="page-title">Vote to <span>REACH.</span></h1>
        <p class="hero-copy">The live rankings board for students reaching toward their educational future. Every verified vote helps power scholarship opportunity.</p>
        <div class="live-status" id="live-status" role="status" aria-live="polite">
          <span class="pulse" aria-hidden="true"></span>
          <span id="status-copy">Loading verified vote totals…</span>
        </div>
        <div class="hero-actions">
          <a class="button button-primary" href="#rankings">See live rankings <span aria-hidden="true">↓</span></a>
          <a class="button button-secondary" href="#vote">Cast your vote <span aria-hidden="true">↗</span></a>
        </div>
        <p class="refresh-note" id="refresh-note">Results refresh securely throughout the day.</p>
      </section>

      <section class="stats" aria-label="Competition totals">
        <article>
          <span class="stat-label">Verified votes</span>
          <strong id="total-votes">—</strong>
        </article>
        <article>
          <span class="stat-label">Students in the running</span>
          <strong id="candidate-count">—</strong>
        </article>
        <article>
          <span class="stat-label">Prize opportunity</span>
          <strong>Up to $2K</strong>
        </article>
      </section>

      <section class="rankings" id="rankings" aria-labelledby="rankings-title">
        <div class="section-heading">
          <div>
            <p class="eyebrow">THE LEADERBOARD</p>
            <h2 id="rankings-title">REACH <span>rankings</span></h2>
          </div>
          <p class="section-caption">Only completed and verified votes appear here. This board never displays voter names, emails, or payment details.</p>
        </div>
        <div class="podium" id="podium" aria-live="polite"></div>
        <div class="candidate-grid" id="candidate-grid" aria-live="polite">
          <div class="loading-card"><span class="loader" aria-hidden="true"></span><p>Connecting to the secure vote counter…</p></div>
        </div>
      </section>

      <section class="vote-panel" id="vote" aria-labelledby="vote-title">
        <div class="vote-panel-copy">
          <p class="eyebrow">MAKE YOUR VOTE COUNT</p>
          <h2 id="vote-title">Your vote opens a door.</h2>
          <p>$1.50 = one vote. Votes are made only through the official secure ballots and then appear on this board after verification.</p>
        </div>
        <div class="ballot-actions">
          <a class="ballot-card" href="https://pci.jotform.com/form/261923509398165" target="_blank" rel="noopener noreferrer">
            <span class="ballot-icon">01</span>
            <span><b>Official Ballot A</b><small>Open secure voting form</small></span>
            <i aria-hidden="true">↗</i>
          </a>
          <a class="ballot-card" href="https://pci.jotform.com/form/261923179002150" target="_blank" rel="noopener noreferrer">
            <span class="ballot-icon">02</span>
            <span><b>Official Ballot B</b><small>Open secure voting form</small></span>
            <i aria-hidden="true">↗</i>
          </a>
        </div>
      </section>

      <section class="how-it-works" id="how-it-works" aria-labelledby="how-title">
        <div>
          <p class="eyebrow">CLEAR. FAIR. VERIFIED.</p>
          <h2 id="how-title">How the board works</h2>
        </div>
        <ol>
          <li><span>1</span><div><b>Vote securely</b><p>Votes are submitted through the official Jotform ballot—not on this page.</p></div></li>
          <li><span>2</span><div><b>Verify each vote</b><p>The board counts completed payment records only, keeping the competition fair.</p></div></li>
          <li><span>3</span><div><b>Watch the impact</b><p>Rankings update on a secure schedule and protect every voter’s personal information.</p></div></li>
        </ol>
      </section>
    </main>

    <footer>
      <div><span class="brand-wordmark">r.e.a.c.h.</span><p>Every Future Fulfilled.</p></div>
      <p>© <span id="year"></span> Esther Funds Foundation</p>
    </footer>
    <script>
const board = {
  totalVotes: document.getElementById('total-votes'),
  candidateCount: document.getElementById('candidate-count'),
  candidateGrid: document.getElementById('candidate-grid'),
  podium: document.getElementById('podium'),
  status: document.getElementById('status-copy'),
  refresh: document.getElementById('refresh-note')
};

const displayNumber = value => new Intl.NumberFormat('en-US').format(Number(value || 0));
const escapeHtml = value => String(value || '').replace(/[&<>'"]/g, char => ({ '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;' }[char]));

function candidateMarkup(candidate, rank, podium = false) {
  const safeName = escapeHtml(candidate.name || 'Candidate');
  const safeSchool = escapeHtml(candidate.school || 'REACH Scholarship Competition');
  const votes = Number.isFinite(Number(candidate.votes)) ? `${displayNumber(candidate.votes)} verified votes` : 'Verification in progress';
  if (podium) {
    const medal = rank === 1 ? 'LEADING' : rank === 2 ? 'SECOND PLACE' : 'THIRD PLACE';
    return `<article class="podium-card" data-rank="${rank}"><span class="rank-mark">0${rank}</span><span class="rank-label">${medal}</span><h3 class="candidate-name">${safeName}</h3><p class="candidate-school">${safeSchool}</p><p class="vote-count">${votes}</p></article>`;
  }
  return `<article class="candidate-card"><span class="rank-mark">${rank}</span><div><h3 class="candidate-name">${safeName}</h3><p class="candidate-school">${safeSchool}</p></div><p class="vote-count">${votes}</p></article>`;
}

function render(data) {
  const candidates = Array.isArray(data.candidates) ? data.candidates : [];
  const numericVotes = candidates.every(candidate => Number.isFinite(Number(candidate.votes)));
  const sorted = [...candidates].sort((a, b) => numericVotes ? Number(b.votes) - Number(a.votes) || String(a.name).localeCompare(String(b.name)) : String(a.name).localeCompare(String(b.name)));
  board.totalVotes.textContent = numericVotes ? displayNumber(data.totalVerifiedVotes) : '—';
  board.candidateCount.textContent = candidates.length ? displayNumber(candidates.length) : '—';
  board.status.textContent = data.statusMessage || (numericVotes ? 'Live verified rankings' : 'Results are being prepared');
  if (data.updatedAt) {
    const updated = new Intl.DateTimeFormat('en-US', { dateStyle:'medium', timeStyle:'short' }).format(new Date(data.updatedAt));
    board.refresh.textContent = `Last secure refresh: ${updated}. Results refresh automatically.`;
  }
  if (!candidates.length) {
    board.podium.innerHTML = '';
    board.candidateGrid.innerHTML = `<div class="empty-state"><h3>Rankings are preparing for launch.</h3><p>The official board is connected securely before totals go live. Come back shortly—no votes are collected on this page.</p></div>`;
    return;
  }
  board.podium.innerHTML = sorted.slice(0, 3).map((candidate, index) => candidateMarkup(candidate, index + 1, true)).join('');
  board.candidateGrid.innerHTML = sorted.slice(3).map((candidate, index) => candidateMarkup(candidate, index + 4)).join('') || '';
}

async function loadBoard() {
  try {
    const response = await fetch('/api/leaderboard', { headers: { Accept: 'application/json' } });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Board is not available yet');
    render(data);
  } catch (error) {
    console.warn('Leaderboard unavailable:', error);
    render({ statusMessage:'Secure vote sync is being prepared', candidates: [] });
    board.refresh.textContent = 'The official voting forms remain available while the live board reconnects.';
  }
}

document.getElementById('year').textContent = new Date().getFullYear();
loadBoard();
window.setInterval(loadBoard, 120000);

    </script>
  </body>
</html>
