(function () {
  'use strict';

  var PRO_KEY = 'scriptly.pro.v1';
  var USAGE_KEY = 'scriptly.usage.v1';
  var SAVED_KEY = 'scriptly.saved.v1';
  var FREE_DAILY_LIMIT = 3;
  var PRO_CHECKOUT_URL = ''; // paste Stripe Payment Link here

  // ── Hook library ─────────────────────────────────────────────────────────────
  var HOOKS = {
    curiosity: {
      label: 'Curiosity Gap', emoji: '🤔', color: '#f59e0b',
      tagline: 'Make them need to watch',
      hooks: [
        'I discovered a {niche} secret that nobody talks about...',
        'The {topic} trick that most {audience} have never heard of',
        'Nobody warned me about this when I started {niche}',
        'There\'s something about {topic} that finally clicked for me...',
        'I tested {topic} for 30 days straight and what happened shocked me',
      ],
      body: [
        'Tease the mystery — hint at what you found without revealing it yet',
        'Build tension — explain why this matters specifically to {audience}',
        'The reveal — share your actual insight, be specific and concrete',
        'Make it actionable — one thing they can do TODAY',
      ]
    },
    hottake: {
      label: 'Hot Take', emoji: '🔥', color: '#ef4444',
      tagline: 'Spark comments with a bold opinion',
      hooks: [
        'Unpopular opinion: most {niche} advice is completely wrong',
        'I\'m going to say what nobody in {niche} wants to admit about {topic}',
        'The {niche} myth that {audience} need to stop believing right now',
        'Everyone gets {topic} backwards — here\'s the truth',
        'Stop doing {topic} the way everyone tells you to',
      ],
      body: [
        'State your bold claim directly — no hedging, no softening',
        'Acknowledge the popular belief you\'re pushing back against',
        'Drop your strongest evidence or personal experience',
        'Address the obvious objection before they comment it',
      ]
    },
    story: {
      label: 'Personal Story', emoji: '📖', color: '#8b5cf6',
      tagline: 'Hook them with a real journey',
      hooks: [
        'Two years ago I knew absolutely nothing about {niche}. Here\'s what happened.',
        'I failed at {topic} for months before I figured out what actually works',
        'The moment that completely changed my approach to {niche}',
        'I almost quit {niche} until this one thing happened...',
        'How {topic} went from my biggest struggle to my biggest strength',
      ],
      body: [
        'The BEFORE — where you started, be vulnerable and specific',
        'The TURNING POINT — the exact moment things changed',
        'What you actually learned — the insight, not just the outcome',
        'The AFTER — where you are now (relatable, not braggy)',
      ]
    },
    tutorial: {
      label: 'Tutorial / How-To', emoji: '✅', color: '#10b981',
      tagline: 'Step-by-step value that saves',
      hooks: [
        'How to {topic} in 3 steps even if you\'re a complete beginner',
        'The exact {topic} method that actually works in {year}',
        'Watch me {topic} from start to finish in under a minute',
        'The beginner\'s guide to {topic} — no fluff, just the stuff that works',
        'Do this one thing to massively improve your {topic}',
      ],
      body: [
        'Promise the outcome — \'by the end you\'ll know exactly how to...\'',
        'Step 1 — the foundation most {audience} skip entirely',
        'Step 2 — the most important part (spend the most time here)',
        'Step 3 — the finishing detail that makes all the difference',
      ]
    },
    stats: {
      label: 'Shocking Statistic', emoji: '📊', color: '#0ea5e9',
      tagline: 'Data that stops mid-scroll',
      hooks: [
        '9 out of 10 {audience} making this one {topic} mistake',
        'Most {audience} waste months on {topic} because of this',
        'The number one reason {audience} fail at {topic} — and it\'s not what you think',
        'Here\'s the brutal truth about {topic} that nobody in {niche} will tell you',
        'After years in {niche}, here\'s the one stat that changed everything for me',
      ],
      body: [
        'Sell the stat hard — commit to the number, make it land',
        'Why this actually matters for YOUR specific audience',
        'The reason most {audience} fall into this category',
        'What the top performers do differently — the fix in one step',
      ]
    },
    warning: {
      label: 'Warning / Alert', emoji: '⚠️', color: '#f97316',
      tagline: 'Protect them from a costly mistake',
      hooks: [
        'If you\'re {audience} doing {topic}, watch this before you go further',
        'Stop {topic} right now if you\'re making any of these mistakes',
        'The {niche} mistake that costs {audience} everything',
        'STOP. Before you {topic}, there\'s something you need to know',
        'I wish someone warned me about this before I started {topic}',
      ],
      body: [
        'Identify the danger — who this applies to and exactly why they\'re at risk',
        'Show the consequence — what actually happens if they ignore this',
        'The most common form of this mistake (make it instantly recognizable)',
        'The fix — specific action they can take right now to protect themselves',
      ]
    },
    pov: {
      label: 'Relatable POV', emoji: '😩', color: '#ec4899',
      tagline: 'Make them feel completely seen',
      hooks: [
        'POV: You\'re {audience} trying to figure out {topic}',
        'Me as {audience} discovering {topic} for the first time:',
        'Every {audience} when they realize {topic} doesn\'t have to be this hard:',
        'Tell me you\'re {audience} without telling me — spending hours on {topic} and getting nowhere',
        'The face I made when I finally understood {topic}:',
      ],
      body: [
        'Paint the scene — describe the relatable moment with vivid, specific detail',
        'Name the emotion — exactly what they\'re feeling in that moment',
        'The realization — the aha moment that changes everything',
        'The shortcut — how they can get there in half the time',
      ]
    },
    list: {
      label: 'Power List', emoji: '📋', color: '#06b6d4',
      tagline: 'Promise X things and deliver all of them',
      hooks: [
        '3 {niche} tips every {audience} needs to know (saving for later)',
        'The 5 biggest {topic} mistakes and exactly how to fix them',
        '4 things I wish I knew about {topic} before I started',
        '3 {niche} tools that changed my life as {audience}',
        '5 signs you\'re finally getting good at {topic}',
      ],
      body: [
        'Open strong: \'[X] things, starting with the most important\'',
        'Item 1 — most surprising or counterintuitive (hook them in immediately)',
        'Item 2 — the practical, immediately-actionable one',
        'Item 3 — the golden nugget they\'ll screenshot',
      ]
    },
  };

  // ── Hashtag library ───────────────────────────────────────────────────────────
  var NICHE_TAGS = {
    finance: ['#personalfinance','#moneytips','#financialfreedom','#savingmoney','#investing','#budgeting','#richgirlera','#wealthbuilding'],
    money: ['#money','#personalfinance','#financialtips','#moneymindset','#savingmoney','#passiveincome','#makemoneyonline'],
    investing: ['#investing','#stocks','#stockmarket','#passiveincome','#wealthbuilding','#financialliteracy','#dividends'],
    fitness: ['#fitness','#workout','#gym','#fitnessmotivation','#healthylifestyle','#exercise','#gains','#fittok'],
    workout: ['#workout','#gym','#fitness','#training','#musclebuilding','#weightloss','#cardio','#fittok'],
    cooking: ['#cooking','#recipe','#foodtok','#food','#easyrecipes','#mealprep','#homecooking','#foodie'],
    food: ['#food','#foodtok','#recipe','#cooking','#foodie','#easyrecipes','#yummy','#foodlover'],
    fashion: ['#fashion','#ootd','#style','#fashiontok','#outfitinspo','#aesthetic','#streetstyle','#outfitoftheday'],
    beauty: ['#beauty','#makeup','#skincare','#beautytips','#glowup','#makeuptutorial','#skincareroutine','#beautytok'],
    skincare: ['#skincare','#skincareRoutine','#glowup','#skincaretips','#clearskin','#beautytok','#skincarecommunity'],
    business: ['#business','#entrepreneur','#sidehustle','#smallbusiness','#makemoneyonline','#businesstips','#startup','#hustle'],
    entrepreneur: ['#entrepreneur','#entrepreneurlife','#businessowner','#startup','#sidehustle','#grindset','#businessmindset'],
    productivity: ['#productivity','#studytok','#selfimprovement','#motivation','#lifehacks','#timemanagement','#habits','#discipline'],
    travel: ['#travel','#traveltok','#wanderlust','#adventure','#travellife','#explore','#travelhacks','#travelguide'],
    gaming: ['#gaming','#gamer','#gaminglife','#games','#gamingtok','#streamer','#gamertok','#playstation','#xbox'],
    pets: ['#pets','#dogtok','#cattok','#petlover','#animals','#cute','#petsoftiktok','#petcare'],
    parenting: ['#parenting','#momtok','#dadtok','#mom','#parent','#family','#kidsoftiktok','#parentingtips'],
    education: ['#education','#learning','#studytips','#knowledge','#didyouknow','#learnontiktok','#edutok','#facts'],
    mindset: ['#mindset','#motivation','#selfimprovement','#growthmindset','#personaldevelopment','#discipline','#success'],
    relationships: ['#relationships','#dating','#love','#advice','#couplegoals','#relationshiptips','#datingadvice'],
    diet: ['#diet','#weightloss','#healthyeating','#nutrition','#wellness','#cleaneating','#healthytok','#caloriedeficit'],
    art: ['#art','#artist','#drawing','#artwork','#creativity','#arttok','#digitalart','#illustration'],
    music: ['#music','#musician','#song','#musictok','#singer','#guitarist','#musicproduction','#producer'],
    photography: ['#photography','#photo','#photographer','#camerawork','#lightroom','#portrait','#photographytips'],
    crypto: ['#crypto','#bitcoin','#ethereum','#web3','#nft','#blockchain','#cryptotok','#altcoins'],
    realestate: ['#realestate','#realtor','#propertyinvesting','#househunting','#realestatetips','#investing','#landlord'],
    default: ['#contentcreator','#creatortips','#growyourtiktok','#tiktoktips','#socialmedia','#onlinebusiness'],
  };

  var PLATFORM_TAGS = {
    tiktok: ['#fyp','#foryoupage','#foryou','#viral','#trending'],
    reels: ['#reels','#instagramreels','#explore','#viral','#reelsviral'],
    shorts: ['#shorts','#youtubeshorts','#viral','#youtube','#subscribe'],
  };

  var PLATFORM_CTA = {
    tiktok: ['Follow for more {niche} tips','Comment your biggest takeaway below','Duet this if you agree','Share this with someone who needs it','Save this — you\'ll want it later'],
    reels: ['Follow for more {niche} content','Save this post before it disappears','Share to your story','Tag a friend who needs to see this','Drop a comment — I read every one'],
    shorts: ['Subscribe for more {niche} content','Like if this helped you','Comment your thoughts below','Share this with someone who needs it','Watch my last video for part 2'],
  };

  // ── State ─────────────────────────────────────────────────────────────────────
  var state = {
    isPro: false,
    platform: 'tiktok',
    results: [],
    saved: [],
  };

  // ── Pro / Usage ───────────────────────────────────────────────────────────────
  function loadState() {
    state.isPro = localStorage.getItem(PRO_KEY) === '1';
    var saved = localStorage.getItem(SAVED_KEY);
    state.saved = saved ? JSON.parse(saved) : [];
  }

  function getUsage() {
    var raw = localStorage.getItem(USAGE_KEY);
    if (!raw) return { date: today(), count: 0 };
    var u = JSON.parse(raw);
    if (u.date !== today()) return { date: today(), count: 0 };
    return u;
  }

  function bumpUsage() {
    var u = getUsage();
    u.count++;
    localStorage.setItem(USAGE_KEY, JSON.stringify(u));
    return u.count;
  }

  function today() {
    return new Date().toISOString().slice(0, 10);
  }

  function usageLeft() {
    if (state.isPro) return Infinity;
    return Math.max(0, FREE_DAILY_LIMIT - getUsage().count);
  }

  // ── Pro gate ──────────────────────────────────────────────────────────────────
  function checkout() {
    if (!PRO_CHECKOUT_URL) {
      alert('Stripe not yet configured — paste your Stripe Payment Link into app.js (PRO_CHECKOUT_URL).');
      return;
    }
    window.location.href = PRO_CHECKOUT_URL + '?client_reference_id=scriptly';
  }

  function handleProRedirect() {
    if (new URLSearchParams(location.search).get('pro') === 'success') {
      localStorage.setItem(PRO_KEY, '1');
      state.isPro = true;
      history.replaceState(null, '', location.pathname);
    }
  }

  // ── Script generation ─────────────────────────────────────────────────────────
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function fill(template, vars) {
    return template.replace(/\{(\w+)\}/g, function (_, k) { return vars[k] || k; });
  }

  function getHashtags(niche, platform) {
    var niches = niche.toLowerCase().split(/[\s,\/]+/);
    var found = [];
    niches.forEach(function (n) {
      Object.keys(NICHE_TAGS).forEach(function (k) {
        if (n.indexOf(k) !== -1 || k.indexOf(n) !== -1) {
          found = found.concat(NICHE_TAGS[k]);
        }
      });
    });
    if (!found.length) found = NICHE_TAGS.default.slice();
    // dedupe & limit
    found = found.filter(function (v, i, a) { return a.indexOf(v) === i; }).slice(0, 8);
    var ptags = (PLATFORM_TAGS[platform] || PLATFORM_TAGS.tiktok).slice();
    return ptags.concat(found).join(' ');
  }

  function viralScore(hookStyle) {
    var base = { curiosity: 88, hottake: 91, story: 82, tutorial: 79, stats: 85, warning: 87, pov: 84, list: 80 };
    var b = base[hookStyle] || 80;
    return b + Math.floor(Math.random() * 7) - 3;
  }

  function generateScripts() {
    var niche     = document.getElementById('inp-niche').value.trim();
    var topic     = document.getElementById('inp-topic').value.trim();
    var audience  = document.getElementById('inp-audience').value.trim() || 'beginners';
    var platform  = document.getElementById('sel-platform').value;
    var hookStyle = document.getElementById('sel-hook').value;
    var year      = new Date().getFullYear();

    if (!niche || !topic) {
      showToast('Enter your niche and topic first', 'warn');
      return;
    }

    if (usageLeft() <= 0) {
      showUpgrade('You\'ve hit the free limit (3 scripts/day). Upgrade to Pro for unlimited.');
      return;
    }

    var styles = hookStyle === 'random'
      ? shuffleKeys(HOOKS).slice(0, 3)
      : [hookStyle, pickDifferent(hookStyle, 0), pickDifferent(hookStyle, 1)];

    var vars = { niche: niche, topic: topic, audience: audience, year: year };
    var ctaPool = PLATFORM_CTA[platform] || PLATFORM_CTA.tiktok;

    var results = styles.map(function (style) {
      var h = HOOKS[style];
      var hookLine = fill(pick(h.hooks), vars);
      var body = h.body.map(function (b) { return fill(b, vars); });
      var cta = fill(pick(ctaPool), vars);
      var hashtags = getHashtags(niche + ' ' + topic, platform);
      var score = viralScore(style);
      return { style: style, label: h.label, emoji: h.emoji, color: h.color,
               hook: hookLine, body: body, cta: cta, hashtags: hashtags, score: score };
    });

    state.results = results;
    state.platform = platform;
    bumpUsage();
    renderResults(results);
    updateCounter();
  }

  function pickDifferent(main, offset) {
    var keys = Object.keys(HOOKS).filter(function (k) { return k !== main; });
    return keys[(Object.keys(HOOKS).indexOf(main) + offset + 1) % keys.length];
  }

  function shuffleKeys(obj) {
    var keys = Object.keys(obj).slice();
    for (var i = keys.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = keys[i]; keys[i] = keys[j]; keys[j] = tmp;
    }
    return keys;
  }

  // ── Render ────────────────────────────────────────────────────────────────────
  function renderResults(results) {
    var wrap = document.getElementById('results');
    if (!results.length) { wrap.innerHTML = emptyState(); return; }
    wrap.innerHTML = results.map(function (r, i) { return scriptCard(r, i); }).join('');
    wrap.querySelectorAll('.copy-btn').forEach(function (btn) {
      btn.addEventListener('click', function () { copyScript(parseInt(btn.dataset.idx)); });
    });
    wrap.querySelectorAll('.save-btn').forEach(function (btn) {
      btn.addEventListener('click', function () { saveScript(parseInt(btn.dataset.idx)); });
    });
    wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function scriptCard(r, i) {
    var scoreColor = r.score >= 88 ? '#10b981' : r.score >= 80 ? '#f59e0b' : '#94a3b8';
    return '<div class="card" style="border-top:3px solid ' + r.color + '">' +
      '<div class="card-header">' +
        '<span class="hook-badge" style="background:' + r.color + '22;color:' + r.color + '">' + r.emoji + ' ' + r.label + '</span>' +
        '<span class="score" style="color:' + scoreColor + '">&#9889; ' + r.score + '/100 Viral Score</span>' +
      '</div>' +
      '<div class="script-section">' +
        '<div class="sec-label">HOOK <span class="sec-sub">(first 3 seconds)</span></div>' +
        '<div class="hook-line">&ldquo;' + esc(r.hook) + '&rdquo;</div>' +
      '</div>' +
      '<div class="script-section">' +
        '<div class="sec-label">SCRIPT OUTLINE <span class="sec-sub">(body)</span></div>' +
        '<ul class="body-list">' + r.body.map(function (b, n) {
          return '<li><span class="bnum">' + (n + 1) + '</span>' + esc(b) + '</li>';
        }).join('') + '</ul>' +
      '</div>' +
      '<div class="script-section">' +
        '<div class="sec-label">CALL TO ACTION <span class="sec-sub">(last 3 seconds)</span></div>' +
        '<div class="cta-line">' + esc(r.cta) + '</div>' +
      '</div>' +
      '<div class="script-section">' +
        '<div class="sec-label">HASHTAGS</div>' +
        '<div class="hashtags">' + esc(r.hashtags) + '</div>' +
      '</div>' +
      '<div class="card-actions">' +
        '<button class="btn btn-ghost copy-btn" data-idx="' + i + '">&#128203; Copy Script</button>' +
        (state.isPro
          ? '<button class="btn btn-ghost save-btn" data-idx="' + i + '">&#128190; Save to Library</button>'
          : '<button class="btn btn-ghost pro-gate-btn" onclick="triggerUpgrade()">&#128190; Save (Pro)</button>') +
      '</div>' +
    '</div>';
  }

  function emptyState() {
    return '<div class="empty-state">' +
      '<div class="empty-icon">&#9999;&#65039;</div>' +
      '<div class="empty-title">Your scripts will appear here</div>' +
      '<div class="empty-sub">Fill in your niche and topic, then hit Generate Scripts</div>' +
    '</div>';
  }

  function esc(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // ── Copy ──────────────────────────────────────────────────────────────────────
  function copyScript(idx) {
    var r = state.results[idx];
    if (!r) return;
    var text = [
      'HOOK (first 3 seconds):',
      '"' + r.hook + '"',
      '',
      'SCRIPT OUTLINE:',
      r.body.map(function (b, i) { return (i + 1) + '. ' + b; }).join('\n'),
      '',
      'CALL TO ACTION:',
      r.cta,
      '',
      'HASHTAGS:',
      r.hashtags,
      '',
      '— Generated by Scriptly.app',
    ].join('\n');
    navigator.clipboard.writeText(text).then(function () {
      showToast('Script copied to clipboard!', 'success');
    }).catch(function () {
      var ta = document.createElement('textarea');
      ta.value = text; document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); document.body.removeChild(ta);
      showToast('Script copied!', 'success');
    });
  }

  // ── Save (Pro) ────────────────────────────────────────────────────────────────
  function saveScript(idx) {
    if (!state.isPro) { showUpgrade(); return; }
    var r = state.results[idx];
    if (!r) return;
    var entry = Object.assign({}, r, { savedAt: Date.now(),
      niche: document.getElementById('inp-niche').value,
      topic: document.getElementById('inp-topic').value });
    state.saved.unshift(entry);
    if (state.saved.length > 100) state.saved.pop();
    localStorage.setItem(SAVED_KEY, JSON.stringify(state.saved));
    showToast('Saved to your library!', 'success');
    renderSaved();
  }

  function renderSaved() {
    var wrap = document.getElementById('saved-list');
    if (!wrap) return;
    if (!state.saved.length) {
      wrap.innerHTML = '<p class="saved-empty">No saved scripts yet. Save a script above to build your content bank.</p>';
      return;
    }
    wrap.innerHTML = state.saved.slice(0, 20).map(function (r, i) {
      return '<div class="saved-card">' +
        '<div class="saved-meta">' +
          '<span class="hook-badge" style="background:' + r.color + '22;color:' + r.color + '">' + r.emoji + ' ' + r.label + '</span>' +
          '<span class="saved-topic">' + esc(r.topic || '') + '</span>' +
        '</div>' +
        '<div class="saved-hook">&ldquo;' + esc(r.hook) + '&rdquo;</div>' +
        '<button class="btn btn-ghost" onclick="copySaved(' + i + ')">&#128203; Copy</button>' +
      '</div>';
    }).join('');
  }

  window.copySaved = function (idx) {
    var r = state.saved[idx];
    if (r) { state.results = [r]; copyScript(0); }
  };

  // ── UI helpers ────────────────────────────────────────────────────────────────
  function updateCounter() {
    var el = document.getElementById('usage-counter');
    if (!el) return;
    if (state.isPro) { el.textContent = 'Pro — Unlimited scripts'; el.className = 'usage-counter pro'; return; }
    var left = usageLeft();
    el.textContent = left + ' free script' + (left === 1 ? '' : 's') + ' remaining today';
    el.className = 'usage-counter' + (left === 0 ? ' empty' : '');
  }

  function showToast(msg, type) {
    var t = document.createElement('div');
    t.className = 'toast toast-' + (type || 'info');
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.classList.add('show'); }, 10);
    setTimeout(function () { t.classList.remove('show'); setTimeout(function () { t.remove(); }, 300); }, 2500);
  }

  function showUpgrade(msg) {
    var overlay = document.getElementById('upgrade-overlay');
    var msgEl = document.getElementById('upgrade-msg');
    if (msgEl && msg) msgEl.textContent = msg;
    if (overlay) overlay.classList.add('open');
  }

  window.generateScripts = generateScripts;
  window.triggerUpgrade = function () { showUpgrade(); };
  window.closeUpgrade = function () {
    var overlay = document.getElementById('upgrade-overlay');
    if (overlay) overlay.classList.remove('open');
  };
  window.goCheckout = function () { checkout(); };

  // ── Tabs ──────────────────────────────────────────────────────────────────────
  window.switchTab = function (tab) {
    document.querySelectorAll('.tab-btn').forEach(function (b) { b.classList.remove('active'); });
    document.querySelectorAll('.tab-pane').forEach(function (p) { p.classList.remove('active'); });
    document.querySelector('[data-tab="' + tab + '"]').classList.add('active');
    document.getElementById('tab-' + tab).classList.add('active');
    if (tab === 'saved') renderSaved();
  };

  // ── Platform toggle ───────────────────────────────────────────────────────────
  window.setPlatform = function (p) {
    document.querySelectorAll('.plat-btn').forEach(function (b) { b.classList.remove('active'); });
    document.querySelector('[data-plat="' + p + '"]').classList.add('active');
    document.getElementById('sel-platform').value = p;
  };

  // ── Init ──────────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    loadState();
    handleProRedirect();
    updateCounter();
    renderResults([]);
    renderSaved();

    // pro badge
    var badge = document.getElementById('pro-badge');
    if (badge) badge.style.display = state.isPro ? 'inline-flex' : 'none';

    var upgradeBtn = document.getElementById('nav-upgrade');
    if (upgradeBtn) upgradeBtn.style.display = state.isPro ? 'none' : 'inline-flex';

    // enter key on inputs
    ['inp-niche','inp-topic','inp-audience'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') generateScripts();
      });
    });
  });

})();
