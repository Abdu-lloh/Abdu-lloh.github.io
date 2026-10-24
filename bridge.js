// ── Toji Somon offline bridge ─────────────────────────────────────────────
// His server is asleep: this bridge answers the app's /api/* calls straight
// from his own Supabase database (the same tables his server uses), with the
// same response shapes his server returns. His frontend (app.js) is not
// modified in any way — only the fetch() transport is rerouted.
(function () {
  'use strict';
  var SB = 'https://pffaclnokhdvzahxfgcu.supabase.co';
  var ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmZmFjbG5va2hkdnphaHhmZ2N1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIyMDIxMzYsImV4cCI6MjEwNzc3ODEzNn0.pnmpwvm7ITPZVL8ttwxyDjjGvXcoReliaFOu0_LeoVA';
  var OWNER = '1432205340';
  var ADMIN_EMAIL = 'aaalisherovich@gmail.com';
  var realFetch = window.fetch.bind(window);

  function jsonRes(obj, status) {
    return new Response(JSON.stringify(obj), {
      status: status || 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  function pgUrl(path) { return SB + '/rest/v1/' + path; }
  async function pg(path, opts) {
    opts = opts || {};
    var headers = { apikey: ANON, Authorization: 'Bearer ' + ANON };
    if (opts.body) headers['Content-Type'] = 'application/json';
    if (opts.prefer) headers['Prefer'] = opts.prefer;
    var r = await realFetch(pgUrl(path), { method: opts.method || 'GET', headers: headers, body: opts.body ? JSON.stringify(opts.body) : undefined });
    if (opts.method && opts.method !== 'GET') {
      if (!r.ok) { var t = await r.text().catch(function () { return ''; }); throw new Error('pg ' + r.status + ' ' + t.slice(0, 120)); }
      if (opts.prefer && opts.prefer.indexOf('return=representation') >= 0) return r.json().catch(function () { return []; });
      return null;
    }
    if (!r.ok) throw new Error('pg ' + r.status);
    return r.json();
  }
  function one(rows) { return (rows && rows.length) ? rows[0] : null; }
  function enc(v) { return encodeURIComponent(String(v)); }
  function nowIso() { return new Date().toISOString(); }
  function hdr(headers, name) {
    if (!headers) return '';
    if (typeof headers.get === 'function') { try { return headers.get(name) || ''; } catch (e) { return ''; } }
    var k = Object.keys(headers).find(function (x) { return x.toLowerCase() === name.toLowerCase(); });
    return k ? String(headers[k]) : '';
  }
  function decName(raw) {
    if (!raw) return '';
    try { return decodeURIComponent(raw); } catch (e) { return String(raw); }
  }
  function canonLangCode(v) {
    var s = String(v || '').trim().toLowerCase();
    if (!s) return null;
    if (s.indexOf('tj') === 0 || s.indexOf('тоҷ') === 0 || s.indexOf('тод') === 0 || s.indexOf('tajik') >= 0 || s.indexOf('точик') >= 0) return 'tj';
    if (s.indexOf('ru') === 0 || s.indexOf('рус') === 0 || s.indexOf('russian') >= 0) return 'ru';
    if (s.indexOf('en') === 0 || s.indexOf('анг') === 0 || s.indexOf('english') >= 0) return 'en';
    if (s.indexOf('fa') === 0 || s.indexOf('форс') === 0 || s.indexOf('фарс') === 0 || s.indexOf('persian') >= 0 || s.indexOf('farsi') >= 0) return 'fa';
    if (s.indexOf('uz') === 0 || s.indexOf('uzbek') >= 0 || s.indexOf('узб') === 0 || s.indexOf('ўзб') === 0) return 'uz';
    return s.slice(0, 2);
  }
  function keyOk(k) { return /^(ep|mv|tg|ig):\d+$/.test(String(k || '')); }
  // Playback plumbing: remember which bot deep link fetches each video,
  // keyed by exact byte size (the key the stream URLs carry), so the app
  // shell can ask the bot to drop the file into the viewer's Telegram
  // when the in-app engine doesn't have it in the bot chat yet.
  window.__tgMedia = window.__tgMedia || {};
  function noteMedia(size, payload) { if (size) { try { window.__tgMedia[String(size)] = payload; } catch (e) {} } }

  async function nameOf(uid, stored) {
    if (stored) return stored;
    try {
      var u = one(await pg('app_users?user_id=eq.' + enc(uid) + '&select=user_name'));
      return (u && u.user_name) || 'User';
    } catch (e) { return 'User'; }
  }
  async function noteUser(uid, name) {
    if (!/^\d+$/.test(String(uid || '')) || !name) return;
    try {
      await pg('app_users?on_conflict=user_id', {
        method: 'POST', prefer: 'resolution=merge-duplicates,return=minimal',
        body: { user_id: String(uid), user_name: String(name).slice(0, 80), updated_at: nowIso(), last_seen_at: nowIso() }
      });
    } catch (e) {}
  }
  async function tally(table, keyField) {
    var m = {};
    try {
      var rows = await pg(table + '?select=' + keyField + '&limit=10000');
      rows.forEach(function (r) { var k = r[keyField]; m[k] = (m[k] || 0) + 1; });
    } catch (e) {}
    return m;
  }
  async function mineSet(table, keyField, uid) {
    var s = new Set();
    if (!uid) return s;
    try {
      var rows = await pg(table + '?user_id=eq.' + enc(uid) + '&select=' + keyField + '&limit=10000');
      rows.forEach(function (r) { s.add(r[keyField]); });
    } catch (e) {}
    return s;
  }
  async function viewCountsFor(keys) {
    var out = {};
    if (!keys.length) return out;
    try {
      var rows = await pg('views?item_key=in.(' + keys.map(enc).join(',') + ')&select=item_key&limit=10000');
      rows.forEach(function (r) { out[r.item_key] = (out[r.item_key] || 0) + 1; });
    } catch (e) {}
    return out;
  }
  async function reelCounts(key) {
    var tables = { likes: 'reel_likes', comments: 'reel_comments', saves: 'reel_saves', reposts: 'reel_reposts', shares: 'reel_shares' };
    var out = {};
    var names = Object.keys(tables);
    for (var i = 0; i < names.length; i++) {
      try {
        var rows = await pg(tables[names[i]] + '?item_key=eq.' + enc(key) + '&select=item_key&limit=10000');
        out[names[i]] = rows.length;
      } catch (e) { out[names[i]] = 0; }
    }
    try {
      var v = await pg('views?item_key=eq.' + enc(key) + '&select=item_key&limit=10000');
      out.views = v.length;
    } catch (e) { out.views = 0; }
    return out;
  }
  async function langGroupMap() {
    var gmap = {};
    try {
      var rows = await pg('series?code_name=not.is.null&code_name=neq.&select=id,code_name');
      rows.forEach(function (r) {
        var cn = String(r.code_name).toLowerCase();
        if (gmap[cn] === undefined || r.id < gmap[cn]) gmap[cn] = r.id;
      });
    } catch (e) {}
    return gmap;
  }

  // ── auth ────────────────────────────────────────────────────────────────
  async function accountLogin(body) {
    var access = String((body && body.access_token) || '');
    if (!access) return jsonRes({ error: 'Missing account token.' }, 400);
    var r;
    try {
      r = await realFetch(SB + '/auth/v1/user', { headers: { apikey: ANON, Authorization: 'Bearer ' + access } });
    } catch (e) { return jsonRes({ error: 'Could not verify the account — try again.' }, 502); }
    if (!r.ok) return jsonRes({ error: 'Account session expired — sign in again.' }, 401);
    var su = await r.json();
    var email = String(su.email || '').toLowerCase();
    var name = (su.user_metadata && su.user_metadata.name) || 'User';
    var uid = email === ADMIN_EMAIL ? OWNER : 'e' + String(su.id || '').replace(/-/g, '').slice(0, 24);
    if (uid !== OWNER) {
      try {
        await pg('app_users?on_conflict=user_id', {
          method: 'POST', prefer: 'resolution=merge-duplicates,return=minimal',
          body: { user_id: uid, user_name: name, updated_at: nowIso() }
        });
      } catch (e) {}
    }
    return jsonRes({ ok: true, token: access, user_id: uid, user_name: await nameOf(uid, name) });
  }

  async function meRoute(uid) {
    var banned = false, until = null, strikes = 0;
    try {
      var m = one(await pg('user_moderation?user_id=eq.' + enc(uid) + '&select=banned_until,strikes'));
      if (m) {
        strikes = m.strikes || 0;
        if (m.banned_until && new Date(m.banned_until).getTime() > Date.now()) { banned = true; until = m.banned_until; }
      }
    } catch (e) {}
    var linked = false;
    if (/^\d+$/.test(uid)) {
      try { linked = !!one(await pg('phone_links?user_id=eq.' + enc(uid) + '&select=phone')); } catch (e) {}
    }
    return { ok: true, banned: banned, until: until, strikes: strikes, phone_linked: linked, needs_questions: !linked };
  }

  // ── catalog ─────────────────────────────────────────────────────────────
  async function seriesList(q, uid) {
    var rows = await pg('series?select=*&order=' + (q.sort === 'rating' ? 'rating.desc' : 'id.desc'));
    var gmap = await langGroupMap();
    var eps = [];
    try { eps = await pg('episodes?select=series_id,season,episode_number&limit=10000'); } catch (e) {}
    var counts = {};
    eps.forEach(function (e) {
      var k = e.series_id + '|' + (e.season == null ? 1 : e.season) + '|' + e.episode_number;
      if (!counts[k]) { counts[k] = true; counts['n' + e.series_id] = (counts['n' + e.series_id] || 0) + 1; }
    });
    rows.forEach(function (r) {
      r.episode_count = counts['n' + r.id] || 0;
      r.lang_group = r.code_name ? (gmap[String(r.code_name).toLowerCase()] || null) : null;
      if (uid !== OWNER) delete r.code_name;
    });
    return rows;
  }
  async function moviesList(q) {
    var rows = await pg('movies?select=*&order=' + (q.sort === 'rating' ? 'rating.desc' : 'id.desc'));
    var files = [];
    try { files = await pg('movie_files?select=movie_id&limit=10000'); } catch (e) {}
    var counts = {};
    files.forEach(function (f) { counts[f.movie_id] = (counts[f.movie_id] || 0) + 1; });
    rows.forEach(function (r) { r.qualities = counts[r.id] || 0; });
    return rows;
  }
  async function seriesDetail(id, uid) {
    var s = one(await pg('series?id=eq.' + enc(id) + '&select=*'));
    if (!s) return jsonRes({ error: 'not found' }, 404);
    if (s.code_name) {
      var sibs = await pg('series?code_name=ilike.' + enc(s.code_name) + '&select=id,title,language&order=id.asc').catch(function () { return []; });
      // PostgREST ilike is a pattern match; re-filter to exact (case-insensitive) like the server.
      sibs = sibs.filter(function (x) { return true; });
      var all = await pg('series?select=id,title,language,code_name').catch(function () { return []; });
      sibs = all.filter(function (x) { return x.code_name && String(x.code_name).toLowerCase() === String(s.code_name).toLowerCase(); })
        .map(function (x) { return { id: x.id, title: x.title, language: x.language }; })
        .sort(function (a, b) { return a.id - b.id; });
      s.lang_versions = sibs.length ? sibs : [{ id: s.id, title: s.title, language: s.language }];
      s.lang_group = s.lang_versions.length ? s.lang_versions[0].id : s.id;
    } else {
      s.lang_versions = [{ id: s.id, title: s.title, language: s.language }];
      s.lang_group = null;
    }
    if (uid !== OWNER) delete s.code_name;
    var eps = await pg('episodes?series_id=eq.' + enc(id) + '&select=id,season,episode_number,quality,file_id,file_size,mt_msg_id,tg_link,title,description,cover_file_id,language,studio&order=season.asc,episode_number.asc');
    var vc = await viewCountsFor(eps.map(function (e) { return 'ep:' + e.id; }));
    var total = 0;
    eps.forEach(function (e) { e.views = vc['ep:' + e.id] || 0; total += e.views; });
    eps.forEach(function (e) { noteMedia(e.file_size, 'watch_ep_' + e.id); });
    s.episodes = eps;
    s.total_views = total;
    return jsonRes(s);
  }
  async function movieDetail(id) {
    var m = one(await pg('movies?id=eq.' + enc(id) + '&select=*'));
    if (!m) return jsonRes({ error: 'not found' }, 404);
    m.files = await pg('movie_files?movie_id=eq.' + enc(id) + '&select=id,quality,file_id,file_size,mt_msg_id&order=id.asc');
    m.files.forEach(function (f) { noteMedia(f.file_size, 'watch_mf_' + f.id); });
    return jsonRes(m);
  }
  async function episodeDetail(id) {
    var ep = one(await pg('episodes?id=eq.' + enc(id) + '&select=id,series_id,season,episode_number,quality,file_id,file_size,mt_msg_id,tg_link,title,description,cover_file_id,intro_start,intro_end,outro_start,outro_end,language,studio'));
    if (!ep) return jsonRes({ error: 'not found' }, 404);
    var srow = one(await pg('series?id=eq.' + enc(ep.series_id) + '&select=id,title,cover_file_id,studio,language,code_name'));
    var series = srow ? { id: srow.id, title: srow.title, cover_file_id: srow.cover_file_id, studio: srow.studio } : null;
    var variants = await pg('episodes?series_id=eq.' + enc(ep.series_id) + '&season=eq.' + enc(ep.season == null ? '' : ep.season) + '&episode_number=eq.' + enc(ep.episode_number) + '&select=id,quality,language,studio,file_id,file_size,mt_msg_id,tg_link,cover_file_id&order=quality.asc');
    variants.forEach(function (v) { noteMedia(v.file_size, 'watch_ep_' + v.id); });
    noteMedia(ep.file_size, 'watch_ep_' + ep.id);
    var gvCover = variants.find(function (v) { return v.cover_file_id; });
    if (gvCover) ep.cover_file_id = gvCover.cover_file_id;
    if (!ep.studio) {
      var gvStudio = variants.find(function (v) { return v.studio; });
      ep.studio = (gvStudio && gvStudio.studio) || (srow && srow.studio) || null;
    }
    ep.language = ep.language || 'Тоҷикӣ';
    var baseLang = (srow && srow.language) || ep.language;
    var languages = [{ language: baseLang, id: ep.id }];
    var showLanguages = [{ series_id: ep.series_id, language: baseLang, episode_id: ep.id }];
    if (srow && srow.code_name) {
      var allS = await pg('series?select=id,title,language,code_name').catch(function () { return []; });
      var siblings = allS.filter(function (x) { return x.code_name && String(x.code_name).toLowerCase() === String(srow.code_name).toLowerCase(); })
        .sort(function (a, b) { return a.id - b.id; });
      var linked = [], showLinked = [];
      for (var i = 0; i < siblings.length; i++) {
        var sib = siblings[i];
        var label = sib.language || sib.title;
        if (sib.id === ep.series_id) { linked.push({ language: label, id: ep.id }); showLinked.push({ series_id: sib.id, language: label, episode_id: ep.id }); continue; }
        var cand = await pg('episodes?series_id=eq.' + enc(sib.id) + '&season=eq.' + enc(ep.season == null ? '' : ep.season) + '&episode_number=eq.' + enc(ep.episode_number) + '&select=id,quality&order=id.asc').catch(function () { return []; });
        var match = null;
        cand.sort(function (a, b) { return (a.quality === ep.quality ? 0 : 1) - (b.quality === ep.quality ? 0 : 1) || a.id - b.id; });
        if (cand.length) match = cand[0];
        if (match) linked.push({ language: label, id: match.id });
        showLinked.push({ series_id: sib.id, language: label, episode_id: match ? match.id : null });
      }
      if (linked.length) languages = linked;
      if (showLinked.length) showLanguages = showLinked;
    }
    var allEps = await pg('episodes?series_id=eq.' + enc(ep.series_id) + '&select=id,season,episode_number,studio&order=season.asc,episode_number.asc,id.asc').catch(function () { return []; });
    function keyOf(e) { return ((e.season == null ? 1 : e.season) * 100000) + e.episode_number; }
    var myKey = keyOf(ep);
    var nexts = allEps.filter(function (e) { return keyOf(e) > myKey; });
    var prevs = allEps.filter(function (e) { return keyOf(e) < myKey; });
    function pickStudioFirst(list, dir) {
      if (!list.length) return null;
      var seasons = {};
      list.forEach(function (e) { var k = keyOf(e); if (!seasons[k]) seasons[k] = []; seasons[k].push(e); });
      var keys = Object.keys(seasons).map(Number).sort(function (a, b) { return dir * (a - b); });
      var group = seasons[keys[0]];
      group.sort(function (a, b) { return ((a.studio || '') === (ep.studio || '') ? 0 : 1) - ((b.studio || '') === (ep.studio || '') ? 0 : 1) || a.id - b.id; });
      return group[0];
    }
    var nextEp = pickStudioFirst(nexts, 1);
    var prevEp = pickStudioFirst(prevs, -1);
    return jsonRes({ ok: true, episode: ep, series: series, qualities: variants, languages: languages, show_languages: showLanguages, next_episode_id: nextEp ? nextEp.id : null, prev_episode_id: prevEp ? prevEp.id : null });
  }

  // ── reels ───────────────────────────────────────────────────────────────
  async function reelsFeed(q, uid, uname) {
    var gmap = await langGroupMap();
    var seriesRows = [], movieRows = [];
    try { seriesRows = await pg('series?select=id,title,code_name'); } catch (e) {}
    try { movieRows = await pg('movies?select=id,title'); } catch (e) {}
    var sById = {}, mById = {};
    seriesRows.forEach(function (s) { sById[s.id] = s; });
    movieRows.forEach(function (m) { mById[m.id] = m; });
    function resolveLink(movie_id, series_id) {
      if (movie_id && mById[movie_id]) return { link_title: mById[movie_id].title, link_type: 'movie', lang_group: null };
      if (series_id && sById[series_id]) {
        var s = sById[series_id];
        return { link_title: s.title, link_type: 'series', lang_group: s.code_name ? (gmap[String(s.code_name).toLowerCase()] || null) : null };
      }
      return { link_title: null, link_type: null };
    }
    var wantFeed = q.feed === 'user' ? 'user' : 'ts';
    var rows = [];
    try { rows = await pg('reels?select=*&order=id.desc&limit=100'); } catch (e) {}
    var out = [];
    rows.forEach(function (r) {
      if ((r.feed || 'ts') !== wantFeed) return;
      noteMedia(r.file_size, 'watch_reel_' + r.id);
      var link = resolveLink(r.movie_id, r.series_id);
      out.push(Object.assign({
        id: r.id, item_key: 'tg:' + r.id, source: 'tg', feed: r.feed || 'ts',
        file_id: r.file_id, file_size: r.file_size, caption: r.caption, title_hint: r.title_hint,
        uploader_name: r.uploader_name, uploader_id: r.uploader_id || null, created_at: r.created_at || null,
        status: r.status, ai_title: r.ai_title, movie_id: r.movie_id, series_id: r.series_id,
        kind: r.kind || 'video', cover_file_id: r.cover_file_id || null, episode_id: r.episode_id || null,
        lang: r.lang || null
      }, link));
    });
    if (wantFeed === 'ts') {
      var igRows = [];
      try { igRows = await pg('ig_reels?select=*&order=id.desc&limit=100'); } catch (e) {}
      igRows.forEach(function (r) {
        var link = resolveLink(r.movie_id, r.series_id);
        out.push(Object.assign({
          id: 'ig' + r.id, item_key: 'ig:' + r.id, ig_id: r.id, source: 'ig', ig_code: r.ig_code,
          url: r.url, thumb: r.thumb ? '/api/ig-thumb/' + r.id : null, caption: r.caption,
          uploader_name: 'Instagram', status: 'done', movie_id: r.movie_id, series_id: r.series_id
        }, link));
      });
    }
    // Language targeting for episode auto-posts (admins see everything).
    var vlangs = [];
    if (uid) {
      try {
        var lr = await pg('user_langs?user_id=eq.' + enc(uid) + '&select=lang');
        vlangs = lr.map(function (r) { return r.lang; });
      } catch (e) {}
    }
    if (!vlangs.length) { var oneLang = canonLangCode(q.lang); vlangs = oneLang ? [oneLang] : []; }
    var admin = uid === OWNER;
    out = out.filter(function (r) {
      return !((r.kind === 'promo' || r.kind === 'teaser') && r.lang && !admin && vlangs.indexOf(r.lang) < 0);
    });
    // Social tallies + my state.
    var tLikes = await tally('reel_likes', 'item_key');
    var tComments = await tally('reel_comments', 'item_key');
    var tSaves = await tally('reel_saves', 'item_key');
    var tReposts = await tally('reel_reposts', 'item_key');
    var tShares = await tally('reel_shares', 'item_key');
    var tViews = await tally('views', 'item_key');
    var myLikes = await mineSet('reel_likes', 'item_key', uid);
    var mySaves = await mineSet('reel_saves', 'item_key', uid);
    var myReposts = await mineSet('reel_reposts', 'item_key', uid);
    out.forEach(function (it) {
      it.like_count = tLikes[it.item_key] || 0;
      it.comment_count = tComments[it.item_key] || 0;
      it.save_count = tSaves[it.item_key] || 0;
      it.repost_count = tReposts[it.item_key] || 0;
      it.share_count = tShares[it.item_key] || 0;
      it.view_count = tViews[it.item_key] || 0;
      it.liked = myLikes.has(it.item_key);
      it.saved = mySaves.has(it.item_key);
      it.reposted = myReposts.has(it.item_key);
    });
    var byKey = {};
    out.forEach(function (it) { byKey[it.item_key] = it; });
    var rpEntries = [];
    try {
      var rpRows = await pg('reel_reposts?select=*&order=id.desc&limit=50');
      rpRows.forEach(function (rp) {
        var src = byKey[rp.item_key];
        if (src) rpEntries.push(Object.assign({}, src, { id: 'rp' + rp.id, repost_id: rp.id, reposted_by: rp.user_name || 'Someone' }));
      });
    } catch (e) {}
    return rpEntries.concat(out);
  }

  async function toggle(table, key, uid, uname, keyCheck) {
    if (!keyCheck(key)) return jsonRes({ error: 'bad reel' }, 400);
    if (!uid) return jsonRes({ error: 'no user' }, 400);
    await noteUser(uid, uname);
    var ex = one(await pg(table + '?item_key=eq.' + enc(key) + '&user_id=eq.' + enc(uid) + '&select=id'));
    var active;
    if (ex) { await pg(table + '?id=eq.' + enc(ex.id), { method: 'DELETE', prefer: 'return=minimal' }); active = false; }
    else {
      await pg(table, { method: 'POST', prefer: 'return=minimal', body: { item_key: key, user_id: uid, user_name: uname || null, created_at: nowIso() } });
      active = true;
    }
    return jsonRes({ ok: true, active: active, counts: await reelCounts(key) });
  }
  async function shareReel(key, uid, uname) {
    if (!/^(ig|tg):\d+$/.test(String(key || ''))) return jsonRes({ error: 'bad reel' }, 400);
    if (!uid) return jsonRes({ error: 'no user' }, 400);
    var ex = one(await pg('reel_shares?item_key=eq.' + enc(key) + '&user_id=eq.' + enc(uid) + '&select=id').catch(function () { return []; }));
    if (!ex) {
      await pg('reel_shares', { method: 'POST', prefer: 'return=minimal', body: { item_key: key, user_id: uid, user_name: uname || null, created_at: nowIso() } }).catch(function () {});
    }
    return jsonRes({ ok: true, counts: await reelCounts(key) });
  }
  async function likers(table, keyCol, keyVal, uid) {
    var rows = await pg(table + '?' + keyCol + '=eq.' + enc(keyVal) + '&select=user_id,user_name,created_at&order=id.desc&limit=300').catch(function () { return []; });
    var users = [];
    for (var i = 0; i < rows.length; i++) {
      users.push({ user_id: rows[i].user_id, user_name: await nameOf(rows[i].user_id, rows[i].user_name), created_at: rows[i].created_at || null });
    }
    return { ok: true, count: rows.length, mine: !!rows.find(function (r) { return String(r.user_id) === String(uid); }), users: users };
  }
  async function commentsList(key, uid) {
    if (!keyOk(key)) return jsonRes({ error: 'bad item' }, 400);
    var rows = await pg('reel_comments?item_key=eq.' + enc(key) + '&select=*&order=id.asc&limit=300');
    var likeMap = {}, myLikes = new Set();
    if (rows.length) {
      var ids = rows.map(function (c) { return c.id; });
      var lrows = await pg('reel_comment_likes?comment_id=in.(' + ids.join(',') + ')&select=comment_id,user_id&limit=10000').catch(function () { return []; });
      lrows.forEach(function (r) {
        likeMap[r.comment_id] = (likeMap[r.comment_id] || 0) + 1;
        if (String(r.user_id) === String(uid)) myLikes.add(r.comment_id);
      });
    }
    return jsonRes(rows.map(function (c) {
      return { id: c.id, user_id: c.user_id, user_name: c.user_name, text: c.text, created_at: c.created_at, media_file_id: c.media_file_id || null, media_kind: c.media_kind || null, parent_id: c.parent_id || null, like_count: likeMap[c.id] || 0, liked: myLikes.has(c.id) };
    }));
  }
  async function commentPost(key, uid, uname, body) {
    if (!keyOk(key)) return jsonRes({ error: 'bad item' }, 400);
    if (!uid) return jsonRes({ error: 'no user' }, 400);
    var text = String((body && body.text) || '').trim().slice(0, 500);
    var mediaFid = String((body && body.media_file_id) || '').slice(0, 220);
    var mediaKind = ['photo', 'video', 'gif', 'sticker', 'voice'].indexOf(body && body.media_kind) >= 0 ? body.media_kind : null;
    var parentId = Number((body && body.parent_id) || 0) || null;
    if (!text && !mediaFid) return jsonRes({ error: 'empty comment' }, 400);
    if (mediaFid) {
      var own = one(await pg('media_uploads?file_id=eq.' + enc(mediaFid) + '&user_id=eq.' + enc(uid) + '&select=file_id').catch(function () { return []; }));
      if (!own) return jsonRes({ error: 'That media is not yours to post' }, 400);
    }
    var rows = await pg('reel_comments', {
      method: 'POST', prefer: 'return=representation',
      body: { item_key: key, user_id: uid, user_name: uname || null, text: text, created_at: nowIso(), media_file_id: mediaFid || null, media_kind: mediaFid ? mediaKind : null, parent_id: parentId }
    });
    var row = one(rows) || {};
    return jsonRes({ ok: true, id: row.id, counts: await reelCounts(key), media_file_id: mediaFid || null, media_kind: mediaFid ? mediaKind : null, parent_id: parentId });
  }
  async function commentLike(cid, uid, uname) {
    if (!uid) return jsonRes({ error: 'no user' }, 400);
    var n = Number(cid);
    if (!n) return jsonRes({ error: 'bad comment' }, 400);
    var ex = one(await pg('reel_comment_likes?comment_id=eq.' + n + '&user_id=eq.' + enc(uid) + '&select=id'));
    var active;
    if (ex) { await pg('reel_comment_likes?id=eq.' + enc(ex.id), { method: 'DELETE', prefer: 'return=minimal' }); active = false; }
    else { await pg('reel_comment_likes', { method: 'POST', prefer: 'return=minimal', body: { comment_id: n, user_id: uid, user_name: uname || null, created_at: nowIso() } }); active = true; }
    var rows = await pg('reel_comment_likes?comment_id=eq.' + n + '&select=id&limit=10000');
    return jsonRes({ ok: true, active: active, count: rows.length });
  }

  // ── profile / social graph / chats ──────────────────────────────────────
  async function profilePayload(target, me) {
    var mine = await pg('reels?uploader_id=eq.' + enc(target) + '&select=id,file_id,file_size,caption,created_at,series_id,movie_id,feed&order=id.desc&limit=60').catch(function () { return []; });
    var keys = mine.map(function (r) { return 'tg:' + r.id; });
    var counts = keys.length ? await viewCountsFor(keys) : {};
    var likeMap = {}, likesReceived = 0;
    if (keys.length) {
      var lrows = await pg('reel_likes?item_key=in.(' + keys.map(enc).join(',') + ')&select=item_key&limit=10000').catch(function () { return []; });
      lrows.forEach(function (r) { likeMap[r.item_key] = (likeMap[r.item_key] || 0) + 1; likesReceived += 1; });
    }
    var followers = await pg('follows?followee_id=eq.' + enc(target) + '&select=follower_id&limit=10000').catch(function () { return []; });
    var followingC = await pg('follows?follower_id=eq.' + enc(target) + '&select=followee_id&limit=10000').catch(function () { return []; });
    var following = false;
    if (me && me !== target) {
      following = !!one(await pg('follows?follower_id=eq.' + enc(me) + '&followee_id=eq.' + enc(target) + '&select=follower_id').catch(function () { return []; }));
    }
    return {
      reels: mine.map(function (r) {
        return { id: r.id, file_id: r.file_id, file_size: r.file_size, caption: r.caption, created_at: r.created_at, feed: r.feed || 'ts', view_count: counts['tg:' + r.id] || 0, like_count: likeMap['tg:' + r.id] || 0 };
      }),
      stats: { posts: mine.length, likes_received: likesReceived, followers: followers.length, following_count: followingC.length },
      following: following
    };
  }
  async function dmThreads(uid) {
    var rows = await pg('dm_threads?or=(user_a.eq.' + enc(uid) + ',user_b.eq.' + enc(uid) + ')&select=*&order=updated_at.desc&limit=60').catch(function () { return []; });
    var out = [];
    for (var i = 0; i < rows.length; i++) {
      var th = rows[i];
      var isA = String(th.user_a) === String(uid);
      var last = one(await pg('dm_messages?thread_id=eq.' + enc(th.id) + '&select=text,sender_id,created_at&order=id.desc&limit=1').catch(function () { return []; }));
      var myRead = isA ? (th.a_read || 0) : (th.b_read || 0);
      var unreadRows = await pg('dm_messages?thread_id=eq.' + enc(th.id) + '&id=gt.' + enc(myRead) + '&sender_id=neq.' + enc(uid) + '&select=id&limit=1000').catch(function () { return []; });
      var peerId = isA ? th.user_b : th.user_a;
      var sr = one(await pg('app_users?user_id=eq.' + enc(peerId) + '&select=last_seen_at,updated_at').catch(function () { return []; }));
      out.push({
        id: th.id, peer_id: peerId, peer_name: isA ? th.b_name : th.a_name,
        last_text: last ? last.text : '', last_at: last ? last.created_at : th.updated_at,
        unread: unreadRows.length, peer_last_seen: sr ? (sr.last_seen_at || sr.updated_at) : null
      });
    }
    return { ok: true, threads: out };
  }


  // ── admin catalog writes (serverless) ─────────────────────────────────
  // The hosted server used to take these; the same writes go straight to
  // the database here, mirroring server.js field-for-field. Owner-only,
  // same gate as /api/admin/viewers and /api/admin/stats. Not mirrored:
  // file uploads, channel-link (tg_link) downloads, the server's own
  // Telegram login, and Instagram-link adds (they need the server to
  // fetch Telegram/Instagram) — those keep the "asleep" answer.
  function normTitleB(v) { return String(v || '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').replace(/\s+/g, ' ').trim(); }
  async function matchCatalogB(hint) {
    var nt = normTitleB(hint);
    if (!nt) return null;
    var movies = await pg('movies?select=id,title&order=id.asc').catch(function () { return []; });
    var i, t;
    for (i = 0; i < movies.length; i++) { t = normTitleB(movies[i].title); if (t && (t === nt || t.indexOf(nt) >= 0 || nt.indexOf(t) >= 0)) return { movie_id: movies[i].id, series_id: null, title: movies[i].title }; }
    var series = await pg('series?select=id,title,code_name&order=id.asc').catch(function () { return []; });
    for (i = 0; i < series.length; i++) { t = normTitleB(series[i].code_name); if (t && (t === nt || t.indexOf(nt) >= 0 || nt.indexOf(t) >= 0)) return { movie_id: null, series_id: series[i].id, title: series[i].title }; }
    for (i = 0; i < series.length; i++) { t = normTitleB(series[i].title); if (t && (t === nt || t.indexOf(nt) >= 0 || nt.indexOf(t) >= 0)) return { movie_id: null, series_id: series[i].id, title: series[i].title }; }
    return null;
  }
  async function autoPostB(srow, ep) {
    try {
      var studio = ep.studio || srow.studio || '';
      var caption = studio
        ? '🆕 A new episode from ' + studio + ' is out! ' + srow.title + ' — Episode ' + ep.episode_number + ' 🔥'
        : '🆕 New episode is out! ' + srow.title + ' — Episode ' + ep.episode_number + ' 🔥';
      var lang = canonLangCode(ep.language || srow.language);
      var now = nowIso();
      if (ep.file_id && String(ep.file_id).indexOf('local:') !== 0 && ep.file_id !== 'downloading') {
        await pg('reels', { method: 'POST', prefer: 'return=minimal', body: { uploader_id: 'system', uploader_name: 'Toji Somon', file_id: ep.file_id, file_size: ep.file_size || 0, caption: caption, title_hint: srow.code_name || null, status: 'done', series_id: srow.id, kind: 'teaser', episode_id: ep.id, lang: lang, created_at: now, feed: 'ts' } }).catch(function () {});
      }
      var cover = ep.cover_file_id || srow.cover_file_id || null;
      await pg('reels', { method: 'POST', prefer: 'return=minimal', body: { uploader_id: 'system', uploader_name: 'Toji Somon', file_id: null, file_size: 0, caption: caption, title_hint: srow.code_name || null, status: 'done', series_id: srow.id, kind: 'promo', cover_file_id: cover, episode_id: ep.id, lang: lang, created_at: now, feed: 'ts' } }).catch(function () {});
    } catch (e) {}
  }
  function secOrNull(v) { return (v === '' || v == null) ? null : (parseInt(v, 10) || 0); }
  async function adminRoute(method, path, seg, uid, body) {
    var b = body || {};
    if (path === '/api/admin/validate-id' && method === 'GET') {
      if (uid !== OWNER) return jsonRes({ error: 'admins only' }, 403);
      // No bot token in the client, so a pasted ID cannot be verified
      // here; answer ok so the form's advisory label never condemns a
      // good ID. Saving never depended on this check.
      return jsonRes({ ok: true, file_size: 0, file_path: '' });
    }
    var A = seg[2], id = seg[3];
    var known =
      (A === 'series' && (method === 'POST' || ((method === 'PUT' || method === 'DELETE') && id))) ||
      (A === 'movie' && (method === 'POST' || ((method === 'PUT' || method === 'DELETE') && id) || (method === 'POST' && id && seg[4] === 'file'))) ||
      (A === 'episode' && (method === 'POST' || ((method === 'PUT' || method === 'DELETE') && id))) ||
      (A === 'reels' && method === 'PUT' && id) ||
      (A === 'ig-reels' && ((method === 'PUT' || method === 'DELETE') && id));
    if (!known) return null;
    if (uid !== OWNER) return jsonRes({ error: 'admins only' }, 403);

    if (A === 'series') {
      if (method === 'POST') {
        if (!b.title) return jsonRes({ error: 'title required' }, 400);
        var dupS = await pg('series?title_lower=eq.' + enc(String(b.title).toLowerCase()) + '&select=id').catch(function () { return []; });
        if (dupS.length) return jsonRes({ error: 'Show already exists' }, 400);
        var insS = await pg('series', { method: 'POST', prefer: 'return=representation', body: { title: b.title, title_lower: String(b.title).toLowerCase(), cover_file_id: b.cover_file_id || null, logo_file_id: b.logo_file_id || null, synopsis: b.synopsis || null, year: b.year || null, rating: parseFloat(b.rating) || 0, language: b.language || null, age_rating: parseInt(b.age_rating, 10) || 0, studio: b.studio || null, code_name: b.code_name || null } });
        var rowS = one(insS) || {};
        return jsonRes({ ok: true, id: rowS.id, code_name: b.code_name || null });
      }
      if (method === 'PUT') {
        if (b.title) {
          var dupS2 = await pg('series?title_lower=eq.' + enc(String(b.title).toLowerCase()) + '&id=neq.' + enc(id) + '&select=id').catch(function () { return []; });
          if (dupS2.length) return jsonRes({ error: 'Show already exists' }, 400);
        }
        var patchS = { title: b.title, title_lower: String(b.title || '').toLowerCase(), year: b.year || null, rating: parseFloat(b.rating) || 0, synopsis: b.synopsis || null, language: b.language || null, age_rating: parseInt(b.age_rating, 10) || 0, cover_file_id: b.cover_file_id || null, logo_file_id: b.logo_file_id || null, studio: b.studio || null };
        if (b.code_name) patchS.code_name = b.code_name;
        await pg('series?id=eq.' + enc(id), { method: 'PATCH', prefer: 'return=minimal', body: patchS });
        return jsonRes({ ok: true });
      }
      // DELETE series: its episodes go with it (server behavior)
      await pg('episodes?series_id=eq.' + enc(id), { method: 'DELETE', prefer: 'return=minimal' });
      await pg('series?id=eq.' + enc(id), { method: 'DELETE', prefer: 'return=minimal' });
      return jsonRes({ ok: true });
    }

    if (A === 'movie') {
      if (method === 'POST' && seg[4] === 'file') {
        if (!b.file_id) return jsonRes({ error: 'file_id required' }, 400);
        await pg('movie_files', { method: 'POST', prefer: 'return=minimal', body: { movie_id: Number(id) || id, quality: b.quality || '720p', file_id: b.file_id, mt_msg_id: parseInt(b.mt_msg_id, 10) || null } });
        return jsonRes({ ok: true });
      }
      if (method === 'POST') {
        if (!b.title || !b.file_id) return jsonRes({ error: 'title and file_id required' }, 400);
        var insM = await pg('movies', { method: 'POST', prefer: 'return=representation', body: { title: b.title, title_lower: String(b.title).toLowerCase(), cover_file_id: b.cover_file_id || null, synopsis: b.synopsis || null, year: b.year || null, rating: parseFloat(b.rating) || 0, language: b.language || null, age_rating: parseInt(b.age_rating, 10) || 0 } });
        var rowM = one(insM) || {};
        await pg('movie_files', { method: 'POST', prefer: 'return=minimal', body: { movie_id: rowM.id, quality: b.quality || '720p', file_id: b.file_id, file_size: parseInt(b.file_size, 10) || 0, mt_msg_id: parseInt(b.mt_msg_id, 10) || null } });
        return jsonRes({ ok: true, id: rowM.id });
      }
      if (method === 'PUT') {
        await pg('movies?id=eq.' + enc(id), { method: 'PATCH', prefer: 'return=minimal', body: { title: b.title, title_lower: String(b.title || '').toLowerCase(), year: b.year || null, rating: parseFloat(b.rating) || 0, synopsis: b.synopsis || null, language: b.language || null, age_rating: parseInt(b.age_rating, 10) || 0, cover_file_id: b.cover_file_id || null } });
        return jsonRes({ ok: true });
      }
      await pg('movie_files?movie_id=eq.' + enc(id), { method: 'DELETE', prefer: 'return=minimal' });
      await pg('movies?id=eq.' + enc(id), { method: 'DELETE', prefer: 'return=minimal' });
      return jsonRes({ ok: true });
    }

    if (A === 'episode') {
      if (method === 'POST') {
        if (!b.series_id || !b.episode_number) return jsonRes({ error: 'series and episode number required' }, 400);
        if (!b.file_id && !b.tg_link) return jsonRes({ error: 'file_id or t.me link required' }, 400);
        if (!b.file_id && b.tg_link) return jsonRes({ error: 'Channel-link episodes need the server to fetch the video — paste the file ID from the bot instead.' }, 400);
        var epRow = { series_id: Number(b.series_id) || b.series_id, season: parseInt(b.season, 10) || 1, episode_number: parseInt(b.episode_number, 10), file_id: b.file_id || '', file_size: parseInt(b.file_size, 10) || 0, quality: b.quality || '720p', mt_msg_id: parseInt(b.mt_msg_id, 10) || null, tg_link: b.tg_link || null, title: b.title || null, description: b.description || null, cover_file_id: b.cover_file_id || null, intro_start: secOrNull(b.intro_start), intro_end: secOrNull(b.intro_end), outro_start: secOrNull(b.outro_start), outro_end: secOrNull(b.outro_end), language: b.language || null, studio: b.studio || null };
        var insE = await pg('episodes', { method: 'POST', prefer: 'return=representation', body: epRow });
        var rowE = one(insE) || {};
        epRow.id = rowE.id;
        var sibs = await pg('episodes?series_id=eq.' + enc(epRow.series_id) + '&season=eq.' + enc(epRow.season) + '&episode_number=eq.' + enc(epRow.episode_number) + '&select=id').catch(function () { return []; });
        if (sibs.length === 1) {
          var srow = one(await pg('series?id=eq.' + enc(epRow.series_id) + '&select=*').catch(function () { return []; }));
          if (srow) await autoPostB(srow, epRow);
        }
        return jsonRes({ ok: true, id: rowE.id });
      }
      if (method === 'PUT') {
        await pg('episodes?id=eq.' + enc(id), { method: 'PATCH', prefer: 'return=minimal', body: { episode_number: parseInt(b.episode_number, 10) || 1, season: parseInt(b.season, 10) || 1, quality: b.quality || '720p', file_id: b.file_id || null, file_size: parseInt(b.file_size, 10) || 0, tg_link: b.tg_link || null, title: b.title || null, description: b.description || null, cover_file_id: b.cover_file_id || null, intro_start: secOrNull(b.intro_start), intro_end: secOrNull(b.intro_end), outro_start: secOrNull(b.outro_start), outro_end: secOrNull(b.outro_end), language: b.language || null, studio: b.studio || null } });
        return jsonRes({ ok: true });
      }
      await pg('episodes?id=eq.' + enc(id), { method: 'DELETE', prefer: 'return=minimal' });
      return jsonRes({ ok: true });
    }

    if (A === 'reels' && method === 'PUT') {
      var rr = one(await pg('reels?id=eq.' + enc(id) + '&select=id').catch(function () { return []; }));
      if (!rr) return jsonRes({ error: 'not found' }, 404);
      var warningR = null;
      if (typeof b.caption === 'string') await pg('reels?id=eq.' + enc(id), { method: 'PATCH', prefer: 'return=minimal', body: { caption: String(b.caption).slice(0, 300) || null } });
      if (b.unlink) {
        await pg('reels?id=eq.' + enc(id), { method: 'PATCH', prefer: 'return=minimal', body: { series_id: null, movie_id: null, title_hint: null } });
      } else if (b.hint && String(b.hint).trim()) {
        var hintR = String(b.hint).trim().slice(0, 120);
        var linkR = await matchCatalogB(hintR);
        if (linkR) await pg('reels?id=eq.' + enc(id), { method: 'PATCH', prefer: 'return=minimal', body: { title_hint: hintR, series_id: linkR.series_id, movie_id: linkR.movie_id } });
        else { await pg('reels?id=eq.' + enc(id), { method: 'PATCH', prefer: 'return=minimal', body: { title_hint: hintR } }); warningR = 'No show or movie matches that code name yet — link unchanged.'; }
      }
      return jsonRes({ ok: true, warning: warningR });
    }

    if (A === 'ig-reels') {
      if (method === 'PUT') {
        var ir = one(await pg('ig_reels?id=eq.' + enc(id) + '&select=id').catch(function () { return []; }));
        if (!ir) return jsonRes({ error: 'not found' }, 404);
        var warningI = null;
        if (typeof b.caption === 'string') await pg('ig_reels?id=eq.' + enc(id), { method: 'PATCH', prefer: 'return=minimal', body: { caption: String(b.caption).slice(0, 300) || null } });
        if (b.unlink) {
          await pg('ig_reels?id=eq.' + enc(id), { method: 'PATCH', prefer: 'return=minimal', body: { series_id: null, movie_id: null } });
        } else if (b.hint && String(b.hint).trim()) {
          var linkI = await matchCatalogB(String(b.hint).trim().slice(0, 120));
          if (linkI) await pg('ig_reels?id=eq.' + enc(id), { method: 'PATCH', prefer: 'return=minimal', body: { series_id: linkI.series_id, movie_id: linkI.movie_id } });
          else warningI = 'No show or movie matches that code name yet — link unchanged.';
        }
        return jsonRes({ ok: true, warning: warningI });
      }
      await pg('ig_reels?id=eq.' + enc(id), { method: 'DELETE', prefer: 'return=minimal' });
      return jsonRes({ ok: true });
    }
    return null;
  }

  // ── router ──────────────────────────────────────────────────────────────
  async function route(method, path, q, headers, body) {
    var uid = hdr(headers, 'x-telegram-id');
    var uname = decName(hdr(headers, 'x-telegram-name'));
    var seg = path.split('/').filter(Boolean); // ['api', ...]
    try {
      if (path === '/api/health') return jsonRes({ ok: true });
      if (path === '/api/auth/account-login' && method === 'POST') return await accountLogin(body);
      if (path === '/api/auth/logout' && method === 'POST') return jsonRes({ ok: true });
      if (path === '/api/auth/phone/start' || path === '/api/auth/phone/verify' || path === '/api/auth/signup/start' || path === '/api/auth/signup/verify')
        return jsonRes({ error: 'SMS is not switched on yet — use account sign-in.' }, 503);
      if (path === '/api/me' && method === 'GET') {
        if (/^\d+$/.test(uid) && uname) noteUser(uid, uname);
        return jsonRes(await meRoute(uid));
      }
      if (path === '/api/me/langs' && method === 'GET') {
        var lr = uid ? await pg('user_langs?user_id=eq.' + enc(uid) + '&select=lang').catch(function () { return []; }) : [];
        return jsonRes({ ok: true, langs: lr.map(function (r) { return r.lang; }) });
      }
      if (path === '/api/me/langs' && method === 'POST') {
        if (!uid) return jsonRes({ error: 'no user' }, 400);
        var langs = Array.from(new Set((Array.isArray(body && body.langs) ? body.langs : []).map(canonLangCode).filter(Boolean))).slice(0, 8);
        await pg('user_langs?user_id=eq.' + enc(uid), { method: 'DELETE', prefer: 'return=minimal' }).catch(function () {});
        for (var li = 0; li < langs.length; li++) {
          await pg('user_langs', { method: 'POST', prefer: 'return=minimal', body: { user_id: uid, lang: langs[li] } }).catch(function () {});
        }
        return jsonRes({ ok: true, langs: langs });
      }
      if (path === '/api/presence' && method === 'POST') { await noteUser(uid, uname); return jsonRes({ ok: true }); }
      if (path === '/api/admin/check') return jsonRes({ isAdmin: uid === OWNER, admin: uid === OWNER });
      if (path === '/api/series' && method === 'GET') return jsonRes(await seriesList(q, uid));
      if (path === '/api/movies' && method === 'GET') return jsonRes(await moviesList(q));
      if (seg.length === 3 && seg[1] === 'series' && method === 'GET') return await seriesDetail(seg[2], uid);
      if (seg.length === 3 && seg[1] === 'movie' && method === 'GET') return await movieDetail(seg[2]);
      if (seg.length === 3 && seg[1] === 'episode' && method === 'GET') return await episodeDetail(seg[2]);
      if (path === '/api/search' && method === 'GET') {
        var qq = String(q.q || '').toLowerCase().trim();
        if (!qq) return jsonRes({ movies: [], series: [] });
        var like = 'ilike.%' + qq.replace(/[%_]/g, '') + '%';
        var sm = await pg('movies?title=' + like + '&select=id,title,year,rating,cover_file_id&order=id.desc&limit=30').catch(function () { return []; });
        var ss = await pg('series?title=' + like + '&select=id,title,year,rating,cover_file_id&order=id.desc&limit=30').catch(function () { return []; });
        return jsonRes({ movies: sm, series: ss });
      }
      if (path === '/api/random' && method === 'GET') {
        var tbl = q.type === 'series' ? 'series' : 'movies';
        var rr = await pg(tbl + '?select=id,title&limit=1000').catch(function () { return []; });
        return jsonRes(rr.length ? rr[Math.floor(Math.random() * rr.length)] : {});
      }
      if (path === '/api/stats' && method === 'GET') {
        var cm = await pg('movies?select=id&limit=10000').catch(function () { return []; });
        var cs = await pg('series?select=id&limit=10000').catch(function () { return []; });
        return jsonRes({ movies: cm.length, series: cs.length, updated: null });
      }
      if (path === '/api/view' && method === 'POST') {
        var key = String((body || {}).item_key || '');
        if (!/^(ep|mv|tg|ig):\d+$/.test(key)) return jsonRes({ error: 'bad item_key' }, 400);
        var viewer = String(uid || (body || {}).viewer || 'anon').slice(0, 64);
        var since = new Date(Date.now() - 30 * 60000).toISOString();
        var dupe = one(await pg('views?item_key=eq.' + enc(key) + '&viewer_id=eq.' + enc(viewer) + '&viewed_at=gt.' + enc(since) + '&select=item_key&limit=1').catch(function () { return []; }));
        if (!dupe) {
          await pg('views', { method: 'POST', prefer: 'return=minimal', body: { item_key: key, viewer_id: viewer, viewed_at: nowIso(), viewer_name: uname || null } }).catch(function () {});
        }
        return jsonRes({ ok: true, counted: !dupe });
      }
      if (path === '/api/reels' && method === 'GET') return jsonRes(await reelsFeed(q, uid, uname));
      if (path === '/api/reels' && method === 'POST') return jsonRes({ error: 'Posting needs the server — it is asleep right now.' }, 503);
      if (seg.length === 4 && seg[1] === 'reels' && seg[3] === 'comments' && method === 'GET') return await commentsList(decodeURIComponent(seg[2]), uid);
      if (seg.length === 4 && seg[1] === 'reels' && seg[3] === 'comments' && method === 'POST') return await commentPost(decodeURIComponent(seg[2]), uid, uname, body);
      if (seg.length === 4 && seg[1] === 'reels' && seg[3] === 'likes' && method === 'GET') {
        if (!keyOk(seg[2])) return jsonRes({ error: 'bad item' }, 400);
        return jsonRes(await likers('reel_likes', 'item_key', decodeURIComponent(seg[2]), uid));
      }
      if (seg.length === 4 && seg[1] === 'reels' && method === 'POST' && (seg[3] === 'like' || seg[3] === 'save' || seg[3] === 'repost')) {
        var tbl = seg[3] === 'like' ? 'reel_likes' : seg[3] === 'save' ? 'reel_saves' : 'reel_reposts';
        return await toggle(tbl, decodeURIComponent(seg[2]), uid, uname, function (k) { return keyOk(k); });
      }
      if (seg.length === 4 && seg[1] === 'reels' && seg[3] === 'share' && method === 'POST') return await shareReel(decodeURIComponent(seg[2]), uid, uname);
      if (seg.length === 4 && seg[1] === 'reels' && seg[2] === 'comments' && method === 'DELETE') {
        var c = one(await pg('reel_comments?id=eq.' + enc(seg[3]) + '&select=*').catch(function () { return []; }));
        if (!c) return jsonRes({ ok: true });
        if (uid !== OWNER && String(c.user_id) !== String(uid)) return jsonRes({ error: 'forbidden' }, 403);
        await pg('reel_comments?id=eq.' + enc(seg[3]), { method: 'DELETE', prefer: 'return=minimal' }).catch(function () {});
        await pg('reel_comments?parent_id=eq.' + enc(seg[3]), { method: 'DELETE', prefer: 'return=minimal' }).catch(function () {});
        await pg('reel_comment_likes?comment_id=eq.' + enc(seg[3]), { method: 'DELETE', prefer: 'return=minimal' }).catch(function () {});
        return jsonRes({ ok: true });
      }
      if (seg.length === 5 && seg[1] === 'reels' && seg[2] === 'comments' && seg[4] === 'like' && method === 'POST') return await commentLike(seg[3], uid, uname);
      if (seg.length === 5 && seg[1] === 'reels' && seg[2] === 'comments' && seg[4] === 'likes' && method === 'GET')
        return jsonRes(await likers('reel_comment_likes', 'comment_id', seg[3], uid));
      if (path === '/api/follow' && method === 'POST') {
        var target = String((body && body.user_id) || '');
        if (!uid || !target || uid === target) return jsonRes({ error: 'bad users' }, 400);
        await noteUser(uid, uname);
        var exf = one(await pg('follows?follower_id=eq.' + enc(uid) + '&followee_id=eq.' + enc(target) + '&select=follower_id').catch(function () { return []; }));
        if (exf) await pg('follows?follower_id=eq.' + enc(uid) + '&followee_id=eq.' + enc(target), { method: 'DELETE', prefer: 'return=minimal' }).catch(function () {});
        else await pg('follows', { method: 'POST', prefer: 'return=minimal', body: { follower_id: uid, followee_id: target, created_at: nowIso() } }).catch(function () {});
        var fc = await pg('follows?followee_id=eq.' + enc(target) + '&select=follower_id&limit=10000').catch(function () { return []; });
        return jsonRes({ ok: true, following: !exf, followers: fc.length });
      }
      if (path === '/api/profile' && method === 'GET') {
        if (!uid) return jsonRes({ error: 'no user' }, 400);
        await noteUser(uid, uname);
        var p0 = await profilePayload(uid, uid);
        var cmade = await pg('reel_comments?user_id=eq.' + enc(uid) + '&select=id&limit=10000').catch(function () { return []; });
        var lrows = await pg('user_langs?user_id=eq.' + enc(uid) + '&select=lang').catch(function () { return []; });
        p0.stats.comments = cmade.length;
        return jsonRes(Object.assign({ ok: true, user_id: uid, langs: lrows.map(function (r) { return r.lang; }) }, p0));
      }
      if (seg.length === 3 && seg[1] === 'profile' && method === 'GET') {
        var tuid = decodeURIComponent(seg[2]);
        var urow = one(await pg('app_users?user_id=eq.' + enc(tuid) + '&select=user_name,last_seen_at,updated_at').catch(function () { return []; }));
        var p1 = await profilePayload(tuid, uid);
        return jsonRes(Object.assign({ ok: true, user_id: tuid, user_name: await nameOf(tuid, null), last_seen: urow ? (urow.last_seen_at || urow.updated_at) : null, is_me: uid === tuid }, p1));
      }
      if (path === '/api/dm/users' && method === 'GET') {
        if (!/^\d+$/.test(uid)) return jsonRes({ ok: true, users: [] });
        var qtxt = String(q.q || '').toLowerCase();
        var urows = await pg('app_users?user_id=neq.' + enc(uid) + '&select=user_id,user_name,last_seen_at,updated_at&order=updated_at.desc&limit=200').catch(function () { return []; });
        if (qtxt) urows = urows.filter(function (r) { return (r.user_name || '').toLowerCase().indexOf(qtxt) >= 0; });
        return jsonRes({ ok: true, users: urows.slice(0, 50).map(function (r) { return { user_id: r.user_id, user_name: r.user_name, last_seen: r.last_seen_at || r.updated_at || null }; }) });
      }
      if (path === '/api/dm/threads' && method === 'GET') {
        if (!uid) return jsonRes({ error: 'no user' }, 400);
        return jsonRes(await dmThreads(uid));
      }
      if (path === '/api/dm/threads' && method === 'POST') {
        var peer = String((body && body.user_id) || '');
        if (!uid || !peer || peer === uid) return jsonRes({ error: 'bad users' }, 400);
        var ex1 = one(await pg('dm_threads?user_a=eq.' + enc(uid) + '&user_b=eq.' + enc(peer) + '&select=id').catch(function () { return []; }));
        var ex2 = ex1 || one(await pg('dm_threads?user_a=eq.' + enc(peer) + '&user_b=eq.' + enc(uid) + '&select=id').catch(function () { return []; }));
        if (ex2) return jsonRes({ ok: true, id: ex2.id });
        var meRow = one(await pg('app_users?user_id=eq.' + enc(uid) + '&select=user_name').catch(function () { return []; }));
        var themRow = one(await pg('app_users?user_id=eq.' + enc(peer) + '&select=user_name').catch(function () { return []; }));
        var created = await pg('dm_threads', { method: 'POST', prefer: 'return=representation', body: { user_a: uid, user_b: peer, a_name: uname || (meRow && meRow.user_name) || 'User', b_name: (themRow && themRow.user_name) || 'User', updated_at: nowIso() } });
        var crow = one(created) || {};
        return jsonRes({ ok: true, id: crow.id });
      }
      if (seg.length === 4 && seg[1] === 'dm' && seg[2] === 'threads' && seg[3] === 'messages') { /* handled below by length 5 */ }
      if (seg.length === 5 && seg[1] === 'dm' && seg[2] === 'threads' && seg[4] === 'messages') {
        var th = one(await pg('dm_threads?id=eq.' + enc(seg[3]) + '&select=*').catch(function () { return []; }));
        if (!th || (String(th.user_a) !== String(uid) && String(th.user_b) !== String(uid))) return jsonRes({ error: 'no thread' }, 404);
        if (method === 'GET') {
          var msgs = await pg('dm_messages?thread_id=eq.' + enc(seg[3]) + '&select=id,sender_id,sender_name,text,created_at&order=id.asc&limit=300').catch(function () { return []; });
          var lastId = msgs.length ? msgs[msgs.length - 1].id : 0;
          var col = String(th.user_a) === String(uid) ? 'a_read' : 'b_read';
          var patch = {}; patch[col] = lastId;
          await pg('dm_threads?id=eq.' + enc(seg[3]), { method: 'PATCH', prefer: 'return=minimal', body: patch }).catch(function () {});
          return jsonRes({ ok: true, messages: msgs });
        }
        if (method === 'POST') {
          var text = String((body && body.text) || '').trim().slice(0, 2000);
          if (!text) return jsonRes({ error: 'empty' }, 400);
          var ins = await pg('dm_messages', { method: 'POST', prefer: 'return=representation', body: { thread_id: Number(seg[3]) || seg[3], sender_id: uid, sender_name: uname || 'User', text: text, created_at: nowIso() } });
          await pg('dm_threads?id=eq.' + enc(seg[3]), { method: 'PATCH', prefer: 'return=minimal', body: { updated_at: nowIso() } }).catch(function () {});
          var irow = one(ins) || {};
          return jsonRes({ ok: true, id: irow.id });
        }
      }
      if (path === '/api/admin/viewers' && method === 'GET') {
        if (uid !== OWNER) return jsonRes({ error: 'admins only' }, 403);
        var vkey = String(q.key || '');
        if (!keyOk(vkey)) return jsonRes({ error: 'bad item' }, 400);
        var keys = [vkey];
        if (vkey.indexOf('ep:') === 0) {
          var epv = one(await pg('episodes?id=eq.' + enc(vkey.slice(3)) + '&select=series_id,season,episode_number').catch(function () { return []; }));
          if (epv) {
            var vars = await pg('episodes?series_id=eq.' + enc(epv.series_id) + '&season=eq.' + enc(epv.season == null ? '' : epv.season) + '&episode_number=eq.' + enc(epv.episode_number) + '&select=id').catch(function () { return []; });
            if (vars.length) keys = vars.map(function (v) { return 'ep:' + v.id; });
          }
        }
        var vrows = await pg('views?item_key=in.(' + keys.map(enc).join(',') + ')&select=viewer_id,viewer_name,viewed_at&order=viewed_at.desc&limit=10000').catch(function () { return []; });
        var grouped = {};
        vrows.forEach(function (r) {
          var g = grouped[r.viewer_id] || (grouped[r.viewer_id] = { user_id: r.viewer_id, user_name: r.viewer_name, last_at: r.viewed_at, count: 0 });
          g.count += 1;
          if (r.viewed_at > g.last_at) g.last_at = r.viewed_at;
        });
        var viewers = Object.values(grouped);
        for (var vi = 0; vi < viewers.length; vi++) viewers[vi].user_name = await nameOf(viewers[vi].user_id, viewers[vi].user_name);
        return jsonRes({ ok: true, viewers: viewers });
      }
      if (path === '/api/admin/stats' && method === 'GET') {
        if (uid !== OWNER) return jsonRes({ error: 'admins only' }, 403);
        var sUsers = await pg('app_users?select=user_id&limit=10000').catch(function () { return []; });
        var sSeries = await pg('series?select=id&limit=10000').catch(function () { return []; });
        var sMovies = await pg('movies?select=id&limit=10000').catch(function () { return []; });
        var sReels = await pg('reels?select=id&limit=10000').catch(function () { return []; });
        return jsonRes({ ok: true, users: sUsers.length, series: sSeries.length, movies: sMovies.length, reels: sReels.length });
      }
      if (path === '/api/send-episode') return jsonRes({ error: 'The bot link is asleep right now — the server sends episodes.' }, 503);
      if (path.indexOf('/api/admin/') === 0) {
        var adm = await adminRoute(method, path, seg, uid, body);
        if (adm) return adm;
        return jsonRes({ error: 'That admin action needs the server — it is asleep right now.' }, 503);
      }
      if (path === '/api/reels/media') return jsonRes({ error: 'Uploads need the server — it is asleep right now.' }, 503);
      if (method === 'DELETE' && seg.length === 3 && seg[1] === 'reels') {
        var rr2 = one(await pg('reels?id=eq.' + enc(seg[2]) + '&select=uploader_id').catch(function () { return []; }));
        if (rr2 && (uid === OWNER || String(rr2.uploader_id) === String(uid))) {
          await pg('reels?id=eq.' + enc(seg[2]), { method: 'DELETE', prefer: 'return=minimal' }).catch(function () {});
          return jsonRes({ ok: true });
        }
        return jsonRes({ error: 'forbidden' }, 403);
      }
      return jsonRes({ error: 'not available while the server sleeps' }, 503);
    } catch (e) {
      return jsonRes({ error: 'bridge: ' + (e && e.message ? e.message : 'failed') }, 502);
    }
  }

  // The Admin page's "Telegram Login (Big Files)" card drives the hosted
  // server's own Telegram session (server-side big-file fetching). There
  // is no server session in the serverless app — the card can neither
  // configure nor log in anything here, and its permanent red
  // "Not configured on server" state only confuses. Hide it. (Playback
  // sign-in is separate: the app shell's native dialog.)
  try {
    var hideMtCard = function () {
      var cards = document.querySelectorAll('.card');
      for (var i = 0; i < cards.length; i++) {
        if (cards[i].textContent && cards[i].textContent.indexOf('Telegram Login (Big Files)') >= 0) {
          cards[i].style.display = 'none';
        }
      }
    };
    new MutationObserver(hideMtCard).observe(document.documentElement, { childList: true, subtree: true });
  } catch (e) {}

  window.fetch = function (input, init) {
    var url = typeof input === 'string' ? input : (input && input.url) || '';
    var u;
    try { u = new URL(url, location.href); } catch (e) { return realFetch(input, init); }
    if (u.pathname.indexOf('/api/') !== 0) return realFetch(input, init);
    init = init || {};
    var method = (init.method || (typeof input !== 'string' && input && input.method) || 'GET').toUpperCase();
    var headers = init.headers || (typeof input !== 'string' && input && input.headers) || {};
    var q = {};
    u.searchParams.forEach(function (v, k) { q[k] = v; });
    var bodyP = Promise.resolve(null);
    if (init.body && typeof init.body === 'string') {
      try { bodyP = Promise.resolve(JSON.parse(init.body)); } catch (e) { bodyP = Promise.resolve(null); }
    } else if (init.body) {
      bodyP = Promise.resolve(null); // multipart etc. — routes that need it answer 503
    }
    return bodyP.then(function (body) { return route(method, u.pathname, q, headers, body); });
  };
})();
