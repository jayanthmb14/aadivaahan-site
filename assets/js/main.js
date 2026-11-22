/* Vivek Chaturvedi · v4
   One cloud of points follows the scroll: it holds its shape while you read,
   and turns into the next figure as the next chapter arrives. Scroll back and it goes back. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  var smooth = function (t) { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var NAMES = { home: 'Vivek Chaturvedi', healing: '01 / Healing', coaching: '02 / Coaching', design: '03 / Design', about: '04 / About', art: '05 / Art', music: '06 / Music', sandbox: '07 / The sandbox' };

  /* ───── reveals ───── */
  $$('.copy, .wrap, .wall-txt, .sand-in, .two > div, .years, .works, .clips, .quotes').forEach(function (g) {
    $$(':scope > .rv', g).forEach(function (el, i) { el.style.setProperty('--i', Math.min(i, 7)); });
  });
  if ('IntersectionObserver' in window && !REDUCED) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
    $$('.rv').forEach(function (el) { io.observe(el); });
  } else { $$('.rv').forEach(function (el) { el.classList.add('in'); }); }

  /* ───── theme and menu ───── */
  var cloud = null;
  $('#theme').addEventListener('click', function () {
    var t = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', t);
    try { localStorage.setItem('vc-theme', t); } catch (e) {}
    if (cloud) cloud.theme();
  });
  var menu = $('#menu'), menuBtn = $('#menuBtn');
  function setMenu(open) {
    menu.hidden = !open; menuBtn.setAttribute('aria-expanded', open);
    $('span', menuBtn).textContent = open ? 'Close' : 'Chapters';
    document.body.style.overflow = open ? 'hidden' : '';
  }
  menuBtn.addEventListener('click', function () { setMenu(menu.hidden); });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { setMenu(false); closeLb(); } });
  $('#yr').textContent = new Date().getFullYear();

  /* ───── small interactives ───── */
  function group(sel, attr, fn) {
    var bs = $$(sel);
    bs.forEach(function (b) { b.addEventListener('click', function () {
      bs.forEach(function (x) { x.classList.toggle('is-on', x === b); });
      fn(b.getAttribute(attr), b);
    }); });
  }
  function texts(sel, attr, outSel, list) {
    var out = $(outSel); out.textContent = list[0];
    group(sel, attr, function (i) { out.textContent = list[i]; });
  }
  texts('[data-who]', 'data-who', '#whoOut', [
    'You are a finely tuned instrument, but in pieces. “The zone” is a state of the body, not a trick of the mind. This work joins the pieces.',
    'You know the maps: Vedanta, Zen, the Fourth Way. But you cannot skip the body. This is the ground under the teaching.',
    'Pain is not the enemy. It keeps the door. With help, you can walk up to it without fear, and go through.']);
  texts('[data-life]', 'data-life', '#lifeOut', [
    'Twelve years in the Navy taught him that every machine is built around its user. Get the user wrong, and nothing else matters.',
    'In America he worked on technology strategy, then in Silicon Valley. He saw how big companies decide what gets built, and what never does.',
    'A shoe, a helmet, a damper, a vehicle. Each one begins by asking how a living body already solves the problem.',
    'Guitar, flute, drums, and a jaw harp made from the brass of old bombs. Rhythm is how a body thinks.',
    'He takes words apart the way he takes machines apart. Per-form. Re-fine-ment. Find the root and you find the truth.',
    'As Avimukt, he helps people go back through the body, to the place in them that was never hurt.']);
  texts('.layer', 'data-layer', '#layerOut', [
    'Hair comes first. It slides, so a glancing blow slips off instead of grabbing the head.',
    'Skin is next. The scalp moves a little over the bone, which turns a sharp twist into a softer one.',
    'Only now comes the hard part. The skull is a curved shell of bone that spreads the load.',
    'Last, the brain floats in fluid. A cushion that slows it down gently.']);
  var FOOT = { heel: 'Heel first: the hit goes straight up the bones. Shin, knee, hip. The springs of the leg barely join in.',
    toe: 'Toes first: the arch and the calf stretch like springs. They soak up the landing and hand the energy back for the next step.' };
  var footLab = $('#footLab'), footOut = $('#footOut');
  function strike(k) { footLab.setAttribute('data-strike', k); footOut.textContent = FOOT[k]; }
  group('[data-strike]', 'data-strike', strike); strike('heel');

  var WORDS = [
    { p: ['per', 'form'], s: 'To live as per a form. More form, more structure, less of you.' },
    { p: ['less', 'ons'], s: 'He never liked his less-ons. So he became the world’s first self-declared “more-on”.' },
    { p: ['re', 'tire'], s: 'Why get tired, and then get tired all over again?' },
    { p: ['re', 'fine', 'ment'], s: 'Not adding more. Making it fine, again and again. He calls this the only real work.' },
    { p: ['in', 'dust', 'realization'], s: 'His answer to industrialization. Remembering what we are made of.' }];
  var wordBig = $('#wordBig'), wordOut = $('#wordOut');
  function word(i) {
    var w = WORDS[i]; wordBig.textContent = '';
    w.p.forEach(function (p, k) {
      if (k) { var d = document.createElement('span'); d.className = 'dot'; d.textContent = '·'; wordBig.appendChild(d); }
      var s = document.createElement('span'); s.textContent = p; s.style.setProperty('--d', k - (w.p.length - 1) / 2); wordBig.appendChild(s);
    });
    wordOut.textContent = w.s;
  }
  group('.word', 'data-w', word); word(0);

  $$('.video[data-yt]').forEach(function (v) {
    v.addEventListener('click', function () {
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + v.getAttribute('data-yt') + '?autoplay=1&rel=0';
      f.title = (v.getAttribute('data-title') || 'Video') + ', Vivek Chaturvedi';
      f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen'; f.allowFullscreen = true;
      v.textContent = ''; v.appendChild(f);
    }, { once: true });
  });

  var lb = $('#lightbox'), lbImg = $('img', lb);
  function closeLb() { lb.hidden = true; lbImg.removeAttribute('src'); }
  $$('.work-b').forEach(function (b) { b.addEventListener('click', function () {
    lbImg.src = b.getAttribute('data-full'); lbImg.alt = $('img', b).alt; lb.hidden = false;
  }); });
  lb.addEventListener('click', closeLb);

  var copyBtn = $('#copyMail');
  copyBtn.addEventListener('click', function () {
    var done = function () { copyBtn.textContent = 'Copied'; setTimeout(function () { copyBtn.textContent = 'Copy the address'; }, 1800); };
    if (navigator.clipboard) navigator.clipboard.writeText('vivek@aadivaahan.com').then(done, done); else done();
  });

  /* the First Exercise: one guided minute */
  var ex = $('#ex'), exBtn = $('#exStart'), exOut = $('#exOut'), ringNum = $('#ringNum'), exSteps = $$('#exSteps li'), exTimer = null;
  function exStop(done) {
    clearInterval(exTimer); exTimer = null; ex.classList.remove('is-run');
    exSteps.forEach(function (li) { li.classList.remove('is-now'); });
    exBtn.textContent = done ? 'Do it again' : 'Begin the minute'; ringNum.textContent = done ? '✓' : '60';
    exOut.textContent = done ? 'Notice the quiet. For a moment, feeling took the place of thinking. That is the starting point.' : '';
  }
  exBtn.addEventListener('click', function () {
    if (exTimer) { exStop(false); return; }
    var t = 60; ex.classList.add('is-run'); exBtn.textContent = 'Stop'; exOut.textContent = 'Close your eyes if you like. The steps light up one by one.';
    function tick() {
      ringNum.textContent = t; var s = t > 50 ? 0 : t > 40 ? 1 : t > 30 ? 2 : 3;
      exSteps.forEach(function (li, i) { li.classList.toggle('is-now', i === s); });
      if (t-- <= 0) exStop(true);
    }
    tick(); exTimer = setInterval(tick, 1000);
  });

  /* ───── the juggle ───── */
  var home = $('#home'), pin = $('#homePin'), jug = $('#jug'), orbitEl = $('.orbit'), balls = $$('#balls .ball'), slots = $$('.slot'),
    ledeW = $('#ledeW'), doors = $('#doors'), arc = $('.arc'), jugStop = $('#jugStop');
  var J = { t: 0, paused: false, hover: false, geo: null, p: 0, h: 0, off: false };
  function measureJuggle() {
    var keep = doors.style.transform; doors.style.transform = 'none';
    var pr = pin.getBoundingClientRect(), o = orbitEl.getBoundingClientRect();
    J.geo = { cx: o.left + o.width / 2 - pr.left, cy: o.top + o.height / 2 - pr.top, rx: o.width / 2, ry: o.height / 2,
      slots: slots.map(function (s) { var r = s.getBoundingClientRect(); return { x: r.left + r.width / 2 - pr.left, y: r.top + r.height / 2 - pr.top, d: r.width }; }),
      d: balls[0].offsetWidth };
    J.h = home.offsetHeight;
    doors.style.transform = keep;
  }
  jug.addEventListener('pointerenter', function () { J.hover = true; });
  jug.addEventListener('pointerleave', function () { J.hover = false; });
  jugStop.addEventListener('click', function () { J.paused = !J.paused; jugStop.textContent = J.paused ? 'Juggle again' : 'Stop the juggle'; });
  function drawJuggle(dt) {
    if (!J.geo) return;
    if (window.scrollY > J.h + 40) { J.off = true; return; }      // home is off screen: nothing to move
    J.off = false;
    var max = J.h - window.innerHeight, p = max > 0 ? clamp(window.scrollY / max, 0, 1) : 0; J.p = p;
    var s = smooth((p - 0.1) / 0.5);
    if (!J.paused && !J.hover && !REDUCED && s < 1) J.t += dt * (1 - s);
    var g = J.geo, n = balls.length;
    for (var i = 0; i < n; i++) {
      var a = J.t * 0.55 + i * Math.PI * 2 / n - Math.PI / 2;
      // a slow cascade: an oval path with a little lift at the top of each throw
      var ox = g.cx + Math.cos(a) * g.rx, oy = g.cy + Math.sin(a) * g.ry - Math.max(0, -Math.sin(a)) * g.ry * 0.08;
      var si = smooth(s * 1.25 - i * 0.05);
      var x = lerp(ox, g.slots[i].x, si), y = lerp(oy, g.slots[i].y, si) - Math.sin(Math.PI * si) * 40;
      var sc = lerp(0.9 + 0.12 * Math.sin(a), g.slots[i].d / g.d, si);
      balls[i].style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0) scale(' + sc.toFixed(3) + ')';
      balls[i].firstElementChild.style.opacity = (1 - si * 1.6).toFixed(2);
    }
    var lo = 1 - smooth(p / 0.16), dop = smooth((p - 0.3) / 0.3);
    ledeW.style.opacity = lo; ledeW.style.visibility = lo < 0.02 ? 'hidden' : 'visible';
    ledeW.style.transform = 'translateY(' + (-(1 - lo) * 24) + 'px)';
    doors.style.opacity = dop; doors.style.visibility = dop < 0.02 ? 'hidden' : 'visible';
    doors.style.transform = 'translateY(' + ((1 - dop) * 24) + 'px)';
    orbitEl.style.opacity = 1 - s;
  }

  /* ───── the cloud (plain WebGL, no library) ───── */
  function initCloud() {
    var canvas = $('#cloud'), gl = null, N = 16000, VER = '7';
    try { gl = canvas.getContext('webgl', { alpha: true, antialias: false, powerPreference: 'high-performance' }); } catch (e) {}
    if (!gl) return null;
    var PR = 1;
    var seed = 7; function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    var shapes = {};                                           // name -> { pos, col, pb, cb }
    function make(name, fn) {
      var pos = new Float32Array(N * 3), col = new Float32Array(N * 3), o = [0, 0, 0, 1, 1, 1];
      for (var i = 0; i < N; i++) { fn(i, o); pos[i * 3] = o[0]; pos[i * 3 + 1] = o[1]; pos[i * 3 + 2] = o[2]; col[i * 3] = o[3]; col[i * 3 + 1] = o[4]; col[i * 3 + 2] = o[5]; }
      shapes[name] = { pos: pos, col: col };
    }
    function rgb(o, r, g, b, k) { o[3] = r * k; o[4] = g * k; o[5] = b * k; }
    var TAU = Math.PI * 2;
    make('galaxy', function (i, o) {                         // spiralling in
      var t = Math.pow(rnd(), 0.62), arm = i % 2, r = 0.05 + t * 1.75, a = Math.log(r / 0.05) * 2.35 + arm * Math.PI + (rnd() - 0.5) * (0.55 - t * 0.25), sp = (rnd() - 0.5) * 0.16 * (0.4 + t);
      o[0] = Math.cos(a) * (r + sp); o[1] = Math.sin(a) * (r + sp) * 0.62; o[2] = (rnd() - 0.5) * 0.35 * (1.2 - t) + Math.sin(a) * r * 0.28;
      var h = 1 - t; o[3] = 1; o[4] = 0.55 + h * 0.4; o[5] = 0.16 + h * 0.55;
    });
    make('coil', function (i, o) {                           // a conch: the spiral that returns to centre
      var t = rnd(), a = t * TAU * 5.5, r = 0.08 + 1.15 * Math.pow(1 - t, 1.25), tube = 0.03 + 0.07 * (1 - t), ja = rnd() * TAU, jr = Math.sqrt(rnd()) * tube;
      o[0] = Math.cos(a) * r + Math.cos(ja) * jr; o[2] = Math.sin(a) * r + Math.sin(ja) * jr; o[1] = -0.95 + t * 1.9 + Math.sin(ja) * jr;
      rgb(o, 0.42 + t * 0.55, 0.86 + t * 0.14, 0.78 + t * 0.2, 0.75 + 0.25 * rnd());
    });
    make('wheel', function (i, o) {                          // time to reinvent the wheel
      var k = rnd(), a, r, z = (rnd() - 0.5) * 0.16;
      if (k < 0.46) { a = rnd() * TAU; r = 1 + (rnd() - 0.5) * 0.13; }
      else if (k < 0.58) { a = rnd() * TAU; r = Math.sqrt(rnd()) * 0.2; z *= 1.6; }
      else { a = Math.floor(rnd() * 12) / 12 * TAU + (rnd() - 0.5) * 0.035; r = 0.2 + rnd() * 0.78; z *= 0.5; }
      o[0] = Math.cos(a) * r; o[1] = Math.sin(a) * r; o[2] = z; rgb(o, 1, 0.56 + 0.3 * rnd(), 0.28, 0.7 + 0.3 * rnd());
    });
    make('lifeline', function (i, o) {                       // one line, six loops, one bead for each life
      var bead = i % 9 === 0, u = bead ? (Math.floor(rnd() * 6) + 0.5) / 6 : rnd(), th = u * TAU * 6, R = 0.3, j = bead ? 0.07 : 0.022;
      o[0] = -1.45 + 2.9 * u + R * Math.sin(th) + (rnd() - 0.5) * j; o[1] = R * (1 - Math.cos(th)) - 0.3 + 0.35 * Math.sin(u * Math.PI) + (rnd() - 0.5) * j; o[2] = Math.sin(th) * 0.22 + (rnd() - 0.5) * j;
      if (bead) rgb(o, 1, 0.82, 0.45, 1); else rgb(o, 0.5, 0.68, 1, 0.65 + 0.35 * rnd());
    });
    var PAL = [[1, 0.36, 0.52], [1, 0.72, 0.2], [0.36, 0.5, 1], [0.5, 0.92, 0.6], [1, 0.3, 0.22], [0.8, 0.5, 1]];
    make('brush', function (i, o) {                          // loose strokes, after his paintings
      var s = i % 6, t = rnd(), ph = s * 1.7, w = 0.05 + 0.1 * Math.sin(t * Math.PI), c = PAL[s];
      var x = -1.3 + 2.6 * t, y = 0.55 * Math.sin(t * 5.2 + ph) + (s - 2.5) * 0.24 + 0.25 * Math.sin(t * 11 + ph * 2);
      o[0] = x + (rnd() - 0.5) * w; o[1] = y * 0.85 + (rnd() - 0.5) * w * 2.2; o[2] = 0.3 * Math.cos(t * 6 + ph) + (rnd() - 0.5) * 0.08;
      rgb(o, c[0], c[1], c[2], 0.6 + 0.4 * rnd());
    });
    make('strings', function (i, o) {                        // four strings, ready to be plucked
      var s = i % 4, x = -1.5 + 3 * rnd(), end = Math.abs(x) > 1.44;
      o[0] = x; o[1] = (s - 1.5) * 0.36 + (rnd() - 0.5) * (end ? 0.2 : 0.012 + s * 0.006); o[2] = (rnd() - 0.5) * 0.03;
      rgb(o, 1, 0.78, 0.32, 0.6 + 0.4 * rnd());
    });
    var rand = new Float32Array(N * 3); for (var i = 0; i < N * 3; i++) rand[i] = Math.random() * 2 - 1;

    var VS = [
      'attribute vec3 aPosA, aPosB, aColA, aColB, aRand;',
      'uniform mat4 uMV, uP; uniform float uMix, uTime, uSize, uShake, uPluck, uScat; varying vec3 vCol; varying float vFade;',
      'void main(){',
      '  float d = clamp(uMix * 1.3 - (aRand.x * .5 + .5) * .3, 0., 1.);',
      '  float e = d * d * (3. - 2. * d);',
      '  vec3 p = mix(aPosA, aPosB, e);',
      '  float mid = sin(e * 3.14159);',
      '  p += aRand * mid * .28 * uScat;',
      '  p.xy += vec2(cos(uTime * .6 + aRand.y * 6.), sin(uTime * .5 + aRand.z * 6.)) * .01;',
      '  p.x += sin(uTime * 13. + p.y * 2.2) * uShake * (p.y + 1.1) * .11;',
      '  p.y += sin((p.x + 1.5) * 2.0944) * sin(uTime * 34. + p.y * 9.) * uPluck * .16;',
      '  vCol = mix(aColA, aColB, e); vFade = 1. - mid * .35 * uScat;',
      '  vec4 mv = uMV * vec4(p, 1.);',
      '  gl_PointSize = uSize * (7. / -mv.z) * (.75 + (aRand.y * .5 + .5) * .7);',
      '  gl_Position = uP * mv;',
      '}'].join('\n');
    var FS = [
      'precision mediump float; uniform float uAlpha, uInk; varying vec3 vCol; varying float vFade;',
      'void main(){ float r = length(gl_PointCoord - .5); float a = 1. - smoothstep(.1, .5, r);',
      '  vec3 ink = vCol * vCol * .34;',                                     // day: the same figure, drawn in ink
      '  gl_FragColor = vec4(mix(vCol, ink, uInk), a * mix(.7, .9, uInk) * vFade * uAlpha); }'].join('\n');
    var prog, loc = {}, U = {}, light = false, cur = [null, null], ok = false;
    function buf(arr) { var b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, arr, gl.STATIC_DRAW); return b; }
    function upload(s) { s.pb = buf(s.pos); s.cb = buf(s.col); }
    function point(name, b) { gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.vertexAttribPointer(loc[name], 3, gl.FLOAT, false, 0, 0); }
    function glInit() {
      function sh(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; }
      prog = gl.createProgram(); gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return false;
      gl.useProgram(prog);
      ['aPosA', 'aPosB', 'aColA', 'aColB', 'aRand'].forEach(function (n) { loc[n] = gl.getAttribLocation(prog, n); gl.enableVertexAttribArray(loc[n]); });
      ['uMV', 'uP', 'uMix', 'uTime', 'uSize', 'uShake', 'uPluck', 'uScat', 'uAlpha', 'uInk'].forEach(function (n) { U[n] = gl.getUniformLocation(prog, n); });
      Object.keys(shapes).forEach(function (k) { upload(shapes[k]); });
      point('aRand', buf(rand));
      gl.disable(gl.DEPTH_TEST); gl.enable(gl.BLEND); gl.clearColor(0, 0, 0, 0);
      return true;
    }
    if (!glInit()) return null;
    ok = true;
    canvas.addEventListener('webglcontextlost', function (e) { e.preventDefault(); ok = false; });
    canvas.addEventListener('webglcontextrestored', function () { ok = glInit(); S.pair = -2; S.dirty = true; measure(); theme(); });

    var stages = $$('.stage').map(function (el) {
      return { el: el, disc: el.querySelector('.disc'), shape: el.getAttribute('data-shape'), base: el.getAttribute('data-shape'), side: el.getAttribute('data-side') || 'right',
        scale: parseFloat(el.getAttribute('data-scale')) || 1, turn: parseFloat(el.getAttribute('data-turn')) || 0, top: 0, bottom: 0 };
    });
    var S = { busyAt: 0, W: 1, H: 1, pair: -2, mix: 0, target: 0, mx: 0, my: 0, shakeAt: -1e9, pluckAt: -1e9, live: true, local: null, k: 0, count: N, size: 2.2, dirty: true, vh: 1, vw: 1 };
    var P = new Float32Array(16), MV = new Float32Array(16); MV[15] = 1;

    /* figures sampled from pictures arrive one small file at a time, in the order the page needs them */
    function got(name, bufr) {
      var p = new Int16Array(bufr, 0, N * 3), c = new Uint8Array(bufr, N * 6, N * 3), pos = new Float32Array(N * 3), col = new Float32Array(N * 3);
      for (var i = 0; i < N * 3; i++) { pos[i] = p[i] / 8000; col[i] = c[i] / 255; }
      shapes[name] = { pos: pos, col: col }; if (ok) upload(shapes[name]);
      S.pair = -2; S.dirty = true; S.busyAt = performance.now();  // if it is on screen now, show it
    }
    var want = [], asked = {};
    stages.forEach(function (s) { if (!shapes[s.shape] && want.indexOf(s.shape) < 0) want.push(s.shape); });
    $$('[data-setshape]').forEach(function (b) { var n = b.getAttribute('data-setshape'); if (!shapes[n] && want.indexOf(n) < 0) want.push(n); });
    function ask(name) {
      if (asked[name] || shapes[name]) return Promise.resolve(); asked[name] = 1;
      return fetch('assets/pts/' + name + '.bin?v=' + VER).then(function (r) { if (!r.ok) throw 0; return r.arrayBuffer(); }).then(function (b) { got(name, b); });
    }
    function fromScript() {                                    // opened straight from a folder (no server): fall back to the one big file
      if (fromScript.done) return; fromScript.done = 1;
      var sc = document.createElement('script'); sc.src = 'assets/js/points.js';
      sc.onload = function () { Object.keys(window.SHAPES || {}).forEach(function (k) {
        var o = window.SHAPES[k], bin = atob(o.p) + atob(o.c), u = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
        got(k, u.buffer); }); window.SHAPES = null; };
      document.head.appendChild(sc);
    }
    (function next() { var n = want.shift(); if (n) ask(n).then(next, location.protocol === 'file:' ? fromScript : next); })();
    function shp(name) { if (!shapes[name]) { ask(name).catch(function () {}); return shapes.galaxy; } return shapes[name]; }

    function setPair(a, b) {
      var A = shp(a), B = shp(b);
      point('aPosA', A.pb); point('aColA', A.cb); point('aPosB', B.pb); point('aColB', B.cb);
    }
    function measure() {
      S.W = window.innerWidth; S.H = window.innerHeight;
      // full sharpness on phones, tablets and laptops; only very large retina screens (5K and up) are held to about 7 million pixels
      PR = Math.max(1, Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(7e6 / (S.W * S.H))));
      var w = Math.round(S.W * PR), h = Math.round(S.H * PR);
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
      gl.viewport(0, 0, w, h);
      var f = 1 / Math.tan(35 * Math.PI / 360), near = 0.1, far = 50;
      P.fill(0); P[0] = f / (S.W / S.H); P[5] = f; P[10] = (far + near) / (near - far); P[11] = -1; P[14] = 2 * far * near / (near - far);
      S.vh = 2 * 7 * Math.tan(35 * Math.PI / 360); S.vw = S.vh * S.W / S.H;
      var y = window.scrollY;
      stages.forEach(function (s) { var r = s.el.getBoundingClientRect(); s.top = r.top + y; s.bottom = r.bottom + y; });
      S.count = S.W < 700 ? Math.floor(N * 0.6) : N; S.size = (S.W < 700 ? 1.9 : 2.2) * PR; S.dirty = true;
    }
    function place(s) {                                       // where a stage wants the figure: [x, y, scale, alpha]
      var vh = S.vh, vw = S.vw, narrow = S.W < 900;
      var fit = narrow ? Math.min(0.95, vw / 3.5) : Math.min(1.14, vw / 7.2), x = 0, y = 0, a = 1;
      if (s.disc) { var dr = s.disc.getBoundingClientRect(); return [((dr.left + dr.width / 2) / S.W - 0.5) * vw, (0.5 - (dr.top + dr.height / 2) / S.H) * vh, s.disc.offsetWidth / S.H * vh / 3.3 * s.scale, 1]; }
      if (s.side === 'homeleft') { x = narrow ? 0 : -vw * 0.24; y = narrow ? vh * 0.2 : -vh * 0.06; a = 0.5; }
      else if (s.side === 'center') { a = 0.55; }
      else if (narrow) { y = vh * 0.2; }
      else x = (s.side === 'left' ? -1 : 1) * vw * 0.235;
      return [x, y, fit * s.scale, a];
    }
    function theme() {
      light = root.getAttribute('data-theme') === 'light'; S.dirty = true;
      if (light) gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA); else gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    }
    measure(); theme();
    window.addEventListener('pointermove', function (e) { S.mx = e.clientX / S.W * 2 - 1; S.my = e.clientY / S.H * 2 - 1; }, { passive: true });
    document.addEventListener('visibilitychange', function () { S.live = !document.hidden; if (S.live) { last = performance.now(); requestAnimationFrame(frame); } });

    var rx = 0, ry = 0, px = 0, py = 0, ps = 1, pa = 0, vis = 1, last = performance.now(), blank = false, lastY = -1, skip = false, prevRaf = 0;
    function frame(now) {
      if (!S.live) return;
      requestAnimationFrame(frame);
      // while you scroll or a figure is changing, every frame is drawn; when all is still, every second one is enough
      var sy = window.scrollY, busy = sy !== lastY || now - S.busyAt < 900 || (!J.off && !J.paused);
      if (sy !== lastY) { lastY = sy; S.busyAt = now; }
      var fast = now - prevRaf < 12; prevRaf = now;            // a 120Hz screen: when all is still, 60 pictures a second look the same
      if (!busy && fast && (skip = !skip)) return;
      var dt = Math.min(0.05, (now - last) / 1000); last = now;
      drawJuggle(dt);
      if (!ok) return;
      var mid = window.scrollY + S.H * 0.5, k = 0, n = stages.length;
      for (var i = 1; i < n; i++) {
        var adj = stages[i].top - stages[i - 1].bottom < 4, w0 = adj ? stages[i].top - S.H * (S.W < 900 ? 0.42 : 0.55) : stages[i].top - S.H * 0.95;
        stages[i].w0 = w0; stages[i].w1 = stages[i].top + S.H * 0.1;
        if (mid >= w0) k = i;
      }
      S.k = k;
      var A = k ? stages[k - 1] : stages[0], B = stages[k], t = k ? smooth((mid - B.w0) / (B.w1 - B.w0)) : 1;
      if (S.local && S.local.k !== k) { stages[S.local.k].shape = stages[S.local.k].base; S.local = null; S.pair = -2; }
      var scat = 1;
      if (S.local) {                                           // a button asked for another figure on this stage
        var q = clamp((now - S.local.t0) / 1300, 0, 1); S.mix = REDUCED ? 1 : q; t = 1;
        if (S.dirty) setPair(S.local.from, B.shape);
      } else {
        if (S.pair !== k) { setPair(A.shape, B.shape); S.mix = k > S.pair ? (S.pair === -2 ? t : 0) : 1; S.pair = k; }
        scat = A.shape === B.shape ? 0 : 1;
        S.mix += (t - S.mix) * (REDUCED ? 1 : Math.min(1, dt * 7));
      }
      S.dirty = false;
      var sh = (now - S.shakeAt) / 1000, shake = sh < 6 ? Math.exp(-sh * 0.75) * (sh < 0.4 ? sh / 0.4 : 1) : 0;
      var pl = (now - S.pluckAt) / 1000, pluck = pl < 5 ? Math.exp(-pl * 0.9) : 0;
      var pA = place(A), pB = place(B), m = S.local ? 1 : S.mix, f = Math.min(1, dt * 6);
      var tx = lerp(pA[0], pB[0], m), ty = lerp(pA[1], pB[1], m) - Math.sin(Math.PI * m) * (Math.abs(pA[0] - pB[0]) > 0.5 ? 0.55 : 0);
      px += (tx - px) * f; py += (ty - py) * f; ps += (lerp(pA[2], pB[2], m) - ps) * f; pa += (lerp(pA[3], pB[3], m) - pa) * Math.min(1, dt * 3);
      var inS = 0; for (var j = 0; j < n; j++) if (mid > stages[j].top - S.H * 0.2 && mid < stages[j].bottom + S.H * 0.2) { inS = 1; break; }
      vis += (inS - vis) * Math.min(1, dt * 5);
      var alpha = pa * vis;
      var flat = B.shape === 'galaxy' && m > 0.5, sway = REDUCED ? 0 : Math.sin(now / 1000 * 0.3) * 0.32;
      var turn = lerp(A.turn, B.turn, m);
      ry += ((flat ? 0 : sway) + turn + S.mx * 0.3 - ry) * f; rx += (S.my * 0.16 - rx) * f;
      if (alpha < 0.004) {                                     // behind a solid band: draw nothing, save the battery
        if (!blank) { gl.clear(gl.COLOR_BUFFER_BIT); blank = true; }
        return;
      }
      blank = false;
      var ex = rx + (flat ? -0.5 : 0) * m, ez = flat && !REDUCED ? now / 1000 * 0.07 : 0;
      var a = Math.cos(ex), b = Math.sin(ex), c = Math.cos(ry), d = Math.sin(ry), e = Math.cos(ez), g = Math.sin(ez);
      MV[0] = c * e * ps; MV[1] = (a * g + b * e * d) * ps; MV[2] = (b * g - a * e * d) * ps;
      MV[4] = -c * g * ps; MV[5] = (a * e - b * g * d) * ps; MV[6] = (b * e + a * g * d) * ps;
      MV[8] = d * ps; MV[9] = -b * c * ps; MV[10] = a * c * ps;
      MV[12] = px; MV[13] = py; MV[14] = -7;
      gl.uniformMatrix4fv(U.uMV, false, MV); gl.uniformMatrix4fv(U.uP, false, P);
      gl.uniform1f(U.uMix, S.mix); gl.uniform1f(U.uTime, now / 1000 % 3600); gl.uniform1f(U.uSize, S.size); gl.uniform1f(U.uShake, shake);
      gl.uniform1f(U.uPluck, pluck); gl.uniform1f(U.uScat, scat); gl.uniform1f(U.uAlpha, alpha); gl.uniform1f(U.uInk, light ? 1 : 0);
      gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.POINTS, 0, S.count);
    }
    requestAnimationFrame(frame);
    return {
      theme: theme, measure: measure,
      shake: function () { S.shakeAt = performance.now(); S.busyAt = S.shakeAt + 6000; }, pluck: function () { S.pluckAt = performance.now(); S.busyAt = S.pluckAt + 5000; },
      show: function (name) {                                  // morph the current stage to another figure
        var s = stages[S.k]; if (s.shape === name) return;
        ask(name).catch(function () {});
        S.local = { k: S.k, t0: performance.now(), from: s.shape }; s.shape = name; S.mix = 0; S.dirty = true; S.busyAt = performance.now() + 1500;
      }
    };
  }

  /* ───── scroll: crumb, trail, colours, thread ───── */
  var SUB = { purnam: 'Purnam', exercise: 'The first exercise', spiral: 'Spiral', idea: 'Shell, animal, bones', method: 'The method', footware: 'Footware', heavenmet: 'Heaven-met', redwood: 'The redwood', sundancer: 'Sundancer',
    lives: 'Six lives', years: 'The years', mind: 'One mind', talk: 'The Unperformance', films: 'Films', gallery: 'The paintings', bones: 'In his bones', listen: 'Listen' };
  var ORDER = ['home', 'healing', 'coaching', 'design', 'about', 'art', 'music', 'sandbox'];
  var secs = $$('main > section[data-ch]').map(function (el) { return { el: el, ch: el.getAttribute('data-ch'), sub: '', top: 0, bottom: 0, wall: el.classList.contains('wall') ? el.querySelector('.disc') : null }; });
  secs.forEach(function (s, i) { s.sub = SUB[s.el.id] || (i && secs[i - 1].ch === s.ch && !s.wall ? secs[i - 1].sub : ''); });
  var chap = {}; ORDER.forEach(function (c) { chap[c] = { top: 0, bottom: 0 }; });
  var rail = $('#railFill'), crumb = $('#crumb'), trailT = $('#trailT'), stops = $$('.trail-s'), yearsEl = $('.years'), curCh = '', curSub = null, Y = { top: 0, h: 1 };
  var river = $('#river'), rBg = $('#river-bg'), rFg = $('#river-fg'), rDotG = $('#river-bead'), R = { len: 0, ys: [], xs: [], ls: [], real: 0, last: -1, on: -1, d: '', W: 0 };
  function measureSecs() {
    var y = window.scrollY;
    secs.forEach(function (s) { var r = s.el.getBoundingClientRect(); s.top = r.top + y; s.bottom = r.bottom + y; });
    ORDER.forEach(function (c) { var mine = secs.filter(function (s) { return s.ch === c; }); if (mine.length) { chap[c].top = mine[0].top; chap[c].bottom = mine[mine.length - 1].bottom; } });
    if (yearsEl) { var yr = yearsEl.getBoundingClientRect(); Y.top = yr.top + y; Y.h = yr.height || 1; }
  }
  function buildRiver() {
    var W = window.innerWidth, vh = window.innerHeight, H = document.documentElement.scrollHeight, y = window.scrollY, narrow = W < 900;
    river.setAttribute('width', W); river.setAttribute('height', H); river.style.height = H + 'px';
    // every section after the home screen gets the thread: figure sections keep it on the figure's side, solid sections take turns
    var flip = false, st = $$('main > section').slice(1).map(function (s) {
      var r = s.getBoundingClientRect(), stage = s.classList.contains('stage'), left;
      if (stage) { left = s.getAttribute('data-side') === 'left'; flip = left; } else { flip = !flip; left = flip; }
      return { x: (left ? (narrow ? 0.04 : 0.045) : (narrow ? 0.96 : 0.955)) * W, top: r.top + y, bottom: r.bottom + y, band: !stage };
    });
    if (st.length < 2) return;
    // it runs straight down one margin, and crosses to the other side only in the gap between two sections.
    // The points along it are worked out here in plain arithmetic, so scrolling never has to ask the browser to measure the path.
    var x0 = st[0].x, y0 = st[0].top + vh * 0.3, d = 'M' + x0 + ' ' + y0, cx = x0, cy = y0;
    var xs = [x0], ys = [y0], ls = [0], len = 0;
    function to(px, py) { len += Math.sqrt((px - cx) * (px - cx) + (py - cy) * (py - cy)); cx = px; cy = py; xs.push(px); ys.push(py); ls.push(len); }
    for (var i = 1; i < st.length; i++) {
      var b = st[i], yb = b.top, g = (b.band || st[i - 1].band) ? Math.min(vh * 0.07, 60) : vh * 0.16;
      if (Math.abs(b.x - cx) < 1) continue;
      var ax = cx, ay = yb - g, by = yb + g;
      d += ' L' + ax + ' ' + ay + ' C' + ax + ' ' + yb + ' ' + b.x + ' ' + yb + ' ' + b.x + ' ' + by;
      to(ax, ay);
      for (var k = 1; k <= 28; k++) {                          // the S-shaped crossing, as 28 short straight pieces
        var t = k / 28, u = 1 - t, w1 = 3 * u * u * t, w2 = 3 * u * t * t, w0 = u * u * u, w3 = t * t * t;
        to((w0 + w1) * ax + (w2 + w3) * b.x, w0 * ay + (w1 + w2) * yb + w3 * by);
      }
    }
    var endY = st[st.length - 1].top + vh * 0.5; d += ' L' + cx + ' ' + endY; to(cx, endY);
    if (d === R.d && W === R.W) return;                        // nothing moved: leave the drawn thread alone
    R.d = d; R.W = W; R.xs = xs; R.ys = ys; R.ls = ls; R.len = len;
    rBg.setAttribute('d', d); rFg.setAttribute('d', d);
    R.real = rFg.getTotalLength() || len;
    rFg.style.strokeDasharray = R.real; rFg.style.strokeDashoffset = R.real; R.last = -1;
  }
  function drawRiver(mid) {
    if (!R.len) return;
    var ys = R.ys, n = ys.length - 1, lo = 0, hi = n;          // how much thread reaches the middle of the screen
    if (mid <= ys[0]) hi = 0; else if (mid >= ys[n]) lo = n;
    else while (hi - lo > 1) { var m = (lo + hi) >> 1; if (ys[m] < mid) lo = m; else hi = m; }
    var f = hi === lo ? 0 : (mid - ys[lo]) / ((ys[hi] - ys[lo]) || 1), L = R.ls[lo] + (R.ls[hi] - R.ls[lo]) * f;
    if (Math.abs(L - R.last) < 0.5) return;
    R.last = L;
    var x = R.xs[lo] + (R.xs[hi] - R.xs[lo]) * f, y = ys[lo] + (ys[hi] - ys[lo]) * f;
    rFg.style.strokeDashoffset = R.real - L * R.real / R.len;
    rDotG.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')');
    var on = L > 1 && L < R.len - 1 ? 1 : 0; if (on !== R.on) { R.on = on; rDotG.style.opacity = on; }
  }
  var ticking = false;
  function onScroll() {
    ticking = false;
    var y = window.scrollY, h = window.innerHeight, max = document.documentElement.scrollHeight - h, mid = y + h * 0.5, ch = curCh, sub = '';
    rail.style.transform = 'scaleX(' + (max > 0 ? clamp(y / max, 0, 1) : 0) + ')';
    for (var i = 0; i < secs.length; i++) {
      var s = secs[i];
      if (s.top <= mid && s.bottom > mid) { ch = s.ch; sub = s.sub; }
      if (s.wall && s.bottom > y - h && s.top < y + h * 2) s.wall.style.setProperty('--r', ((mid - s.top) / h * 70).toFixed(1) + 'deg');   // the ball rolls as you scroll
    }
    if (mid >= secs[secs.length - 1].bottom) { ch = 'sandbox'; sub = ''; }
    if (ch !== curCh || sub !== curSub) {
      curCh = ch; curSub = sub; document.body.setAttribute('data-ch', ch);
      var label = (NAMES[ch] || '') + (sub ? '  ·  ' + sub : ''); crumb.textContent = label; trailT.textContent = label;
    }
    var ci = ORDER.indexOf(ch);
    stops.forEach(function (a, i) {
      var c = chap[ORDER[i]], p = i < ci ? 1 : i > ci ? 0 : clamp((mid - c.top) / ((c.bottom - c.top) || 1), 0, 1);
      if (a._p !== p) { a._p = p; a.style.setProperty('--p', p.toFixed(3)); }
      var st = i === ci ? 2 : i < ci ? 1 : 0;
      if (a._s !== st) { a._s = st; a.classList.toggle('is-on', st === 2); a.classList.toggle('is-done', st === 1); if (st === 2) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); }
    });
    if (yearsEl && mid > Y.top - h && mid < Y.top + Y.h + h) yearsEl.style.setProperty('--yp', clamp((mid - Y.top) / Y.h, 0, 1).toFixed(3));
    drawRiver(mid);
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });

  $$('[data-setshape]').forEach(function (b) { b.addEventListener('click', function () {
    $$('[data-setshape]').forEach(function (x) { x.classList.toggle('is-on', x === b); });
    if (cloud) cloud.show(b.getAttribute('data-setshape'));
  }); });
  var quakeOut = $('#quakeOut'), pluckOut = $('#pluckOut');
  $('#quake').addEventListener('click', function () { if (cloud) cloud.shake(); quakeOut.textContent = 'It bends. It sways. The shaking spreads out through the trunk and fades. Nothing snaps.'; });
  $('#pluck').addEventListener('click', function () { if (cloud) cloud.pluck(); pluckOut.textContent = 'Three loops ring along each string, then fade back to stillness.'; });

  var lastW = 0, lastH = 0;
  function layout() { measureJuggle(); measureSecs(); buildRiver(); if (cloud) cloud.measure(); onScroll(); }
  function onResize() {                                        // phones fire resize when the address bar slides: ignore those
    var w = window.innerWidth, h = window.innerHeight;
    if (w === lastW && Math.abs(h - lastH) < 120 && w < 900) return;
    lastW = w; lastH = h; layout();
  }
  cloud = initCloud();
  if (!cloud) { document.body.classList.add('no-webgl'); var lastT = performance.now(); (function loop(now) { drawJuggle(Math.min(0.05, (now - lastT) / 1000)); lastT = now; requestAnimationFrame(loop); })(lastT); }
  lastW = window.innerWidth; lastH = window.innerHeight; layout();
  window.addEventListener('load', layout);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
  window.addEventListener('resize', onResize);
  if ('ResizeObserver' in window) { var roT = 0; new ResizeObserver(function () { clearTimeout(roT); roT = setTimeout(layout, 150); }).observe($('main')); }
  root.setAttribute('data-ready', '1');
})();
