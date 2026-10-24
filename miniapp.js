// ── Toji Somon Mini App (web) shim ─────────────────────────────────────────
// Loaded only by the static web bundle (GitHub Pages), never by the
// Android app. The page runs the same frontend + bridge as the app, but a
// browser has no Telegram engine, so:
//   - <video src="/api/stream…"> can't play in-page → it becomes a
//     "Watch in Telegram" button that opens the bot with the exact deep
//     link for that file; the bot sends the video into the chat and
//     Telegram's own player plays it (fast, native).
//   - <img src="/api/cover?fid=…"> and /api/ig-thumb/<id> are answered
//     from the same Supabase caches the Android shell uses (meta table
//     cover:<file_id> base64, ig_reels.thumb base64).
(function () {
  'use strict';
  var SB = 'https://pffaclnokhdvzahxfgcu.supabase.co';
  var ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmZmFjbG5va2hkdnphaHhmZ2N1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIyMDIxMzYsImV4cCI6MjEwNzc3ODEzNn0.pnmpwvm7ITPZVL8ttwxyDjjGvXcoReliaFOu0_LeoVA';
  var BOT = 'https://t.me/Hsshsgsgsbzvbot';
  var PIXEL = 'data:image/gif;base64,R0lGODlhAQABAAAAACw=';

  function pg(path) {
    return fetch(SB + '/rest/v1/' + path, {
      headers: { apikey: ANON, Authorization: 'Bearer ' + ANON }
    }).then(function (r) { return r.ok ? r.json() : []; }).catch(function () { return []; });
  }
  function asDataUrl(v) {
    if (!v) return null;
    v = String(v);
    return v.indexOf('data:') === 0 ? v : 'data:image/jpeg;base64,' + v;
  }

  // ── covers ────────────────────────────────────────────────────────────
  var coverCache = {};
  function coverFor(fid) {
    if (!coverCache[fid]) {
      coverCache[fid] = pg('meta?key=eq.' + encodeURIComponent('cover:' + fid) + '&select=value')
        .then(function (rows) { return asDataUrl(rows && rows[0] && rows[0].value); });
    }
    return coverCache[fid];
  }
  var thumbCache = {};
  function thumbFor(id) {
    if (!thumbCache[id]) {
      thumbCache[id] = pg('ig_reels?id=eq.' + encodeURIComponent(id) + '&select=thumb')
        .then(function (rows) { return asDataUrl(rows && rows[0] && rows[0].thumb); });
    }
    return thumbCache[id];
  }
  function fixImg(img) {
    var src = img.getAttribute('src') || '';
    var m;
    if ((m = src.match(/\/api\/cover\?fid=([^&]+)/))) {
      if (img.dataset.tsFix) return;
      img.dataset.tsFix = '1';
      var fid = decodeURIComponent(m[1]);
      coverFor(fid).then(function (url) { img.src = url || PIXEL; });
    } else if ((m = src.match(/\/api\/ig-thumb\/(\d+)/))) {
      if (img.dataset.tsFix) return;
      img.dataset.tsFix = '1';
      thumbFor(m[1]).then(function (url) { img.src = url || PIXEL; });
    }
  }

  // ── videos → Watch in Telegram ────────────────────────────────────────
  function payloadFor(src, tries) {
    var m = String(src || '').match(/[?&]sz=(\d+)/);
    var sz = m ? m[1] : '0';
    var map = window.__tgMedia || {};
    if (map[sz]) return Promise.resolve(map[sz]);
    if (tries <= 0) return Promise.resolve(null);
    return new Promise(function (res) {
      setTimeout(function () { res(payloadFor(src, tries - 1)); }, 250);
    });
  }
  function openBot(payload) {
    var url = payload ? BOT + '?start=' + payload : BOT;
    try {
      if (window.Telegram && Telegram.WebApp && Telegram.WebApp.openTelegramLink) {
        Telegram.WebApp.openTelegramLink(url);
        return;
      }
    } catch (e) {}
    window.open(url, '_blank');
  }
  function fixVideo(v) {
    var src = v.getAttribute('src') || '';
    if (src.indexOf('/api/stream') < 0 && src.indexOf('/api/trailer') < 0) return;
    if (v.dataset.tsWatch) return;
    v.dataset.tsWatch = '1';
    var isReel = (v.className || '').indexOf('reel-video') >= 0;
    payloadFor(src, 12).then(function (payload) {
      if (!v.isConnected) return;
      var box = document.createElement('div');
      box.className = v.className || '';
      box.setAttribute('style', (v.getAttribute('style') || '') +
        ';display:flex;flex-direction:column;align-items:center;justify-content:center;background:#000;cursor:pointer;' +
        (isReel ? 'width:100%;height:100%;' : 'width:100%;aspect-ratio:16/9;'));
      box.innerHTML =
        '<div style="width:74px;height:74px;border-radius:50%;background:linear-gradient(135deg,#F5D97E,#D4A853);display:flex;align-items:center;justify-content:center;box-shadow:0 8px 30px rgba(212,168,83,.45)">' +
        '<div style="width:0;height:0;border-top:13px solid transparent;border-bottom:13px solid transparent;border-left:20px solid #111;margin-left:5px"></div></div>' +
        '<div style="margin-top:14px;color:#F5D97E;font-weight:700;font-size:15px;letter-spacing:.3px">Watch in Telegram</div>' +
        '<div style="margin-top:4px;color:#8E8E93;font-size:12px">Plays instantly in the bot chat</div>';
      box.addEventListener('click', function () { openBot(payload); });
      v.replaceWith(box);
    });
  }

  function scan(node) {
    if (!node || node.nodeType !== 1) return;
    if (node.tagName === 'IMG') fixImg(node);
    if (node.tagName === 'VIDEO') fixVideo(node);
    var imgs = node.querySelectorAll ? node.querySelectorAll('img') : [];
    for (var i = 0; i < imgs.length; i++) fixImg(imgs[i]);
    var vids = node.querySelectorAll ? node.querySelectorAll('video') : [];
    for (var j = 0; j < vids.length; j++) fixVideo(vids[j]);
  }
  var mo = new MutationObserver(function (muts) {
    for (var i = 0; i < muts.length; i++) {
      var mu = muts[i];
      if (mu.type === 'attributes') { scan(mu.target); continue; }
      for (var k = 0; k < mu.addedNodes.length; k++) scan(mu.addedNodes[k]);
    }
  });
  function start() {
    scan(document.body);
    mo.observe(document.documentElement, {
      childList: true, subtree: true,
      attributes: true, attributeFilter: ['src']
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else { start(); }
})();
