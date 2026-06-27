(function () {
  'use strict';

  var PRO_KEY      = 'scriptly.pro.v1';
  var USAGE_KEY    = 'scriptly.usage.v1';
  var SAVED_KEY    = 'scriptly.saved.v1';
  var FREE_DAILY_LIMIT = 1;
  var PRO_CHECKOUT_URL = '';

  // ── Platform config ───────────────────────────────────────────────────────────
  var PLATFORMS = {
    tiktok:   { label: 'TikTok',          maxDur: '90s',  paceNote: 'Fast pace — 1 idea per 5 seconds max',     ctaVerb: 'Follow',   saveVerb: 'Save this',  algNote: 'Optimised for TikTok FYP algorithm (watch time + shares)' },
    reels:    { label: 'Instagram Reels', maxDur: '90s',  paceNote: 'Smooth pace — prioritise saves',            ctaVerb: 'Follow',   saveVerb: 'Save this post', algNote: 'Optimised for Reels Explore (saves + shares to stories)' },
    shorts:   { label: 'YouTube Shorts',  maxDur: '90s',  paceNote: 'Punchy — subscriber-growth focused',       ctaVerb: 'Subscribe',saveVerb: 'Like this',  algNote: 'Optimised for Shorts shelf (CTR + subscribe rate)' },
    youtube:  { label: 'YouTube',         maxDur: '10min',paceNote: 'Pattern interrupt every 2 min',             ctaVerb: 'Subscribe',saveVerb: 'Like + save', algNote: 'Optimised for YouTube search + suggested (retention + CTR)' },
  };

  // ── Duration config ───────────────────────────────────────────────────────────
  var DURATIONS = {
    '15s':  { label: '15 sec',  words: 38,   platforms: ['tiktok','reels','shorts'],          pro: false, sections: ['hook','cta'] },
    '30s':  { label: '30 sec',  words: 75,   platforms: ['tiktok','reels','shorts'],          pro: false, sections: ['hook','setup','cta'] },
    '60s':  { label: '60 sec',  words: 150,  platforms: ['tiktok','reels','shorts','youtube'],pro: false, sections: ['hook','setup','body1','body2','cta'] },
    '90s':  { label: '90 sec',  words: 225,  platforms: ['tiktok','reels','shorts','youtube'],pro: true,  sections: ['hook','setup','body1','body2','body3','cta'] },
    '3min': { label: '3 min',   words: 450,  platforms: ['reels','shorts','youtube'],         pro: true,  sections: ['hook','intro','body1','midcta','body2','body3','cta'] },
    '5min': { label: '5 min',   words: 750,  platforms: ['youtube'],                          pro: true,  sections: ['hook','intro','body1','midcta1','body2','midcta2','body3','body4','cta','description'] },
    '10min':{ label: '10 min',  words: 1500, platforms: ['youtube'],                          pro: true,  sections: ['hook','intro','body1','midcta1','body2','midcta2','body3','midcta3','body4','body5','cta','description'] },
  };

  // ── Platform hashtags ─────────────────────────────────────────────────────────
  var PLATFORM_TAGS = {
    tiktok:  ['#fyp','#foryoupage','#foryou','#viral','#trending'],
    reels:   ['#reels','#instagramreels','#explore','#viral','#reelsviral'],
    shorts:  ['#shorts','#youtubeshorts','#viral','#youtube','#subscribe'],
    youtube: [],
  };

  var NICHE_TAGS = {
    finance:['#personalfinance','#moneytips','#financialfreedom','#savingmoney','#investing','#budgeting','#wealthbuilding'],
    money:['#money','#personalfinance','#moneymindset','#savingmoney','#passiveincome','#makemoneyonline'],
    investing:['#investing','#stocks','#stockmarket','#passiveincome','#wealthbuilding','#dividends'],
    fitness:['#fitness','#workout','#gym','#fitnessmotivation','#healthylifestyle','#gains','#fittok'],
    workout:['#workout','#gym','#fitness','#training','#musclebuilding','#weightloss','#fittok'],
    cooking:['#cooking','#recipe','#foodtok','#food','#easyrecipes','#mealprep','#homecooking'],
    food:['#food','#foodtok','#recipe','#cooking','#foodie','#easyrecipes','#yummy'],
    fashion:['#fashion','#ootd','#style','#fashiontok','#outfitinspo','#aesthetic','#streetstyle'],
    beauty:['#beauty','#makeup','#skincare','#beautytips','#glowup','#makeuptutorial','#skincareroutine'],
    skincare:['#skincare','#glowup','#skincaretips','#clearskin','#beautytok'],
    business:['#business','#entrepreneur','#sidehustle','#smallbusiness','#makemoneyonline','#businesstips','#startup'],
    entrepreneur:['#entrepreneur','#businessowner','#startup','#sidehustle','#grindset','#businessmindset'],
    productivity:['#productivity','#selfimprovement','#motivation','#lifehacks','#timemanagement','#habits','#discipline'],
    travel:['#travel','#traveltok','#wanderlust','#adventure','#travelhacks','#travelguide'],
    gaming:['#gaming','#gamer','#games','#gamingtok','#streamer','#gamertok'],
    pets:['#pets','#dogtok','#cattok','#petlover','#animals','#cute','#petsoftiktok'],
    parenting:['#parenting','#momtok','#dadtok','#mom','#parent','#family'],
    education:['#education','#learning','#studytips','#learnontiktok','#edutok','#facts'],
    mindset:['#mindset','#motivation','#selfimprovement','#growthmindset','#discipline','#success'],
    relationships:['#relationships','#dating','#love','#relationshiptips','#datingadvice'],
    diet:['#diet','#weightloss','#nutrition','#wellness','#cleaneating','#healthytok'],
    crypto:['#crypto','#bitcoin','#ethereum','#web3','#blockchain','#cryptotok'],
    realestate:['#realestate','#propertyinvesting','#investing','#landlord','#realestatetips'],
    default:['#contentcreator','#creatortips','#viral','#socialmedia','#onlinebusiness'],
  };

  // ── Full script body templates (actual spoken words) ──────────────────────────
  var HOOKS_TEXT = {
    curiosity: [
      "I discovered something about {niche} that I'm honestly not sure I'm supposed to share...",
      "Nobody in {niche} talks about this, but {topic} works completely differently than you think.",
      "I've been deep in {niche} for a while now and I just figured out something about {topic} that changes everything.",
      "There's a {topic} truth that most {audience} never find out — and it explains why most people plateau.",
    ],
    hottake: [
      "Unpopular opinion: most {niche} advice about {topic} is genuinely, completely wrong.",
      "I'm going to say the thing that nobody in {niche} wants to admit about {topic}.",
      "Stop. If you're {audience} doing {topic} the way everyone tells you — stop. You're being misled.",
      "The {topic} advice that everyone swears by? It's backwards. And I can prove it.",
    ],
    story: [
      "[Time period] ago I knew nothing about {niche}. What happened next completely changed my life.",
      "I failed at {topic} over and over again until one thing finally clicked — and now I can't stop.",
      "The moment that changed my entire approach to {niche}: I was [doing X] when [event happened]...",
      "I almost quit {niche} entirely — until I discovered what was actually holding me back.",
    ],
    tutorial: [
      "How to {topic} the right way — most {audience} have never been taught this.",
      "The exact {topic} process that actually works in {year} — step by step, nothing left out.",
      "If you're {audience} who wants to {topic}, watch this all the way through. This is the complete playbook.",
      "I'm going to show you how to {topic} in the time it takes to watch this video.",
    ],
    stats: [
      "The number one reason {audience} fail at {topic} — and it's not what you think.",
      "Most {audience} doing {topic} are making the same mistake — and it's costing them everything.",
      "Here's the uncomfortable truth about {topic} that the data actually shows.",
      "After years in {niche}, here's the one pattern I see in every person who struggles with {topic}.",
    ],
    warning: [
      "If you're {audience} doing {topic} — stop and watch this first. I'm serious.",
      "STOP. Before you spend another second on {topic}, there's something you absolutely need to know.",
      "I wish someone had told me this about {niche} before I wasted [time/money] on the wrong approach to {topic}.",
      "The {topic} mistake that {audience} make that nobody warns you about — until it's too late.",
    ],
    pov: [
      "POV: You're {audience} who's been trying to figure out {topic} for [weeks/months] and getting nowhere.",
      "Me as {audience} the moment I finally understood why {topic} actually works:",
      "Every {audience} when they realise {topic} doesn't have to be this complicated:",
      "Tell me you're {audience} without telling me — spending hours on {topic} and getting the same result every time.",
    ],
    list: [
      "Three things every {audience} needs to know about {topic} before it's too late — save this.",
      "The five {niche} mistakes I see {audience} make with {topic} — and how to fix every single one.",
      "If I was {audience} starting {topic} from scratch, these are the only things I'd focus on.",
      "Four {niche} things about {topic} that took me years to learn — you're getting them in sixty seconds.",
    ],
  };

  var SETUP_TEXT = {
    curiosity: [
      "So I've been obsessing over {topic} in {niche} for a while now — and I noticed something that most {audience} completely miss. Once you see it, you'll understand why some people get results and most people don't.",
      "Here's some context. I've been doing {niche} long enough to see the pattern clearly. And the pattern is: {audience} who actually succeed at {topic} are doing one specific thing differently from everyone else.",
    ],
    hottake: [
      "I know that sounds like a big claim. But stay with me — because if you're {audience} who's been grinding at {topic} without the results you expected, this might be exactly why.",
      "Before you scroll, hear me out. I've spent a long time in {niche} and I've seen this play out over and over. The conventional wisdom about {topic} is actively working against you.",
    ],
    story: [
      "I want to tell you what was actually happening — because I think a lot of {audience} are in the exact same place I was. I was putting in the work on {topic} and getting almost nothing back. And it wasn't until [event] that I understood why.",
      "The version of me who started {niche} had no idea what I was doing with {topic}. I was following all the advice, doing everything right on paper — and going nowhere. This is what changed.",
    ],
    tutorial: [
      "I'm going to walk you through this properly — no skipping steps, no vague advice. By the end of this, you'll have exactly what you need to actually {topic} without guessing.",
      "Most tutorials about {topic} in {niche} skip the most important parts. I'm not doing that. If you're {audience} who wants real results, this is the complete version.",
    ],
    stats: [
      "I'm not going to sugarcoat this. The reality of {topic} for most {audience} is not what the success stories on the internet make it look like. Here's what's actually true — and what it means for you.",
      "Let me give you the honest picture of where most {audience} are with {topic} — and then I'm going to tell you the one thing that separates the ones who break through from the ones who don't.",
    ],
    warning: [
      "This isn't meant to scare you — it's meant to save you. I've seen {audience} make this {topic} mistake so many times, and every single time it costs them months of progress. You need to know this before you go any further.",
      "I'm telling you this because I wish someone had told me. I wasted [time] on {topic} doing the wrong thing in {niche}, and if this video stops even one {audience} from doing the same thing, it's worth it.",
    ],
    pov: [
      "If this is you — you're not alone. This is genuinely one of the most common things I see with {audience} trying to make progress on {topic}. And the good news? The fix is usually one thing.",
      "I've been exactly there. Trying to figure out {topic} in {niche}, doing everything I could find, and wondering why nothing was sticking. Here's what I eventually worked out.",
    ],
    list: [
      "I'm keeping this tight — no filler, no fluff. These are the actual things that move the needle with {topic} in {niche}. Most {audience} know none of these. By the end of this, you'll know all of them.",
      "Quick note before we start: these aren't generic {niche} tips. These are specifically about {topic} — the things that have the biggest impact and that most {audience} are currently missing.",
    ],
  };

  var BODY_SHORT = { // 60s and under — 1-2 body sections
    curiosity: [
      "Here's what I found: most {audience} approach {topic} by focusing on [the obvious surface thing]. That makes sense — that's what everyone talks about in {niche}. But it's actually the wrong thing to optimise for.\n\nThe real lever is [the deeper insight]. When I shifted my focus there, the results were immediate. Not because I worked harder. Because I was finally pointed in the right direction.\n\n[EDIT: Add your specific insight about {topic} here — what do you know that most {audience} don't?]",
      "The thing nobody tells {audience} about {topic} is this: it's not about [what most people focus on]. It's about [what actually matters]. And the reason that distinction matters is [reason].\n\nI changed this one thing about my {niche} approach and [specific positive result] in [timeframe]. The method is simple. The hard part is unlearning the wrong way first.\n\n[EDIT: Replace the [brackets] with your actual experience and insight.]",
    ],
    hottake: [
      "Here's why [common {topic} advice] doesn't work: [specific reason it fails]. The people teaching this mean well, but they're optimising for [wrong thing].\n\nWhat actually works in {niche} is [your approach]. It feels counterintuitive — that's the point. The conventional approach to {topic} is designed for [different situation]. It doesn't account for [key variable].\n\nI switched to this and [specific result]. If you're {audience} who's been stuck, this is almost certainly why.\n\n[EDIT: Fill in your specific hot take and evidence.]",
    ],
    story: [
      "I was [doing X with {topic}] — the normal way. The way you're supposed to do it. And I was getting okay results. Nothing special. Then [event or realisation happened].\n\nI changed [specific thing about my {niche} approach] and went from [before] to [after] in [timeframe]. Not a huge change. One adjustment.\n\nThe lesson: [core insight about {topic} that the story reveals].\n\n[EDIT: Replace [brackets] with your actual story — be specific, be real, use real numbers if you can.]",
    ],
    tutorial: [
      "Step one: [First action for {topic}]. This is the foundation. Most {audience} skip it because it feels too basic, but it's why everything else falls apart without it.\n\nStep two: [Second action]. This is where the actual progress happens. [Brief explanation of why this step matters in {niche}].\n\nStep three: [Third action]. This is what most tutorials leave out — and it's the part that makes the whole thing compound over time.\n\n[EDIT: Replace [brackets] with your specific {topic} steps.]",
    ],
    stats: [
      "Here's the pattern I see with {audience} who struggle with {topic}: they focus all their energy on [wrong thing]. Meanwhile, the metric that actually predicts success in {niche} is [right thing].\n\nWhen I started tracking [right metric] instead of [wrong metric], everything clicked. Not because the work changed. Because I finally knew what I was measuring for.\n\nThe one-sentence version: [core {topic} insight].\n\n[EDIT: Add your specific data point or observation about {topic}.]",
    ],
    warning: [
      "The mistake: [specific {topic} mistake most {audience} make]. Here's exactly how it happens — [how the mistake occurs, step by step]. It feels like the right thing to do. It's not.\n\nThe consequence: [what actually happens when {audience} make this mistake in {niche}]. It's not dramatic. But it compounds. Three months in, six months in — you're way behind where you should be.\n\nThe fix: [specific corrective action]. That's it. One change.\n\n[EDIT: Be specific about the mistake and fix — general warnings don't build trust. Specifics do.]",
    ],
    pov: [
      "That feeling when you're doing everything right and nothing is moving — that's not you failing. That's a signal that [underlying issue with {topic} in {niche}].\n\nThe reason it feels stuck is [actual reason]. And the way out isn't to try harder at the same thing. It's to [shift approach].\n\nWhen I made this shift, [specific change in result]. And the relief of finally understanding *why* was just as valuable as the actual progress.\n\n[EDIT: Make this relatable to YOUR specific {audience} — what is the exact feeling you're describing?]",
    ],
    list: [
      "One: [First {topic} insight] — [one sentence explanation].\n\nTwo: [Second {topic} insight] — most {audience} know this in theory but don't actually do it, because [reason].\n\nThree: [Third {topic} insight] — this is the one people screenshot. [Why it matters in {niche}].\n\nBonus — and this is the one nobody talks about: [Unexpected {topic} insight]. File this one away.\n\n[EDIT: Replace each [bracket] with your real insights about {topic}.]",
    ],
  };

  var BODY_MEDIUM = { // 90s–3min — 3-4 body sections
    curiosity: "Let me break this down properly.\n\nI've been in {niche} long enough to see the pattern clearly. The {audience} who actually get results with {topic}? They're doing one specific thing differently from everyone else.\n\nHere's what most people do: [common approach]. It makes sense. It's logical. But it optimises for the wrong outcome — because [reason it fails].\n\nHere's what the successful ones do instead: [better approach]. The key difference is [specific insight].\n\nWhy does this work? [Explanation — 2-3 sentences connecting the approach to the outcome].\n\nHere's the practical version for {audience}:\n\nFirst: [Action step 1]. This is the foundation — don't skip it.\nSecond: [Action step 2]. This is where most people give up, but it's the most important part.\nThird: [Action step 3]. This is what compounds everything else.\n\nI applied this to my own {niche} practice and [specific result] in [timeframe]. Not overnight — but faster than anything else I'd tried.\n\n[EDIT: Fill every [bracket] with your specific knowledge. The more specific, the more credible.]",
    hottake: "Here's the evidence. [Observation or experience that supports your hot take about {topic}].\n\nThe reason the conventional {niche} wisdom about {topic} persists is [reason — usually: it worked in a different context, or it benefits someone else, or it's just never been questioned].\n\nBut if you actually look at the {audience} who are consistently getting [desired result] with {topic}, they're doing [contrarian approach]. Not because they're contrarians. Because they tested things and followed the results.\n\nHere's the practical implication: [what {audience} should do differently based on your hot take].\n\nAnd here's the thing I want you to push back on in the comments: [specific point you want debate on]. I could be wrong. But I think most people agreeing with me have just never tried the alternative.\n\n[EDIT: Be specific about the evidence. Anecdote, data, pattern — any of these work. Vague hot takes get ignored. Specific ones get shared.]",
    story: "Here's the full story.\n\n[WHEN]: I was [timeframe] into {niche} and [describe situation clearly]. I was doing {topic} [describe how — be honest about what wasn't working].\n\n[THE TURNING POINT]: Then [specific event, conversation, or realisation]. I remember thinking: [honest internal reaction]. It was [uncomfortable/surprising/obvious in retrospect].\n\n[WHAT CHANGED]: I started [new approach to {topic}]. At first it felt [describe the friction]. But after [timeframe], [describe first signs of improvement].\n\n[THE RESULT]: [Where you are now]. Not perfect — but [meaningful specific improvement].\n\n[THE LESSON]: The one thing I'd tell {audience} just starting {niche} is: [core insight in one sentence]. Everything else is details.\n\n[EDIT: Use real specifics — real timeframes, real emotions, real numbers. Authentic stories beat polished ones every time.]",
    tutorial: "Here's the complete process. I'm not skipping anything.\n\nSETUP — before you do anything:\n[Pre-requisite or mindset/tool/context needed]. Most tutorials skip this and wonder why {audience} struggle with the first step.\n\nSTEP ONE — [name of first step]:\n[Full explanation of what to do, how to do it, and why it matters for {topic} in {niche}]. Common mistake here: [mistake]. Fix: [fix].\n\nSTEP TWO — [name of second step]:\n[Full explanation]. This is the step that makes the biggest difference. [Reason — connect to {audience}'s actual goal].\n\nSTEP THREE — [name of third step]:\n[Full explanation]. Optional but high-impact: [bonus tip].\n\nSTEP FOUR — [name of final step]:\n[Full explanation]. This is the long game. Most {audience} quit before this part, which is why [most people don't get result].\n\nTOTAL TIME: [how long this process takes]. Total cost: [cost, or free]. [Brief summary of expected outcome].\n\n[EDIT: Each step needs to be specific enough that {audience} could follow it without asking any questions.]",
    stats: "Let me give you the real picture.\n\n[OBSERVATION/DATA]: [Specific thing you've noticed about {topic} and {audience} in {niche}]. This might be a stat, a pattern, or something you've observed firsthand.\n\nWHY THIS MATTERS: Because it means [implication for {audience}]. If you're measuring [wrong thing], you'll always feel like you're failing at {topic} — even when you're actually making progress.\n\nWHAT THE SUCCESSFUL ONES TRACK INSTEAD: [The right metric or focus]. Here's why this metric is better: [reason — connect to how {niche} actually works].\n\nHOW TO APPLY IT: \n— [Action 1]\n— [Action 2]\n— [Action 3]\n\nThe shift is small. The difference it makes is not.\n\n[Your personal result or observation that validates this].\n\n[EDIT: Ground this in something specific you've actually observed or experienced. Data you've personally witnessed is 10x more credible than abstract statistics.]",
    warning: "Let me be specific about what this mistake actually looks like.\n\nIT STARTS WITH: [Initial decision or behaviour that seems fine — the early stage of the mistake].\n\nTHEN: [What happens next — the compounding effect].\n\nBY THE TIME YOU NOTICE: [The delayed consequence]. And the frustrating thing is it looks like [something else] on the surface — so {audience} usually blame [wrong cause] instead of the real one.\n\nI'VE SEEN THIS WITH: [Specific type of {audience} / specific {niche} context]. Every single time, it plays out the same way.\n\nTHE FIX:\nStep one: [Immediate action to stop the damage].\nStep two: [Corrective action to get back on track].\nStep three: [Prevention — how to make sure it doesn't happen again].\n\nThis fix takes [timeframe]. The mistake costs [much longer]. Easy trade.\n\n[EDIT: The more specific and recognisable the mistake, the more shares this will get. If {audience} are watching going 'oh no that's me' — you've nailed it.]",
    pov: "Let me tell you what's actually happening when you're in this situation.\n\nThe feeling of [stuck/confused/overwhelmed] with {topic} is almost never about [what it looks like]. It's actually a signal that [underlying issue].\n\nHere's the pattern: [describe the cycle {audience} gets stuck in with {topic}]. Does that sound familiar? Because I've seen it hundreds of times in {niche}.\n\nThe exit is not trying harder. It's not more information. It's [specific shift in approach or mindset].\n\nHere's exactly how to make that shift:\n— [First thing to do/change]\n— [Second thing to do/change]\n— [Third thing to let go of]\n\nThe timeline looks like this: in the first [timeframe], you'll [early sign of improvement]. In [longer timeframe], you'll [bigger result]. The discomfort at the start is real — but it's the discomfort of something working, not something failing.\n\n[EDIT: Be the creator who actually understands what {audience} are going through, not just someone giving generic advice. The more specific your empathy, the more engaged your audience will be.]",
    list: "Let's go through these properly.\n\nNUMBER ONE — [Name the insight]: [2-3 sentence explanation]. The reason most {audience} don't know this: [reason]. Application: [how to use it].\n\nNUMBER TWO — [Name the insight]: [2-3 sentence explanation]. This one specifically applies to {topic} because [connection]. Most people know this in theory and ignore it in practice because [reason].\n\nNUMBER THREE — [Name the insight]: [2-3 sentence explanation]. This is the most underrated one. If you only take one thing from this video, take this.\n\nNUMBER FOUR — [Name the insight]: [2-3 sentence explanation]. [Why this matters for {audience} specifically].\n\nBONUS — and this is the one that changed everything for me: [Unexpected insight about {topic}]. [Brief explanation]. I've never seen this in any {niche} content online, which is exactly why I wanted to include it.\n\n[EDIT: Each insight needs its own example or evidence. 'Just trust me' lists don't get saves. Lists with reasons do.]",
  };

  var BODY_LONG = { // 5-10min YouTube
    intro_block: "Before I get into the main content — make sure you're subscribed. I post {niche} content every week and if you've landed on this video, this channel is probably for you.\n\nHere's what we're covering today: [overview of {topic} — 3-4 key things they'll learn]. By the end of this, you'll [specific outcome] — without [common frustration].\n\nLet's get into it.",
    chapter: function(n) { return "CHAPTER " + n + " — [Chapter title related to {topic}]:\n\n[Full spoken paragraph — 100-150 words covering this specific aspect of {topic}. Include: main point, explanation, example, and implication for {audience}. This should feel like you're having a real conversation, not reading a list.]\n\n[Second paragraph if needed — go deeper on this point, add nuance, address the obvious objection.]\n\n[EDIT: Each chapter should stand alone as a mini-video. Strong opening sentence, clear insight, specific example, clear takeaway.]\n\n"; },
    midcta: "Quick interruption — if you're finding this useful, hit the like button now. It genuinely helps this video reach more {audience}, and I put a lot of time into making this actually useful instead of vague. Back to it.",
    description: "\n━━━━━━━━━━━━━━━━━━━━━━━━━\n📋 VIDEO DESCRIPTION (paste into YouTube):\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\n[SEO TITLE OPTION A]: How to {topic} — The Complete {year} Guide for {audience}\n[SEO TITLE OPTION B]: {topic}: What {audience} Need to Know (That Nobody Tells You)\n[SEO TITLE OPTION C]: I Finally Figured Out {topic} — Here's Everything I Learned\n\nDESCRIPTION:\nIn this video, I cover everything {audience} need to know about {topic} in {niche}. [2-3 sentence summary of what you cover]. This is the video I wish existed when I started.\n\nTIMESTAMPS:\n0:00 — Hook & intro\n[Add timestamps as you edit]\n\nRELATED: [Link to your previous relevant video]\n\nTAGS: {topic}, {niche}, {niche} for {audience}, how to {topic}, {topic} tips, {niche} tips {year}\n\n[EDIT: Write 150-300 words describing the video. Include your main keyword ({topic}) in the first 2 sentences. YouTube indexes descriptions.]",
  };

  var CTA_TEXT = {
    tiktok: {
      curiosity: ["Follow for more {niche} content that nobody else is covering.", "If that clicked — follow me. I post this kind of thing every week."],
      hottake: ["Fight me in the comments. And follow if you want more takes like this.", "If you agree — or disagree — drop it in the comments. And follow so you don't miss the next one."],
      story: ["If that resonated, follow me — I share these kinds of {niche} lessons every week.", "Follow for more of the {niche} journey — the wins, the mistakes, and everything in between."],
      tutorial: ["Follow for the next step in this series. There's a lot more to cover.", "Save this for when you need it. And follow for more {niche} tutorials like this."],
      stats: ["Follow if you want the honest {niche} content without the usual fluff.", "Follow for weekly {niche} breakdowns based on what actually works, not what sounds good."],
      warning: ["Follow so you catch the next one before you make the mistake. I cover this stuff every week.", "Share this with someone who needs to hear it. And follow for more."],
      pov: ["If this is you — follow. I make content specifically for {audience} trying to figure out {niche}.", "You're not alone in this. Follow me and let's figure it out together."],
      list: ["Save this and follow for the next list. There are more where this came from.", "Follow for a new {niche} list every week — all the stuff worth knowing, none of the filler."],
    },
    reels: {
      curiosity: ["Save this post before it disappears. And follow for more {niche} content like this.", "Follow and share this to your story if it helped you."],
      hottake: ["Save this and drop your take in the comments. I want to know what you think.", "Share this to your story if you agree. Let's start the conversation."],
      story: ["Save this for when you need the reminder. Follow for more {niche} content.", "Follow for more of the honest {niche} journey. And share if this resonated."],
      tutorial: ["Save this — you'll want to come back to it. Follow for the full series.", "Share this to your story so your people can use it too."],
      stats: ["Follow for weekly {niche} breakdowns. Save this so you don't lose it.", "Share this with someone who's been misled by the wrong {niche} advice."],
      warning: ["Save this before you need it. And tag someone who should see this.", "Share this to your story — someone in your network needs to hear this right now."],
      pov: ["Save this for when you're having one of those days. Follow for more.", "Share this to your story if your {audience} friends would find it useful."],
      list: ["Save this list. And follow for a new one every week.", "Share this to your story. And follow so you never miss the next one."],
    },
    shorts: {
      curiosity: ["Subscribe for more {niche} content like this every week.", "Hit subscribe — I post this kind of thing all the time."],
      hottake: ["Subscribe and let me know your take in the comments.", "Subscribe for more. And tell me in the comments: am I wrong?"],
      story: ["Subscribe for more {niche} content — the real version, not the highlight reel.", "Subscribe for the next part of this. There's more to the story."],
      tutorial: ["Subscribe for the complete series. This is just part one.", "Subscribe and turn on notifications — the follow-up to this drops soon."],
      stats: ["Subscribe for weekly {niche} content based on real patterns, not hype.", "Like this and subscribe. More data-backed {niche} content every week."],
      warning: ["Subscribe so you catch the next warning before you need it. There are more.", "Like and subscribe. More essential {niche} content every week."],
      pov: ["Subscribe if this is for you. I make content for {audience} every single week.", "Subscribe for more. You're in the right place."],
      list: ["Subscribe for the next list. There are a lot more where this came from.", "Like, subscribe, and save this. More lists every week."],
    },
    youtube: {
      curiosity: ["If this was useful — subscribe, hit the like button, and drop your biggest question about {topic} in the comments. I read every single one and I'm making videos based on what you ask.", "Subscribe for more {niche} content. And like this video if it helped — it genuinely helps me make more of it."],
      default: ["Subscribe if you want more honest {niche} content. Like the video if it was useful — it helps the algorithm show this to more {audience} who need it. And drop a comment: what's your biggest challenge with {topic} right now? I might make a video about it.", "Hit subscribe and the notification bell — I post every week. If you have questions about {topic} or {niche} in general, drop them in the comments. I'll answer as many as I can."],
    },
  };

  var CAPTION_TEXT = {
    curiosity: '"{hook_start}" 👀 Drop a comment if this changed how you see {topic} 👇',
    hottake:   "Unpopular opinion about {topic}... what do you think? 👇 #hottake",
    story:     "The {niche} story I never thought I'd share 📖 If this resonated, you're not alone 👇",
    tutorial:  "Save this {topic} tutorial — you'll want it later 📌",
    stats:     "The truth about {topic} that nobody talks about 📊 Does this match your experience? 👇",
    warning:   "I wish someone told me this about {topic} sooner ⚠️ Tag someone who needs to see this",
    pov:       "POV: {audience} trying to figure out {topic} 😩 You're not alone — comment below 👇",
    list:      "Save this list before it disappears 📋 Which one surprised you most? 👇",
  };

  var COVER_FRAME = {
    curiosity: "Film face-on with good lighting — text overlay: \"THE {NICHE} SECRET\" or \"WHAT THEY DON'T TELL YOU\" — direct eye contact, slight lean forward",
    hottake:   "Bold text overlay with your hot take — high contrast, expressive face in thumbnail — include the word that will spark debate",
    story:     "Before/after visual if possible — or thoughtful expression — text: \"THE MOMENT THAT CHANGED EVERYTHING\" — authentic, not polished",
    tutorial:  "Step number visible — clean graphic or split screen showing before/after result — text: \"THE COMPLETE GUIDE\" or \"STEP BY STEP\"",
    stats:     "Bold number/percentage in text overlay — concerned or surprised expression — text: \"MOST [AUDIENCE] GET THIS WRONG\"",
    warning:   "Warning sign visual or stop-gesture — red/orange colour palette if possible — text: \"STOP DOING THIS\" or \"BEFORE YOU [ACTION]\"",
    pov:       "Relatable expression — overly dramatic is fine for this format — text: \"POV: YOU'RE [AUDIENCE]\" — keep it authentic",
    list:      "List graphic or numbered items visible — clean layout — text: \"[N] THINGS YOU NEED TO KNOW\" — save-worthy visual",
  };

  var YOUTUBE_THUMB = {
    curiosity: "THUMBNAIL CONCEPT: Close-up face with curious/surprised expression + bold text \"THE {NICHE} TRUTH\" — high contrast, minimal text, clear emotion",
    hottake:   "THUMBNAIL CONCEPT: Direct eye contact + controversial text overlay — use colour to make it visually polarising — include a counter-point word if possible",
    story:     "THUMBNAIL CONCEPT: Two-panel before/after OR single strong emotional face — text: \"HOW I [RESULT]\" or \"THE TRUTH ABOUT MY [NICHE] JOURNEY\"",
    tutorial:  "THUMBNAIL CONCEPT: Process result visible (screenshot/photo of outcome) + face reaction + text: \"COMPLETE {TOPIC} GUIDE\" — show the transformation",
    stats:     "THUMBNAIL CONCEPT: Large bold number + shocked/concerned face — text: \"[X]% OF {AUDIENCE} GET THIS WRONG\" — stat does the heavy lifting",
    warning:   "THUMBNAIL CONCEPT: Warning/stop visual + alarmed face — red elements + bold text \"STOP DOING THIS\" — urgency drives CTR",
    pov:       "THUMBNAIL CONCEPT: Relatable expression + text \"IF YOU'RE {AUDIENCE}...\" — should feel like looking in a mirror",
    list:      "THUMBNAIL CONCEPT: Clean graphic showing the list concept + face — text: \"[N] THINGS ABOUT {TOPIC}\" — make it look like a resource",
  };

  // ── Script assembly ───────────────────────────────────────────────────────────
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function fill(str, vars) {
    return str.replace(/\{(\w+)\}/g, function(_, k) { return vars[k] || ('{' + k + '}'); });
  }

  function getHashtags(niche, platform) {
    var niches = niche.toLowerCase().split(/[\s,\/&]+/);
    var found = [];
    niches.forEach(function(n) {
      Object.keys(NICHE_TAGS).forEach(function(k) {
        if ((n.indexOf(k) !== -1 || k.indexOf(n) !== -1) && found.length < 12) {
          found = found.concat(NICHE_TAGS[k].filter(function(t){ return found.indexOf(t) === -1; }));
        }
      });
    });
    if (!found.length) found = NICHE_TAGS.default.slice();
    var ptags = (PLATFORM_TAGS[platform] || []).slice();
    var all = ptags.concat(found).filter(function(v,i,a){ return a.indexOf(v) === i; });
    return all.slice(0, platform === 'youtube' ? 20 : 14).join(' ');
  }

  function viralScore(style) {
    var base = { curiosity:88, hottake:92, story:81, tutorial:78, stats:85, warning:87, pov:83, list:80 };
    var b = base[style] || 80;
    return Math.min(99, b + Math.floor(Math.random() * 7) - 2);
  }

  function buildScript(platform, niche, topic, audience, style, duration) {
    var dur    = DURATIONS[duration];
    var plat   = PLATFORMS[platform];
    var year   = new Date().getFullYear();
    var vars   = { niche:niche, topic:topic, audience:audience, year:year };
    var isLong = duration === '5min' || duration === '10min';
    var isMed  = duration === '90s' || duration === '3min';

    // Hook line
    var hookLine = fill(pick(HOOKS_TEXT[style] || HOOKS_TEXT.curiosity), vars);

    // Setup
    var setupBlocks = SETUP_TEXT[style] || SETUP_TEXT.curiosity;
    var setup = fill(pick(setupBlocks), vars);

    // Body
    var bodyText = '';
    if (isLong) {
      var numChapters = duration === '10min' ? 5 : 4;
      var intro = fill(BODY_LONG.intro_block, vars);
      bodyText += intro + '\n\n';
      for (var i = 1; i <= numChapters; i++) {
        bodyText += fill(BODY_LONG.chapter(i), vars);
        if (i === 2 || i === Math.ceil(numChapters / 2)) {
          bodyText += fill(BODY_LONG.midcta, vars) + '\n\n';
        }
      }
    } else if (isMed) {
      var medTemplates = BODY_MEDIUM[style] || BODY_MEDIUM.curiosity;
      var medText = typeof medTemplates === 'string' ? medTemplates : pick(medTemplates);
      bodyText = fill(medText, vars);
    } else {
      var shortTemplates = BODY_SHORT[style] || BODY_SHORT.curiosity;
      var parts = Array.isArray(shortTemplates) ? shortTemplates : [shortTemplates];
      bodyText = fill(pick(parts), vars);
    }

    // CTA
    var ctaPool = CTA_TEXT[platform] && (CTA_TEXT[platform][style] || CTA_TEXT[platform].default);
    if (!ctaPool) ctaPool = CTA_TEXT.tiktok[style] || CTA_TEXT.tiktok.curiosity;
    var cta = fill(pick(ctaPool), vars);

    // Caption
    var caption = fill(CAPTION_TEXT[style] || CAPTION_TEXT.curiosity, vars)
      .replace('{hook_start}', hookLine.slice(0, 60) + (hookLine.length > 60 ? '...' : ''));

    // Hashtags
    var hashtags = getHashtags(niche, platform);

    // Timing
    var timings = buildTimings(duration, dur.sections);

    // Description (YouTube long)
    var description = isLong ? fill(BODY_LONG.description, vars) : '';

    // Thumbnail/cover
    var thumb = platform === 'youtube'
      ? fill((YOUTUBE_THUMB[style] || YOUTUBE_THUMB.curiosity), Object.assign({}, vars, {NICHE: niche.toUpperCase()}))
      : fill((COVER_FRAME[style] || COVER_FRAME.curiosity), Object.assign({}, vars, {NICHE: niche.toUpperCase()}));

    return {
      platform: platform, duration: duration, style: style,
      hookLine: hookLine, setup: setup, body: bodyText, cta: cta,
      caption: caption, hashtags: hashtags, timings: timings,
      thumb: thumb, description: description,
      score: viralScore(style),
      label: (HOOKS_TEXT[style] ? ({ curiosity:'Curiosity Gap', hottake:'Hot Take', story:'Personal Story', tutorial:'Tutorial', stats:'Statistic', warning:'Warning', pov:'Relatable POV', list:'Power List' })[style] : 'Script'),
      emoji: ({ curiosity:'🤔', hottake:'🔥', story:'📖', tutorial:'✅', stats:'📊', warning:'⚠️', pov:'😩', list:'📋' })[style] || '📝',
      color: ({ curiosity:'#f59e0b', hottake:'#ef4444', story:'#8b5cf6', tutorial:'#10b981', stats:'#0ea5e9', warning:'#f97316', pov:'#ec4899', list:'#06b6d4' })[style] || '#0ea5e9',
    };
  }

  function buildTimings(duration, sections) {
    var map = {
      '15s':  { hook:'0:00 – 0:03', cta:'0:03 – 0:15' },
      '30s':  { hook:'0:00 – 0:03', setup:'0:03 – 0:08', cta:'0:08 – 0:30' },
      '60s':  { hook:'0:00 – 0:03', setup:'0:03 – 0:10', body1:'0:10 – 0:30', body2:'0:30 – 0:50', cta:'0:50 – 1:00' },
      '90s':  { hook:'0:00 – 0:03', setup:'0:03 – 0:10', body1:'0:10 – 0:35', body2:'0:35 – 1:00', body3:'1:00 – 1:20', cta:'1:20 – 1:30' },
      '3min': { hook:'0:00 – 0:10', intro:'0:10 – 0:30', body1:'0:30 – 1:10', midcta:'1:10 – 1:20', body2:'1:20 – 2:00', body3:'2:00 – 2:45', cta:'2:45 – 3:00' },
      '5min': { hook:'0:00 – 0:30', intro:'0:30 – 1:00', body1:'1:00 – 2:00', midcta1:'2:00 – 2:10', body2:'2:10 – 3:10', midcta2:'3:10 – 3:20', body3:'3:20 – 4:10', body4:'4:10 – 4:45', cta:'4:45 – 5:00', description:'' },
      '10min':{ hook:'0:00 – 0:30', intro:'0:30 – 1:00', body1:'1:00 – 2:00', midcta1:'2:00 – 2:10', body2:'2:10 – 3:30', midcta2:'3:30 – 3:40', body3:'3:40 – 5:00', midcta3:'5:00 – 5:10', body4:'5:10 – 7:00', body5:'7:00 – 9:30', cta:'9:30 – 10:00', description:'' },
    };
    return map[duration] || map['60s'];
  }

  // ── Script analyzer ───────────────────────────────────────────────────────────
  var CURIOSITY_WORDS = ['discovered','secret','nobody','truth','actually','hidden','real','never','didn\'t know','supposed to','not supposed'];
  var CONTROVERSY_WORDS = ['wrong','unpopular','stop','actually','backwards','lie','myth','never','mistake','misled'];
  var POV_WORDS = ['pov:','if you\'re','every ','me when','that feeling','you know when'];
  var NUM_PATTERN = /\b\d+[\s%]/;

  function analyzeScript(text, platform) {
    var first = text.split('\n')[0].trim();
    var words  = first.split(/\s+/).length;
    var lower  = first.toLowerCase();

    var hookScore = 50;
    CURIOSITY_WORDS.forEach(function(w){ if (lower.indexOf(w) !== -1) hookScore += 8; });
    CONTROVERSY_WORDS.forEach(function(w){ if (lower.indexOf(w) !== -1) hookScore += 7; });
    POV_WORDS.forEach(function(w){ if (lower.indexOf(w) !== -1) hookScore += 6; });
    if (NUM_PATTERN.test(lower)) hookScore += 10;
    if (words <= 12) hookScore += 8;
    if (words > 25) hookScore -= 15;
    hookScore = Math.min(99, Math.max(20, hookScore));

    var totalWords = text.split(/\s+/).length;
    var hasNumbers = NUM_PATTERN.test(text);
    var hasCTA = /follow|subscribe|save|like|share|comment/i.test(text);
    var hasList = /\n[\-\*\d]/.test(text) || /first|second|third|step one|step two/i.test(text);
    var retentionScore = Math.min(99, 55 + (hasList ? 15 : 0) + (hasNumbers ? 10 : 0) + (totalWords > 80 ? 5 : -10));
    var ctaScore = hasCTA ? Math.min(95, 65 + Math.floor(Math.random() * 20)) : 35;

    var suggestions = [];
    if (words > 18) suggestions.push({ locked:false, type:'hook', text:'Your hook is too long — aim for under 15 words. Shorter = faster scroll-stop. Try cutting: "' + first.split(' ').slice(0,10).join(' ') + '..."' });
    else suggestions.push({ locked:false, type:'hook', text:'Hook length is good (' + words + ' words). ' + (hookScore > 70 ? 'Strong curiosity or controversy detected — this should stop the scroll.' : 'Consider adding a curiosity gap or a surprising number to boost impact.') });
    suggestions.push({ locked:true, type:'retention', text:platform === 'youtube' ? 'Add a pattern interrupt at the 2-minute mark — a question, a visual change, or a bold statement — to recover viewers about to leave.' : 'Add a visual or verbal pattern interrupt in the middle of your video to re-hook viewers whose attention is drifting.' });
    suggestions.push({ locked:true, type:'cta', text:hasCTA ? 'Your CTA is present but generic. Make it specific: tell them exactly what they\'ll get by following ("Follow for weekly finance tips that actually work for people in their 20s").' : 'No CTA detected. Add one in the last 5-10 seconds. The best CTAs on ' + PLATFORMS[platform].label + ' ask for ' + PLATFORMS[platform].saveVerb + ' or ' + PLATFORMS[platform].ctaVerb + '.' });
    suggestions.push({ locked:true, type:'seo', text:!hasNumbers ? 'Adding a specific number to your hook increases retention by ~23% on average. Try: "' + first.replace(/^(.{0,40})/, '$13 things about') + '"' : 'Good — you have a number in your script. Numbers increase trust and save-rates.' });
    suggestions.push({ locked:true, type:'structure', text:hasList ? 'Good list structure detected — this is the most save-worthy format. Make sure each point has a one-sentence payoff.' : 'Consider restructuring as a list: "3 things about [topic]..." Lists get 2-3x more saves than narrative scripts on ' + PLATFORMS[platform].label + '.' });

    return { hookScore:hookScore, retentionScore:retentionScore, ctaScore:ctaScore, suggestions:suggestions };
  }

  // ── State ─────────────────────────────────────────────────────────────────────
  var state = { isPro:false, results:[], saved:[], platform:'tiktok', duration:'60s', analyzeResult:null };

  function loadState() {
    state.isPro = localStorage.getItem(PRO_KEY) === '1';
    try { state.saved = JSON.parse(localStorage.getItem(SAVED_KEY) || '[]'); } catch(e) { state.saved = []; }
  }

  function today() { return new Date().toISOString().slice(0,10); }

  function getUsage() {
    try {
      var raw = localStorage.getItem(USAGE_KEY);
      if (!raw) return { date:today(), count:0 };
      var u = JSON.parse(raw);
      return u.date === today() ? u : { date:today(), count:0 };
    } catch(e) { return { date:today(), count:0 }; }
  }

  function bumpUsage() { var u = getUsage(); u.count++; localStorage.setItem(USAGE_KEY, JSON.stringify(u)); return u.count; }

  function usageLeft() { return state.isPro ? Infinity : Math.max(0, FREE_DAILY_LIMIT - getUsage().count); }

  function handleProRedirect() {
    if (new URLSearchParams(location.search).get('pro') === 'success') {
      localStorage.setItem(PRO_KEY, '1');
      state.isPro = true;
      history.replaceState(null, '', location.pathname);
    }
  }

  function checkout() {
    if (!PRO_CHECKOUT_URL) { alert('Stripe not yet configured — paste your Payment Link into app.js (PRO_CHECKOUT_URL).'); return; }
    window.location.href = PRO_CHECKOUT_URL;
  }

  // ── Generate scripts ──────────────────────────────────────────────────────────
  window.generateScripts = function() {
    var niche    = document.getElementById('inp-niche').value.trim();
    var topic    = document.getElementById('inp-topic').value.trim();
    var audience = document.getElementById('inp-audience').value.trim() || 'beginners';
    var platform = document.getElementById('sel-platform').value;
    var hookSel  = document.getElementById('sel-hook').value;
    var duration = document.getElementById('sel-duration').value;

    if (!niche || !topic) { showToast('Enter your niche and topic first', 'warn'); return; }

    // Pro gate for long durations
    if (DURATIONS[duration] && DURATIONS[duration].pro && !state.isPro) {
      showUpgrade('Video lengths over 60 seconds require Scriptly Pro. Upgrade to generate 90-second, 3-minute, 5-minute, and 10-minute scripts.');
      return;
    }

    if (usageLeft() <= 0) {
      showUpgrade('You\'ve used your 1 free script today. Upgrade to Pro for unlimited scripts, longer video lengths, and the full Script Analyser.');
      return;
    }

    // Pick 1 or 3 styles
    var styles;
    if (hookSel === 'random') {
      var keys = shuffleKeys(HOOKS_TEXT);
      styles = state.isPro ? keys.slice(0,3) : keys.slice(0,1);
    } else {
      styles = state.isPro ? [hookSel, pickOther(hookSel,0), pickOther(hookSel,1)] : [hookSel];
    }

    var results = styles.map(function(s) { return buildScript(platform, niche, topic, audience, s, duration); });
    state.results = results;
    bumpUsage();
    updateCounter();
    renderResults(results);
  };

  function pickOther(main, offset) {
    var keys = Object.keys(HOOKS_TEXT).filter(function(k){ return k !== main; });
    return keys[(offset + 2) % keys.length];
  }

  function shuffleKeys(obj) {
    var k = Object.keys(obj).slice();
    for (var i = k.length-1; i > 0; i--) { var j = Math.floor(Math.random()*(i+1)); var t=k[i]; k[i]=k[j]; k[j]=t; }
    return k;
  }

  // ── Render results ────────────────────────────────────────────────────────────
  function renderResults(results) {
    var wrap = document.getElementById('results');
    if (!results || !results.length) { wrap.innerHTML = emptyState(); return; }

    wrap.innerHTML = results.map(function(r, i) {
      return scriptCard(r, i);
    }).join('');

    wrap.querySelectorAll('.copy-btn').forEach(function(btn) {
      btn.addEventListener('click', function() { copyScript(parseInt(btn.dataset.idx)); });
    });
    wrap.querySelectorAll('.save-btn').forEach(function(btn) {
      btn.addEventListener('click', function() { saveScript(parseInt(btn.dataset.idx)); });
    });
    wrap.scrollIntoView({ behavior:'smooth', block:'start' });
  }

  function scriptCard(r, i) {
    var isLong   = r.duration === '5min' || r.duration === '10min';
    var dur      = DURATIONS[r.duration] || {};
    var t        = r.timings || {};
    var scoreCol = r.score >= 88 ? '#10b981' : r.score >= 78 ? '#f59e0b' : '#94a3b8';
    var platCfg  = PLATFORMS[r.platform] || PLATFORMS.tiktok;
    var algNote  = platCfg.algNote || '';
    var paceNote = platCfg.paceNote || '';

    function sec(key, label, note, text, visual) {
      if (!text) return '';
      return '<div class="script-sec">' +
        '<div class="sec-hdr"><span class="sec-label">' + label + '</span>' +
        (t[key] ? '<span class="sec-time">' + t[key] + '</span>' : '') +
        '</div>' +
        (visual ? '<div class="visual-note">🎬 ' + esc(visual) + '</div>' : '') +
        (note ? '<div class="sec-note">' + esc(note) + '</div>' : '') +
        '<div class="sec-text">' + escNl(text) + '</div>' +
      '</div>';
    }

    // Grammarly-style analysis (free: 1 suggestion + 2 locked; pro: all)
    var analysis = analyzeScriptFromResult(r);
    var analysisHtml = buildAnalysisHtml(analysis, i);

    var scriptBody = sec('hook','HOOK','Direct eye contact — high energy', r.hookLine, null) +
      (t.setup ? sec('setup','SETUP','Build connection with your audience', r.setup, null) : '') +
      (r.body ? sec('body1','SCRIPT',(isLong ? 'Full script — each [bracket] is your personal expertise to fill in' : 'Be animated — one idea per section'), r.body, null) : '') +
      sec('cta','CALL TO ACTION','Be direct — eye contact, confident', r.cta, null);

    var extras = '<div class="extras">' +
      '<div class="extra-item"><div class="extra-label">📝 CAPTION</div><div class="extra-text">' + esc(r.caption) + '</div></div>' +
      '<div class="extra-item"><div class="extra-label">' + (r.platform === 'youtube' ? '🏷️ TAGS' : '#️⃣ HASHTAGS') + '</div><div class="hashtags">' + esc(r.hashtags) + '</div></div>' +
      '<div class="extra-item"><div class="extra-label">🖼️ ' + (r.platform === 'youtube' ? 'THUMBNAIL' : 'COVER FRAME') + '</div><div class="extra-text">' + esc(r.thumb) + '</div></div>' +
      (r.description ? '<div class="extra-item"><div class="extra-label">📋 YOUTUBE DESCRIPTION & SEO</div><div class="extra-text code-block">' + escNl(r.description) + '</div></div>' : '') +
    '</div>';

    return '<div class="card" style="border-top:3px solid ' + r.color + '">' +
      '<div class="card-header">' +
        '<div class="card-meta">' +
          '<span class="hook-badge" style="background:' + r.color + '22;color:' + r.color + '">' + r.emoji + ' ' + esc(r.label) + '</span>' +
          '<span class="dur-badge">' + (dur.label || r.duration) + '</span>' +
          '<span class="plat-badge">' + esc(platCfg.label || r.platform) + '</span>' +
        '</div>' +
        '<span class="score" style="color:' + scoreCol + '">⚡ ' + r.score + '/100</span>' +
      '</div>' +
      (algNote ? '<div class="alg-note">📈 ' + esc(algNote) + ' · ' + esc(paceNote) + '</div>' : '') +
      scriptBody +
      analysisHtml +
      extras +
      '<div class="card-actions">' +
        '<button class="btn btn-ghost copy-btn" data-idx="' + i + '">📋 Copy Full Script</button>' +
        (state.isPro
          ? '<button class="btn btn-ghost save-btn" data-idx="' + i + '">💾 Save to Library</button>'
          : '<button class="btn btn-ghost" onclick="triggerUpgrade()">💾 Save (Pro)</button>') +
      '</div>' +
    '</div>';
  }

  function analyzeScriptFromResult(r) {
    var fullText = [r.hookLine, r.setup, r.body, r.cta].filter(Boolean).join('\n');
    return analyzeScript(fullText, r.platform);
  }

  function buildAnalysisHtml(a, idx) {
    function scoreBar(label, val, col) {
      return '<div class="score-row">' +
        '<span class="score-label">' + label + '</span>' +
        '<div class="score-bar-wrap"><div class="score-bar-fill" style="width:' + val + '%;background:' + col + '"></div></div>' +
        '<span class="score-num" style="color:' + col + '">' + val + '</span>' +
      '</div>';
    }
    var hookCol = a.hookScore >= 80 ? '#10b981' : a.hookScore >= 60 ? '#f59e0b' : '#ef4444';
    var retCol  = a.retentionScore >= 75 ? '#10b981' : '#f59e0b';
    var ctaCol  = a.ctaScore >= 70 ? '#10b981' : '#f59e0b';

    var sugsHtml = a.suggestions.map(function(s, si) {
      var show = state.isPro || si === 0;
      if (show) {
        var icon = {hook:'🪝',retention:'📊',cta:'📣',seo:'🔍',structure:'🏗️'}[s.type] || '💡';
        return '<div class="suggestion open"><span class="sug-icon">' + icon + '</span><span class="sug-text">' + esc(s.text) + '</span></div>';
      } else {
        return '<div class="suggestion locked"><span class="sug-lock">🔒</span><span class="sug-locked-text">' +
          ({retention:'Retention improvement suggestion', cta:'CTA improvement suggestion', seo:'SEO & hook improvement', structure:'Script structure suggestion'}[s.type] || 'Script suggestion') +
          ' — <a href="#" onclick="event.preventDefault();triggerUpgrade()">upgrade to see</a></span></div>';
      }
    }).join('');

    return '<div class="analysis-block">' +
      '<div class="analysis-title">📊 Script Analysis' + (!state.isPro ? ' <span class="pro-only-tag">Full analysis is Pro</span>' : '') + '</div>' +
      scoreBar('Hook Strength', a.hookScore, hookCol) +
      (state.isPro ? scoreBar('Retention Score', a.retentionScore, retCol) : '<div class="score-row locked-row"><span class="score-label">Retention Score</span><span class="locked-score">🔒 Pro</span></div>') +
      (state.isPro ? scoreBar('CTA Effectiveness', a.ctaScore, ctaCol) : '<div class="score-row locked-row"><span class="score-label">CTA Effectiveness</span><span class="locked-score">🔒 Pro</span></div>') +
      '<div class="suggestions">' + sugsHtml + '</div>' +
    '</div>';
  }

  function emptyState() {
    return '<div class="empty-state"><div class="empty-icon">✏️</div>' +
      '<div class="empty-title">Your full script will appear here</div>' +
      '<div class="empty-sub">Enter your niche, topic, and video length — then hit Generate Script</div></div>';
  }

  function esc(s)   { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function escNl(s) { return esc(s).replace(/\n/g,'<br>'); }

  // ── Copy ──────────────────────────────────────────────────────────────────────
  function copyScript(idx) {
    var r = state.results[idx];
    if (!r) return;
    var dur = DURATIONS[r.duration];
    var lines = [
      '━━━━━━━━━━━━━━━━━━━━━━━━━',
      'SCRIPTLY — ' + (r.emoji + ' ' + r.label).toUpperCase() + ' | ' + (dur ? dur.label : r.duration) + ' | ' + (PLATFORMS[r.platform]||{label:r.platform}).label,
      'Viral Score: ' + r.score + '/100',
      '━━━━━━━━━━━━━━━━━━━━━━━━━',
      '',
      'HOOK (first 3 seconds):',
      '"' + r.hookLine + '"',
      '',
      'SETUP:',
      r.setup,
      '',
      'MAIN SCRIPT:',
      r.body,
      '',
      'CALL TO ACTION:',
      r.cta,
      '',
      'CAPTION:',
      r.caption,
      '',
      (r.platform === 'youtube' ? 'TAGS:' : 'HASHTAGS:'),
      r.hashtags,
      '',
      (r.platform === 'youtube' ? 'THUMBNAIL:' : 'COVER FRAME:'),
      r.thumb,
    ];
    if (r.description) { lines.push(''); lines.push(r.description); }
    lines.push('', '— Generated by Scriptly.app (better than ChatGPT for TikTok scripts)');
    navigator.clipboard.writeText(lines.join('\n')).then(function(){ showToast('Full script copied!','success'); }).catch(function(){
      var ta = document.createElement('textarea'); ta.value = lines.join('\n');
      document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
      showToast('Full script copied!','success');
    });
  }

  // ── Script analyzer tab ───────────────────────────────────────────────────────
  window.runAnalysis = function() {
    var text = (document.getElementById('analyze-input')||{}).value || '';
    if (text.trim().length < 20) { showToast('Paste a script to analyse (at least 20 characters)', 'warn'); return; }
    var platform = (document.getElementById('analyze-platform')||{}).value || 'tiktok';
    var result = analyzeScript(text, platform);
    state.analyzeResult = result;
    renderAnalysis(result, platform);
  };

  function renderAnalysis(a, platform) {
    var wrap = document.getElementById('analysis-results');
    if (!wrap) return;
    var hookCol = a.hookScore >= 80 ? '#10b981' : a.hookScore >= 60 ? '#f59e0b' : '#ef4444';
    var retCol  = a.retentionScore >= 75 ? '#10b981' : '#f59e0b';
    var ctaCol  = a.ctaScore >= 70 ? '#10b981' : '#f59e0b';

    function bar(label, val, col, locked) {
      if (locked && !state.isPro) return '<div class="score-row locked-row" style="margin:8px 0"><span class="score-label">' + label + '</span><button class="btn btn-xs" onclick="triggerUpgrade()">🔒 Unlock with Pro</button></div>';
      return '<div class="score-row" style="margin:8px 0"><span class="score-label">' + label + '</span>' +
        '<div class="score-bar-wrap"><div class="score-bar-fill" style="width:' + val + '%;background:' + col + '"></div></div>' +
        '<span class="score-num" style="color:' + col + '">' + val + '</span></div>';
    }

    var sugsHtml = a.suggestions.map(function(s, i) {
      var show = state.isPro || i === 0;
      var icon = {hook:'🪝',retention:'📊',cta:'📣',seo:'🔍',structure:'🏗️'}[s.type] || '💡';
      if (show) return '<div class="suggestion open"><span class="sug-icon">' + icon + '</span><span class="sug-text">' + esc(s.text) + '</span></div>';
      return '<div class="suggestion locked"><span class="sug-lock">🔒</span><span class="sug-locked-text">' +
        ({retention:'Retention improvement available',cta:'CTA improvement available',seo:'SEO & hook boost available',structure:'Structure improvement available'}[s.type]||'Suggestion available') +
        ' — <a href="#" onclick="event.preventDefault();triggerUpgrade()">upgrade to Pro to unlock</a></span></div>';
    }).join('');

    wrap.innerHTML = '<div class="analysis-block" style="background:var(--surface2);border-radius:12px;padding:20px">' +
      '<div class="analysis-title" style="margin-bottom:16px">📊 Script Analysis — ' + (PLATFORMS[platform]||{label:platform}).label + '</div>' +
      bar('Hook Strength', a.hookScore, hookCol, false) +
      bar('Retention Score', a.retentionScore, retCol, true) +
      bar('CTA Effectiveness', a.ctaScore, ctaCol, true) +
      '<div class="suggestions" style="margin-top:16px">' +
        '<div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);margin-bottom:10px">SUGGESTIONS</div>' +
        sugsHtml +
      '</div>' +
      (!state.isPro ? '<div style="margin-top:16px;padding:14px;background:rgba(14,165,233,.08);border:1px solid rgba(14,165,233,.2);border-radius:8px;font-size:13px;color:var(--muted2)">' +
        '<strong style="color:var(--text)">🔒 ' + (a.suggestions.length - 1) + ' more suggestions locked.</strong> ' +
        'Pro also rewrites your hook, scores your retention, and shows your full CTA analysis. ' +
        '<a href="#" onclick="event.preventDefault();triggerUpgrade()" style="color:var(--accent)">Upgrade for $6/mo →</a>' +
      '</div>' : '') +
    '</div>';
  }

  // ── Save ──────────────────────────────────────────────────────────────────────
  function saveScript(idx) {
    if (!state.isPro) { showUpgrade(); return; }
    var r = state.results[idx];
    if (!r) return;
    state.saved.unshift(Object.assign({}, r, { savedAt:Date.now() }));
    if (state.saved.length > 100) state.saved.pop();
    localStorage.setItem(SAVED_KEY, JSON.stringify(state.saved));
    showToast('Saved to library!','success');
    renderSaved();
  }

  function renderSaved() {
    var wrap = document.getElementById('saved-list');
    if (!wrap) return;
    if (!state.saved.length) { wrap.innerHTML = '<p class="saved-empty">No saved scripts yet.</p>'; return; }
    wrap.innerHTML = state.saved.slice(0,20).map(function(r, i) {
      return '<div class="saved-card">' +
        '<div class="saved-meta">' +
          '<span class="hook-badge" style="background:' + r.color + '22;color:' + r.color + '">' + r.emoji + ' ' + esc(r.label) + '</span>' +
          '<span class="dur-badge">' + esc((DURATIONS[r.duration]||{label:r.duration}).label) + '</span>' +
        '</div>' +
        '<div class="saved-hook">"' + esc(r.hookLine) + '"</div>' +
        '<button class="btn btn-ghost btn-sm" onclick="copySaved(' + i + ')">📋 Copy</button>' +
      '</div>';
    }).join('');
  }

  window.copySaved = function(idx) { var r = state.saved[idx]; if (r) { state.results = [r]; copyScript(0); } };

  // ── UI helpers ────────────────────────────────────────────────────────────────
  function updateCounter() {
    var el = document.getElementById('usage-counter');
    if (!el) return;
    if (state.isPro) { el.textContent = 'Pro — Unlimited scripts'; el.className = 'usage-counter pro'; return; }
    var left = usageLeft();
    el.textContent = left > 0 ? left + ' free script remaining today' : 'Daily limit reached — upgrade for unlimited';
    el.className = 'usage-counter' + (left === 0 ? ' empty' : '');
  }

  function showToast(msg, type) {
    var t = document.createElement('div');
    t.className = 'toast toast-' + (type||'info'); t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function(){ t.classList.add('show'); }, 10);
    setTimeout(function(){ t.classList.remove('show'); setTimeout(function(){ t.remove(); }, 300); }, 2500);
  }

  function showUpgrade(msg) {
    var el = document.getElementById('upgrade-msg');
    if (el && msg) el.textContent = msg;
    var ov = document.getElementById('upgrade-overlay');
    if (ov) ov.classList.add('open');
  }

  window.triggerUpgrade  = function() { showUpgrade(); };
  window.closeUpgrade    = function() { var ov = document.getElementById('upgrade-overlay'); if (ov) ov.classList.remove('open'); };
  window.goCheckout      = function() { checkout(); };

  // ── Tabs & selectors ──────────────────────────────────────────────────────────
  window.switchTab = function(tab) {
    document.querySelectorAll('.tab-btn').forEach(function(b){ b.classList.remove('active'); });
    document.querySelectorAll('.tab-pane').forEach(function(p){ p.classList.remove('active'); });
    var tabBtn = document.querySelector('[data-tab="' + tab + '"]');
    var tabPane = document.getElementById('tab-' + tab);
    if (tabBtn) tabBtn.classList.add('active');
    if (tabPane) tabPane.classList.add('active');
    if (tab === 'saved') renderSaved();
  };

  window.setPlatform = function(p) {
    document.querySelectorAll('.plat-btn').forEach(function(b){ b.classList.remove('active'); });
    var btn = document.querySelector('[data-plat="' + p + '"]');
    if (btn) btn.classList.add('active');
    document.getElementById('sel-platform').value = p;
    state.platform = p;
    updateDurationOptions(p);
  };

  function updateDurationOptions(platform) {
    var sel = document.getElementById('sel-duration');
    if (!sel) return;
    var current = sel.value;
    sel.innerHTML = Object.keys(DURATIONS).filter(function(d){ return DURATIONS[d].platforms.indexOf(platform) !== -1; }).map(function(d){
      var dur = DURATIONS[d];
      return '<option value="' + d + '"' + (d === current || d === '60s' ? ' selected' : '') + '>' + dur.label + (dur.pro ? ' ⭐ Pro' : '') + '</option>';
    }).join('');
  }

  window.setHook = function(style) {
    document.querySelectorAll('.hook-opt').forEach(function(b){ b.classList.remove('active'); });
    var btn = document.querySelector('[data-hook="' + style + '"]');
    if (btn) btn.classList.add('active');
    document.getElementById('sel-hook').value = style;
  };

  // ── Init ──────────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function() {
    loadState();
    handleProRedirect();
    updateCounter();
    renderResults([]);
    renderSaved();

    var badge = document.getElementById('pro-badge');
    if (badge) badge.style.display = state.isPro ? 'inline-flex' : 'none';
    var upgradeBtn = document.getElementById('nav-upgrade');
    if (upgradeBtn) upgradeBtn.style.display = state.isPro ? 'none' : 'inline-flex';

    updateDurationOptions('tiktok');

    ['inp-niche','inp-topic','inp-audience'].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('keydown', function(e){ if (e.key === 'Enter') window.generateScripts(); });
    });
  });

})();
