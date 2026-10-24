const { useState, useEffect, useRef } = React;

// ── Professional outline icons (feather-style, stroke = currentColor) ──
const ic = (paths, size, sw) => (
  <svg width={size || 20} height={size || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw || 1.8} strokeLinecap="round" strokeLinejoin="round" style={{display: 'inline-block', verticalAlign: '-0.16em', flexShrink: 0}}>{paths}</svg>
);
const I = {
  film: (s) => ic(<><rect x="2" y="2" width="20" height="20" rx="2.2"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></>, s),
  tv: (s) => ic(<><rect x="2" y="7" width="20" height="15" rx="2"/><polyline points="17 2 12 7 7 2"/></>, s),
  eye: (s) => ic(<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>, s),
  crown: (s) => ic(<><path d="M3 19h18"/><path d="M4 17.5L2.8 8.8 8.2 13 12 5.8 15.8 13l5.4-4.2L20 17.5z"/></>, s),
  file: (s) => ic(<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>, s),
  drive: (s) => ic(<><line x1="22" y1="12" x2="2" y2="12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><line x1="6" y1="16" x2="6.01" y2="16"/><line x1="10" y1="16" x2="10.01" y2="16"/></>, s),
  save: (s) => ic(<><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></>, s),
  plus: (s) => ic(<><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>, s),
  trash: (s) => ic(<><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></>, s),
  edit: (s) => ic(<path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>, s),
  download: (s) => ic(<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>, s),
  send: (s) => ic(<><line x1="22" y1="2" x2="11" y2="13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></>, s),
  link: (s) => ic(<><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></>, s),
  play: (s) => (<svg width={s || 16} height={s || 16} viewBox="0 0 24 24" fill="currentColor" style={{display: 'inline-block', verticalAlign: '-0.13em', flexShrink: 0}}><polygon points="7 4 20 12 7 20 7 4"/></svg>),
  clock: (s) => ic(<><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>, s),
  star: (s) => ic(<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>, s),
  shuffle: (s) => ic(<><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></>, s),
  gear: (s) => ic(<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></>, s),
  radio: (s) => ic(<><circle cx="12" cy="12" r="2"/><path d="M4.93 19.07a10 10 0 0 1 0-14.14"/><path d="M7.76 16.24a6 6 0 0 1 0-8.49"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></>, s),
  bookmark: (s) => ic(<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>, s),
  copy: (s) => ic(<><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></>, s),
  check: (s) => ic(<polyline points="20 6 9 17 4 12"/>, s),
  image: (s) => ic(<><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></>, s),
  video: (s) => ic(<><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></>, s),
  chevR: (s) => ic(<polyline points="9 18 15 12 9 6"/>, s),
  vol: (s) => ic(<><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></>, s),
  volX: (s) => ic(<><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></>, s),
  ban: (s) => ic(<><circle cx="12" cy="12" r="10"/><line x1="4.9" y1="4.9" x2="19.1" y2="19.1"/></>, s),
};

const tg = window.Telegram?.WebApp;
if (tg) { try { tg.ready(); tg.expand(); } catch {} }

// Version self-check (v149): if the server already serves a newer app.js,
// reload once — the Telegram WebView otherwise keeps a stale build alive
// for days and new fixes "don't work" on the admin's phone.
const APP_VER = 205;
try {
  fetch('/?vc=' + Date.now(), { cache: 'no-store' }).then(r => r.text()).then(t => {
    const m = t.match(/app\.js\?v=(\d+)/);
    if (m && +m[1] !== APP_VER && !sessionStorage.getItem('vc_reloaded')) { sessionStorage.setItem('vc_reloaded', '1'); location.reload(); }
  }).catch(() => {});
} catch (e) {}

const getSession = () => { try { return JSON.parse(localStorage.getItem('somon_session') || 'null'); } catch (e) { return null; } };
const viewerId = () => {
  const tid = tg?.initDataUnsafe?.user?.id;
  if (tid) return String(tid);
  const s = getSession();
  if (s && s.user_id) return String(s.user_id);
  try {
    let g = localStorage.getItem('somon_guest_id');
    if (!g) { g = 'g' + Date.now().toString(36) + Math.random().toString(36).slice(2, 9); localStorage.setItem('somon_guest_id', g); }
    return g;
  } catch (e) { return 'guest'; }
};
const sessHeaders = () => { const s = getSession(); return s && s.token ? { 'x-session': s.token } : {}; };
const myDisplayName = () => (tg && tg.initDataUnsafe && tg.initDataUnsafe.user && tg.initDataUnsafe.user.first_name) || (getSession() || {}).user_name || '';
const api = {
  get: (p) => fetch(p, { headers: { 'x-telegram-id': viewerId(), 'x-telegram-name': encodeURIComponent(myDisplayName()), ...sessHeaders() } }).then(r => r.json()),
  del: (p) => fetch(p, { method: 'DELETE', headers: { 'x-telegram-id': viewerId(), 'x-telegram-name': encodeURIComponent(myDisplayName()), ...sessHeaders() } }).then(r => r.json()),
};
const coverUrl = (fid) => fid ? `/api/cover?fid=${encodeURIComponent(fid)}` : null;
// View counting: fired once per item per app session when playback (or a
// promo card) actually starts/opens; the server dedupes per viewer.
const viewSeen = new Set();
function beaconView(itemKey) {
  if (!itemKey || viewSeen.has(itemKey)) return;
  viewSeen.add(itemKey);
  try {
    fetch('/api/view', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-telegram-id': String(viewerId() || ''), 'x-telegram-name': encodeURIComponent((tg && tg.initDataUnsafe && tg.initDataUnsafe.user && tg.initDataUnsafe.user.first_name) || '') }, body: JSON.stringify({ item_key: itemKey }) }).catch(() => {});
  } catch (e) {}
}
const botLink = (arg) => {
  const url = `https://t.me/Hsshsgsgsbzvbot?start=${arg}`;
  if (tg) tg.openTelegramLink(url);
  else window.open(url, '_blank');
};
const fmtSize = (b) => {
  if (!b) return '';
  const gb = b / 1e9;
  return gb >= 1 ? `${gb.toFixed(1)} GB` : `${Math.round(b / 1e6)} MB`;
};
const trailerUrl = (fid) => fid ? `/api/trailer?fid=${encodeURIComponent(fid)}` : null;

// ── I18N ──
const STR = {
  en: { search: 'Search…', films: 'Films', series: 'Series', back: 'Back', quality: 'Quality', getViaBot: 'Get via Bot',
    episodes: 'episodes', episodesShort: 'episodes', season: 'Season', all: 'All', trailer: 'Trailer', share: 'Share', ageTitle: 'Age Restricted', confirmAge: 'This title is 18+. Confirm you are an adult.',
    iAmAdult: 'I am 18+', cancel: 'Cancel', loading: 'Loading…', nothingFound: 'Nothing here yet', home: 'Home', bot: 'Bot',
    episode: 'Episode', langName: 'Language', skip: 'Skip', watch: 'Watch', download: 'Download', newest: 'Newest', topRated: 'Top Rated', random: 'Random',
    admin: 'Admin', manageMovies: 'Manage Movies', manageSeries: 'Manage Series',
    deleteConfirm: 'Delete this?', deleted: 'Deleted', addViaBot: 'Add via Bot', stats: 'Stats' },
  ru: { search: 'Поиск…', films: 'Фильмы', series: 'Сериалы', back: 'Назад', quality: 'Качество', getViaBot: 'Получить в боте',
    episodes: 'серий', episodesShort: 'серий', season: 'Сезон', all: 'Все', trailer: 'Трейлер', share: 'Поделиться', confirmAge: 'Контент 18+. Подтвердите возраст.',
    iAmAdult: 'Мне есть 18', cancel: 'Отмена', loading: 'Загрузка…', nothingFound: 'Пока пусто', home: 'Главная', bot: 'Бот',
    episode: 'Серия', langName: 'Язык', skip: 'Пропустить', watch: 'Смотреть', download: 'Скачать', newest: 'Новые', topRated: 'Топ', random: 'Случайно',
    admin: 'Админ', manageMovies: 'Фильмы', manageSeries: 'Сериалы',
    deleteConfirm: 'Удалить?', deleted: 'Удалено', addViaBot: 'Добавить в боте', stats: 'Статистика' },
  tj: { search: 'Ҷустуҷӯ…', films: 'Филмҳо', series: 'Силсилафилмҳо', back: 'Бозгашт', quality: 'Сифат', getViaBot: 'Гирифтан дар бот',
    episodes: 'Қисмҳо', episodesShort: 'қисм', season: 'Фасл', all: 'Ҳама', trailer: 'Трейлер', share: 'Мубодила', confirmAge: 'Ин 18+ аст. Синну солатонро тасдиқ кунед.',
    iAmAdult: 'Ман 18-солаам', cancel: 'Бекор', loading: 'Бор мешавад…', nothingFound: 'Ҳоло холӣ', home: 'Асосӣ', bot: 'Бот',
    episode: 'Қисми', langName: 'Забон', skip: 'Гузаронидан', watch: 'Тамошо', download: 'Зеркашӣ', newest: 'Навтарин', topRated: 'Беҳтарин', random: 'Тасодуфӣ',
    admin: 'Админ', manageMovies: 'Идоракунии филмҳо', manageSeries: 'Идоракунии сериалҳо',
    deleteConfirm: 'Ҳазф шавад?', deleted: 'Ҳазф шуд', addViaBot: 'Дар бот илова кун', stats: 'Омор' },
  fa: { search: 'جستجو…', films: 'فیلم‌ها', series: 'سریال‌ها', back: 'بازگشت', quality: 'کیفیت', getViaBot: 'دریافت در ربات',
    episodes: 'قسمت', episodesShort: 'قسمت', season: 'فصل', all: 'همه', trailer: 'تریلر', share: 'اشتراک', confirmAge: 'این محتوا ۱۸+ است. سن خود را تأیید کنید.',
    iAmAdult: 'من ۱۸ سال دارم', cancel: 'لغو', loading: 'در حال بارگذاری…', nothingFound: 'هنوز خالی است', home: 'خانه', bot: 'ربات',
    episode: 'قسمت', langName: 'زبان', skip: 'رد کردن', watch: 'تماشا', download: 'دانلود', newest: 'جدیدترین', topRated: 'برترین', random: 'تصادفی',
    admin: 'مدیر', manageMovies: 'مدیریت فیلم‌ها', manageSeries: 'مدیریت سریال‌ها',
    deleteConfirm: 'حذف شود؟', deleted: 'حذف شد', addViaBot: 'افزودن در ربات', stats: 'آمار' },
};
const LANGS = { en: 'EN', ru: 'RU', tj: 'TJ', fa: 'FA' };
let lang = localStorage.getItem('somon_lang') || tg?.initDataUnsafe?.user?.language_code?.slice(0, 2) || 'en';
if (lang === 'tg') lang = 'tj';
if (!STR[lang]) lang = 'en';
const t = (k) => STR[lang][k] || STR.en[k] || k;
function setLang(l) { lang = l; localStorage.setItem('somon_lang', l); location.reload(); }

// Language versions of one show share a code name (server sends a lang_group
// id, never the name itself). The catalog shows ONE card per show: the version
// whose language matches the app's UI language, else the first version.
// A language is the same language in any script or spelling:
// Тоҷикӣ = Tajik = Tadjik = تاجیکی. canonLang maps any alias to one key.
const LANG_CANON = {
  tj: ['tajik', 'tadjik', 'tadzhik', 'todzhik', 'tojik', 'tojiki', 'тоҷикӣ', 'точикӣ', 'точики', 'тоджикский', 'таджикский', 'тоджик', 'таджик', 'تاجیکی', 'تاجیک'],
  ru: ['russian', 'русский', 'русӣ', 'рус'],
  en: ['english', 'английский', 'англисӣ'],
  fa: ['persian', 'farsi', 'forsi', 'فارسی', 'форсӣ', 'форси', 'персидский', 'dari', 'дари', 'дарӣ'],
  uz: ['uzbek', 'узбекский', 'ӯзбекӣ', 'узбек', "o'zbek", "o'zbekcha", 'ozbek', 'اوزبیک'],
  kk: ['kazakh', 'казахский', 'қазоқӣ', 'қазақ', 'қазақша'],
  ky: ['kyrgyz', 'киргизский', 'қирғизӣ', 'кыргыз', 'кыргызча'],
  tr: ['turkish', 'турецкий', 'туркӣ', 'турк', 'türkçe', 'turkce'],
  ar: ['arabic', 'арабский', 'арабӣ', 'араб', 'العربية', 'عربي'],
  uk: ['ukrainian', 'украинский', 'українська', 'украин'],
  hy: ['armenian', 'армянский', 'арманӣ', 'հայերեն'],
  ka: ['georgian', 'грузинский', 'гурҷӣ', 'ქართული'],
  az: ['azerbaijani', 'азербайджанский', 'озарӣ', 'azərbaycan', 'azerbaycan'],
  hi: ['hindi', 'хиндӣ', 'хинди', 'हिन्दी'],
  ja: ['japanese', 'японский', 'японӣ', '日本語'],
  ko: ['korean', 'корейский', 'кореягӣ', '한국어'],
  zh: ['chinese', 'китайский', 'хитоӣ', 'хитойӣ', '中文'],
  es: ['spanish', 'испанский', 'испанӣ', 'español', 'espanol'],
  fr: ['french', 'французский', 'фаронсавӣ', 'француз', 'français', 'francais'],
  de: ['german', 'немецкий', 'олмонӣ', 'немис', 'deutsch'],
  it: ['italian', 'итальянский', 'итолиёвӣ', 'italiano'],
  pt: ['portuguese', 'португальский', 'português', 'portugues'],
  ur: ['urdu', 'урду', 'اردو'],
  ps: ['pashto', 'пушту', 'پښتو'],
  bn: ['bengali', 'бенгальский', 'бенгалӣ', 'বাংলা'],
  id: ['indonesian', 'индонезийский', 'indonesia', 'bahasa indonesia'],
};
const _aliasToCanon = {};
Object.keys(LANG_CANON).forEach(k => LANG_CANON[k].forEach(a => { _aliasToCanon[a] = k; }));
function canonLang(s) {
  return _aliasToCanon[(s || '').trim().toLowerCase()] || null;
}
// Does a language label match what the user typed (any script/spelling)?
function langTextMatches(label, q) {
  const query = (q || '').trim().toLowerCase();
  if (!query) return true;
  if ((label || '').toLowerCase().includes(query)) return true;
  const cl = canonLang(label), cq = canonLang(query);
  if (cl && cq) return cl === cq;
  if (cl) return LANG_CANON[cl].some(a => a.includes(query));
  return false;
}
function mergeSeriesByLang(list) {
  if (!Array.isArray(list)) return list;
  const groups = {}, order = [];
  list.forEach(s => {
    const key = s.lang_group ? 'g' + s.lang_group : 's' + s.id;
    if (!groups[key]) { groups[key] = []; order.push(key); }
    groups[key].push(s);
  });
  return order.map(k => {
    const g = groups[k];
    return g.find(s => canonLang(s.language) === lang) || g[0];
  });
}

// ── User's logo (video roar, seamless loop) ──
function Logo() {
  return (
    <div className="logo-stage" style={{transform: 'translateX(20px)'}}>
      <video src="/logo-roar-transparent.webm" muted playsInline autoPlay loop preload="auto"
        style={{width: '100%', height: 'auto', display: 'block', background: 'transparent'}} />
    </div>
  );
}


// ── Skeleton loaders ──
function SkelGrid() {
  return (
    <div className="grid">
      {[0,1,2,3].map(i => (
        <div key={i} className="skel"><div className="ph" /><div className="ln" style={{width: '70%'}} /></div>
      ))}
    </div>
  );
}

// ── Home ──
let homeCache = { movies: null, series: null, sort: null };
// Persist home cache so a cold start / WebView reload renders instantly (fixes dark screen)
// Versioned: bump HOME_CACHE_VER whenever the series/movie payload shape changes,
// or old cached lists (e.g. without lang_group) would be served forever.
const HOME_CACHE_VER = 2;
try {
  const _saved = JSON.parse(localStorage.getItem('somon_home') || 'null');
  if (_saved && _saved.v === HOME_CACHE_VER && Array.isArray(_saved.movies) && Array.isArray(_saved.series)) homeCache = { movies: _saved.movies, series: _saved.series, sort: _saved.sort };
} catch (e) {}
function saveHomeCache() {
  try { localStorage.setItem('somon_home', JSON.stringify({ ...homeCache, v: HOME_CACHE_VER })); } catch (e) {}
}
function clearHomeCache() {
  homeCache = { movies: null, series: null, sort: null };
  try { localStorage.removeItem('somon_home'); } catch (e) {}
}

function Home({ go }) {
  const [tab, setTab] = useState('movies');
  const [sort, setSort] = useState('new');
  const [movies, setMovies] = useState(homeCache.movies);
  const [series, setSeries] = useState(homeCache.series);
  const [q, setQ] = useState('');
  const [results, setResults] = useState(null);

  useEffect(() => {
    // Use cache if available for this sort (validate it's actually an array)
    if (homeCache.sort === sort && Array.isArray(homeCache.movies) && Array.isArray(homeCache.series)) {
      setMovies(homeCache.movies);
      setSeries(homeCache.series);
      return;
    }
    api.get(`/api/movies?sort=${sort}`)
      .then(d => { const arr = Array.isArray(d) ? d : []; setMovies(arr); homeCache.movies = arr; saveHomeCache(); })
      .catch(() => setMovies([]));
  }, [sort]);
  useEffect(() => {
    if (homeCache.sort === sort && Array.isArray(homeCache.series)) return;
    api.get(`/api/series?sort=${sort}`)
      .then(d => { const arr = Array.isArray(d) ? d : []; setSeries(arr); homeCache.series = arr; homeCache.sort = sort; saveHomeCache(); })
      .catch(() => setSeries([]));
  }, [sort]);
  useEffect(() => {
    if (!q.trim()) { setResults(null); return; }
    const t = setTimeout(() => api.get(`/api/search?q=${encodeURIComponent(q)}`).then(setResults), 300);
    return () => clearTimeout(t);
  }, [q]);

  const surprise = async () => {
    const r = await api.get(`/api/random?type=${tab}`);
    if (r.id) go(tab === 'movies' ? 'movie' : 'series', r.id);
  };

  const seriesList = mergeSeriesByLang(series);
  const list = results ? (tab === 'movies' ? results.movies : results.series) : (tab === 'movies' ? movies : seriesList);

  const Card = ({ item, type }) => (
    <div className="card" onClick={() => go(type, item.id)}>
      <div className="poster">
        {coverUrl(item.cover_file_id)
          ? <img src={coverUrl(item.cover_file_id)} loading="lazy" alt="" />
          : <span className="noimg">{I.film(34)}</span>}
      </div>
      <div className="card-body">
        <h3>{item.title}</h3>
        <div className="card-meta">
          {item.year && <span>{item.year}</span>}
          {item.rating > 0 && <span className="rating">★ {item.rating}</span>}
          {type === 'series' && item.episode_count > 0 && <span className="badge">{item.episode_count} EP</span>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="page">
      <div className="hero">
        <Logo />
        <div className="tagline">Cinema</div>
      </div>
      <div className="search">
        <input value={q} onChange={e => setQ(e.target.value)} placeholder={t('search')} />
      </div>
      <div style={{display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 14}}>
        {Object.entries(LANGS).map(([code, label]) => (
          <button key={code} onClick={() => setLang(code)}
            style={{background: lang === code ? 'var(--gold)' : 'transparent', color: lang === code ? '#0a0a0a' : 'var(--muted)',
              border: '1px solid var(--border)', borderRadius: 16, padding: '5px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer'}}>
            {label}</button>
        ))}
      </div>
      <div className="tabs">
        <button className={`tab${tab === 'movies' ? ' active' : ''}`} onClick={() => setTab('movies')}>{I.film(16)} {t('films')}</button>
        <button className={`tab${tab === 'series' ? ' active' : ''}`} onClick={() => setTab('series')}>{I.tv(16)} {t('series')}</button>
      </div>
      <div style={{display: 'flex', gap: 8, marginBottom: 16}}>
        <button className={`tab${sort === 'new' ? ' active' : ''}`} style={{flex: 1}} onClick={() => setSort('new')}>{I.clock(16)} {t('newest')}</button>
        <button className={`tab${sort === 'rating' ? ' active' : ''}`} style={{flex: 1}} onClick={() => setSort('rating')}>{I.star(16)} {t('topRated')}</button>
        <button className="tab" style={{flex: 1}} onClick={surprise}>{I.shuffle(16)} {t('random')}</button>
      </div>
      {!Array.isArray(list) ? <SkelGrid />
      : list.length === 0 ? <div className="empty"><div className="big" style={{color: 'var(--muted)'}}>{I.film(44)}</div>{t('nothingFound')}</div>
      : <div className="grid">{list.map(i => <Card key={i.id} item={i} type={tab === 'movies' ? 'movie' : 'series'} />)}</div>}
    </div>
  );
}

// ── Age gate modal ──
function AgeGate({ onConfirm, onCancel }) {
  return (
    <div className="age-gate">
      <div className="age-card">
        <div className="n">18+</div>
        <h2>{t('ageTitle')}</h2>
        <p>{t('confirmAge')}</p>
        <button className="btn" style={{marginTop: 0}} onClick={onConfirm}>{t('iAmAdult')}</button>
        <button className="btn btn-ghost" onClick={onCancel}>{t('cancel')}</button>
      </div>
    </div>
  );
}

// ── In-app video player ──
function VideoPlayer({ fid, title, fileSize, mtMsgId, tgLink, onClose, introStart, introEnd, outroStart, outroEnd, onNext, viewKey }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [showOutro, setShowOutro] = useState(false);
  const videoRef = React.useRef(null);
  // Try to hide Telegram's native header while video is open
  React.useEffect(() => {
    try {
      if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.requestFullscreen) {
        window.Telegram.WebApp.requestFullscreen();
      }
    } catch {}
    return () => {
      try {
        if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.exitFullscreen) {
          window.Telegram.WebApp.exitFullscreen();
        }
      } catch {}
    };
  }, []);
  // Track time for skip buttons
  React.useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => {
      const t = v.currentTime;
      setShowIntro(introStart != null && introEnd != null && t >= introStart && t < introEnd);
      setShowOutro(outroStart != null && outroEnd != null && t >= outroStart && t < outroEnd);
    };
    v.addEventListener('timeupdate', onTime);
    return () => v.removeEventListener('timeupdate', onTime);
  }, [introStart, introEnd, outroStart, outroEnd]);
  const skipIntro = (e) => { e.stopPropagation(); if (videoRef.current) videoRef.current.currentTime = introEnd; };
  const skipOutro = (e) => { e.stopPropagation(); if (videoRef.current) videoRef.current.currentTime = outroEnd; };
  if (!fid && !tgLink) return null;
  const mtm = mtMsgId ? `&mtm=${mtMsgId}` : '';
  const tgl = tgLink ? `&tglink=${encodeURIComponent(tgLink)}` : '';
  const srcFid = fid || 'x';
  const goFullscreen = (e) => {
    e.stopPropagation();
    // Try real Fullscreen API first (hides status bar in Chrome)
    const container = e.currentTarget.parentElement;
    try {
      if (container && container.requestFullscreen) {
        container.requestFullscreen();
        return;
      } else if (container && container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
        return;
      }
    } catch {}
    // Fallback to CSS rotation (for Telegram WebView where API is blocked)
    setIsFullscreen(true);
  };
  const exitFullscreen = (e) => {
    if (e) e.stopPropagation();
    // Exit real fullscreen API if active
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen();
        return;
      } else if (document.webkitFullscreenElement && document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
        return;
      }
    } catch {}
    // Exit CSS fallback
    setIsFullscreen(false);
  };
  return (
    <div className="trailer-modal" onClick={onClose} style={isFullscreen ? {position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, background: '#000', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'} : {}}>
      <button className="trailer-close" onClick={onClose} style={isFullscreen ? {position: 'absolute', top: 10, left: 10, zIndex: 10000} : {}}>✕</button>
      <div style={isFullscreen ? {
        position: 'relative',
        width: '100vh',
        height: '100vw',
        transform: 'rotate(90deg)',
        transformOrigin: 'center center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      } : {position: 'relative', width: '100%'}} onClick={(e => e.stopPropagation())}>
        <video ref={videoRef} src={`/api/stream?fid=${encodeURIComponent(srcFid)}&sz=${fileSize || 0}${mtm}${tgl}`} controls autoPlay playsInline
          onPlay={() => { if (viewKey) beaconView(viewKey); }}
          style={isFullscreen ? {width: '100%', height: '100%', objectFit: 'contain', background: '#000'} : {width: '100%', display: 'block', background: '#000'}} />
        {showIntro && (
          <button onClick={skipIntro}
            style={{position: 'absolute', bottom: 60, right: 12, background: 'rgba(0,0,0,0.75)', border: '1px solid #d4af37',
              borderRadius: 8, color: '#fff', fontSize: 14, padding: '8px 14px', cursor: 'pointer', zIndex: 6}}>
            Skip Intro ⏭
          </button>
        )}
        {showOutro && (
          <button onClick={skipOutro}
            style={{position: 'absolute', bottom: 60, right: 12, background: 'rgba(0,0,0,0.75)', border: '1px solid #d4af37',
              borderRadius: 8, color: '#fff', fontSize: 14, padding: '8px 14px', cursor: 'pointer', zIndex: 6}}>
            Skip Outro ⏭
          </button>
        )}
        {onNext && (
          <button onClick={(e) => { e.stopPropagation(); onNext(); }}
            style={{position: 'absolute', bottom: 60, left: 12, background: 'rgba(0,0,0,0.75)', border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: 8, color: '#fff', fontSize: 14, padding: '8px 14px', cursor: 'pointer', zIndex: 6}}>
            Next Episode ▶
          </button>
        )}
        {!isFullscreen ? (
          <button onClick={goFullscreen} title="Fullscreen"
            style={{position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: 8, color: '#fff', fontSize: 20, padding: '6px 10px', cursor: 'pointer', zIndex: 5}}>
            ⛶
          </button>
        ) : (
          <button onClick={exitFullscreen} title="Exit fullscreen"
            style={{position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: 8, color: '#fff', fontSize: 20, padding: '6px 10px', cursor: 'pointer', zIndex: 5}}>
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

function VideoPage({ id, go, back }) {
  const [ep, setEp] = useState(null);
  const [series, setSeries] = useState(null);
  const [nextId, setNextId] = useState(null);
  const [prevId, setPrevId] = useState(null);
  const [qualities, setQualities] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [showLangs, setShowLangs] = useState([]);
  const [allEps, setAllEps] = useState(null);
  const [seasonTab, setSeasonTab] = useState(null);
  const [showIntro, setShowIntro] = useState(false);
  const [showOutro, setShowOutro] = useState(false);
  const [rotated, setRotated] = useState(false);
  const [fsActive, setFsActive] = useState(false);
  const [auto, setAutoState] = useState(function() { try { return localStorage.getItem('somon_auto') === '1'; } catch { return false; } });
  const [showUI, setShowUI] = useState(true);
  const videoRef = React.useRef(null);
  const containerRef = React.useRef(null);
  // Leaving the page must just leave: stop the video dead on exit.
  React.useEffect(() => () => { const v = videoRef.current; if (v) { try { v.pause(); v.removeAttribute('src'); v.load(); } catch (e) {} } }, []);
  const tapRef = React.useRef({ x: 0, y: 0, last: 0 });
  const hideTimer = React.useRef(null);
  const autoRef = React.useRef(false);
  const nextIdRef = React.useRef(null);
  autoRef.current = auto;
  nextIdRef.current = nextId;
  const toggleAuto = () => {
    const nv = !auto;
    setAutoState(nv);
    autoRef.current = nv;
    try { localStorage.setItem('somon_auto', nv ? '1' : '0'); } catch {}
    try { const cs = window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.CloudStorage; if (cs) cs.setItem('somon_auto', nv ? '1' : '0', function() {}); } catch {}
  };
  const scheduleHide = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      const v = videoRef.current;
      if (v && !v.paused) setShowUI(false);
    }, 3000);
  };
  const toggleUI = () => {
    const now = Date.now();
    if (now - tapRef.current.last < 500) return;
    tapRef.current.last = now;
    setShowUI(s => {
      const next = !s;
      if (next) scheduleHide();
      else if (hideTimer.current) clearTimeout(hideTimer.current);
      return next;
    });
  };
  useEffect(() => {
    api.get('/api/episode/' + id).then(function(d) {
      if (d.ok) {
        setEp(d.episode); setSeries(d.series); setNextId(d.next_episode_id || null); setPrevId(d.prev_episode_id || null);
        setQualities(d.qualities || []); setLanguages(d.languages || []); setShowLangs(d.show_languages || []);
        api.get('/api/series/' + d.episode.series_id).then(function(sd) { if (sd && sd.episodes) setAllEps(sd.episodes); }).catch(function() {});
      }
    }).catch(function() {});
  }, [id]);
  useEffect(() => {
    // Telegram top bar: hidden ONLY while the player is fullscreen (native FS
    // or the CSS-rotated fallback); visible on the rest of the video page and
    // everywhere else (his call 2026-10-20 — supersedes fullscreen-on-mount).
    const wa = window.Telegram && window.Telegram.WebApp;
    if (!wa) return;
    try {
      if (fsActive || rotated) { if (wa.requestFullscreen) wa.requestFullscreen(); }
      else if (wa.exitFullscreen) wa.exitFullscreen();
    } catch {}
  }, [fsActive, rotated]);
  useEffect(() => {
    return () => { try { const wa = window.Telegram && window.Telegram.WebApp; if (wa && wa.exitFullscreen) wa.exitFullscreen(); } catch {} };
  }, []);
  useEffect(() => {
    // Auto choice lives in Telegram CloudStorage too, so it survives fully
    // closing the app (localStorage alone can be cleared by the WebView).
    try {
      const cs = window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.CloudStorage;
      if (cs) cs.getItem('somon_auto', function(err, val) {
        if (!err && (val === '1' || val === '0')) {
          const on = val === '1';
          setAutoState(on);
          autoRef.current = on;
          try { localStorage.setItem('somon_auto', val); } catch {}
        }
      });
    } catch {}
  }, []);

  useEffect(() => {
    const onFsChange = () => {
      const fsEl = document.fullscreenElement || document.webkitFullscreenElement;
      // Native fullscreen button makes the VIDEO fullscreen — page buttons can't
      // overlay that. Hand fullscreen to the container instead (same fullscreen,
      // buttons can render), which is what our own ⛶ button does.
      if (fsEl && fsEl.tagName === 'VIDEO' && containerRef.current) {
        try {
          const p = containerRef.current.requestFullscreen && containerRef.current.requestFullscreen();
          if (p && p.catch) p.catch(function() {});
        } catch {}
        setFsActive(true);
        return;
      }
      setFsActive(!!fsEl);
    };
    document.addEventListener('fullscreenchange', onFsChange);
    document.addEventListener('webkitfullscreenchange', onFsChange);
    return () => { document.removeEventListener('fullscreenchange', onFsChange); document.removeEventListener('webkitfullscreenchange', onFsChange); };
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !ep) return;
    const onTime = () => {
      const t = v.currentTime;
      setShowIntro(ep.intro_start != null && ep.intro_end != null && t >= ep.intro_start && t < ep.intro_end);
      setShowOutro(ep.outro_start != null && ep.outro_end != null && t >= ep.outro_start && t < ep.outro_end);
      if (autoRef.current) {
        if (ep.intro_start != null && ep.intro_end != null && t >= ep.intro_start && t < ep.intro_end) { v.currentTime = ep.intro_end; return; }
        if (ep.outro_start != null && ep.outro_end != null && t >= ep.outro_start && t < ep.outro_end) { v.currentTime = ep.outro_end; return; }
      }
    };
    const onEnded = () => { if (autoRef.current && nextIdRef.current) go('video', nextIdRef.current); };
    v.addEventListener('ended', onEnded);
    v.addEventListener('timeupdate', onTime);
    v.addEventListener('loadedmetadata', onTime);
    v.addEventListener('play', onTime);
    const onPlayHide = () => scheduleHide();
    const onPauseHide = () => { if (hideTimer.current) clearTimeout(hideTimer.current); };
    v.addEventListener('play', onPlayHide);
    v.addEventListener('pause', onPauseHide);
    onTime();
    if (!v.paused) scheduleHide();
    return () => { v.removeEventListener('timeupdate', onTime); v.removeEventListener('loadedmetadata', onTime); v.removeEventListener('play', onTime); v.removeEventListener('play', onPlayHide); v.removeEventListener('pause', onPauseHide); v.removeEventListener('ended', onEnded); if (hideTimer.current) clearTimeout(hideTimer.current); };
  }, [ep]);
  if (!ep) return React.createElement('div', {className: 'page', style: {background: '#000', minHeight: '100vh'}}, React.createElement('div', {className: 'skel', style: {height: 300}}));
  const mtm = ep.mt_msg_id ? ('&mtm=' + ep.mt_msg_id) : '';
  const tgl = ep.tg_link ? ('&tglink=' + encodeURIComponent(ep.tg_link)) : '';
  const srcFid = ep.file_id || 'x';
  const title = ep.title || ('Episode ' + ep.episode_number);
  const doFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    try {
      if (document.fullscreenElement) { document.exitFullscreen(); return; }
      if (rotated) { setRotated(false); return; }
      if (el.requestFullscreen) { el.requestFullscreen().catch(() => setRotated(true)); return; }
      if (el.webkitRequestFullscreen) { try { el.webkitRequestFullscreen(); } catch { setRotated(true); } return; }
      const v = videoRef.current;
      if (v && v.webkitEnterFullscreen) { v.webkitEnterFullscreen(); return; }
    } catch {}
    setRotated(true);
  };
  const btnStyle = {background: 'rgba(25,25,25,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 14, fontWeight: 600, padding: '14px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flex: 1};
  const btnOffStyle = {background: 'rgba(15,15,15,0.6)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 12, color: 'rgba(255,255,255,0.3)', fontSize: 14, fontWeight: 600, padding: '14px 8px', cursor: 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flex: 1};
  const autoOnStyle = {background: '#e8b33c', border: '1px solid #e8b33c', borderRadius: 12, color: '#000', fontSize: 14, fontWeight: 700, padding: '14px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flex: 1};
  var btns = [];
  if (prevId) btns.push(React.createElement('button', {key: 'p', style: {...btnStyle}, onTouchEnd: function(e) { e.stopPropagation(); }, onClick: function(e) { e.stopPropagation(); go('video', prevId); }}, '‹ ≣ Previous'));
  btns.push(React.createElement('button', {key: 'i', style: {...(showIntro ? btnStyle : btnOffStyle)}, disabled: !showIntro, onTouchEnd: function(e) { e.stopPropagation(); }, onClick: function(e) { e.stopPropagation(); if (showIntro && videoRef.current) videoRef.current.currentTime = ep.intro_end; }}, '⏮ Skip Intro'));
  btns.push(React.createElement('button', {key: 'a', style: {...(auto ? autoOnStyle : btnStyle)}, onTouchEnd: function(e) { e.stopPropagation(); }, onClick: function(e) { e.stopPropagation(); toggleAuto(); }}, 'Auto' + (auto ? ' ✓' : '')));
  btns.push(React.createElement('button', {key: 'o', style: {...(showOutro ? btnStyle : btnOffStyle)}, disabled: !showOutro, onTouchEnd: function(e) { e.stopPropagation(); }, onClick: function(e) { e.stopPropagation(); if (showOutro && videoRef.current) videoRef.current.currentTime = ep.outro_end; }}, '⏭ Skip Outro'));
  if (nextId) btns.push(React.createElement('button', {key: 'n', style: {...btnStyle}, onTouchEnd: function(e) { e.stopPropagation(); }, onClick: function(e) { e.stopPropagation(); go('video', nextId); }}, '≣▶ Next ›'));
  // Fullscreen overlay buttons: vertical stack on the right (matches reference)
  var fsBtns = [];
  fsBtns.push(React.createElement('button', {key: 'fi', style: showIntro ? {...btnStyle, flex: 'none'} : {...btnOffStyle, flex: 'none'}, disabled: !showIntro, onTouchEnd: function(e) { e.stopPropagation(); }, onClick: function(e) { e.stopPropagation(); if (showIntro && videoRef.current) videoRef.current.currentTime = ep.intro_end; }}, '⏮ Skip Intro'));
  fsBtns.push(React.createElement('button', {key: 'fa', style: auto ? {...autoOnStyle, flex: 'none'} : {...btnStyle, flex: 'none'}, onTouchEnd: function(e) { e.stopPropagation(); }, onClick: function(e) { e.stopPropagation(); toggleAuto(); }}, 'Auto' + (auto ? ' ✓' : '')));
  fsBtns.push(React.createElement('button', {key: 'fo', style: showOutro ? {...btnStyle, flex: 'none'} : {...btnOffStyle, flex: 'none'}, disabled: !showOutro, onTouchEnd: function(e) { e.stopPropagation(); }, onClick: function(e) { e.stopPropagation(); if (showOutro && videoRef.current) videoRef.current.currentTime = ep.outro_end; }}, '⏭ Skip Outro'));
  if (nextId) fsBtns.push(React.createElement('button', {key: 'fn', style: {...btnStyle, flex: 'none'}, onTouchEnd: function(e) { e.stopPropagation(); }, onClick: function(e) { e.stopPropagation(); go('video', nextId); }}, '≣▶ Next Episode ›'));
  var fsStack = React.createElement('div', {style: {position: 'absolute', right: 24, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 10, pointerEvents: showUI ? 'auto' : 'none', width: 210}}, fsBtns);
  var prevStack = prevId ? React.createElement('div', {style: {position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 10, pointerEvents: showUI ? 'auto' : 'none', width: 210}}, React.createElement('button', {style: {...btnStyle, flex: 'none'}, onTouchEnd: function(e) { e.stopPropagation(); }, onClick: function(e) { e.stopPropagation(); go('video', prevId); }}, '‹ ≣ Previous Episode')) : null;
  var fsOverlay = null;
  if ((rotated || fsActive) && (fsBtns.length || prevId)) {
    fsOverlay = rotated
      ? React.createElement('div', {style: {position: 'absolute', top: '50%', left: '50%', width: '100vh', height: '100vw', transform: 'translate(-50%, -50%) rotate(90deg)', transformOrigin: 'center center', pointerEvents: 'none', zIndex: 6, opacity: showUI ? 1 : 0, transition: 'opacity 0.25s'}}, prevStack, fsStack)
      : React.createElement('div', {style: {position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 6, opacity: showUI ? 1 : 0, transition: 'opacity 0.25s'}}, prevStack, fsStack);
  }
  // ── Page sections under the video: studio, language, quality, episodes ──
  const pillStyle = {background: 'rgba(25,25,25,0.95)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 999, color: '#fff', fontSize: 13, fontWeight: 600, padding: '8px 14px', cursor: 'pointer'};
  const pillOnStyle = {...pillStyle, background: '#e8b33c', border: '1px solid #e8b33c', color: '#000'};
  const secLabelStyle = {color: 'var(--muted)', fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', margin: '16px 0 8px'};
  const epBtnStyle = {minWidth: 52, height: 44, padding: '0 10px', borderRadius: 10, background: 'rgba(25,25,25,0.95)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer'};
  const epBtnOnStyle = {...epBtnStyle, background: '#e8b33c', border: '1px solid #e8b33c', color: '#000'};
  var sections = [];
  var epGroupId = ep.id;
  (allEps || []).forEach(function(e) { if ((e.season || 1) === (ep.season || 1) && e.episode_number === ep.episode_number && e.id < epGroupId) epGroupId = e.id; });
  sections.push(React.createElement('div', {key: 'comments', style: {padding: '0 16px'}},
    React.createElement(CommentsBtn, {itemKey: 'ep:' + epGroupId, go: go}),
    React.createElement(LikeBtn, {itemKey: 'ep:' + epGroupId, go: go}),
    React.createElement(ViewersBtn, {itemKey: 'ep:' + epGroupId, go: go})));
  // Studios: the same episode dubbed by different studios. The buttons carry
  // the studio names — tap one to watch that studio's voice of this episode.
  const epStudio = ep.studio || '';
  const studioMap = {};
  qualities.forEach(function(q) {
    const st = q.studio || '';
    if (!studioMap[st] || q.quality === ep.quality) studioMap[st] = q;
  });
  const studioList = Object.keys(studioMap).map(function(k) { return { studio: k, id: studioMap[k].id }; });
  if (studioList.length > 1) sections.push(React.createElement('div', {key: 'studios', style: {padding: '0 16px'}},
    React.createElement('div', {style: secLabelStyle}, 'Studio'),
    React.createElement('div', {style: {display: 'flex', gap: 8, flexWrap: 'wrap'}},
      studioList.map(function(S) { return React.createElement('button', {key: S.studio || 'default', style: S.studio === epStudio ? pillOnStyle : pillStyle, onClick: function() { go('video', S.id); }}, S.studio || 'Default'); }))));
  // Languages: the show's language versions (code name link) as a picker bar.
  // Jumps to the same episode in that version, or to that version's page when
  // it doesn't have this episode yet.
  if (showLangs.length > 1) sections.push(React.createElement('div', {key: 'lang', style: {padding: '0 16px'}},
    React.createElement('div', {style: secLabelStyle}, 'Language'),
    React.createElement(LanguageBar, {options: showLangs.map(function(L) { return {id: L.series_id, label: L.language}; }), currentId: ep.series_id, onPick: function(sid) {
      const target = showLangs.find(function(L) { return L.series_id === sid; });
      if (target && target.episode_id) go('video', target.episode_id); else go('series', sid);
    }})));
  const studioQualities = qualities.filter(function(q) { return (q.studio || '') === epStudio; });
  if (studioQualities.length > 1) sections.push(React.createElement('div', {key: 'qual', style: {padding: '0 16px'}},
    React.createElement('div', {style: secLabelStyle}, 'Quality'),
    React.createElement('div', {style: {display: 'flex', gap: 8, flexWrap: 'wrap'}},
      studioQualities.map(function(q) { return React.createElement('button', {key: q.id, style: q.id === ep.id ? pillOnStyle : pillStyle, onClick: function() { go('video', q.id); }}, q.quality); }))));
  if (allEps) {
    const langEps = allEps;
    const seasonNums = Array.from(new Set(langEps.map(function(e) { return e.season || 1; }))).sort(function(a, b) { return a - b; });
    const curSeason = seasonTab != null ? seasonTab : ep.season;
    const byNum = {};
    langEps.filter(function(e) { return (e.season || 1) === curSeason; }).forEach(function(e) {
      const cur = byNum[e.episode_number];
      const score = function(x) { return ((x.studio || '') === epStudio ? 2 : 0) + (x.quality === ep.quality ? 1 : 0); };
      if (!cur || score(e) > score(cur)) byNum[e.episode_number] = e;
    });
    const seasonEps = Object.values(byNum).sort(function(a, b) { return a.episode_number - b.episode_number; });
    var epChildren = [React.createElement('div', {key: 'h', style: secLabelStyle}, 'Episodes')];
    if (seasonNums.length > 1) epChildren.push(React.createElement('div', {key: 'seasons', style: {display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10}},
      seasonNums.map(function(n) { return React.createElement('button', {key: n, style: n === curSeason ? pillOnStyle : pillStyle, onClick: function() { setSeasonTab(n); }}, 'Season ' + n); })));
    epChildren.push(React.createElement('div', {key: 'grid', style: {display: 'flex', gap: 8, flexWrap: 'wrap'}},
      seasonEps.map(function(e) { return React.createElement('button', {key: e.id, style: (e.episode_number === ep.episode_number && curSeason === ep.season) ? epBtnOnStyle : epBtnStyle, onClick: function() { go('video', e.id); }}, e.episode_number); })));
    sections.push(React.createElement('div', {key: 'eps', style: {padding: '0 16px 24px'}}, epChildren));
  }
  return React.createElement('div', {style: {background: '#000', minHeight: '100vh', display: 'flex', flexDirection: 'column'}},
    React.createElement('div', {style: {display: 'flex', alignItems: 'center', padding: '10px 6px'}},
      React.createElement('button', {className: 'back-btn', onClick: back, style: {margin: 0}}, '‹ ' + t('back')),
      React.createElement('div', {style: {flex: 1, textAlign: 'center', color: '#fff', fontWeight: 600, fontSize: 15, paddingRight: 40}}, title)
    ),
    React.createElement('div', {ref: containerRef,
      onClick: function() { toggleUI(); },
      onTouchStart: function(e) { const t = e.touches && e.touches[0]; if (t) { tapRef.current.x = t.clientX; tapRef.current.y = t.clientY; } if (showUI) scheduleHide(); },
      onTouchEnd: function(e) { const t = e.changedTouches && e.changedTouches[0]; if (t && Math.abs(t.clientX - tapRef.current.x) < 12 && Math.abs(t.clientY - tapRef.current.y) < 12) toggleUI(); },
      style: rotated ? {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, background: '#000',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      } : fsActive ? {position: 'relative', width: '100%', height: '100%', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center'} : {position: 'relative', width: '100%', background: '#000'}},
      React.createElement('video', {ref: videoRef, src: '/api/stream?fid=' + encodeURIComponent(srcFid) + '&sz=' + (ep.file_size || 0) + mtm + tgl, controls: true, autoPlay: true, playsInline: true, onPlay: function() { beaconView('ep:' + ep.id); }, style: rotated ? {
          width: '100vh', height: '100vw', transform: 'rotate(90deg)', transformOrigin: 'center center', objectFit: 'contain', background: '#000'
        } : fsActive ? {width: '100%', height: '100%', objectFit: 'contain', background: '#000'} : {width: '100%', background: '#000', display: 'block'}}),
      React.createElement('button', {onTouchEnd: function(e) { e.stopPropagation(); }, onClick: function(e) { e.stopPropagation(); doFullscreen(); }, title: 'Fullscreen', style: {position: 'absolute', right: 8, top: (rotated || fsActive) ? 'auto' : 8, bottom: (rotated || fsActive) ? 8 : 'auto', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 8, color: '#fff', fontSize: 18, padding: '6px 10px', cursor: 'pointer', zIndex: 7, opacity: ((!rotated && !fsActive) || showUI) ? 1 : 0, pointerEvents: ((!rotated && !fsActive) || showUI) ? 'auto' : 'none', transition: 'opacity 0.25s'}}, rotated || fsActive ? '✕' : '⛶'),
      fsOverlay
    ),
    btns.length ? React.createElement('div', {style: {display: 'flex', gap: 8, padding: '12px 10px 4px'}}, btns) : null,
    series ? React.createElement('div', {style: {color: 'var(--muted)', fontSize: 13, padding: '8px 16px'}}, series.title + ' — Ep ' + ep.episode_number) : null,
    sections
  );
}

// ── Typed content deep links (his link system) ────────────────────────────
// {lang3}_show_{id} / _s{season} / _s{season}_e{ep} / _trailer for shows,
// {lang3}_movie_{id} / _trailer for movies, plus the legacy s_/m_/e_ app
// links. They arrive via ?startapp= (bot button or direct link) or via
// Telegram's start_param, and open exactly that content.
const _PREFIX_BY_LANG = { en: 'eng', ru: 'rus', tj: 'tjk', fa: 'fas', uz: 'uzb', tr: 'tur', ar: 'ara', de: 'deu', fr: 'fra', es: 'spa', it: 'ita', pt: 'por', ja: 'jpn', ko: 'kor', uk: 'ukr', pl: 'pol', nl: 'nld', sv: 'swe', no: 'nor' };
function langPrefixOf(language) {
  const c = canonLang(language || '');
  return _PREFIX_BY_LANG[c] || 'eng';
}
function parseDeepLink(raw) {
  if (!raw) return null;
  const p = String(raw).trim();
  let m;
  if ((m = p.match(/^e_(\d+)$/))) return { view: 'episode', id: +m[1] };
  if ((m = p.match(/^tsreel_(tg|ig)(\d+)$/))) return { view: 'reel', itemKey: m[1] + ':' + m[2] };
  if ((m = p.match(/^m_(\d+)$/))) return { view: 'movie', id: +m[1] };
  if ((m = p.match(/^s_(\d+)(?:_s(\d+)(?:_e(\d+))?)?$/))) return { view: 'series', id: +m[1], season: m[2] ? +m[2] : null, episode: m[3] ? +m[3] : null };
  if ((m = p.match(/^[a-z]{3}_movie_(\d+)(_trailer)?$/))) return { view: 'movie', id: +m[1], trailer: !!m[2] };
  if ((m = p.match(/^[a-z]{3}_show_(\d+)(?:_s(\d+)(?:_e(\d+)|_trailer)?|_trailer)?$/))) return { view: 'series', id: +m[1], season: m[2] ? +m[2] : null, episode: m[3] ? +m[3] : null, trailer: /_trailer$/.test(p) };
  return null;
}
function startParam() {
  try {
    const q = new URLSearchParams(location.search);
    return q.get('startapp') || q.get('start_param') || q.get('tgWebAppStartParam') || (tg && tg.initDataUnsafe && tg.initDataUnsafe.start_param) || null;
  } catch (e) { return null; }
}

function ShareBtn({ title, deep }) {
  const share = () => {
    const url = `https://t.me/Hsshsgsgsbzvbot?start=${deep}`;
    const text = `🎬 ${title}`;
    if (tg) tg.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`);
    else if (navigator.share) navigator.share({ title, text, url }).catch(() => {});
    else window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
  };
  return <button className="btn btn-ghost" onClick={share}>{I.link(16)} {t('share')}</button>;
}

// ── Movie detail ──
function MovieDetail({ id, go, back }) {
  const [m, setM] = useState(null);
  const [quality, setQuality] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [ageOk, setAgeOk] = useState(false);
  const [playing, setPlaying] = useState(false);
  useEffect(() => { api.get(`/api/movie/${id}`).then(d => { setM(d); if (d.files?.length) setQuality(d.files[d.files.length - 1].quality); if (window.__somonTrailerFor === +id) { window.__somonTrailerFor = null; if (d.trailer_file_id) setShowTrailer(true); } }); }, [id]);
  if (!m) return <div className="page"><div className="backdrop" /><div className="detail-body"><div className="skel" style={{height: 200}} /></div></div>;
  const needsAge = m.age_rating >= 18 && !ageOk;
  return (
    <div className="page">
      <button className="back-btn over-hero" onClick={back}>‹ {t('back')}</button>
      <div className="backdrop">
        {coverUrl(m.cover_file_id) ? <img src={coverUrl(m.cover_file_id)} alt="" /> : <div className="empty"><div className="big">{I.film(40)}</div></div>}
      </div>
      <div className="detail-body">
        <h1>{m.title}</h1>
        <div className="detail-meta">
          {m.year && <span className="pill">{m.year}</span>}
          {m.rating > 0 && <span className="pill gold">★ {m.rating}</span>}
          {m.language && <span className="pill">{m.language}</span>}
          {m.age_rating > 0 && <span className="pill">{m.age_rating}+</span>}
        </div>
        {m.synopsis && <p className="synopsis">{m.synopsis}</p>}
        {trailerUrl(m.trailer_file_id) && (
          <div>
            {!showTrailer
              ? <button className="btn btn-ghost" onClick={() => setShowTrailer(true)}>{I.play(14)} {t('trailer')}</button>
              : <div className="video-wrap" style={{borderRadius: 14, overflow: 'hidden', marginTop: 12}}>
                  <video src={trailerUrl(m.trailer_file_id)} controls playsInline style={{width: '100%', display: 'block'}} />
                </div>}
          </div>
        )}
        {m.files?.length > 0 && (
          <div>
            <div className="section-title">{t('quality')}</div>
            <div className="quality-row">
              {m.files.map(f => (
                <button key={f.quality} className={`q${quality === f.quality ? ' active' : ''}`}
                  onClick={() => setQuality(f.quality)}>{f.quality}</button>
              ))}
            </div>
            <a className="btn" style={{textDecoration: 'none', textAlign: 'center', display: 'block'}}
              href={`/api/download?fid=${encodeURIComponent(m.files.find(f => f.quality === quality)?.file_id || '')}&name=${encodeURIComponent(m.title + '_' + quality)}`}>
              {I.download(16)} {t('download')} — {quality}
            </a>
            <button className="btn" style={{marginTop: 10}}
              onClick={() => { if (m.age_rating >= 18 && !ageOk) { setAgeOk('pending'); return; } setPlaying(true); }}>
              {I.play(14)} {t('watch')} — {quality}
            </button>
          </div>
        )}
        {needsAge
          ? <button className="btn" onClick={() => setAgeOk('pending')}>{m.age_rating}+</button>
          : <button className="btn" onClick={() => botLink(`m_${m.id}`)}>{I.send(16)} {t('getViaBot')}</button>}
        <ShareBtn title={m.title} deep={`${langPrefixOf(m.language)}_movie_${m.id}`} />
        <CommentsBtn itemKey={'mv:' + m.id} go={go} />
        <LikeBtn itemKey={'mv:' + m.id} go={go} />
        <ViewersBtn itemKey={'mv:' + m.id} go={go} />
      </div>
      {playing && <VideoPlayer fid={m.files.find(f => f.quality === quality)?.file_id} fileSize={m.files.find(f => f.quality === quality)?.file_size} mtMsgId={m.files.find(f => f.quality === quality)?.mt_msg_id} title={`${m.title} — ${quality}`} onClose={() => setPlaying(false)} />}
      {ageOk === 'pending' && <AgeGate onConfirm={() => setAgeOk(true)} onCancel={() => setAgeOk(false)} />}
    </div>
  );
}

// ── Series detail ──
// Language picker: a single bar showing the current language. Tap it and it
// opens the list of available languages, with a field to type and filter.
function LanguageBar({ options, currentId, onPick }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const cur = options.find(o => o.id === currentId) || options[0];
  const filtered = query.trim() ? options.filter(o => langTextMatches(o.label, query)) : options;
  return (
    <div>
      <div onClick={() => setOpen(!open)} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 10, cursor: 'pointer', color: '#fff', fontSize: 15}}>
        <span>{cur ? cur.label : ''}</span>
        <span style={{color: 'var(--gold)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s'}}>▾</span>
      </div>
      {open && (
        <div style={{marginTop: 8, border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, overflow: 'hidden', background: 'rgba(20,20,20,0.98)'}}>
          <input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="Type language…"
            style={{width: '100%', padding: '11px 14px', background: 'rgba(255,255,255,0.05)', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box'}} />
          <div style={{maxHeight: 220, overflowY: 'auto'}}>
            {filtered.map(o => (
              <div key={o.id} onClick={() => { setOpen(false); setQuery(''); if (o.id !== currentId) onPick(o.id); }}
                style={{padding: '11px 14px', cursor: 'pointer', color: o.id === currentId ? 'var(--gold)' : '#fff', fontSize: 15, display: 'flex', justifyContent: 'space-between'}}>
                <span>{o.label}</span>{o.id === currentId ? <span>✓</span> : null}
              </div>
            ))}
            {filtered.length === 0 && <div style={{padding: '11px 14px', color: 'var(--muted)', fontSize: 14}}>—</div>}
          </div>
        </div>
      )}
    </div>
  );
}

// Typeable language field for forms: type in any script/spelling and the
// matching languages appear as suggestions; free text is also allowed.
const LANG_OPTIONS = ['Тоҷикӣ','Русский','English','فارسی',"O'zbekcha",'Қазақша','Кыргызча','Türkçe','العربية','Հայերեն','ქართული','Azərbaycan','Українська','हिन्दी','日本語','한국어','中文','Español','Français','Deutsch','Italiano','Português','اردو','پښتو','বাংলা','Bahasa Indonesia'];
function LangInput({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const filtered = LANG_OPTIONS.filter(l => langTextMatches(l, value));
  return (
    <div style={{position: 'relative'}}>
      <input value={value || ''} placeholder="Тоҷикӣ"
        onChange={e => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)} />
      {open && filtered.length > 0 && (
        <div style={{position: 'absolute', left: 0, right: 0, top: '100%', marginTop: 4, zIndex: 30, maxHeight: 200, overflowY: 'auto', background: 'rgba(20,20,20,0.98)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 10}}>
          {filtered.map(l => (
            <div key={l} onMouseDown={e => { e.preventDefault(); onChange(l); setOpen(false); }} style={{padding: '10px 12px', cursor: 'pointer', color: '#fff', fontSize: 15}}>{l}</div>
          ))}
        </div>
      )}
    </div>
  );
}

function SeriesDetail({ id, go, back }) {
  const [s, setS] = useState(null);
  const [ageOk, setAgeOk] = useState(false);
  const [season, setSeason] = useState(null);
  const [playing, setPlaying] = useState(null);
  const [selQ, setSelQ] = useState({});
  useEffect(() => { api.get(`/api/series/${id}`).then(setS); }, [id]);
  useEffect(() => {
    // A season deep link (…_show_{id}_s{n}) preselects that season.
    if (window.__somonSeasonFor && window.__somonSeasonFor.id === +id) { setSeason(window.__somonSeasonFor.season); window.__somonSeasonFor = null; }
  }, [id]);
  if (!s) return <div className="page"><div className="backdrop" /><div className="detail-body"><div className="skel" style={{height: 200}} /></div></div>;
  const seasons = [...new Set((s.episodes || []).map(e => e.season))].sort((a, b) => a - b);
  // Episode count = distinct episodes; quality/studio versions of the same
  // episode are still one episode (his rule, 2026-10-21).
  const epCount = new Set((s.episodes || []).map(e => (e.season || 1) + ':' + e.episode_number)).size;
  const curSeason = season === null ? seasons[0] : season;
  const eps = (s.episodes || []).filter(e => e.season === curSeason);
  const needsAge = s.age_rating >= 18 && !ageOk;
  const openEp = (e) => {
    if (needsAge) { setAgeOk('pending'); return; }
    go('episode', e.id);
  };
  return (
    <div className="page">
      <button className="back-btn over-hero" onClick={back}>‹ {t('back')}</button>
      <div className="backdrop">
        {coverUrl(s.cover_file_id) ? <img src={coverUrl(s.cover_file_id)} alt="" /> : <div className="empty"><div className="big">{I.tv(40)}</div></div>}
      </div>
      <div className="detail-body">
        {s.logo_file_id && coverUrl(s.logo_file_id)
          ? <img src={coverUrl(s.logo_file_id)} alt={s.title} style={{maxWidth: '100%', height: 'auto', display: 'block', marginBottom: 12, mixBlendMode: 'screen'}} />
          : <h1>{s.title}</h1>}
        <div className="detail-meta">
          {s.year && <span className="pill">{s.year}</span>}
          {s.rating > 0 && <span className="pill">★ {s.rating}</span>}
          {s.age_rating > 0 && <span className="pill">{s.age_rating}+</span>}
          {s.total_views > 0 && <span className="pill">👁 {s.total_views}</span>}
          <span className="pill">{epCount} {t('episodesShort') || t('episodes')}</span>
        </div>
        {s.synopsis && <p className="synopsis">{s.synopsis}</p>}
        {s.lang_versions && s.lang_versions.length > 1 && (
          <div>
            <div className="section-title">{t('langName')}</div>
            <LanguageBar options={s.lang_versions.map(v => ({ id: v.id, label: v.language || v.title }))} currentId={s.id} onPick={(vid) => go('series', vid)} />
          </div>
        )}
        {seasons.length > 1 && (
          <div>
            <div className="section-title">{lang === 'tj' ? 'Фаслҳо' : t('season')}</div>
            <div className="quality-row">
              {seasons.map(n => (
                <button key={n} className={`q${curSeason === n ? ' active' : ''}`} onClick={() => setSeason(n)}>{lang === 'tj' ? 'Фасли ' + n : t('season') + ' ' + n}</button>
              ))}
            </div>
          </div>
        )}
        <div className="section-title">{t('episodes')}</div>
        {(() => {
          // Group by episode_number so qualities show as options, not separate rows
          const groups = {};
          eps.forEach(e => {
            const k = `${e.season}_${e.episode_number}`;
            if (!groups[k]) groups[k] = [];
            groups[k].push(e);
          });
          return Object.values(groups).map(g => {
            const first = g[0];
            const sel = selQ[first.episode_number] || g[0].id;
            const cur = g.find(x => x.id === sel) || g[0];
            const gViews = g.reduce((a, x) => a + (x.views || 0), 0);
            return (
              <div key={`${first.season}_${first.episode_number}`} className="ep-row" onClick={() => openEp(cur)} style={{cursor: 'pointer', flexDirection: 'column', alignItems: 'stretch'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                  <div className="ep-num">{first.episode_number}</div>
                  <div className="ep-info" style={{flex: 1}}>
                    <div className="t">{t('episode')} {first.episode_number}</div>
                    <div className="s">{fmtSize(cur.file_size)}{gViews > 0 ? ` • 👁 ${gViews}` : ''}</div>
                  </div>
                  <a className="ep-dl" href={`/api/download?fid=${encodeURIComponent(cur.file_id || '')}&name=${encodeURIComponent(s.title + '_E' + first.episode_number)}`}
                    onClick={ev => ev.stopPropagation()}>{I.download(15)}</a>
                  <div className="ep-go" onClick={() => openEp(cur)}>{I.chevR(20)}</div>
                </div>
                {g.length > 1 && (
                  <div style={{display: 'flex', gap: 6, marginTop: 8, paddingLeft: 48}}>
                    {g.map(q => (
                      <button key={q.id} onClick={(e) => { e.stopPropagation(); setSelQ(prev => ({...prev, [first.episode_number]: q.id})); }}
                        style={{
                          padding: '4px 12px', borderRadius: 6, fontSize: 12, cursor: 'pointer',
                          background: q.id === sel ? 'var(--gold)' : 'rgba(255,255,255,0.1)',
                          color: q.id === sel ? '#000' : '#fff',
                          border: '1px solid ' + (q.id === sel ? 'var(--gold)' : 'rgba(255,255,255,0.2)')
                        }}>
                        {q.quality || 'HD'}{(q.views > 0) ? ' 👁' + q.views : ''}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          });
        })()}
        <ShareBtn title={s.title} deep={`${langPrefixOf(s.language)}_show_${s.id}`} />
      </div>
      {playing && <VideoPlayer fid={playing.file_id} fileSize={playing.file_size} mtMsgId={playing.mt_msg_id} tgLink={playing.tg_link} title={`${s.title} — ${t('episode')} ${playing.episode_number}`} viewKey={'ep:' + playing.id} onClose={() => setPlaying(null)} />}
      {ageOk === 'pending' && <AgeGate onConfirm={() => setAgeOk(true)} onCancel={() => setAgeOk(false)} />}
    </div>
  );
}

function EpisodeDetail({ id, go, back }) {
  const [ep, setEp] = useState(null);
  const [series, setSeries] = useState(null);
  const [qualities, setQualities] = useState([]);
  const [nextEpId, setNextEpId] = useState(null);
  const [selQ, setSelQ] = useState(null);
  const [sending, setSending] = useState(false);
  const [playing, setPlaying] = useState(null);
  useEffect(() => {
    api.get('/api/episode/' + id).then(function(d) {
      if (d.ok) {
        setEp(d.episode);
        setSeries(d.series);
        setQualities(d.qualities || []);
        setNextEpId(d.next_episode_id || null);
        setSelQ(d.episode.id);
      }
    }).catch(function() {});
  }, [id]);
  if (!ep) {
    return React.createElement('div', {className: 'page'},
      React.createElement('div', {className: 'detail-body'},
        React.createElement('div', {className: 'skel', style: {height: 200}})
      )
    );
  }
  var cur = ep;
  var groupId = ep.id;
  for (var i = 0; i < qualities.length; i++) {
    if (qualities[i].id === selQ) cur = qualities[i];
    if (qualities[i].id < groupId) groupId = qualities[i].id;
  }
  var displayTitle = ep.title || ('Episode ' + ep.episode_number);
  var doSend = function() {
    setSending(true);
    fetch('/api/send-episode', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({episode_id: cur.id, telegram_id: (tg && tg.initDataUnsafe && tg.initDataUnsafe.user && tg.initDataUnsafe.user.id) || ''})
    }).then(function(r) { return r.json(); }).then(function(r) {
      setSending(false);
      alert(r.ok ? 'Sent! Check the bot.' : ('Error: ' + (r.error || 'failed')));
    }).catch(function() { setSending(false); alert('Network error'); });
  };
  var coverImg = null;
  if (ep.cover_file_id && coverUrl(ep.cover_file_id)) {
    coverImg = React.createElement('img', {src: coverUrl(ep.cover_file_id), alt: ''});
  } else if (series && series.cover_file_id && coverUrl(series.cover_file_id)) {
    coverImg = React.createElement('img', {src: coverUrl(series.cover_file_id), alt: '', style: {opacity: 0.4}});
  } else {
    coverImg = React.createElement('div', {className: 'empty'}, React.createElement('div', {className: 'big'}, I.tv(40)));
  }
  var qButtons = qualities.map(function(q) {
    return React.createElement('button', {
      key: q.id,
      className: 'q' + (q.id === selQ ? ' active' : ''),
      onClick: function() { setSelQ(q.id); }
    }, q.quality || 'HD');
  });
  return React.createElement('div', {className: 'page'},
    React.createElement('button', {className: 'back-btn', onClick: back}, '‹ ' + t('back')),
    React.createElement('div', {className: 'backdrop', style: {aspectRatio: '16/9', height: 'auto'}}, coverImg),
    React.createElement('div', {className: 'detail-body'},
      React.createElement('h1', null, displayTitle),
      series ? React.createElement('div', {style: {color: 'var(--muted)', fontSize: 13, marginBottom: 8}}, series.title + ' — Ep ' + ep.episode_number) : null,
      ep.studio ? React.createElement('div', {style: {color: 'var(--gold-light)', fontSize: 13, marginBottom: 8}}, ep.studio) : null,
      ep.description ? React.createElement('p', {className: 'synopsis'}, ep.description) : null,
      qualities.length > 1 ? React.createElement('div', null,
        React.createElement('div', {className: 'section-title'}, 'Quality'),
        React.createElement('div', {className: 'quality-row'}, qButtons)
      ) : null,
      React.createElement('div', {style: {display: 'flex', gap: 10, marginTop: 16}},
        React.createElement('button', {className: 'btn', style: {flex: 1}, onClick: function() { go('video', cur.id); }}, I.play(14), ' Watch'),
        React.createElement('button', {className: 'btn', style: {flex: 1}, onClick: doSend, disabled: sending}, sending ? '…' : <span style={{display: 'inline-flex', alignItems: 'center', gap: 6}}>{I.send(14)} Send via Bot</span>)
      ),
      React.createElement(ShareBtn, {title: displayTitle, deep: langPrefixOf(ep.language || (series && series.language) || '') + '_show_' + ep.series_id + '_s' + (ep.season || 1) + '_e' + ep.episode_number}),
      React.createElement(CommentsBtn, {itemKey: 'ep:' + groupId, go: go}),
      React.createElement(LikeBtn, {itemKey: 'ep:' + groupId, go: go}),
      React.createElement(ViewersBtn, {itemKey: 'ep:' + groupId, go: go})
    ),
    playing ? React.createElement(VideoPlayer, {
      fid: playing.file_id, fileSize: playing.file_size, mtMsgId: playing.mt_msg_id, tgLink: playing.tg_link, title: displayTitle,
      introStart: ep.intro_start, introEnd: ep.intro_end, outroStart: ep.outro_start, outroEnd: ep.outro_end,
      onNext: nextEpId ? function() { setPlaying(null); go('episode', nextEpId); } : null,
      onClose: function() { setPlaying(null); }
    }) : null
  );
}

// ── MTProto video picker: pick a video from the bot chat, link its msgId ──
function MtVideoPicker({ onPick, onClose }) {
  const [videos, setVideos] = useState(null);
  const [err, setErr] = useState('');
  const tgId = tg?.initDataUnsafe?.user?.id || '';
  useEffect(() => {
    fetch('/api/admin/mtproto/bot-videos?limit=20', { headers: { 'x-telegram-id': tgId } })
      .then(r => r.json())
      .then(d => {
        if (d.ok) setVideos(d.videos);
        else setErr(d.error === 'not logged in' ? 'Log in via Telegram Login first' : (d.error || 'failed'));
      })
      .catch(() => setErr('❌ Network error'));
  }, []);
  const fmtDate = (iso) => { try { return new Date(iso).toLocaleString(); } catch { return iso || ''; } };
  const fmtDur = (s) => { s = Math.round(s || 0); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
  return (
    <div className="trailer-modal" onClick={onClose} style={{zIndex: 300}}>
      <div className="card" style={{margin: 'auto', width: '92%', maxWidth: 480, maxHeight: '80vh', overflowY: 'auto', cursor: 'default'}} onClick={e => e.stopPropagation()}>
        <div style={{fontWeight: 700, color: 'var(--gold-light)', marginBottom: 4}}>{I.radio(15)} Pick video from Telegram</div>
        <div style={{fontSize: 12, color: 'var(--muted)', marginBottom: 12}}>Recent videos sent to @Hsshsgsgsbzvbot</div>
        {err && <div style={{fontSize: 13, color: 'var(--muted)', marginBottom: 8}}>{err}</div>}
        {!videos && !err && <div className="skel" style={{height: 40}} />}
        {videos && videos.length === 0 && <div style={{fontSize: 13, color: 'var(--muted)'}}>No videos found.</div>}
        {videos && videos.map(v => (
          <div key={v.msgId} style={{display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)'}}>
            <div style={{color: 'var(--muted)'}}>{I.film(22)}</div>
            <div style={{flex: 1, fontSize: 13}}>
              <div style={{color: '#fff'}}>{fmtDate(v.date)}</div>
              <div style={{color: 'var(--muted)', fontSize: 12}}>{(v.size / 1048576).toFixed(1)} MB • {fmtDur(v.duration)} • #{v.msgId}</div>
            </div>
            <button className="btn" style={{padding: '8px 14px', fontSize: 13}} onClick={() => onPick(v)}>Pick</button>
          </div>
        ))}
        <button className="btn btn-ghost" style={{marginTop: 12, width: '100%'}} onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

function FileUpload({ kind, label, onUploaded, manualId, onManualId, onPickMt }) {
  // ── File upload (video/photo) with manual ID fallback ──
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [idStatus, setIdStatus] = useState(''); // validation message for pasted ID
  const tgId = tg?.initDataUnsafe?.user?.id || '';
  const validateId = async (id) => {
    if (!id || id.length < 20) { setIdStatus(''); return; }
    try {
      const r = await fetch(`/api/admin/validate-id?fid=${encodeURIComponent(id)}`, { headers: { 'x-telegram-id': tgId } }).then(r => r.json());
      if (!r.ok) { setIdStatus('❌ Invalid ID'); return; }
      if (r.big_file) {
        setIdStatus(kind === 'video' ? 'Video (big file, >20MB — needs MTProto)' : 'Big file, not a photo');
        return;
      }
      const isVideo = (r.file_path || '').startsWith('videos/');
      const isPhoto = (r.file_path || '').startsWith('photos/');
      const sizeMb = (r.file_size / 1048576).toFixed(1);
      if (kind === 'video' && isPhoto) setIdStatus('❌ This is a PHOTO, not a video! Paste the video ID.');
      else if (kind === 'photo' && isVideo) setIdStatus('❌ This is a VIDEO, not a photo! Paste the photo ID.');
      else if (kind === 'video' && isVideo) setIdStatus(`Video (${sizeMb} MB)`);
      else if (kind === 'photo' && isPhoto) setIdStatus(`Photo (${sizeMb} MB)`);
      else setIdStatus(`Valid (${sizeMb} MB)`);
    } catch { setIdStatus(''); }
  };
  const upload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    setUploading(true);
    setProgress(0);
    try {
      // Photos via bot (persistent); videos via local (bot API fails on large files)
      const endpoint = kind === 'photo' ? '/api/admin/upload' : '/api/admin/upload-local';
      const fd = new FormData();
      fd.append('file', file);
      if (kind === 'photo') fd.append('kind', kind);
      // Use XHR for progress tracking
      const r = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', endpoint);
        xhr.setRequestHeader('x-telegram-id', tg?.initDataUnsafe?.user?.id || '');
        xhr.upload.onprogress = (ev) => {
          if (ev.lengthComputable) setProgress(Math.round((ev.loaded / ev.total) * 100));
        };
        xhr.onload = () => {
          try { resolve(JSON.parse(xhr.responseText)); }
          catch { reject(new Error('bad response')); }
        };
        xhr.onerror = () => reject(new Error('network error'));
        xhr.send(fd);
      });
      if (r.ok) onUploaded(r);
      else alert('Upload failed: ' + (r.error || 'unknown'));
    } catch {
      alert('Upload failed');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };
  return (
    <div className="field">
      <label>{label}</label>
      <label style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        padding: '18px', borderRadius: 14, cursor: 'pointer',
        background: 'rgba(212,168,83,0.08)', border: '1px dashed rgba(212,168,83,0.4)',
        color: 'var(--gold-light)', fontWeight: 600, fontSize: 14,
      }}>
        <input type="file" accept={kind === 'photo' ? 'image/*' : 'video/*'} onChange={upload}
          style={{display: 'none'}} disabled={uploading} />
        {uploading ? `Uploading... ${progress}%` : (fileName ? fileName : `Choose ${kind === 'photo' ? 'photo' : 'video'}`)}
      </label>
      {uploading && progress > 0 && (
        <div style={{height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.1)', marginTop: 8, overflow: 'hidden'}}>
          <div style={{height: '100%', width: `${progress}%`, background: 'var(--gold)', borderRadius: 3, transition: 'width 0.2s'}} />
        </div>
      )}
      <div style={{textAlign: 'center', margin: '10px 0 6px', color: 'var(--muted)', fontSize: 12}}>— or paste ID —</div>
      <input className="mono" value={manualId || ''} placeholder={`Paste ${kind} file ID from bot`}
        onChange={e => { onManualId && onManualId(e.target.value); validateId(e.target.value); }} />
      {idStatus && <div style={{fontSize: 12, marginTop: 6, color: idStatus.startsWith('❌') ? '#ff6b6b' : 'var(--gold-light)'}}>{idStatus}</div>}
      {onPickMt && (
        <button type="button" className="btn btn-ghost" style={{width: '100%', marginTop: 8, fontSize: 13}}
          onClick={() => setShowPicker(true)}>{I.radio(15)} Pick from Telegram</button>
      )}
      {showPicker && <MtVideoPicker onPick={(v) => { setShowPicker(false); onPickMt(v.msgId, v.size); }} onClose={() => setShowPicker(false)} />}
    </div>
  );
}

// ── MTProto Telegram login (for big-file access) ──
function MtLogin() {
  const [status, setStatus] = useState(null);
  const [code, setCode] = useState('');
  const [phoneCodeHash, setPhoneCodeHash] = useState('');
  const [password, setPassword] = useState('');
  const [needPassword, setNeedPassword] = useState(false);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [sessionStr, setSessionStr] = useState('');
  const tgId = tg?.initDataUnsafe?.user?.id || '';
  const refresh = async () => {
    try {
      const d = await fetch('/api/admin/mtproto/status', { headers: { 'x-telegram-id': tgId } }).then(r => r.json());
      setStatus(d);
    } catch {}
  };
  useEffect(refresh, []);
  const sendCode = async () => {
    setBusy(true); setMsg(''); setNeedPassword(false);
    try {
      const d = await fetch('/api/admin/mtproto/send-code', {
        method: 'POST', headers: { 'x-telegram-id': tgId },
      }).then(r => r.json());
      if (d.ok && d.alreadyLoggedIn) { setMsg('Already logged in'); refresh(); }
      else if (d.ok) { setPhoneCodeHash(d.phoneCodeHash); setMsg('Code sent — check your Telegram app, then enter it below'); }
      else setMsg((d.error || 'failed'));
    } catch { setMsg('❌ Network error'); }
    setBusy(false);
  };
  const verify = async () => {
    if (!code.trim()) return;
    setBusy(true); setMsg('');
    try {
      const d = await fetch('/api/admin/mtproto/verify-code', {
        method: 'POST', headers: { 'x-telegram-id': tgId, 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim(), phoneCodeHash }),
      }).then(r => r.json());
      if (d.ok) { setMsg('Logged in! Big files can now be fetched'); setCode(''); setPhoneCodeHash(''); if (d.session) setSessionStr(d.session); refresh(); }
      else if (d.needPassword) { setNeedPassword(true); setMsg('Enter your 2FA password'); }
      else setMsg('❌ ' + (d.error || 'invalid code'));
    } catch { setMsg('❌ Network error'); }
    setBusy(false);
  };
  const verifyPwd = async () => {
    if (!password) return;
    setBusy(true); setMsg('');
    try {
      const d = await fetch('/api/admin/mtproto/verify-password', {
        method: 'POST', headers: { 'x-telegram-id': tgId, 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      }).then(r => r.json());
      if (d.ok) { setMsg('Logged in! Big files can now be fetched'); setPassword(''); setNeedPassword(false); setPhoneCodeHash(''); if (d.session) setSessionStr(d.session); refresh(); }
      else setMsg('❌ ' + (d.error || 'wrong password'));
    } catch { setMsg('❌ Network error'); }
    setBusy(false);
  };
  return (
    <div className="card" style={{marginBottom: 12, padding: 14}}>
      <div style={{fontWeight: 700, color: 'var(--gold-light)', marginBottom: 8}}>{I.radio(16)} Telegram Login (Big Files)</div>
      <div style={{fontSize: 13, color: 'var(--muted)', marginBottom: 8}}>
        Status: <span style={{display: 'inline-block', width: 8, height: 8, borderRadius: '50%', marginRight: 6, background: !status ? '#666' : status.loggedIn ? '#22c55e' : status.configured ? '#e8b33c' : '#ef4444'}} />{status ? (status.loggedIn ? 'Connected' : status.configured ? 'Not logged in' : 'Not configured on server') : '…'}
      </div>
      {!status?.loggedIn && (
        <div>
          {!phoneCodeHash ? (
            <button className="btn" onClick={sendCode} disabled={busy || !status?.configured}>
              {busy ? '…' : <span style={{display: 'inline-flex', alignItems: 'center', gap: 6}}>{I.send(14)} Send Login Code</span>}
            </button>
          ) : needPassword ? (
            <div style={{display: 'flex', gap: 8}}>
              <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="2FA password" style={{flex: 1}} />
              <button className="btn" onClick={verifyPwd} disabled={busy || !password}>
                {busy ? '…' : '✓ Confirm'}
              </button>
            </div>
          ) : (
            <div style={{display: 'flex', gap: 8}}>
              <input className="input" value={code} onChange={e => setCode(e.target.value)}
                placeholder="Enter code from Telegram" inputMode="numeric" style={{flex: 1}} />
              <button className="btn" onClick={verify} disabled={busy || !code.trim()}>
                {busy ? '…' : '✓ Verify'}
              </button>
            </div>
          )}
        </div>
      )}
      {msg && <div style={{fontSize: 13, marginTop: 8, color: 'var(--muted)'}}>{msg}</div>}
      {sessionStr && (
        <div style={{marginTop: 12, padding: 10, background: 'rgba(212,168,83,0.1)', borderRadius: 8, border: '1px solid var(--gold)'}}>
          <div style={{fontSize: 12, fontWeight: 700, color: 'var(--gold-light)', marginBottom: 6}}>
            Save this to survive redeploys:
          </div>
          <div style={{fontSize: 11, color: 'var(--muted)', marginBottom: 8}}>
            1. Copy the session below<br/>
            2. Go to Render → toji-somon → Environment<br/>
            3. Add variable: <code>MT_SESSION</code> = (paste)<br/>
            4. Save — you won't need to log in again!
          </div>
          <textarea readOnly value={sessionStr} rows={3} style={{width: '100%', fontSize: 10, background: '#000', color: '#0f0', border: '1px solid #333', borderRadius: 4, padding: 6}} onClick={e => e.target.select()} />
          <button className="btn" style={{marginTop: 8, fontSize: 12}} onClick={() => { navigator.clipboard.writeText(sessionStr); setMsg('Copied! Paste it as MT_SESSION in Render.'); }}>
            {I.copy(14)} Copy Session
          </button>
        </div>
      )}
    </div>
  );
}

// ── Admin panel (super admin) ──
function MovieForm({ initial, onDone }) {
  const [f, setF] = useState(initial || { title: '', year: '', rating: '', synopsis: '', language: '', age_rating: '', cover_file_id: '', file_id: '', quality: '720p' });
  const set = (k, v) => setF(prev => ({ ...prev, [k]: v }));
  const [saving, setSaving] = useState(false);
  const save = async () => {
    if (!f.title || (!initial && !f.file_id)) { alert('Title + File ID required'); return; }
    setSaving(true);
    try {
      const r = await fetch(initial ? `/api/admin/movie/${initial.id}` : '/api/admin/movie', {
        method: initial ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', 'x-telegram-id': tg?.initDataUnsafe?.user?.id || '' },
        body: JSON.stringify(f),
      }).then(r => r.json());
      if (r.ok) onDone(); else alert('Error: ' + (r.error || 'unknown'));
    } finally { setSaving(false); }
  };
  const qualities = ['144p','240p','360p','480p','720p','1080p','2K','4K'];
  return (
    <div className="card" style={{cursor: 'default', padding: 18}}>
      <div className="field"><label>Title *</label>
        <input value={f.title} onChange={e => set('title', e.target.value)} placeholder="Movie title" /></div>
      <div style={{display: 'flex', gap: 10}}>
        <div className="field" style={{flex: 1}}><label>Year</label>
          <input value={f.year} onChange={e => set('year', e.target.value)} placeholder="2024" /></div>
        <div className="field" style={{flex: 1}}><label>Rating</label>
          <input value={f.rating} onChange={e => set('rating', e.target.value)} placeholder="8.5" inputMode="decimal" /></div>
        <div className="field" style={{flex: 1}}><label>Age</label>
          <input value={f.age_rating} onChange={e => set('age_rating', e.target.value)} placeholder="0" inputMode="numeric" /></div>
      </div>
      <div className="field"><label>Synopsis</label>
        <textarea value={f.synopsis} onChange={e => set('synopsis', e.target.value)} /></div>
      <div className="field"><label>Language</label>
        <input value={f.language} onChange={e => set('language', e.target.value)} placeholder="Tajik" /></div>
      {!initial && (
        <div>
          <FileUpload kind="video" label="Video File *" manualId={f.file_id}
            onUploaded={(r) => { set('file_id', r.file_id); set('file_size', r.file_size); set('mt_msg_id', ''); }}
            onManualId={(id) => set('file_id', id)}
            onPickMt={(msgId) => set('mt_msg_id', msgId)} />
          {f.file_id && <div style={{fontSize: 12, color: 'var(--gold-light)', marginBottom: 14}}>{I.check(14)} Video uploaded{f.file_size ? ` (${(f.file_size / 1048576).toFixed(1)} MB)` : ''}</div>}
          {f.mt_msg_id ? <div style={{fontSize: 12, color: 'var(--gold-light)', marginBottom: 14}}>{I.radio(13)} MTProto linked (msg #{f.mt_msg_id}) — reliable big-file playback</div> : null}
          <div className="field"><label>Quality</label>
            <select value={f.quality} onChange={e => set('quality', e.target.value)}>
              {qualities.map(q => <option key={q} value={q}>{q}</option>)}
            </select></div>
        </div>
      )}
      <FileUpload kind="photo" label="Cover Photo" manualId={f.cover_file_id} onUploaded={(r) => set('cover_file_id', r.file_id)} onManualId={(id) => set('cover_file_id', id)} />
      {f.cover_file_id && <div style={{fontSize: 12, color: 'var(--gold-light)', marginBottom: 14}}>{I.check(14)} Cover uploaded</div>}
      <button className="btn" onClick={save} disabled={saving}>{saving ? '…' : (initial ? <span style={{display: 'inline-flex', alignItems: 'center', gap: 6}}>{I.save(15)} Save</span> : <span style={{display: 'inline-flex', alignItems: 'center', gap: 6}}>{I.plus(15)} Add Movie</span>)}</button>
    </div>
  );
}

function SeriesForm({ initial, onDone }) {
  const [f, setF] = useState(initial || { title: '', year: '', rating: '', synopsis: '', language: '', age_rating: '', cover_file_id: '' });
  const set = (k, v) => setF(prev => ({ ...prev, [k]: v }));
  const [saving, setSaving] = useState(false);
  const save = async () => {
    if (!f.title) { alert('Title required'); return; }
    setSaving(true);
    try {
      const r = await fetch(initial ? `/api/admin/series/${initial.id}` : '/api/admin/series', {
        method: initial ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', 'x-telegram-id': tg?.initDataUnsafe?.user?.id || '' },
        body: JSON.stringify(f),
      }).then(r => r.json());
      if (r.ok) onDone(r.id); else alert('Error: ' + (r.error || 'unknown'));
    } finally { setSaving(false); }
  };
  return (
    <div className="card" style={{cursor: 'default', padding: 18}}>
      <div className="field"><label>Title *</label>
        <input value={f.title} onChange={e => set('title', e.target.value)} placeholder="Series title" /></div>
      <div style={{display: 'flex', gap: 10}}>
        <div className="field" style={{flex: 1}}><label>Year</label>
          <input value={f.year} onChange={e => set('year', e.target.value)} placeholder="2024" /></div>
        <div className="field" style={{flex: 1}}><label>Rating</label>
          <input value={f.rating} onChange={e => set('rating', e.target.value)} placeholder="8.5" inputMode="decimal" /></div>
        <div className="field" style={{flex: 1}}><label>Age</label>
          <input value={f.age_rating} onChange={e => set('age_rating', e.target.value)} placeholder="0" inputMode="numeric" /></div>
      </div>
      <div className="field"><label>Synopsis</label>
        <textarea value={f.synopsis} onChange={e => set('synopsis', e.target.value)} /></div>
      <div className="field"><label>Language</label>
        <input value={f.language} onChange={e => set('language', e.target.value)} placeholder="Tajik" /></div>
      <div className="field"><label>Code Name (admin only — same code links every language of this show)</label>
        <input value={f.code_name || ''} onChange={e => set('code_name', e.target.value)} placeholder="e.g. blue lock" /></div>
      <FileUpload kind="photo" label="Cover Photo" manualId={f.cover_file_id} onUploaded={(r) => set('cover_file_id', r.file_id)} onManualId={(id) => set('cover_file_id', id)} />
      {f.cover_file_id && <div style={{fontSize: 12, color: 'var(--gold-light)', marginBottom: 14}}>{I.check(14)} Cover uploaded</div>}
      <FileUpload kind="photo" label="Series Logo (optional, transparent PNG)" manualId={f.logo_file_id} onUploaded={(r) => set('logo_file_id', r.file_id)} onManualId={(id) => set('logo_file_id', id)} />
      {f.logo_file_id && <div style={{fontSize: 12, color: 'var(--gold-light)', marginBottom: 14}}>{I.check(14)} Logo uploaded</div>}
      <button className="btn" onClick={save} disabled={saving}>{saving ? '…' : (initial ? <span style={{display: 'inline-flex', alignItems: 'center', gap: 6}}>{I.save(15)} Save</span> : <span style={{display: 'inline-flex', alignItems: 'center', gap: 6}}>{I.plus(15)} Add Series</span>)}</button>
    </div>
  );
}

function EpisodeForm({ seriesList, onDone, initial }) {
  const fmtTime = (sec) => {
    if (sec == null || sec === '') return '';
    const s = parseInt(sec) || 0;
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), ss = s % 60;
    if (h > 0) return h + ':' + String(m).padStart(2, '0') + ':' + String(ss).padStart(2, '0');
    return m + ':' + String(ss).padStart(2, '0');
  };
  const parseTime = (str) => {
    if (!str || String(str).trim() === '') return null;
    const parts = String(str).trim().split(':').map(x => parseInt(x) || 0);
    if (parts.length === 1) return parts[0];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    return null;
  };
  const [f, setF] = useState(initial ? {
    series_id: String(initial.series_id || ''), season: String(initial.season || '1'),
    episode_number: String(initial.episode_number || ''), file_id: initial.file_id || '',
    file_size: initial.file_size || '', quality: initial.quality || '720p',
    title: initial.title || '', description: initial.description || '',
    cover_file_id: initial.cover_file_id || '', tg_link: initial.tg_link || '',
    language: initial.language || 'Тоҷикӣ', studio: initial.studio || '',
    intro_start: fmtTime(initial.intro_start), intro_end: fmtTime(initial.intro_end),
    outro_start: fmtTime(initial.outro_start), outro_end: fmtTime(initial.outro_end),
  } : { series_id: String(seriesList[0]?.id || ''), season: '1', episode_number: '', file_id: '', quality: '720p', title: '', description: '', cover_file_id: '', language: ({ tj: 'Тоҷикӣ', ru: 'Русский', en: 'English', fa: 'فارسی' }[canonLang(seriesList[0]?.language || '')] || 'Тоҷикӣ'), studio: '', intro_start: '', intro_end: '', outro_start: '', outro_end: '' });
  const set = (k, v) => setF(prev => ({ ...prev, [k]: v }));
  const [saving, setSaving] = useState(false);
  const save = async () => {
    if (!f.series_id || !f.episode_number || (!f.file_id && !f.tg_link)) { alert('Series, episode # and File ID or t.me link required'); return; }
    setSaving(true);
    try {
      const payload = { ...f,
        intro_start: parseTime(f.intro_start),
        intro_end: parseTime(f.intro_end),
        outro_start: parseTime(f.outro_start),
        outro_end: parseTime(f.outro_end),
      };
      const url = initial ? '/api/admin/episode/' + initial.id : '/api/admin/episode';
      const r = await fetch(url, {
        method: initial ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', 'x-telegram-id': tg?.initDataUnsafe?.user?.id || '' },
        body: JSON.stringify(payload),
      }).then(r => r.json());
      if (r.ok) {
        if (!initial) { set('episode_number', String(parseInt(f.episode_number || '0') + 1)); set('file_id', ''); set('mt_msg_id', ''); set('file_size', ''); }
        onDone();
      }
      else alert('Error: ' + (r.error || 'unknown'));
    } finally { setSaving(false); }
  };
  const qualities = ['144p','240p','360p','480p','720p','1080p','2K','4K'];
  return (
    <div className="card" style={{cursor: 'default', padding: 18}}>
      <div style={{display: 'flex', gap: 10}}>
        <div className="field" style={{flex: 1}}><label>Season</label>
          <input value={f.season} onChange={e => set('season', e.target.value)} inputMode="numeric" /></div>
        <div className="field" style={{flex: 1}}><label>Episode # *</label>
          <input value={f.episode_number} onChange={e => set('episode_number', e.target.value)} inputMode="numeric" /></div>
      </div>
      <div className="field"><label>Studio (who translated / dubbed this episode)</label>
        <input value={f.studio || ''} onChange={e => set('studio', e.target.value)} placeholder="e.g. Somoni Tojik" /></div>
      <div className="field"><label>Quality</label>
        <select value={f.quality} onChange={e => set('quality', e.target.value)}>
          {qualities.map(q => <option key={q} value={q}>{q}</option>)}
        </select></div>
      <div className="field"><label>Series *</label>
        <select value={f.series_id} onChange={e => {
          set('series_id', e.target.value);
          // Prefill the dub language from the chosen series' language (any script)
          const dub = { tj: 'Тоҷикӣ', ru: 'Русский', en: 'English', fa: 'فارسی' }[canonLang(seriesList.find(x => String(x.id) === e.target.value)?.language || '')];
          if (dub) set('language', dub);
        }}>
          {seriesList.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
        </select></div>
      <div className="field"><label>Language (dub)</label>
        <LangInput value={f.language || ''} onChange={v => set('language', v)} /></div>
      <FileUpload kind="video" label="Episode Video *" manualId={f.file_id}
        onUploaded={(r) => { set('file_id', r.file_id); set('file_size', r.file_size); set('mt_msg_id', ''); }}
        onManualId={(id) => set('file_id', id)}
        onPickMt={(msgId) => set('mt_msg_id', msgId)} />
      {f.file_id && <div style={{fontSize: 12, color: 'var(--gold-light)', marginBottom: 14}}>{I.check(14)} Video uploaded{f.file_size ? ` (${(f.file_size / 1048576).toFixed(1)} MB)` : ''}</div>}
      {f.mt_msg_id ? <div style={{fontSize: 12, color: 'var(--gold-light)', marginBottom: 14}}>{I.radio(13)} MTProto linked (msg #{f.mt_msg_id}) — reliable big-file playback</div> : null}
      <div className="field"><label>t.me Message Link (for channel videos)</label>
        <input value={f.tg_link || ''} onChange={e => set('tg_link', e.target.value)} placeholder="https://t.me/channel/123" /></div>
      <div className="field"><label>Episode Title (e.g. Dream)</label>
        <input value={f.title || ''} onChange={e => set('title', e.target.value)} placeholder="Episode name" /></div>
      <div className="field"><label>Description</label>
        <textarea value={f.description || ''} onChange={e => set('description', e.target.value)} rows={2} style={{width:'100%'}} placeholder="What happens..." /></div>
      <FileUpload kind="photo" label="Episode Cover (optional)" manualId={f.cover_file_id}
        onUploaded={(r) => set('cover_file_id', r.file_id)}
        onManualId={(id) => set('cover_file_id', id)} />
      <div style={{display: 'flex', gap: 10}}>
        <div className="field" style={{flex: 1}}><label>Intro Start (optional)</label>
          <input value={f.intro_start || ''} onChange={e => set('intro_start', e.target.value)} placeholder="0:50 or 1:02:30" /></div>
        <div className="field" style={{flex: 1}}><label>Intro End</label>
          <input value={f.intro_end || ''} onChange={e => set('intro_end', e.target.value)} placeholder="2:30" /></div>
      </div>
      <div style={{display: 'flex', gap: 10}}>
        <div className="field" style={{flex: 1}}><label>Outro Start (optional)</label>
          <input value={f.outro_start || ''} onChange={e => set('outro_start', e.target.value)} placeholder="42:00" /></div>
        <div className="field" style={{flex: 1}}><label>Outro End</label>
          <input value={f.outro_end || ''} onChange={e => set('outro_end', e.target.value)} placeholder="43:30" /></div>
      </div>
      <button className="btn" onClick={save} disabled={saving}>{saving ? '…' : (initial ? <span style={{display: 'inline-flex', alignItems: 'center', gap: 6}}>{I.save(15)} Save</span> : <span style={{display: 'inline-flex', alignItems: 'center', gap: 6}}>{I.plus(15)} Add Episode</span>)}</button>
    </div>
  );
}

function Admin({ go, back }) {
  const [stats, setStats] = useState(null);
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [manageTab, setManageTab] = useState('movies');
  const [form, setForm] = useState(null); // null | 'addMovie' | 'addSeries' | 'addEpisode' | {edit:'movie'|'series', item}
  const [epManage, setEpManage] = useState(null); // {seriesId, title, episodes[]} | null
  const refresh = () => {
    clearHomeCache();
    api.get('/api/admin/stats').then(setStats).catch(() => {});
    api.get('/api/movies').then(setMovies).catch(() => {});
    api.get('/api/series').then(setSeries).catch(() => {});
  };
  useEffect(refresh, []);
  const del = async (type, id, title) => {
    if (!confirm(`${t('deleteConfirm')} "${title}"`)) return;
    await api.del(`/api/admin/${type}/${id}`);
    refresh();
    if (epManage) openEpisodes(epManage.seriesId, epManage.title);
  };
  const openEpisodes = async (seriesId, title) => {
    try {
      const full = await api.get(`/api/series/${seriesId}`);
      setEpManage({ seriesId, title, episodes: full.episodes || [] });
    } catch {}
  };
  const delEpisode = async (epId, label) => {
    if (!confirm(`${t('deleteConfirm')} "${label}"`)) return;
    await api.del(`/api/admin/episode/${epId}`);
    refresh();
    if (epManage) openEpisodes(epManage.seriesId, epManage.title);
  };
  const list = manageTab === 'movies' ? movies : series;
  return (
    <div className="page">
      <button className="back-btn" onClick={back}>‹ {t('back')}</button>
      <div className="section-title" style={{display: 'flex', alignItems: 'center', gap: 8}}>{I.gear(18)} {t('admin')}</div>
      <MtLogin />
      {stats && (
        <div className="grid" style={{gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 16}}>
          {[[I.film(20), stats.movies], [I.tv(20), stats.series], [I.file(20), stats.episodes], [I.drive(20), stats.files]].map(([ico, n], i) => (
            <div key={i} className="card" style={{textAlign: 'center', padding: 12, cursor: 'default'}}>
              <div style={{color: 'var(--gold)', display: 'flex', justifyContent: 'center'}}>{ico}</div>
              <div style={{fontSize: 18, fontWeight: 700, color: 'var(--gold-light)'}}>{n}</div>
            </div>
          ))}
        </div>
      )}
      {!form && (
        <div style={{display: 'flex', gap: 8, marginBottom: 12}}>
          <button className="tab active" style={{flex: 1, border: 'none'}} onClick={() => setForm('addMovie')}>{I.plus(15)} {I.film(17)}</button>
          <button className="tab active" style={{flex: 1, border: 'none'}} onClick={() => setForm('addSeries')}>{I.plus(15)} {I.tv(17)}</button>
          <button className="tab active" style={{flex: 1, border: 'none'}} onClick={() => setForm('addEpisode')}>{I.plus(15)} {I.file(17)}</button>
        </div>
      )}
      {form === 'addMovie' && <div><button className="back-btn" onClick={() => setForm(null)}>‹ {t('cancel')}</button><MovieForm onDone={() => { setForm(null); refresh(); }} /></div>}
      {form === 'addSeries' && <div><button className="back-btn" onClick={() => setForm(null)}>‹ {t('cancel')}</button><SeriesForm onDone={() => { setForm(null); refresh(); }} /></div>}
      {form === 'addEpisode' && <div><button className="back-btn" onClick={() => setForm(null)}>‹ {t('cancel')}</button><EpisodeForm seriesList={series} onDone={refresh} /></div>}
      {form?.edit === 'movie' && <div><button className="back-btn" onClick={() => setForm(null)}>‹ {t('cancel')}</button><MovieForm initial={form.item} onDone={() => { setForm(null); refresh(); }} /></div>}
      {form?.edit === 'series' && <div><button className="back-btn" onClick={() => setForm(null)}>‹ {t('cancel')}</button><SeriesForm initial={form.item} onDone={() => { setForm(null); refresh(); }} /></div>}
      {form?.edit === 'episode' && <div><button className="back-btn" onClick={() => setForm(null)}>‹ {t('cancel')}</button><EpisodeForm seriesList={series} initial={form.item} onDone={() => { setForm(null); refresh(); }} /></div>}
      {!form && epManage && (
        <div>
          <button className="back-btn" onClick={() => setEpManage(null)}>‹ {epManage.title}</button>
          <div className="section-title" style={{fontSize: 16}}>{I.file(15)} {t('episodes') || 'Episodes'} ({new Set(epManage.episodes.map(e => (e.season || 1) + ':' + e.episode_number)).size})</div>
          {(() => {
            // All versions (qualities/studios) of one episode live inside a
            // single card (his rule, 2026-10-21) — one row per episode,
            // the versions listed within.
            const groups = {};
            epManage.episodes.forEach(ep => { const k = (ep.season || 1) + ':' + ep.episode_number; (groups[k] = groups[k] || []).push(ep); });
            const keys = Object.keys(groups).sort((a, b) => { const pa = a.split(':').map(Number); const pb = b.split(':').map(Number); return pa[0] - pb[0] || pa[1] - pb[1]; });
            return keys.map(k => {
              const vers = groups[k];
              const head = vers[0];
              return (
                <div key={k} className="ep-row" style={{cursor: 'default', display: 'block'}}>
                  <div className="ep-info" style={{marginBottom: 4}}>
                    <div className="t">{t('episode') || 'Episode'} {head.episode_number} {head.season > 1 ? `(S${head.season})` : ''}</div>
                    <div className="s">{vers.length} {vers.length > 1 ? 'versions' : 'version'}</div>
                  </div>
                  {vers.map(ep => (
                    <div key={ep.id} style={{display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderTop: '1px solid rgba(255,255,255,0.07)'}}>
                      <div className="ep-info" style={{flex: 1}}>
                        <div className="t" style={{fontSize: 14}}>{ep.quality || '—'}{ep.studio ? ` • ${ep.studio}` : ''}</div>
                        <div className="s">{[ep.file_size ? `${Math.round(ep.file_size/1048576)} MB` : null, ep.file_id === 'downloading' ? 'downloading' : null].filter(Boolean).join(' • ')}</div>
                      </div>
                      <button onClick={() => setForm({edit: 'episode', item: {...ep, series_id: epManage.seriesId}})}
                        style={{background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, padding: '8px 14px', cursor: 'pointer'}}>{I.edit(15)}</button>
                      <button onClick={() => delEpisode(ep.id, `${t('episode') || 'Episode'} ${ep.episode_number}`)}
                        style={{background: 'rgba(163,22,33,0.2)', border: '1px solid #a31621', borderRadius: 8, padding: '8px 14px', color: '#f87171', cursor: 'pointer'}}>{I.trash(15)}</button>
                    </div>
                  ))}
                </div>
              );
            });
          })()}
          {epManage.episodes.length === 0 && <div style={{color: 'var(--muted)', padding: 16}}>—</div>}
        </div>
      )}
      {!form && !epManage && (
        <div>
          <div className="tabs">
            <button className={`tab${manageTab === 'movies' ? ' active' : ''}`} onClick={() => setManageTab('movies')}>{t('manageMovies')}</button>
            <button className={`tab${manageTab === 'series' ? ' active' : ''}`} onClick={() => setManageTab('series')}>{t('manageSeries')}</button>
          </div>
          {list.map(item => (
            <div key={item.id} className="ep-row" style={{cursor: 'default'}}>
              <div className="ep-info">
                <div className="t">{item.title}</div>
                <div className="s">{[item.year, item.rating > 0 ? `★ ${item.rating}` : null].filter(Boolean).join(' • ')}</div>
              </div>
              {manageTab === 'series' && (
                <button onClick={() => openEpisodes(item.id, item.title)}
                  style={{background: 'rgba(59,130,246,0.15)', border: '1px solid #3b82f6', borderRadius: 8, padding: '8px 14px', color: '#93c5fd', cursor: 'pointer'}}>{I.file(15)}</button>
              )}
              <button onClick={async () => {
                const full = await api.get(`/api/${manageTab === 'movies' ? 'movie' : 'series'}/${item.id}`);
                setForm({ edit: manageTab === 'movies' ? 'movie' : 'series', item: full });
              }} style={{background: 'rgba(212,168,83,0.15)', border: '1px solid var(--gold-dark)', borderRadius: 8, padding: '8px 14px', color: 'var(--gold-light)', cursor: 'pointer'}}>{I.edit(15)}</button>
              <button onClick={() => del(manageTab === 'movies' ? 'movie' : 'series', item.id, item.title)}
                style={{background: 'rgba(163,22,33,0.2)', border: '1px solid #a31621', borderRadius: 8, padding: '8px 14px', color: '#f87171', cursor: 'pointer'}}>{I.trash(15)}</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── App shell ──
// ── Reels: short clips from users. AI identifies the movie/show, and when it
// is in the catalog the reel gets a Watch button straight to it. ──
// Instagram-style share sheet (his reference): friends grid first — tap a
// person to send the reel into your DM with them — then Copy link /
// Telegram / WhatsApp along the bottom.
function ShareSheet({ row, onClose, onCount }) {
  const [people, setPeople] = useState(null);
  const [q, setQ] = useState('');
  const [note, setNote] = useState('');
  const counted = useRef(false);
  const myId = viewerId();
  const isGuest = !/^\d+$/.test(myId);
  const link = `https://t.me/Hsshsgsgsbzvbot?start=tsreel_${row.item_key.replace(':', '')}`;
  const text = row.link_title ? `▶ Watch ${row.link_title} — Toji Somon` : 'Toji Somon';
  useEffect(() => { if (!isGuest) api.get('/api/dm/users?q=').then(d => setPeople(d && d.ok ? d.users : [])).catch(() => setPeople([])); else setPeople([]); }, []);
  const count = () => { if (!counted.current) { counted.current = true; if (onCount) onCount(); } };
  const sendTo = async (u) => {
    const th = await apiPost('/api/dm/threads', { user_id: u.user_id });
    if (th && th.id) {
      await apiPost(`/api/dm/threads/${th.id}/messages`, { text: (row.caption ? row.caption.slice(0, 140) + '\n' : '🎬 ') + link });
      count();
      setNote('Sent to ' + u.user_name + ' ✓');
      setTimeout(onClose, 950);
    } else setNote('Could not send — try again.');
  };
  const copyLink = async () => { count(); try { await navigator.clipboard.writeText(link); setNote('Link copied ✓'); setTimeout(onClose, 950); } catch (e) { window.prompt('Copy this link:', link); } };
  const viaTelegram = () => { count(); const su = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`; if (tg) { try { tg.openTelegramLink(su); } catch (e) {} } else window.open(su, '_blank'); onClose(); };
  const viaWhats = () => { count(); window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + link)}`, '_blank'); onClose(); };
  const shown = people ? people.filter(u => !q.trim() || (u.user_name || '').toLowerCase().includes(q.trim().toLowerCase())) : [];
  const actBtn = {display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', fontSize: 11.5, fontFamily: 'inherit'};
  const actIco = {width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center'};
  return (
    <div style={{position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 90, display: 'flex', alignItems: 'flex-end'}} onClick={onClose}>
      <div style={{background: '#181818', borderRadius: '20px 20px 0 0', padding: '10px 16px 22px', width: '100%', maxHeight: '78vh', display: 'flex', flexDirection: 'column'}} onClick={e => e.stopPropagation()}>
        <div style={{width: 40, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.25)', margin: '2px auto 14px'}} />
        <div style={{position: 'relative', marginBottom: 14}}>
          <span style={{position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', display: 'flex', pointerEvents: 'none'}}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.5" y2="16.5"/></svg>
          </span>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search" style={{width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#fff', padding: '10px 14px 10px 38px', fontSize: 14, outline: 'none'}} />
        </div>
        {note && <div style={{textAlign: 'center', color: 'var(--gold)', fontWeight: 700, fontSize: 13.5, marginBottom: 10}}>{note}</div>}
        {!isGuest && (
          <div style={{overflowY: 'auto', marginBottom: 6}}>
            {people === null && <p style={{color: 'var(--muted)', fontSize: 13}}>Loading…</p>}
            {people && shown.length === 0 && <p style={{color: 'var(--muted)', fontSize: 13}}>No people yet — people appear here after they open the app.</p>}
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px 8px'}}>
              {shown.map(u => (
                <button key={u.user_id} onClick={() => sendTo(u)} style={{background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, color: 'var(--text)', fontFamily: 'inherit', padding: 0}}>
                  <span style={{position: 'relative', display: 'inline-flex'}}>
                    <TgAvatar name={u.user_name} uid={u.user_id} size={62} />
                    {isOnline(u.last_seen) && <span style={{position: 'absolute', right: 1, bottom: 1, width: 14, height: 14, borderRadius: '50%', background: '#2fd67b', border: '2.5px solid #181818'}} />}
                  </span>
                  <span style={{fontSize: 12, lineHeight: 1.25, textAlign: 'center', maxWidth: 92, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{u.user_name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        <div style={{display: 'flex', justifyContent: 'space-around', paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.07)'}}>
          <button style={actBtn} onClick={copyLink}>
            <span style={actIco}><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg></span>
            Copy link
          </button>
          <button style={actBtn} onClick={viaTelegram}>
            <span style={actIco}>{I.send(21)}</span>
            Telegram
          </button>
          <button style={actBtn} onClick={viaWhats}>
            <span style={{...actIco, background: '#25d366', color: '#fff', fontWeight: 800, fontSize: 13}}>WA</span>
            WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}

function ReelsPage({ go, isAdmin, feed = 'ts' }) {
  const [reels, setReels] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [caption, setCaption] = useState('');
  const [hint, setHint] = useState('');
  const [busy, setBusy] = useState(false);
  // Sound choice is the viewer's own: once they unmute it stays unmuted
  // (across visits too) until they mute again — persisted in localStorage.
  const [muted, setMuted] = useState(() => { try { return localStorage.getItem('somon_muted') !== '0'; } catch { return true; } });
  const toggleMuted = () => setMuted(m => { const nm = !m; try { localStorage.setItem('somon_muted', nm ? '1' : '0'); } catch {} return nm; });
  const [playingIg, setPlayingIg] = useState(null);
  const [igAspect, setIgAspect] = useState({});
  const noteAspect = (id, e) => { const img = e.currentTarget; if (img && img.naturalWidth && img.naturalHeight) setIgAspect(p => (p[id] ? p : { ...p, [id]: img.naturalWidth / img.naturalHeight })); };
  const [showIgForm, setShowIgForm] = useState(false);
  const [igUrl, setIgUrl] = useState('');
  const [igTitle, setIgTitle] = useState('');
  const [igCaption, setIgCaption] = useState('');
  const fileRef = useRef(null);
  const [seriesList, setSeriesList] = useState([]);
  // The feed is MIXED on every visit (his rule) — never plain upload order.
  const shuffleRows = (rows) => { const a = [...rows]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
  const load = (mix) => api.get('/api/reels?feed=' + feed + '&lang=' + encodeURIComponent(lang || '')).then(d => { let rows = Array.isArray(d) ? d : []; if (window.__somonReelFor) { const ix = rows.findIndex(x => x.item_key === window.__somonReelFor); if (ix >= 0) { const hit = rows[ix]; rows = [hit, ...rows.filter((_, j) => j !== ix)]; window.__somonReelFor = null; } else if (feed === 'ts') { go('reels'); return; } else { window.__somonReelFor = null; } } setReels(mix ? shuffleRows(rows) : rows); }).catch(() => setReels([]));
  useEffect(() => { load(true); api.get('/api/series').then(d => setSeriesList(Array.isArray(d) ? d : [])).catch(() => {}); }, []);
  // Watch opens the version in the viewer's own language (same code-name
  // group pick as the Home merge), falling back to the linked version.
  const openLinked = (r) => {
    if (r.episode_id) { go('video', r.episode_id); return; }
    if (r.link_type === 'series' && r.lang_group && seriesList.length) {
      const g = seriesList.filter(s => s.lang_group === r.lang_group);
      const pick = g.find(s => canonLang(s.language) === lang) || g.find(s => s.id === r.series_id) || g[0];
      if (pick) { go('series', pick.id); return; }
    }
    go(r.link_type, r.series_id || r.movie_id);
  };
  useEffect(() => {
    if (!reels || showForm) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        const v = en.target;
        if (en.isIntersecting) { const p = v.play(); if (p) p.catch(() => {}); } else v.pause();
      });
    }, { threshold: 0.55 });
    document.querySelectorAll('video.reel-video').forEach(v => io.observe(v));
    return () => io.disconnect();
  }, [reels, showForm]);
  useEffect(() => {
    // Autoplay Telegram clips as they scroll into view (muted until tapped) —
    // the visible clip just plays, no button to press. Others pause. An inline
    // Instagram player (v151: plays inside the card, no separate page) stops
    // when its card scrolls away.
    const io = new IntersectionObserver((es) => {
      es.forEach(en => {
        const v = en.target;
        if (en.intersectionRatio >= 0.55) { const p = v.play(); if (p) p.catch(() => {}); }
        else v.pause();
      });
    }, { threshold: [0, 0.55, 0.9] });
    document.querySelectorAll('.reel-video').forEach(v => io.observe(v));
    const io2 = new IntersectionObserver((es) => {
      es.forEach(en => { if (en.intersectionRatio < 0.3) setPlayingIg(null); });
    }, { threshold: [0.3] });
    document.querySelectorAll('.ig-live-slot').forEach(s => io2.observe(s));
    return () => { io.disconnect(); io2.disconnect(); };
  }, [reels, savedOnly, playingIg]);
  const upload = async () => {
    const file = fileRef.current && fileRef.current.files && fileRef.current.files[0];
    if (!file) { alert('Choose a video first'); return; }
    if (file.size > 20 * 1024 * 1024) { alert('Reels up to 20 MB'); return; }
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('caption', caption);
      fd.append('title_hint', hint);
      fd.append('uploader_name', (tg && tg.initDataUnsafe && tg.initDataUnsafe.user && tg.initDataUnsafe.user.first_name) || '');
      fd.append('feed', feed);
      const r = await fetch('/api/reels', { method: 'POST', headers: { 'x-telegram-id': (tg && tg.initDataUnsafe && tg.initDataUnsafe.user && tg.initDataUnsafe.user.id) || '' }, body: fd }).then(r => r.json());
      if (!r.ok) alert(r.error || 'Upload failed');
      else { setShowForm(false); setCaption(''); setHint(''); load(); }
    } catch (e) { alert('Upload failed'); }
    setBusy(false);
  };
  const del = async (r) => { if (!confirm('Delete this reel?')) return; const rawId = (r.item_key || '').split(':')[1] || r.id; if (r.source === 'ig') await api.del(`/api/admin/ig-reels/${rawId}`); else await api.del(`/api/reels/${rawId}`); load(); };
  const openEdit = (r) => { setEditFor(r); setEditCaption(r.caption || ''); setEditHint(r.title_hint || ''); };
  const saveEdit = async (unlink) => {
    if (!editFor || editBusy) return;
    setEditBusy(true);
    const rawId = (editFor.item_key || '').split(':')[1] || editFor.id;
    const url = editFor.source === 'ig' ? `/api/admin/ig-reels/${rawId}` : `/api/admin/reels/${rawId}`;
    const body = unlink ? { caption: editCaption, unlink: true } : { caption: editCaption, hint: editHint };
    const res = await fetch(url, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'x-telegram-id': myId }, body: JSON.stringify(body) }).then(x => x.json()).catch(() => null);
    setEditBusy(false);
    if (!res || !res.ok) { alert('Could not save — try again.'); return; }
    if (res.warning) alert(res.warning);
    setEditFor(null);
    load();
  };
  const myId = viewerId();
  const myName = (tg && tg.initDataUnsafe && tg.initDataUnsafe.user && tg.initDataUnsafe.user.first_name) || 'Guest';
  const [savedOnly, setSavedOnly] = useState(false);
  const [commentsFor, setCommentsFor] = useState(null);
  const [likersRows, setLikersRows] = useState(false);
  const [viewersRows, setViewersRows] = useState(false);
  const [cLikersRows, setCLikersRows] = useState(false);
  const openLikers = async (r) => { setLikersRows(null); const d = await fetch(`/api/reels/${encodeURIComponent(r.item_key)}/likes`, { headers: { 'x-telegram-id': myId, 'x-telegram-name': encodeURIComponent(myName || '') } }).then(x => x.json()).catch(() => null); setLikersRows(d && d.users ? d.users.map(u => ({ user_id: u.user_id, user_name: u.user_name, sub: relTime(u.created_at) })) : []); };
  const openViewers = async (r) => { if (!isAdmin) return; setViewersRows(null); const d = await api.get('/api/admin/viewers?key=' + encodeURIComponent(r.item_key)).catch(() => null); setViewersRows(d && d.ok ? d.viewers.map(v => ({ user_id: v.user_id, user_name: v.user_name, sub: 'watched ' + relTime(v.last_at) + (v.count > 1 ? ' · ' + v.count + '×' : '') })) : []); };
  const openCLikers = async (c) => { setCLikersRows(null); const d = await fetch(`/api/reels/comments/${c.id}/likes`, { headers: { 'x-telegram-id': myId, 'x-telegram-name': encodeURIComponent(myName || '') } }).then(x => x.json()).catch(() => null); setCLikersRows(d && d.users ? d.users.map(u => ({ user_id: u.user_id, user_name: u.user_name, sub: relTime(u.created_at) })) : []); };
  const [comments, setComments] = useState([]);
  const [commentDraft, setCommentDraft] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [mediaAtt, setMediaAtt] = useState(null);
  const [mediaBusy, setMediaBusy] = useState(false);
  const [openReplies, setOpenReplies] = useState({});
  const commentFileRef = useRef(null);
  const [burst, setBurst] = useState(null);
  const [landed, setLanded] = useState(null);
  const [editFor, setEditFor] = useState(null);
  const [editCaption, setEditCaption] = useState('');
  const [editHint, setEditHint] = useState('');
  const [editBusy, setEditBusy] = useState(false);
  const [pausedMap, setPausedMap] = useState({});
  const tapRef = useRef({});
  const tapTimer = useRef(null);
  // Double-tap the video/poster = like (Instagram-style, with a heart burst).
  // A single tap keeps its old job (mute toggle / open the IG player) — it
  // just waits ~285ms to see whether a second tap is coming.
  const tapMedia = (r, singleAction, pt) => {
    const now = Date.now();
    const last = tapRef.current[r.item_key] || 0;
    if (now - last < 300) {
      tapRef.current[r.item_key] = 0;
      if (tapTimer.current) { clearTimeout(tapTimer.current); tapTimer.current = null; }
      // The heart bursts where the finger landed, dips down, then glides —
      // slowly (1.5s) — to the rail's like button and lands on it. The
      // flight vector is measured from the real button, so it lands
      // exactly on it on any screen (the old burst flew a fixed pixel
      // path, fast, and faded mid-air).
      const x = (pt && pt.x) || window.innerWidth / 2;
      const y = (pt && pt.y) || window.innerHeight * 0.42;
      let dx = window.innerWidth / 2 - 40, dy = 240;
      try {
        const btn = document.querySelector(`[data-likebtn="${r.item_key}"]`);
        if (btn) { const b = btn.getBoundingClientRect(); dx = (b.left + b.width / 2) - x; dy = (b.top + b.height / 2) - y; }
      } catch (e) {}
      setBurst({ key: r.item_key, x, y, dx, dy });
      setTimeout(() => setBurst(b => (b && b.key === r.item_key ? null : b)), 1580);
      setTimeout(() => { setLanded(r.item_key); setTimeout(() => setLanded(l => (l === r.item_key ? null : l)), 500); }, 1230);
      if (!r.liked) act(r, 'like');
    } else {
      tapRef.current[r.item_key] = now;
      if (singleAction) {
        if (tapTimer.current) clearTimeout(tapTimer.current);
        tapTimer.current = setTimeout(() => { singleAction(); }, 285);
      }
    }
  };
  const act = async (r, kind) => {
    const res = await fetch(`/api/reels/${encodeURIComponent(r.item_key)}/${kind}`, { method: 'POST', headers: { 'x-telegram-id': myId, 'x-telegram-name': encodeURIComponent(myName || '') } }).then(x => x.json()).catch(() => null);
    if (!res || !res.ok) return;
    const flag = kind === 'like' ? 'liked' : kind === 'save' ? 'saved' : 'reposted';
    setReels(rs => rs.map(x => x.item_key === r.item_key ? { ...x, [flag]: res.active, like_count: res.counts.likes, comment_count: res.counts.comments, save_count: res.counts.saves, repost_count: res.counts.reposts, share_count: res.counts.shares } : x));
    if (kind === 'repost') load();
  };
  const [shareFor, setShareFor] = useState(null);
  const countShare = async (r) => {
    // Counted in our own DB once per user (server-side dedupe).
    try {
      const res = await fetch(`/api/reels/${encodeURIComponent(r.item_key)}/share`, { method: 'POST', headers: { 'x-telegram-id': myId, 'x-telegram-name': encodeURIComponent(myName || '') } }).then(x => x.json()).catch(() => null);
      if (res && res.ok) setReels(rs => rs.map(x => x.item_key === r.item_key ? { ...x, share_count: res.counts.shares } : x));
    } catch (e) {}
  };
  const share = (r) => { setShareFor(r); };
  const openComments = async (r) => {
    setCommentsFor(r); setComments([]); setReplyTo(null); setMediaAtt(null); setCommentDraft(''); setOpenReplies({});
    const list = await api.get(`/api/reels/${encodeURIComponent(r.item_key)}/comments`).catch(() => []);
    setComments(Array.isArray(list) ? list : []);
  };
  const relTime = (iso) => {
    const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
    if (s < 60) return 'now';
    if (s < 3600) return Math.floor(s / 60) + 'm';
    if (s < 86400) return Math.floor(s / 3600) + 'h';
    if (s < 7 * 86400) return Math.floor(s / 86400) + 'd';
    return Math.floor(s / (7 * 86400)) + 'w';
  };
  const AV_GRADS = ['linear-gradient(135deg,#f6c453,#de9b2d)', 'linear-gradient(135deg,#7b61ff,#4a2fd6)', 'linear-gradient(135deg,#ff6a88,#d63a5c)', 'linear-gradient(135deg,#2fd67b,#159455)', 'linear-gradient(135deg,#39a0ff,#2563eb)', 'linear-gradient(135deg,#ff9440,#e05e12)'];
  const avatarFor = (name, uid, size) => {
    const n = String(name || 'User');
    let h = 0; const seed = String(uid || n); for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
    return (
      <span style={{position: 'relative', width: size, height: size, borderRadius: '50%', background: AV_GRADS[h % AV_GRADS.length], color: '#fff', fontWeight: 700, fontSize: size * 0.45, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, textTransform: 'uppercase', overflow: 'hidden'}}>
        {n.trim().charAt(0) || '?'}
        {/^\d+$/.test(String(uid || '')) && <img src={`/api/avatar/${uid}`} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none'; }} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}} />}
      </span>
    );
  };
  const postComment = async () => {
    const text = commentDraft.trim();
    if ((!text && !mediaAtt) || !commentsFor) return;
    const res = await fetch(`/api/reels/${encodeURIComponent(commentsFor.item_key)}/comments`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-telegram-id': myId, 'x-telegram-name': encodeURIComponent(myName || '') }, body: JSON.stringify({ text, media_file_id: mediaAtt ? mediaAtt.file_id : '', media_kind: mediaAtt ? mediaAtt.kind : '', parent_id: replyTo ? replyTo.id : 0 }) }).then(x => x.json()).catch(() => null);
    if (res && res.ok) {
      const parentId = replyTo ? replyTo.id : null;
      setCommentDraft(''); setMediaAtt(null); setReplyTo(null);
      if (parentId) setOpenReplies(o => ({ ...o, [parentId]: true }));
      setComments(cs => [...cs, { id: res.id, user_id: myId, user_name: myName, text, created_at: new Date().toISOString(), media_file_id: res.media_file_id, media_kind: res.media_kind, parent_id: parentId, like_count: 0, liked: false }]);
      setReels(rs => rs.map(x => x.item_key === commentsFor.item_key ? { ...x, comment_count: res.counts.comments } : x));
    } else if (res && res.error) alert(res.error);
  };
  const likeComment = async (c) => {
    const res = await fetch(`/api/reels/comments/${c.id}/like`, { method: 'POST', headers: { 'x-telegram-id': myId, 'x-telegram-name': encodeURIComponent(myName || '') } }).then(x => x.json()).catch(() => null);
    if (res && res.ok) setComments(cs => cs.map(x => x.id === c.id ? { ...x, liked: res.active, like_count: res.count } : x));
  };
  const pickCommentMedia = async () => {
    const f = commentFileRef.current && commentFileRef.current.files && commentFileRef.current.files[0];
    if (!f) return;
    const fname = (f.name || '').toLowerCase();
    if (fname.endsWith('.tgs')) { alert('That sticker format (.tgs) can\'t be shown in the app — .webp and .webm stickers work.'); try { commentFileRef.current.value = ''; } catch (e) {} return; }
    if (f.size > 20 * 1024 * 1024) { alert('Media up to 20 MB'); return; }
    let intent = '';
    if ((f.type || '').startsWith('audio/')) intent = 'voice';
    else if (fname.endsWith('.webp') || fname.endsWith('.webm') || f.type === 'image/webp') intent = 'sticker';
    setMediaBusy(true);
    try {
      const fd = new FormData(); fd.append('file', f); if (intent) fd.append('intent', intent);
      const res = await fetch('/api/reels/media', { method: 'POST', headers: { 'x-telegram-id': myId, 'x-telegram-name': encodeURIComponent(myName || '') }, body: fd }).then(x => x.json()).catch(() => null);
      if (res && res.ok) setMediaAtt({ file_id: res.file_id, kind: res.kind });
      else alert((res && res.error) || 'Could not attach that file');
    } catch (e) { alert('Could not attach that file'); }
    setMediaBusy(false);
    try { commentFileRef.current.value = ''; } catch (e) {}
  };
  const delComment = async (c) => {
    await fetch(`/api/reels/comments/${c.id}`, { method: 'DELETE', headers: { 'x-telegram-id': myId } }).then(x => x.json()).catch(() => null);
    setComments(cs => cs.filter(x => x.id !== c.id));
    if (commentsFor) setReels(rs => rs.map(x => x.item_key === commentsFor.item_key ? { ...x, comment_count: Math.max(0, (x.comment_count || 1) - 1) } : x));
  };
  const renderComment = (c, isReply) => {
    const kids = comments.filter(x => x.parent_id === c.id);
    return (
      <div key={c.id} style={{marginLeft: isReply ? 46 : 0}}>
        <div style={{display: 'flex', gap: 9, padding: '9px 0', alignItems: 'flex-start'}}>
          <span onClick={() => { if (go && /^\d+$/.test(String(c.user_id))) go('profile', String(c.user_id)); }} style={{display: 'inline-flex', cursor: 'pointer'}}>{avatarFor(c.user_name, c.user_id, 34)}</span>
          <div style={{flex: 1, minWidth: 0}}>
            <div style={{display: 'flex', gap: 6, alignItems: 'baseline'}}>
              <span onClick={() => { if (go && /^\d+$/.test(String(c.user_id))) go('profile', String(c.user_id)); }} style={{color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer'}}>{c.user_name || 'User'}</span>
              <span style={{color: 'var(--muted)', fontSize: 11}}>{relTime(c.created_at)}</span>
            </div>
            {c.text ? <div style={{color: '#eee', fontSize: 14, lineHeight: 1.35, wordBreak: 'break-word'}}>{c.text}</div> : null}
            {c.media_file_id && (c.media_kind === 'video'
              ? <video src={`/api/stream?fid=${encodeURIComponent(c.media_file_id)}`} controls playsInline preload="metadata" style={{marginTop: 6, maxWidth: 230, width: '100%', borderRadius: 12, display: 'block', background: '#000'}} />
              : c.media_kind === 'voice'
                ? <audio src={`/api/stream?fid=${encodeURIComponent(c.media_file_id)}`} controls style={{marginTop: 6, width: 230, maxWidth: '100%', display: 'block'}} />
                : c.media_kind === 'sticker'
                  ? <StickerMedia fid={c.media_file_id} />
                  : <img src={`/api/stream?fid=${encodeURIComponent(c.media_file_id)}`} alt="" style={{marginTop: 6, maxWidth: 230, borderRadius: 12, display: 'block'}} />)}
            <div style={{display: 'flex', gap: 14, marginTop: 5, alignItems: 'center'}}>
              <button onClick={() => setReplyTo({ id: c.parent_id || c.id, name: c.user_name || 'User' })} style={{background: 'none', border: 'none', color: 'var(--muted)', fontSize: 12, fontWeight: 600, cursor: 'pointer', padding: 0}}>Reply</button>
              {(isAdmin || String(c.user_id) === String(myId)) && <button onClick={() => delComment(c)} style={{background: 'none', border: 'none', color: 'var(--muted)', fontSize: 12, cursor: 'pointer', padding: 0}}>{I.trash(12)} Delete</button>}
            </div>
          </div>
          <button onClick={() => likeComment(c)} style={{background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, padding: '2px 0 0'}}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill={c.liked ? '#ff3040' : 'none'} stroke={c.liked ? '#ff3040' : '#9a9a9a'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            <span onClick={(e) => { e.stopPropagation(); openCLikers(c); }} style={{color: 'var(--muted)', fontSize: 11, cursor: 'pointer', padding: '2px 4px'}}>{c.like_count || ''}</span>
          </button>
        </div>
        {!isReply && kids.length > 0 && !openReplies[c.id] && (
          <button onClick={() => setOpenReplies(o => ({ ...o, [c.id]: true }))} style={{background: 'none', border: 'none', color: 'var(--muted)', fontSize: 12, fontWeight: 600, cursor: 'pointer', padding: '0 0 6px 46px'}}>— View {kids.length} {kids.length === 1 ? 'reply' : 'replies'}</button>
        )}
        {!isReply && kids.length > 0 && !!openReplies[c.id] && kids.map(k => renderComment(k, true))}
      </div>
    );
  };
  const addIg = async () => {
    if (!igUrl.trim()) { alert('Paste the Instagram link first'); return; }
    setBusy(true);
    try {
      const r = await fetch('/api/admin/ig-reels', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-telegram-id': (tg && tg.initDataUnsafe && tg.initDataUnsafe.user && tg.initDataUnsafe.user.id) || '' }, body: JSON.stringify({ url: igUrl, title: igTitle, caption: igCaption }) }).then(r => r.json());
      if (!r.ok) alert(r.error || 'Could not add that link');
      else if (r.matched_title) alert(igTitle.trim() ? `Added — linked to ${r.matched_title}` : `Added — AI linked it to ${r.matched_title}`);
      else if (!igTitle.trim()) alert('Added — AI could not identify the show, so it has no Watch button');
      else alert('Added (no catalog match for that code name)');
      if (r.ok) { setShowIgForm(false); setIgUrl(''); setIgTitle(''); setIgCaption(''); load(); }
    } catch (e) { alert('Could not add that link'); }
    setBusy(false);
  };
  const shown = reels && savedOnly ? reels.filter(r => r.saved) : reels;
  return (
    <div className="page" style={{padding: '1px 0 0', position: 'relative'}}>
      <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 88, background: 'linear-gradient(rgba(0,0,0,0.55), transparent)', zIndex: 5, pointerEvents: 'none'}} />
      <div style={{position: 'absolute', top: 4, left: 12, right: 12, zIndex: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h1 style={{fontSize: 22, margin: 0, textShadow: '0 2px 10px rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', gap: 8}}>{feed === 'ts' ? <>{I.crown(22)} TSReels</> : <>{I.film(22)} Reels</>}</h1>
        <div style={{display: 'flex', gap: 8}}>
          <button className="btn-gold" style={{width: 'auto', padding: '9px 12px', ...(savedOnly ? {} : {background: 'rgba(255,255,255,0.12)', color: '#fff'})}} onClick={() => setSavedOnly(!savedOnly)}>{I.bookmark(14)} Saved</button>
          {feed === 'ts' && isAdmin && <button className="btn-gold" style={{width: 'auto', padding: '9px 12px'}} onClick={() => setShowIgForm(!showIgForm)}>＋ IG video</button>}
          {(feed === 'user' || isAdmin) && <button className="btn-gold" style={{width: 'auto', padding: '9px 16px'}} onClick={() => setShowForm(!showForm)}>＋ Post</button>}
        </div>
      </div>
      {showForm && (
        <div className="card" style={{cursor: 'default', padding: 16, margin: '72px 12px 14px'}}>
          <div className="field"><label>Video (up to 20 MB)</label>
            <input type="file" accept="video/*" ref={fileRef} /></div>
          <div className="field"><label>Caption</label>
            <input value={caption} onChange={e => setCaption(e.target.value)} placeholder="Say something…" /></div>
          <div className="field"><label>Movie / show name (helps the AI)</label>
            <input value={hint} onChange={e => setHint(e.target.value)} placeholder="e.g. Blue Lock" /></div>
          <button className="btn-gold" disabled={busy} onClick={upload}>{busy ? 'Uploading…' : 'Post reel'}</button>
          <div style={{color: 'var(--muted)', fontSize: 12, marginTop: 8}}>After posting, AI checks the clip — if the movie/show is in Toji Somon, a Watch button appears on your reel.</div>
        </div>
      )}
      {showIgForm && isAdmin && (
        <div className="card" style={{cursor: 'default', padding: 16, margin: '72px 12px 14px'}}>
          <div className="field"><label>Instagram video link</label>
            <input value={igUrl} onChange={e => setIgUrl(e.target.value)} placeholder="https://www.instagram.com/reel/…" /></div>
          <div className="field"><label>Show code name — optional (for the Watch button)</label>
            <input value={igTitle} onChange={e => setIgTitle(e.target.value)} placeholder="e.g. Blue Lock — or leave empty" /></div>
          <div className="field"><label>Caption (optional)</label>
            <input value={igCaption} onChange={e => setIgCaption(e.target.value)} placeholder="Say something…" /></div>
          <button className="btn-gold" disabled={busy} onClick={addIg}>{busy ? 'Adding…' : 'Add video'}</button>
          <div style={{color: 'var(--muted)', fontSize: 12, marginTop: 8}}>The video stays on Instagram — only the link is saved here, so it can never be wiped. Leave the code name empty and AI identifies the show from the post itself.</div>
        </div>
      )}
      {reels === null && <div style={{color: 'var(--muted)', textAlign: 'center', padding: '110px 30px 30px'}}>{t('loading')}</div>}
      {reels !== null && reels.length === 0 && !showForm && (
        <div style={{color: 'var(--muted)', textAlign: 'center', padding: '120px 40px 40px'}}>No reels yet.<br />Be the first to post one</div>
      )}
      {reels !== null && savedOnly && shown.length === 0 && (
        <div style={{color: 'var(--muted)', textAlign: 'center', padding: '120px 40px 40px'}}>Nothing saved yet.<br />Tap the bookmark icon on a video to save it here.</div>
      )}
      {reels !== null && shown.length > 0 && (
        <div style={{height: 'calc(100dvh - 68px)', overflowY: 'auto', scrollSnapType: 'y mandatory'}}>
          {shown.map(r => (
            <div key={r.id} style={{height: '100%', scrollSnapAlign: 'start', position: 'relative', background: '#000', overflow: 'hidden'}}>
              {r.kind === 'promo' ? (
                <div onClick={() => { beaconView(r.item_key); if (r.episode_id) go('video', r.episode_id); else openLinked(r); }} style={{width: '100%', height: '100%', position: 'relative', cursor: 'pointer', background: '#000'}}>
                  {r.cover_file_id
                    ? <img src={coverUrl(r.cover_file_id)} alt="" style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} />
                    : <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(160deg, #2b1055 0%, #7597de 55%, #ff7eb3 100%)'}} />}
                  <div style={{position: 'absolute', top: 76, left: 12, background: 'var(--gold)', color: '#000', fontWeight: 700, fontSize: 12, padding: '6px 10px', borderRadius: 8, zIndex: 3}}>🆕 NEW EPISODE</div>
                  <div style={{position: 'absolute', left: 0, right: 0, top: '36%', textAlign: 'center', color: '#fff', fontSize: 52, textShadow: '0 4px 18px rgba(0,0,0,0.85)', pointerEvents: 'none'}}>▶</div>
                </div>
              ) : r.source === 'ig' ? (
                playingIg === r.id ? (
                  <div className="ig-live-slot" style={{width: '100%', height: '100%', position: 'relative', background: '#000', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    {(() => {
                      // Show ONLY the video: crop the embed to the video's own area
                      // (aspect learned from the poster) and center it on black —
                      // Instagram's white panel below the video never appears.
                      const A = igAspect[r.id] || 0.8;
                      const cardW = Math.min(window.innerWidth || 400, 600);
                      const cardH = Math.max(300, (window.innerHeight || 700) - 68);
                      const vH = cardW / A;
                      const winH = Math.min(vH * 0.995, cardH);
                      const shift = 58 + Math.max(0, (vH - cardH) / 2);
                      return (
                        <div style={{width: '100%', height: winH, overflow: 'hidden', position: 'relative', background: '#000', flexShrink: 0}}>
                          <iframe src={`https://www.instagram.com/reel/${r.ig_code}/embed`} title={r.caption || 'Video'}
                            style={{width: '100%', height: vH + 58, marginTop: -shift, border: 0, background: '#000', display: 'block'}} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
                        </div>
                      );
                    })()}
                    <button onClick={(e) => { e.stopPropagation(); setPlayingIg(null); }} style={{position: 'absolute', top: 102, right: 12, width: 36, height: 36, borderRadius: '50%', border: 'none', background: 'rgba(20,20,20,0.78)', color: '#fff', fontSize: 15, cursor: 'pointer', zIndex: 6}}>✕</button>
                  </div>
                ) : (
                  <div onClick={(e) => tapMedia(r, () => { beaconView(r.item_key); setPlayingIg(r.id); }, { x: e.clientX, y: e.clientY })} style={{width: '100%', height: '100%', position: 'relative', cursor: 'pointer', background: '#000'}}>
                    {r.thumb
                      ? <img src={r.thumb} alt="" onLoad={e => noteAspect(r.id, e)} style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} />
                      : <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(160deg, #2b1055 0%, #7597de 55%, #ff7eb3 100%)'}} />}
                  </div>
                )
              ) : (
                <video className="reel-video" src={`/api/stream?fid=${encodeURIComponent(r.file_id)}&sz=${r.file_size || 0}`} loop playsInline muted={muted} preload="metadata"
                  onPlay={() => { beaconView(r.item_key); setPausedMap(m => ({...m, [r.item_key]: false})); }}
                  onPause={() => setPausedMap(m => ({...m, [r.item_key]: true}))}
                  onClick={(e) => { const el = e.currentTarget; tapMedia(r, () => { if (el.paused) { const p = el.play(); if (p) p.catch(() => {}); } else el.pause(); }, { x: e.clientX, y: e.clientY }); }} style={{width: '100%', height: '100%', objectFit: 'contain', display: 'block'}} />
              )}
              {r.source === 'tg' && pausedMap[r.item_key] && (
                <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 5}}>
                  <div style={{position: 'relative', width: 68, height: 68, borderRadius: '50%', background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', paddingLeft: 5}}>
                    {I.play(30)}
                    <button onClick={(e) => { e.stopPropagation(); toggleMuted(); }} style={{position: 'absolute', top: -16, left: -26, width: 37, height: 37, borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.55)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', pointerEvents: 'auto'}}>
                      {muted ? I.volX(18) : I.vol(18)}
                    </button>
                  </div>
                </div>
              )}
              <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, padding: '34px 70px 14px 14px', background: 'linear-gradient(transparent, rgba(0,0,0,0.85))', pointerEvents: 'none'}}>
                {r.reposted_by && <div style={{color: 'var(--gold)', fontSize: 12, marginBottom: 4}}>Reposted by {r.reposted_by}</div>}
                {r.caption && <div style={{color: '#fff', fontSize: 15, marginBottom: 4}}>{r.caption}</div>}
                {r.uploader_name && r.source !== 'ig' && <div onClick={() => { if (r.uploader_id && /^\d+$/.test(String(r.uploader_id))) go('profile', String(r.uploader_id)); }} style={{color: 'var(--muted)', fontSize: 12, marginBottom: 8, cursor: r.uploader_id ? 'pointer' : 'default'}}>{`@${r.uploader_name}`}{r.created_at ? ` · ${relTime(r.created_at)}` : ''}</div>}
                <div style={{display: 'flex', gap: 8, alignItems: 'center', pointerEvents: 'auto'}}>
                  {r.link_title && (
                    <button className="btn-gold" style={{width: 'auto', padding: '10px 16px'}} onClick={() => openLinked(r)}>{I.play(13)} Watch {r.link_title}</button>
                  )}
                  {r.status === 'identifying' && <span style={{color: '#fff', fontSize: 12, background: 'rgba(255,255,255,0.14)', padding: '6px 10px', borderRadius: 8}}>AI is checking this clip…</span>}
                  {r.status !== 'identifying' && !r.link_title && r.ai_title && <span style={{color: 'var(--muted)', fontSize: 12}}>Looks like: {r.ai_title} (not in catalog)</span>}
                  {isAdmin && <button onClick={() => openEdit(r)} style={{marginLeft: 'auto', background: 'rgba(255,255,255,0.12)', border: 'none', color: '#fff', borderRadius: 8, padding: '8px 10px', cursor: 'pointer'}}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg></button>}
                  {isAdmin && <button onClick={() => del(r)} style={{background: 'rgba(255,255,255,0.12)', border: 'none', color: '#fff', borderRadius: 8, padding: '8px 10px', cursor: 'pointer'}}>{I.trash(15)}</button>}
                </div>
              </div>
              {r.source === 'tg' && r.kind !== 'promo' && <div style={{position: 'absolute', top: 10, right: 12, color: '#fff', fontSize: 18, opacity: 0.85, pointerEvents: 'none'}}>{muted ? I.volX(19) : I.vol(19)}</div>}
              {r.kind === 'teaser' && <div style={{position: 'absolute', top: 10, left: 12, background: 'var(--gold)', color: '#000', fontWeight: 700, fontSize: 12, padding: '6px 10px', borderRadius: 8, zIndex: 4, pointerEvents: 'none'}}>🆕 NEW EPISODE</div>}
              <div style={{position: 'absolute', right: 12, bottom: 118, display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center', zIndex: 4}}>
                {[
                  { svg: <svg width="31" height="31" viewBox="0 0 24 24" fill={r.liked ? '#ff3040' : 'none'} stroke={r.liked ? '#ff3040' : '#fff'} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>, count: r.like_count, fn: () => act(r, 'like'), countFn: () => openLikers(r) },
                  { svg: <svg width="31" height="31" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>, count: r.comment_count, fn: () => openComments(r) },
                  { svg: <svg width="29" height="29" viewBox="0 0 24 24" fill="none" stroke={r.reposted ? '#e8b33c' : '#fff'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>, count: r.repost_count, fn: () => act(r, 'repost') },
                  { svg: <svg width="29" height="29" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>, count: r.share_count, fn: () => share(r) },
                  { svg: <svg width="29" height="29" viewBox="0 0 24 24" fill={r.saved ? '#e8b33c' : 'none'} stroke={r.saved ? '#e8b33c' : '#fff'} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>, count: r.save_count, fn: () => act(r, 'save') },
                ].map((b, i) => (
                  <button key={i} data-likebtn={i === 0 ? r.item_key : undefined} onClick={(e) => { e.stopPropagation(); b.fn(); }} style={{background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: 0, filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.65))'}}>
                    {i === 0 ? <span className={landed === r.item_key ? 'rail-pulse' : undefined} style={{display: 'flex'}}>{b.svg}</span> : b.svg}
                    <span onClick={(e) => { if (b.countFn) { e.stopPropagation(); b.countFn(); } }} style={{color: '#fff', fontSize: 13, fontWeight: 600, textShadow: '0 1px 5px rgba(0,0,0,0.85)'}}>{b.count || 0}</span>
                  </button>
                ))}
                <div onClick={() => openViewers(r)} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.65))', cursor: isAdmin ? 'pointer' : 'default'}}>
                  <svg width="29" height="29" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  <span style={{color: '#fff', fontSize: 13, fontWeight: 600, textShadow: '0 1px 5px rgba(0,0,0,0.85)'}}>{r.view_count || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {burst && (
        <div className="burst-heart" style={{left: burst.x, top: burst.y, '--fx': burst.dx + 'px', '--fy': burst.dy + 'px'}}>
          <svg width="112" height="112" viewBox="0 0 24 24">
            <defs>
              <linearGradient id="burstGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#feda75" />
                <stop offset="30%" stopColor="#fa7e1e" />
                <stop offset="58%" stopColor="#d62976" />
                <stop offset="82%" stopColor="#a832b4" />
                <stop offset="100%" stopColor="#962fbf" />
              </linearGradient>
            </defs>
            <path fill="url(#burstGrad)" stroke="rgba(255,255,255,0.45)" strokeWidth="0.5" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            <ellipse cx="7.5" cy="8.1" rx="2.7" ry="1.7" transform="rotate(-24 7.5 8.1)" fill="rgba(255,255,255,0.5)" />
          </svg>
        </div>
      )}
      {shareFor && <ShareSheet row={shareFor} onClose={() => setShareFor(null)} onCount={() => countShare(shareFor)} />}
      {editFor && (
        <div style={{position: 'fixed', inset: 0, zIndex: 3001, background: 'rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}} onClick={() => setEditFor(null)}>
          <div style={{background: '#131313', borderRadius: '20px 20px 0 0', padding: '10px 16px 20px'}} onClick={e => e.stopPropagation()}>
            <div style={{width: 42, height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.25)', margin: '2px auto 12px'}} />
            <b style={{color: '#fff', fontSize: 16}}>Edit reel</b>
            <div style={{color: 'var(--muted)', fontSize: 12, margin: '12px 0 5px'}}>Caption</div>
            <input value={editCaption} onChange={e => setEditCaption(e.target.value)} placeholder="Caption shown under the reel" style={{width: '100%', boxSizing: 'border-box', background: '#1e1e1e', border: '1px solid #333', borderRadius: 10, color: '#fff', padding: '11px 12px', fontSize: 14}} />
            <div style={{color: 'var(--muted)', fontSize: 12, margin: '14px 0 5px'}}>Show / movie code name (sets the Watch button)</div>
            <input value={editHint} onChange={e => setEditHint(e.target.value)} placeholder="e.g. Blue Lock — empty keeps the current link" style={{width: '100%', boxSizing: 'border-box', background: '#1e1e1e', border: '1px solid #333', borderRadius: 10, color: '#fff', padding: '11px 12px', fontSize: 14}} />
            {editFor.link_title && <div style={{color: 'var(--gold)', fontSize: 12, marginTop: 8}}>Currently linked: {editFor.link_title}</div>}
            <div style={{display: 'flex', gap: 8, marginTop: 16}}>
              <button className="btn-gold" disabled={editBusy} onClick={() => saveEdit(false)} style={{flex: 1, padding: '12px 0'}}>{editBusy ? 'Saving…' : 'Save'}</button>
              {editFor.link_title && <button onClick={() => saveEdit(true)} style={{background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: 10, padding: '12px 14px', cursor: 'pointer'}}>Unlink</button>}
              <button onClick={() => setEditFor(null)} style={{background: 'none', border: '1px solid #333', color: '#fff', borderRadius: 10, padding: '12px 14px', cursor: 'pointer'}}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {likersRows !== false && <PeopleSheet title="Liked by" rows={likersRows} onClose={() => setLikersRows(false)} go={go} />}
      {viewersRows !== false && <PeopleSheet title="Watched by" rows={viewersRows} onClose={() => setViewersRows(false)} go={go} />}
      {cLikersRows !== false && <PeopleSheet title="Liked by" rows={cLikersRows} onClose={() => setCLikersRows(false)} go={go} />}
      {commentsFor && (
        <div style={{position: 'fixed', inset: 0, zIndex: 3001, background: 'rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}} onClick={() => setCommentsFor(null)}>
          <div style={{background: '#131313', borderRadius: '20px 20px 0 0', maxHeight: '78dvh', display: 'flex', flexDirection: 'column', padding: '8px 14px 10px'}} onClick={e => e.stopPropagation()}>
            <div style={{width: 42, height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.25)', margin: '2px auto 10px'}} />
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4}}>
              <b style={{color: '#fff', fontSize: 15}}>Comments{comments.length ? ` · ${comments.length}` : ''}</b>
              <button onClick={() => setCommentsFor(null)} style={{background: 'none', border: 'none', color: '#fff', fontSize: 18, cursor: 'pointer'}}>✕</button>
            </div>
            <div style={{overflowY: 'auto', flex: 1, minHeight: 60}}>
              {comments.length === 0 && <div style={{color: 'var(--muted)', textAlign: 'center', padding: 22}}>No comments yet — be the first.</div>}
              {comments.filter(c => !c.parent_id).map(c => renderComment(c, false))}
            </div>
            {replyTo && (
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: '7px 10px', marginTop: 8}}>
                <span style={{color: 'var(--muted)', fontSize: 12}}>Replying to <b style={{color: '#fff'}}>{replyTo.name}</b></span>
                <button onClick={() => setReplyTo(null)} style={{background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 13}}>✕</button>
              </div>
            )}
            {mediaAtt && (
              <div style={{display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: '7px 10px', marginTop: 8}}>
                {mediaAtt.kind === 'video'
                  ? <video src={`/api/stream?fid=${encodeURIComponent(mediaAtt.file_id)}`} muted playsInline style={{width: 44, height: 44, objectFit: 'cover', borderRadius: 8, background: '#000'}} />
                  : <img src={`/api/stream?fid=${encodeURIComponent(mediaAtt.file_id)}`} alt="" style={{width: 44, height: 44, objectFit: 'cover', borderRadius: 8}} />}
                <span style={{color: '#eee', fontSize: 13, flex: 1}}>{mediaAtt.kind === 'video' ? <span style={{display: 'inline-flex', alignItems: 'center', gap: 6}}>{I.video(14)} Video attached</span> : mediaAtt.kind === 'gif' ? <span style={{display: 'inline-flex', alignItems: 'center', gap: 6}}>{I.film(14)} GIF attached</span> : <span style={{display: 'inline-flex', alignItems: 'center', gap: 6}}>{I.image(14)} Picture attached</span>}</span>
                <button onClick={() => setMediaAtt(null)} style={{background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 14}}>✕</button>
              </div>
            )}
            <div style={{display: 'flex', justifyContent: 'space-between', padding: '8px 2px 2px'}}>
              {['❤️', '🔥', '😂', '😍', '😮', '👏', '🙌', '🥺'].map(e => (
                <button key={e} onClick={() => setCommentDraft(d => (d + e).slice(0, 500))} style={{background: 'none', border: 'none', fontSize: 21, cursor: 'pointer', padding: 2}}>{e}</button>
              ))}
            </div>
            <div style={{display: 'flex', gap: 8, marginTop: 6, alignItems: 'center'}}>
              {avatarFor(myName, myId, 34)}
              <input value={commentDraft} onChange={e => setCommentDraft(e.target.value)} placeholder="Add a comment…" style={{flex: 1, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 999, color: '#fff', padding: '11px 15px', fontSize: 14, minWidth: 0}} onKeyDown={e => { if (e.key === 'Enter') postComment(); }} />
              <input type="file" accept="image/*,video/*,audio/*,.webp,.webm" ref={commentFileRef} style={{display: 'none'}} onChange={pickCommentMedia} />
              <button onClick={() => commentFileRef.current && commentFileRef.current.click()} disabled={mediaBusy} style={{background: 'none', border: 'none', cursor: 'pointer', padding: 4, opacity: mediaBusy ? 0.5 : 1}} title="Attach a picture, GIF or video">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
              </button>
              <button className="btn-gold" style={{width: 'auto', padding: '10px 18px', opacity: (commentDraft.trim() || mediaAtt) ? 1 : 0.5}} onClick={postComment}>Post</button>
            </div>
            <div style={{color: 'var(--muted)', fontSize: 11, marginTop: 7, textAlign: 'center'}}>Pictures, GIFs and videos are AI-checked — sexual or violent content earns a warning; 3 strikes = a 7-day block in the app and the bot.</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Comments — one shared sheet for episodes and movies ───────────────────
// Same thread system as Reels (item_key ep:<episode> / mv:<movie>), same
// AI-checked attachments: photos, GIFs, videos, stickers and voice.
// Stickers attach as files (.webp/.webm — a Mini App cannot open Telegram's
// own sticker panel; premium stickers are the same file types). Voice can
// be recorded in place or attached as an audio file.
function StickerMedia({ fid }) {
  const [vid, setVid] = useState(false);
  const src = `/api/stream?fid=${encodeURIComponent(fid)}`;
  if (vid) return <video src={src} autoPlay loop muted playsInline style={{marginTop: 6, maxWidth: 150, width: '100%', borderRadius: 12, display: 'block', background: '#000'}} />;
  return <img src={src} alt="" onError={() => setVid(true)} style={{marginTop: 6, maxWidth: 150, width: '100%', borderRadius: 12, display: 'block'}} />;
}

function CommentsSheet({ itemKey, onClose, onCountChange, go }) {
  const myId = viewerId();
  const myName = (tg && tg.initDataUnsafe && tg.initDataUnsafe.user && tg.initDataUnsafe.user.first_name) || 'Guest';
  const [list, setList] = useState(null);
  const [cLikersRows, setCLikersRows] = useState(false);
  const openCLikers = async (c) => { setCLikersRows(null); const d = await fetch(`/api/reels/comments/${c.id}/likes`, { headers: { 'x-telegram-id': myId, 'x-telegram-name': encodeURIComponent(myName || '') } }).then(x => x.json()).catch(() => null); setCLikersRows(d && d.users ? d.users.map(u => ({ user_id: u.user_id, user_name: u.user_name, sub: relTime(u.created_at) })) : []); };
  const [draft, setDraft] = useState('');
  const [mediaAtt, setMediaAtt] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [openReplies, setOpenReplies] = useState({});
  const [mediaBusy, setMediaBusy] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [recording, setRecording] = useState(false);
  const fileRef = useRef(null);
  const recRef = useRef(null);
  useEffect(() => { api.get('/api/admin/check').then(d => setIsAdmin(!!d.isAdmin)).catch(() => {}); }, []);
  useEffect(() => {
    let live = true;
    api.get(`/api/reels/${encodeURIComponent(itemKey)}/comments`).then(d => { if (live) setList(Array.isArray(d) ? d : []); }).catch(() => { if (live) setList([]); });
    return () => { live = false; };
  }, [itemKey]);
  const relTime = (iso) => {
    const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
    if (s < 60) return 'now';
    if (s < 3600) return Math.floor(s / 60) + 'm';
    if (s < 86400) return Math.floor(s / 3600) + 'h';
    if (s < 7 * 86400) return Math.floor(s / 86400) + 'd';
    return Math.floor(s / (7 * 86400)) + 'w';
  };
  const AV_GRADS = ['linear-gradient(135deg,#f6c453,#de9b2d)', 'linear-gradient(135deg,#7b61ff,#4a2fd6)', 'linear-gradient(135deg,#ff6a88,#d63a5c)', 'linear-gradient(135deg,#2fd67b,#159455)', 'linear-gradient(135deg,#39a0ff,#2563eb)', 'linear-gradient(135deg,#ff9440,#e05e12)'];
  const avatarFor = (name, uid, size) => {
    const n = String(name || 'User');
    let h = 0; const seed = String(uid || n); for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
    return (
      <span style={{position: 'relative', width: size, height: size, borderRadius: '50%', background: AV_GRADS[h % AV_GRADS.length], color: '#fff', fontWeight: 700, fontSize: size * 0.45, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, textTransform: 'uppercase', overflow: 'hidden'}}>
        {n.trim().charAt(0) || '?'}
        {/^\d+$/.test(String(uid || '')) && <img src={`/api/avatar/${uid}`} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none'; }} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}} />}
      </span>
    );
  };
  const uploadMedia = async (file, intent) => {
    const fd = new FormData(); fd.append('file', file); if (intent) fd.append('intent', intent);
    return fetch('/api/reels/media', { method: 'POST', headers: { 'x-telegram-id': myId, 'x-telegram-name': encodeURIComponent(myName || '') }, body: fd }).then(x => x.json()).catch(() => null);
  };
  const pickMedia = async () => {
    const f = fileRef.current && fileRef.current.files && fileRef.current.files[0];
    if (!f) return;
    const name = (f.name || '').toLowerCase();
    if (name.endsWith('.tgs')) { alert('That sticker format (.tgs) can\'t be shown in the app — .webp and .webm stickers work.'); try { fileRef.current.value = ''; } catch (e) {} return; }
    if (f.size > 20 * 1024 * 1024) { alert('Media up to 20 MB'); return; }
    let intent = '';
    if ((f.type || '').startsWith('audio/')) intent = 'voice';
    else if (name.endsWith('.webp') || name.endsWith('.webm') || f.type === 'image/webp') intent = 'sticker';
    setMediaBusy(true);
    const res = await uploadMedia(f, intent);
    setMediaBusy(false);
    if (res && res.ok) setMediaAtt({ file_id: res.file_id, kind: res.kind });
    else alert((res && res.error) || 'Could not attach that file');
    try { fileRef.current.value = ''; } catch (e) {}
  };
  const toggleRecord = async () => {
    if (recording) { try { recRef.current && recRef.current.stop(); } catch (e) {} return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      const chunks = [];
      rec.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };
      rec.onstop = async () => {
        stream.getTracks().forEach(x => x.stop());
        setRecording(false);
        const blob = new Blob(chunks, { type: rec.mimeType || 'audio/webm' });
        if (!blob.size) return;
        setMediaBusy(true);
        const res = await uploadMedia(new File([blob], 'voice.webm', { type: blob.type }), 'voice');
        setMediaBusy(false);
        if (res && res.ok) setMediaAtt({ file_id: res.file_id, kind: 'voice' });
        else alert((res && res.error) || 'Could not attach that voice message');
      };
      recRef.current = rec;
      rec.start();
      setRecording(true);
    } catch (e) { alert('Voice recording is not available here — you can attach a voice file with the picture button instead.'); }
  };
  const post = async () => {
    const text = draft.trim();
    if (!text && !mediaAtt) return;
    const res = await fetch(`/api/reels/${encodeURIComponent(itemKey)}/comments`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-telegram-id': myId, 'x-telegram-name': encodeURIComponent(myName || '') }, body: JSON.stringify({ text, media_file_id: mediaAtt ? mediaAtt.file_id : '', media_kind: mediaAtt ? mediaAtt.kind : '', parent_id: replyTo ? replyTo.id : 0 }) }).then(x => x.json()).catch(() => null);
    if (res && res.ok) {
      const parentId = replyTo ? replyTo.id : null;
      setDraft(''); setMediaAtt(null); setReplyTo(null);
      if (parentId) setOpenReplies(o => ({ ...o, [parentId]: true }));
      setList(cs => [...(cs || []), { id: res.id, user_id: myId, user_name: myName, text, created_at: new Date().toISOString(), media_file_id: res.media_file_id, media_kind: res.media_kind, parent_id: parentId, like_count: 0, liked: false }]);
      if (onCountChange && res.counts) onCountChange(res.counts.comments);
    } else if (res && res.error) alert(res.error);
  };
  const like = async (c) => {
    const res = await fetch(`/api/reels/comments/${c.id}/like`, { method: 'POST', headers: { 'x-telegram-id': myId, 'x-telegram-name': encodeURIComponent(myName || '') } }).then(x => x.json()).catch(() => null);
    if (res && res.ok) setList(cs => (cs || []).map(x => x.id === c.id ? { ...x, liked: res.active, like_count: res.count } : x));
  };
  const del = async (c) => {
    await fetch(`/api/reels/comments/${c.id}`, { method: 'DELETE', headers: { 'x-telegram-id': myId } }).then(x => x.json()).catch(() => null);
    setList(cs => (cs || []).filter(x => x.id !== c.id));
    if (onCountChange) onCountChange(Math.max(0, ((list || []).length || 1) - 1));
  };
  const renderMedia = (c) => {
    if (!c.media_file_id) return null;
    const src = `/api/stream?fid=${encodeURIComponent(c.media_file_id)}`;
    if (c.media_kind === 'video') return <video src={src} controls playsInline preload="metadata" style={{marginTop: 6, maxWidth: 230, width: '100%', borderRadius: 12, display: 'block', background: '#000'}} />;
    if (c.media_kind === 'voice') return <audio src={src} controls style={{marginTop: 6, width: 230, maxWidth: '100%', display: 'block'}} />;
    if (c.media_kind === 'sticker') return <StickerMedia fid={c.media_file_id} />;
    return <img src={src} alt="" style={{marginTop: 6, maxWidth: 230, borderRadius: 12, display: 'block'}} />;
  };
  const renderComment = (c, isReply) => {
    const kids = (list || []).filter(x => x.parent_id === c.id);
    return (
      <div key={c.id} style={{marginLeft: isReply ? 46 : 0}}>
        <div style={{display: 'flex', gap: 9, padding: '9px 0', alignItems: 'flex-start'}}>
          <span onClick={() => { if (go && /^\d+$/.test(String(c.user_id))) go('profile', String(c.user_id)); }} style={{display: 'inline-flex', cursor: 'pointer'}}>{avatarFor(c.user_name, c.user_id, 34)}</span>
          <div style={{flex: 1, minWidth: 0}}>
            <div style={{display: 'flex', gap: 6, alignItems: 'baseline'}}>
              <span onClick={() => { if (go && /^\d+$/.test(String(c.user_id))) go('profile', String(c.user_id)); }} style={{color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer'}}>{c.user_name || 'User'}</span>
              <span style={{color: 'var(--muted)', fontSize: 11}}>{relTime(c.created_at)}</span>
            </div>
            {c.text ? <div style={{color: '#eee', fontSize: 14, lineHeight: 1.35, wordBreak: 'break-word'}}>{c.text}</div> : null}
            {renderMedia(c)}
            <div style={{display: 'flex', gap: 14, marginTop: 5, alignItems: 'center'}}>
              <button onClick={() => setReplyTo({ id: c.parent_id || c.id, name: c.user_name || 'User' })} style={{background: 'none', border: 'none', color: 'var(--muted)', fontSize: 12, fontWeight: 600, cursor: 'pointer', padding: 0}}>Reply</button>
              {(isAdmin || String(c.user_id) === String(myId)) && <button onClick={() => del(c)} style={{background: 'none', border: 'none', color: 'var(--muted)', fontSize: 12, cursor: 'pointer', padding: 0}}>{I.trash(12)} Delete</button>}
            </div>
          </div>
          <button onClick={() => like(c)} style={{background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, padding: '2px 0 0'}}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill={c.liked ? '#ff3040' : 'none'} stroke={c.liked ? '#ff3040' : '#9a9a9a'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            <span onClick={(e) => { e.stopPropagation(); openCLikers(c); }} style={{color: 'var(--muted)', fontSize: 11, cursor: 'pointer', padding: '2px 4px'}}>{c.like_count || ''}</span>
          </button>
        </div>
        {!isReply && kids.length > 0 && !openReplies[c.id] && (
          <button onClick={() => setOpenReplies(o => ({ ...o, [c.id]: true }))} style={{background: 'none', border: 'none', color: 'var(--muted)', fontSize: 12, fontWeight: 600, cursor: 'pointer', padding: '0 0 6px 46px'}}>— View {kids.length} {kids.length === 1 ? 'reply' : 'replies'}</button>
        )}
        {!isReply && kids.length > 0 && !!openReplies[c.id] && kids.map(k => renderComment(k, true))}
      </div>
    );
  };
  return (
    <div style={{position: 'fixed', inset: 0, zIndex: 3001, background: 'rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}} onClick={onClose}>
      <div style={{background: '#101012', borderRadius: '20px 20px 0 0', maxHeight: '80dvh', display: 'flex', flexDirection: 'column', padding: '10px 0 14px'}} onClick={e => e.stopPropagation()}>
        <div style={{width: 40, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.25)', margin: '2px auto 10px'}} />
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px 6px'}}>
          <span style={{color: '#fff', fontSize: 16, fontWeight: 700}}>Comments</span>
          <button onClick={onClose} style={{background: 'none', border: 'none', color: '#fff', fontSize: 18, cursor: 'pointer'}}>✕</button>
        </div>
        <div style={{overflowY: 'auto', padding: '0 16px', flex: 1}}>
          {list === null && <div style={{color: 'var(--muted)', textAlign: 'center', padding: 22}}>…</div>}
          {list !== null && list.length === 0 && <div style={{color: 'var(--muted)', textAlign: 'center', padding: 22}}>No comments yet — be the first.</div>}
          {list !== null && list.filter(c => !c.parent_id).map(c => renderComment(c, false))}
        </div>
        <div style={{padding: '6px 16px 0'}}>
          {replyTo && (
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: '6px 10px', marginBottom: 6}}>
              <span style={{color: 'var(--muted)', fontSize: 12}}>Replying to {replyTo.name}</span>
              <button onClick={() => setReplyTo(null)} style={{background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 13}}>✕</button>
            </div>
          )}
          {mediaAtt && (
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(212,168,83,0.12)', border: '1px solid rgba(212,168,83,0.35)', borderRadius: 10, padding: '6px 10px', marginBottom: 6}}>
              <span style={{color: 'var(--gold-light)', fontSize: 12}}>📎 {mediaAtt.kind} attached</span>
              <button onClick={() => setMediaAtt(null)} style={{background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 13}}>✕</button>
            </div>
          )}
          <div style={{display: 'flex', justifyContent: 'space-between', padding: '0 2px'}}>
            {['❤️', '🔥', '😂', '😍', '😮', '👏', '🙌', '🥺'].map(e => (
              <button key={e} onClick={() => setDraft(d => (d + e).slice(0, 500))} style={{background: 'none', border: 'none', fontSize: 21, cursor: 'pointer', padding: 2}}>{e}</button>
            ))}
          </div>
          <div style={{display: 'flex', gap: 8, marginTop: 6, alignItems: 'center'}}>
            {avatarFor(myName, myId, 34)}
            <input value={draft} onChange={e => setDraft(e.target.value)} placeholder={recording ? '● Recording… tap the mic to stop' : 'Add a comment…'} style={{flex: 1, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 999, color: '#fff', padding: '11px 15px', fontSize: 14, minWidth: 0}} onKeyDown={e => { if (e.key === 'Enter') post(); }} />
            <input type="file" accept="image/*,video/*,audio/*,.webp,.webm" ref={fileRef} style={{display: 'none'}} onChange={pickMedia} />
            <button onClick={() => fileRef.current && fileRef.current.click()} disabled={mediaBusy} style={{background: 'none', border: 'none', cursor: 'pointer', padding: 4, opacity: mediaBusy ? 0.5 : 1}} title="Attach a picture, GIF, video, sticker or voice file">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
            </button>
            <button onClick={toggleRecord} disabled={mediaBusy} style={{background: recording ? 'rgba(255,48,64,0.25)' : 'none', border: recording ? '1px solid #ff3040' : 'none', borderRadius: '50%', cursor: 'pointer', padding: 5, opacity: mediaBusy ? 0.5 : 1}} title="Record a voice message">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={recording ? '#ff3040' : '#fff'} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
            </button>
            <button className="btn-gold" style={{width: 'auto', padding: '10px 18px', opacity: (draft.trim() || mediaAtt) ? 1 : 0.5}} onClick={post}>Post</button>
          </div>
          {cLikersRows !== false && <PeopleSheet title="Liked by" rows={cLikersRows} onClose={() => setCLikersRows(false)} go={go} />}
          <div style={{color: 'var(--muted)', fontSize: 11, marginTop: 7, textAlign: 'center'}}>Pictures, GIFs, videos and stickers are AI-checked — sexual or violent content earns a warning; 3 strikes = a 7-day block in the app and the bot.</div>
        </div>
      </div>
    </div>
  );
}

function CommentsBtn({ itemKey, go }) {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(null);
  useEffect(() => { api.get(`/api/reels/${encodeURIComponent(itemKey)}/comments`).then(d => setCount(Array.isArray(d) ? d.length : 0)).catch(() => setCount(0)); }, [itemKey]);
  return (
    <React.Fragment>
      <button className="btn btn-ghost" onClick={() => setOpen(true)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
        Comments{count ? ` (${count})` : ''}
      </button>
      {open && <CommentsSheet itemKey={itemKey} go={go} onClose={() => setOpen(false)} onCountChange={(n) => setCount(n)} />}
    </React.Fragment>
  );
}

function apiPost(path, body) {
  return fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-telegram-id': viewerId(), 'x-telegram-name': encodeURIComponent(myDisplayName()), ...sessHeaders() }, body: JSON.stringify(body || {}) }).then(r => r.json()).catch(() => null);
}
function relTimeShort(iso) {
  if (!iso) return '';
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 60) return 'now';
  if (s < 3600) return Math.floor(s / 60) + 'm';
  if (s < 86400) return Math.floor(s / 3600) + 'h';
  if (s < 604800) return Math.floor(s / 86400) + 'd';
  if (s < 2592000) return Math.floor(s / 604800) + 'w';
  return Math.floor(s / 2592000) + 'mo';
}
// WhatsApp-style presence: under 2 minutes = online, else "seen Xm ago".
function presenceLabel(iso) {
  if (!iso) return '';
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 120) return 'online';
  return 'seen ' + relTimeShort(iso) + ' ago';
}
function isOnline(iso) {
  if (!iso) return false;
  return (Date.now() - new Date(iso).getTime()) / 1000 < 120;
}
// Make URLs inside chat messages tappable (shared reel links land here).
function linkify(text) {
  return String(text || '').split(/(https?:\/\/[^\s]+)/g).map((p, i) => /^https?:\/\//.test(p)
    ? <a key={i} href={p} target="_blank" rel="noreferrer" style={{color: 'inherit', textDecoration: 'underline', wordBreak: 'break-all'}}>{p}</a>
    : p);
}
const LANG_OPTS = [
  { code: 'tj', label: 'Тоҷикӣ' }, { code: 'ru', label: 'Русский' },
  { code: 'en', label: 'English' }, { code: 'fa', label: 'فارسی' },
  { code: 'uz', label: "O'zbekcha" },
];

// ── Profile (Instagram-style): avatar, stats, TSReels grid, follows, and
// (on your own page) the interested-languages picker that targets
// new-episode posts to your feed. Opened for any user via userId. ──
function ProfilePage({ go, userId, back }) {
  const [data, setData] = useState(null);
  const [pick, setPick] = useState([]);
  const [following, setFollowing] = useState(false);
  const [followers, setFollowers] = useState(0);
  const user = (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) || null;
  const self = !userId || String(userId) === String(viewerId());
  const myName = user ? ((user.first_name || '') + (user.last_name ? ' ' + user.last_name : '')) : 'Guest';
  const dispName = self ? myName : (data ? (data.user_name || 'User') : '…');
  useEffect(() => {
    api.get(self ? '/api/profile' : '/api/profile/' + userId).then(d => {
      if (d && d.ok) { setData(d); setPick(d.langs || []); setFollowing(!!d.following); setFollowers(d.stats ? d.stats.followers : 0); }
    }).catch(() => {});
  }, [userId]);
  const toggleLang = (code) => {
    const next = pick.includes(code) ? pick.filter(c => c !== code) : [...pick, code];
    setPick(next);
    apiPost('/api/me/langs', { langs: next });
  };
  const toggleFollow = async () => {
    const r = await apiPost('/api/follow', { user_id: String(userId) });
    if (r && r.ok) { setFollowing(r.following); setFollowers(r.followers); }
  };
  const openChat = async () => {
    const r = await apiPost('/api/dm/threads', { user_id: String(userId) });
    if (r && r.id) go('chat', r.id);
  };
  const initials = (dispName || 'U').trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('');
  const stat = (n, label) => (
    <div style={{textAlign: 'center', minWidth: 52}}>
      <div style={{fontWeight: 800, fontSize: 16}}>{n}</div>
      <div style={{color: 'var(--muted)', fontSize: 11}}>{label}</div>
    </div>
  );
  return (
    <div className="page" style={{maxWidth: 560, margin: '0 auto'}}>
      {!self && (
        <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8}}>
          <button className="icon-btn" onClick={back} aria-label="Back"><span style={{fontSize: 26, lineHeight: 1}}>‹</span></button>
          <div style={{fontWeight: 800, fontSize: 17}}>{dispName}</div>
        </div>
      )}
      <div style={{height: 86, borderRadius: 20, background: 'linear-gradient(120deg,#4a3508,#171205 52%,#7a5510)', border: '1px solid rgba(240,185,90,0.28)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)'}} />
      <div style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: -30, padding: '0 14px'}}>
        {self && user && user.photo_url
          ? <img src={user.photo_url} alt="" style={{width: 78, height: 78, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--gold)'}} />
          : <TgAvatar name={dispName} uid={self ? viewerId() : userId} size={78} />}
        <div style={{flex: 1}}>
          <div style={{fontWeight: 800, fontSize: 19}}>{dispName}</div>
          {self && user && user.username && <div style={{color: 'var(--muted)', fontSize: 13}}>@{user.username}</div>}
          {self
            ? <div style={{color: '#2fd67b', fontSize: 12.5, fontWeight: 600, marginTop: 2}}>online</div>
            : (data && data.last_seen ? <div style={{color: isOnline(data.last_seen) ? '#2fd67b' : 'var(--muted)', fontSize: 12.5, fontWeight: 600, marginTop: 2}}>{presenceLabel(data.last_seen)}</div> : null)}
          <div style={{display: 'flex', gap: 14, marginTop: 12, flexWrap: 'wrap', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '10px 12px'}}>
            {stat(data ? data.stats.posts : '—', 'Posts')}
            {stat(data ? data.stats.likes_received : '—', 'Likes')}
            {stat(data ? followers : '—', 'Followers')}
            {stat(data ? data.stats.following_count : '—', 'Following')}
            {self && stat(data ? data.stats.comments : '—', 'Comments')}
          </div>
        </div>
      </div>
      {!self && (
        <div style={{display: 'flex', gap: 8, marginTop: 16}}>
          <button className={following ? 'btn-ghost' : 'btn-gold'} onClick={toggleFollow} style={{flex: 1, padding: '11px 0', borderRadius: 999}}>
            {following ? 'Following' : 'Follow'}
          </button>
          <button className="btn-ghost" onClick={openChat} style={{flex: 1, padding: '11px 0', borderRadius: 999}}>Message</button>
        </div>
      )}
      {self && (
        <div style={{marginTop: 20}}>
          <div style={{fontWeight: 700, marginBottom: 4}}>Languages I follow</div>
          <div style={{color: 'var(--muted)', fontSize: 12, marginBottom: 10}}>New episodes are posted to the TSReels of people who follow their language. No pick = your app language.</div>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: 8}}>
            {LANG_OPTS.map(o => (
              <button key={o.code} onClick={() => toggleLang(o.code)} style={{padding: '8px 14px', borderRadius: 999, border: '1px solid ' + (pick.includes(o.code) ? 'var(--gold)' : 'var(--border)'), background: pick.includes(o.code) ? 'rgba(240,185,90,0.16)' : 'var(--card)', color: pick.includes(o.code) ? 'var(--gold)' : 'var(--text)', fontWeight: 700, fontSize: 13}}>{o.label}</button>
            ))}
          </div>
        </div>
      )}
      {self && getSession() && (
        <button onClick={async () => { try { await apiPost('/api/auth/logout', {}); } catch (e) {} try { localStorage.removeItem('somon_session'); } catch (e) {} location.reload(); }} style={{width: '100%', marginTop: 22, padding: '13px 0', borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#f87171', fontWeight: 700, fontSize: 14.5, cursor: 'pointer', fontFamily: 'inherit'}}>Sign out</button>
      )}
      <div style={{fontWeight: 700, margin: '22px 0 10px'}}>{self ? 'My TSReels' : 'TSReels'}</div>
      {!data && <p style={{color: 'var(--muted)'}}>Loading…</p>}
      {data && data.reels.length === 0 && <p style={{color: 'var(--muted)', fontSize: 13, lineHeight: 1.6}}>{self ? <>You haven't posted yet. Open TSReels and tap <b style={{color: 'var(--gold)'}}>＋ Post</b> — the AI finds the show or movie and adds the Watch button when it's in the catalog.</> : 'No posts yet.'}</p>}
      {data && data.reels.length > 0 && (
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4}}>
          {data.reels.map(r => (
            <div key={r.id} onClick={() => { window.__somonReelFor = 'tg:' + r.id; go(r.feed === 'user' ? 'reels' : 'tsreels'); }} style={{position: 'relative', aspectRatio: '3/4', background: '#000', overflow: 'hidden', cursor: 'pointer', borderRadius: 12}}>
              <video src={`/api/stream?fid=${encodeURIComponent(r.file_id)}`} muted playsInline preload="metadata" style={{width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none'}} />
              <span style={{position: 'absolute', left: 5, bottom: 5, fontSize: 10, color: '#fff', background: 'rgba(0,0,0,0.55)', padding: '1px 6px', borderRadius: 8}}>{relTimeShort(r.created_at)}</span>
              <span style={{position: 'absolute', right: 5, bottom: 5, fontSize: 10, color: '#fff', background: 'rgba(0,0,0,0.55)', padding: '1px 6px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 3}}>{I.eye(11)} {r.view_count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Real Telegram profile photo over a gradient initial (falls back to the
// initial when the user has no public photo). Defined at module scope —
// Chats, Chat, Profile, PeopleSheet and ShareSheet all render it.
function TgAvatar({ name, uid, size }) {
  const GRADS = ['linear-gradient(135deg,#f6c453,#de9b2d)', 'linear-gradient(135deg,#7b61ff,#4a2fd6)', 'linear-gradient(135deg,#ff6a88,#d63a5c)', 'linear-gradient(135deg,#2fd67b,#159455)', 'linear-gradient(135deg,#39a0ff,#2563eb)', 'linear-gradient(135deg,#ff9440,#e05e12)'];
  const n = String(name || 'User');
  let h = 0; const seed = String(uid || n); for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return (
    <span style={{position: 'relative', width: size, height: size, borderRadius: '50%', background: GRADS[h % GRADS.length], color: '#fff', fontWeight: 700, fontSize: size * 0.42, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, textTransform: 'uppercase', overflow: 'hidden'}}>
      {n.trim().charAt(0) || '?'}
      {/^\d+$/.test(String(uid || '')) && <img src={`/api/avatar/${uid}`} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none'; }} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}} />}
    </span>
  );
}

// ── Chats: DM threads between app users ──────────────────────────────────
function ChatsPage({ go }) {
  const [threads, setThreads] = useState(null);
  const [q, setQ] = useState('');
  const [users, setUsers] = useState([]);
  const isGuest = !/^\d+$/.test(viewerId());
  useEffect(() => { api.get('/api/dm/threads').then(d => setThreads(d && d.ok ? d.threads : [])).catch(() => setThreads([])); }, []);
  useEffect(() => {
    if (!q.trim()) { setUsers([]); return; }
    const t = setTimeout(() => { api.get('/api/dm/users?q=' + encodeURIComponent(q.trim())).then(d => setUsers(d && d.ok ? d.users : [])).catch(() => {}); }, 250);
    return () => clearTimeout(t);
  }, [q]);
  const openUser = async (u) => {
    const r = await apiPost('/api/dm/threads', { user_id: u.user_id });
    if (r && r.id) go('chat', r.id);
  };
  const card = {display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, marginBottom: 9, cursor: 'pointer'};
  return (
    <div className="page" style={{maxWidth: 560, margin: '0 auto'}}>
      <h2 style={{margin: '2px 0 14px', fontSize: 26, fontWeight: 800, letterSpacing: -0.3}}>Chats</h2>
      {isGuest
        ? <p style={{color: 'var(--muted)', lineHeight: 1.6, fontSize: 13.5}}>Open Toji Somon from Telegram to chat — chats need a Telegram account.</p>
        : <>
          <div style={{position: 'relative', marginBottom: 14}}>
            <span style={{position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', display: 'flex', pointerEvents: 'none'}}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.5" y2="16.5"/></svg>
            </span>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search people…" style={{width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 999, color: '#fff', padding: '12px 16px 12px 42px', fontSize: 14.5, outline: 'none'}} />
          </div>
          {users.length > 0 && (
            <div style={{marginBottom: 8}}>
              {users.map(u => (
                <div key={u.user_id} onClick={() => openUser(u)} style={card}>
                  <TgAvatar name={u.user_name} uid={u.user_id} size={46} />
                  <div style={{fontWeight: 650, fontSize: 15}}>{u.user_name}</div>
                  <span style={{marginLeft: 'auto', color: 'var(--gold)', fontSize: 12, fontWeight: 700}}>MESSAGE</span>
                </div>
              ))}
            </div>
          )}
          {threads === null && <p style={{color: 'var(--muted)'}}>Loading…</p>}
          {threads && threads.length === 0 && <p style={{color: 'var(--muted)', fontSize: 13.5, lineHeight: 1.6}}>No chats yet — search a name above to start one.</p>}
          {threads && threads.map(th => (
            <div key={th.id} onClick={() => go('chat', th.id)} style={card}>
              <TgAvatar name={th.peer_name} uid={th.peer_id} size={50} />
              <div style={{flex: 1, minWidth: 0}}>
                <div style={{display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'baseline'}}>
                  <span style={{fontWeight: 700, fontSize: 15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{th.peer_name}</span>
                  {th.peer_last_seen ? <span style={{color: isOnline(th.peer_last_seen) ? '#2fd67b' : 'var(--muted)', fontSize: 11, fontWeight: 600, flexShrink: 0}}>{isOnline(th.peer_last_seen) ? '● online' : presenceLabel(th.peer_last_seen)}</span> : null}
                  <span style={{color: th.unread > 0 ? 'var(--gold)' : 'var(--muted)', fontSize: 11.5, flexShrink: 0, fontWeight: th.unread > 0 ? 700 : 400}}>{relTimeShort(th.last_at)}</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center', marginTop: 3}}>
                  <span style={{color: th.unread > 0 ? '#e8e8e8' : 'var(--muted)', fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: th.unread > 0 ? 600 : 400}}>{th.last_text || 'Say hi 👋'}</span>
                  {th.unread > 0 && <span style={{background: 'linear-gradient(135deg,#f0b95a,#c98f2e)', color: '#171205', fontWeight: 800, fontSize: 11, minWidth: 20, height: 20, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 6px', flexShrink: 0}}>{th.unread}</span>}
                </div>
              </div>
            </div>
          ))}
        </>}
    </div>
  );
}

function ChatPage({ id, back, go }) {
  const [msgs, setMsgs] = useState(null);
  const [peer, setPeer] = useState('');
  const [peerId, setPeerId] = useState(null);
  const [peerSeen, setPeerSeen] = useState(null);
  const [text, setText] = useState('');
  const myId = viewerId();
  const endRef = useRef(null);
  const load = () => api.get(`/api/dm/threads/${id}/messages`).then(d => { if (d && d.ok) setMsgs(d.messages); }).catch(() => {});
  useEffect(() => {
    load();
    const fillPeer = () => api.get('/api/dm/threads').then(d => { const th = d && d.threads ? d.threads.find(x => String(x.id) === String(id)) : null; if (th) { setPeer(th.peer_name || ''); setPeerId(th.peer_id || null); setPeerSeen(th.peer_last_seen || null); } }).catch(() => {});
    fillPeer();
    let ticks = 0;
    const iv = setInterval(() => { load(); ticks++; if (ticks % 8 === 0) fillPeer(); }, 3500);
    return () => clearInterval(iv);
  }, [id]);
  useEffect(() => { if (endRef.current) endRef.current.scrollIntoView({ block: 'end' }); }, [msgs]);
  const send = async () => {
    const v = text.trim(); if (!v) return;
    setText('');
    const r = await apiPost(`/api/dm/threads/${id}/messages`, { text: v });
    if (r && r.ok) load(); else alert('Could not send — try again.');
  };
  return (
    <div className="page" style={{maxWidth: 560, margin: '0 auto', display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 90px)'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 11, padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, marginBottom: 14}}>
        <button className="icon-btn" onClick={back} aria-label="Back" style={{flexShrink: 0}}><span style={{fontSize: 26, lineHeight: 1}}>‹</span></button>
        <span onClick={() => { if (go && peerId) go('profile', String(peerId)); }} style={{display: 'inline-flex', cursor: peerId ? 'pointer' : 'default'}}><TgAvatar name={peer} uid={peerId} size={40} /></span>
        <div onClick={() => { if (go && peerId) go('profile', String(peerId)); }} style={{cursor: peerId ? 'pointer' : 'default', minWidth: 0}}>
          <div style={{fontWeight: 800, fontSize: 16, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{peer || 'Chat'}</div>
          {peerSeen
            ? <div style={{color: isOnline(peerSeen) ? '#2fd67b' : 'var(--muted)', fontSize: 11.5, fontWeight: 600}}>{presenceLabel(peerSeen)}</div>
            : <div style={{color: 'var(--gold)', fontSize: 11.5, fontWeight: 600}}>Toji Somon member</div>}
        </div>
      </div>
      <div style={{flex: 1, padding: '0 2px'}}>
        {msgs === null && <p style={{color: 'var(--muted)'}}>Loading…</p>}
        {msgs && msgs.length === 0 && <p style={{color: 'var(--muted)', fontSize: 13.5, textAlign: 'center', marginTop: 24}}>No messages yet — say hi 👋</p>}
        {msgs && msgs.map(m => {
          const mine = String(m.sender_id) === String(myId);
          return (
            <div key={m.id} style={{display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start', marginBottom: 7}}>
              <div style={{maxWidth: '78%', padding: '9px 13px 7px', borderRadius: mine ? '19px 19px 6px 19px' : '19px 19px 19px 6px', background: mine ? 'linear-gradient(135deg,#f0b95a,#d29a33)' : 'rgba(255,255,255,0.08)', color: mine ? '#171205' : 'var(--text)', boxShadow: mine ? '0 4px 14px rgba(240,185,90,0.22)' : 'none'}}>
                <div style={{fontSize: 14.5, lineHeight: 1.45, wordBreak: 'break-word', whiteSpace: 'pre-wrap'}}>{linkify(m.text)}</div>
                <div style={{fontSize: 10, opacity: 0.6, textAlign: 'right', marginTop: 2}}>{relTimeShort(m.created_at)}</div>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>
      <div style={{display: 'flex', gap: 9, alignItems: 'center', position: 'sticky', bottom: 72, paddingTop: 10, background: 'linear-gradient(transparent, var(--bg) 35%)'}}>
        <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') send(); }} placeholder="Message…" style={{flex: 1, boxSizing: 'border-box', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 999, color: '#fff', padding: '12px 17px', fontSize: 14.5, outline: 'none', minWidth: 0}} />
        <button onClick={send} aria-label="Send" style={{width: 47, height: 47, borderRadius: '50%', border: 'none', background: 'linear-gradient(135deg,#f0b95a,#c98f2e)', color: '#171205', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, boxShadow: '0 5px 16px rgba(240,185,90,0.35)'}}>{I.send(20)}</button>
      </div>
    </div>
  );
}

function PeopleSheet({ title, rows, onClose, go }) {
  return (
    <div style={{position: 'fixed', inset: 0, zIndex: 3200, background: 'rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}} onClick={onClose}>
      <div style={{background: '#181818', borderRadius: '20px 20px 0 0', padding: '10px 16px 22px', maxHeight: '72vh', display: 'flex', flexDirection: 'column'}} onClick={e => e.stopPropagation()}>
        <div style={{width: 42, height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.25)', margin: '2px auto 12px'}} />
        <b style={{fontSize: 16}}>{title}</b>
        <div style={{overflowY: 'auto', marginTop: 8}}>
          {rows === null && <p style={{color: 'var(--muted)', fontSize: 13}}>Loading…</p>}
          {rows && rows.length === 0 && <p style={{color: 'var(--muted)', fontSize: 13}}>Nobody yet.</p>}
          {rows && rows.map((p, i) => (
            <div key={i} onClick={() => { if (go && /^\d+$/.test(String(p.user_id))) { onClose(); go('profile', String(p.user_id)); } }} style={{display: 'flex', alignItems: 'center', gap: 11, padding: '8px 2px', cursor: go ? 'pointer' : 'default'}}>
              <TgAvatar name={p.user_name} uid={p.user_id} size={38} />
              <div style={{flex: 1, minWidth: 0}}>
                <div style={{fontWeight: 600, fontSize: 14}}>{p.user_name || 'User'}</div>
                {p.sub && <div style={{color: 'var(--muted)', fontSize: 11.5}}>{p.sub}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ❤ for episodes/movies (reels have their own rail): tap the heart to like,
// tap the count to see WHO liked — visible to everyone, like Instagram.
function LikeBtn({ itemKey, go }) {
  const [st, setSt] = useState(null);
  const [users, setUsers] = useState(null);
  const [sheet, setSheet] = useState(false);
  const myId = viewerId();
  const myName = (tg && tg.initDataUnsafe && tg.initDataUnsafe.user && tg.initDataUnsafe.user.first_name) || '';
  const load = () => fetch(`/api/reels/${encodeURIComponent(itemKey)}/likes`, { headers: { 'x-telegram-id': myId, 'x-telegram-name': encodeURIComponent(myName || '') } }).then(r => r.json()).then(d => { if (d && d.ok) { setSt({ count: d.count, mine: d.mine }); setUsers(d.users); } }).catch(() => {});
  useEffect(() => { load(); }, [itemKey]);
  const toggle = async () => {
    const res = await fetch(`/api/reels/${encodeURIComponent(itemKey)}/like`, { method: 'POST', headers: { 'x-telegram-id': myId, 'x-telegram-name': encodeURIComponent(myName || '') } }).then(x => x.json()).catch(() => null);
    if (res && res.ok) { setSt({ count: res.counts.likes, mine: res.active }); load(); }
  };
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 8, margin: '10px 0'}}>
      <button onClick={toggle} aria-label="Like" style={{background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex'}}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill={st && st.mine ? '#ff3040' : 'none'} stroke={st && st.mine ? '#ff3040' : '#fff'} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
      </button>
      <button onClick={() => { setSheet(true); load(); }} style={{background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', fontSize: 14, fontWeight: 600, padding: 2}}>{st ? st.count : '…'} likes</button>
      {sheet && <PeopleSheet title="Liked by" rows={users ? users.map(u => ({ user_id: u.user_id, user_name: u.user_name, sub: relTimeShort(u.created_at) })) : null} onClose={() => setSheet(false)} go={go} />}
    </div>
  );
}

// Admin only: who watched this video.
function ViewersBtn({ itemKey, go }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [rows, setRows] = useState(null);
  useEffect(() => { api.get('/api/admin/check').then(d => setIsAdmin(!!(d && d.admin))).catch(() => {}); }, []);
  if (!isAdmin) return null;
  const open = () => {
    setSheet(true); setRows(null);
    api.get('/api/admin/viewers?key=' + encodeURIComponent(itemKey)).then(d => setRows(d && d.ok ? d.viewers.map(v => ({ user_id: v.user_id, user_name: v.user_name, sub: 'watched ' + relTimeShort(v.last_at) + (v.count > 1 ? ' · ' + v.count + '×' : '') })) : [])).catch(() => setRows([]));
  };
  return (
    <React.Fragment>
      <button className="btn-ghost" onClick={open} style={{display: 'flex', alignItems: 'center', gap: 7, justifyContent: 'center', width: '100%'}}>{I.eye(16)} Who watched (admin)</button>
      {sheet && <PeopleSheet title="Watched by" rows={rows} onClose={() => setSheet(false)} go={go} />}
    </React.Fragment>
  );
}

// Website sign-in (his spec): phone number → the bot sends a code to that
// Telegram account → type the code → session. Numbers get linked inside
// the bot first (share-contact flow); an unlinked number is registration
// that still has to happen in Telegram, so we send the user there.
// Country picker (his ask): no hardcoded code — a button opens the full
// country list and the chosen dial code leads the number.
const COUNTRIES = [["Afghanistan","AF","93"],["Albania","AL","355"],["Algeria","DZ","213"],["Andorra","AD","376"],["Angola","AO","244"],["Antigua and Barbuda","AG","1268"],["Argentina","AR","54"],["Armenia","AM","374"],["Australia","AU","61"],["Austria","AT","43"],["Azerbaijan","AZ","994"],["Bahamas","BS","1242"],["Bahrain","BH","973"],["Bangladesh","BD","880"],["Barbados","BB","1246"],["Belarus","BY","375"],["Belgium","BE","32"],["Belize","BZ","501"],["Benin","BJ","229"],["Bhutan","BT","975"],["Bolivia","BO","591"],["Bosnia and Herzegovina","BA","387"],["Botswana","BW","267"],["Brazil","BR","55"],["Brunei","BN","673"],["Bulgaria","BG","359"],["Burkina Faso","BF","226"],["Burundi","BI","257"],["Cambodia","KH","855"],["Cameroon","CM","237"],["Canada","CA","1"],["Cape Verde","CV","238"],["Central African Republic","CF","236"],["Chad","TD","235"],["Chile","CL","56"],["China","CN","86"],["Colombia","CO","57"],["Comoros","KM","269"],["Congo","CG","242"],["Congo (DRC)","CD","243"],["Costa Rica","CR","506"],["Croatia","HR","385"],["Cuba","CU","53"],["Cyprus","CY","357"],["Czechia","CZ","420"],["Denmark","DK","45"],["Djibouti","DJ","253"],["Dominica","DM","1767"],["Dominican Republic","DO","1809"],["Ecuador","EC","593"],["Egypt","EG","20"],["El Salvador","SV","503"],["Equatorial Guinea","GQ","240"],["Eritrea","ER","291"],["Estonia","EE","372"],["Eswatini","SZ","268"],["Ethiopia","ET","251"],["Fiji","FJ","679"],["Finland","FI","358"],["France","FR","33"],["Gabon","GA","241"],["Gambia","GM","220"],["Georgia","GE","995"],["Germany","DE","49"],["Ghana","GH","233"],["Greece","GR","30"],["Grenada","GD","1473"],["Guatemala","GT","502"],["Guinea","GN","224"],["Guinea-Bissau","GW","245"],["Guyana","GY","592"],["Haiti","HT","509"],["Honduras","HN","504"],["Hong Kong","HK","852"],["Hungary","HU","36"],["Iceland","IS","354"],["India","IN","91"],["Indonesia","ID","62"],["Iran","IR","98"],["Iraq","IQ","964"],["Ireland","IE","353"],["Israel","IL","972"],["Italy","IT","39"],["Ivory Coast","CI","225"],["Jamaica","JM","1876"],["Japan","JP","81"],["Jordan","JO","962"],["Kazakhstan","KZ","7"],["Kenya","KE","254"],["Kiribati","KI","686"],["Kosovo","XK","383"],["Kuwait","KW","965"],["Kyrgyzstan","KG","996"],["Laos","LA","856"],["Latvia","LV","371"],["Lebanon","LB","961"],["Lesotho","LS","266"],["Liberia","LR","231"],["Libya","LY","218"],["Liechtenstein","LI","423"],["Lithuania","LT","370"],["Luxembourg","LU","352"],["Macau","MO","853"],["Madagascar","MG","261"],["Malawi","MW","265"],["Malaysia","MY","60"],["Maldives","MV","960"],["Mali","ML","223"],["Malta","MT","356"],["Mauritania","MR","222"],["Mauritius","MU","230"],["Mexico","MX","52"],["Moldova","MD","373"],["Monaco","MC","377"],["Mongolia","MN","976"],["Montenegro","ME","382"],["Morocco","MA","212"],["Mozambique","MZ","258"],["Myanmar","MM","95"],["Namibia","NA","264"],["Nepal","NP","977"],["Netherlands","NL","31"],["New Zealand","NZ","64"],["Nicaragua","NI","505"],["Niger","NE","227"],["Nigeria","NG","234"],["North Korea","KP","850"],["North Macedonia","MK","389"],["Norway","NO","47"],["Oman","OM","968"],["Pakistan","PK","92"],["Palestine","PS","970"],["Panama","PA","507"],["Papua New Guinea","PG","675"],["Paraguay","PY","595"],["Peru","PE","51"],["Philippines","PH","63"],["Poland","PL","48"],["Portugal","PT","351"],["Qatar","QA","974"],["Romania","RO","40"],["Russia","RU","7"],["Rwanda","RW","250"],["Samoa","WS","685"],["San Marino","SM","378"],["Sao Tome and Principe","ST","239"],["Saudi Arabia","SA","966"],["Senegal","SN","221"],["Serbia","RS","381"],["Seychelles","SC","248"],["Sierra Leone","SL","232"],["Singapore","SG","65"],["Slovakia","SK","421"],["Slovenia","SI","386"],["Solomon Islands","SB","677"],["Somalia","SO","252"],["South Africa","ZA","27"],["South Korea","KR","82"],["South Sudan","SS","211"],["Spain","ES","34"],["Sri Lanka","LK","94"],["Sudan","SD","249"],["Suriname","SR","597"],["Sweden","SE","46"],["Switzerland","CH","41"],["Syria","SY","963"],["Taiwan","TW","886"],["Tajikistan","TJ","992"],["Tanzania","TZ","255"],["Thailand","TH","66"],["Timor-Leste","TL","670"],["Togo","TG","228"],["Tonga","TO","676"],["Trinidad and Tobago","TT","1868"],["Tunisia","TN","216"],["Turkey","TR","90"],["Turkmenistan","TM","993"],["Uganda","UG","256"],["Ukraine","UA","380"],["United Arab Emirates","AE","971"],["United Kingdom","GB","44"],["United States","US","1"],["Uruguay","UY","598"],["Uzbekistan","UZ","998"],["Vanuatu","VU","678"],["Vatican City","VA","39"],["Venezuela","VE","58"],["Vietnam","VN","84"],["Yemen","YE","967"],["Zambia","ZM","260"],["Zimbabwe","ZW","263"]];
const flagFor = (iso) => iso.replace(/./g, c => String.fromCodePoint(c.charCodeAt(0) + 127397));
function LoginScreen({ onDone }) {
  // Account sign-in (email + password via Supabase Auth) — his spec
  // 2026-10-23: replaces the number/code sign-in at the app's door.
  // The server maps the account to an app identity (the owner's email
  // becomes his Telegram super-admin self) and issues the web session.
  const [mode, setMode] = useState('signin'); // signin | signup
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [pass2, setPass2] = useState('');
  const [err, setErr] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const SB = 'https://pffaclnokhdvzahxfgcu.supabase.co/auth/v1';
  const ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmZmFjbG5va2hkdnphaHhmZ2N1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIyMDIxMzYsImV4cCI6MjEwNzc3ODEzNn0.pnmpwvm7ITPZVL8ttwxyDjjGvXcoReliaFOu0_LeoVA';
  const sbCall = async (path, body) => {
    try {
      const r = await fetch(SB + path, { method: 'POST', headers: { apikey: ANON, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const d = await r.json().catch(() => ({}));
      return { ok: r.ok, d };
    } catch (e) { return { ok: false, d: {} }; }
  };
  const finish = async (access) => {
    const r = await apiPost('/api/auth/account-login', { access_token: access });
    if (!r) { setErr('Network error — try again.'); setBusy(false); return; }
    if (r.error) { setErr(r.error); setBusy(false); return; }
    if (r.ok && r.token) onDone({ token: r.token, user_id: r.user_id, user_name: r.user_name });
    else { setErr('Sign-in failed — try again.'); setBusy(false); }
  };
  const submit = async () => {
    setErr(''); setNote('');
    const em = email.trim().toLowerCase();
    if (!em || !pass) { setErr('Enter your email and password.'); return; }
    if (mode === 'signup') {
      if (name.trim().length < 2) { setErr('Enter your name.'); return; }
      if (pass.length < 6) { setErr('Password must be at least 6 characters.'); return; }
      if (pass !== pass2) { setErr("Passwords don't match."); return; }
    }
    setBusy(true);
    const { ok, d } = mode === 'signup'
      ? await sbCall('/signup', { email: em, password: pass, data: { name: name.trim() } })
      : await sbCall('/token?grant_type=password', { email: em, password: pass });
    if (!ok || !d.access_token) {
      setBusy(false);
      setErr((d && (d.msg || d.message || d.error_description)) || (mode === 'signup' ? 'Could not create the account.' : 'Wrong email or password.'));
      return;
    }
    await finish(d.access_token);
  };
  const forgot = async () => {
    setErr(''); setNote('');
    const em = email.trim().toLowerCase();
    if (!em) { setErr('Type your email first, then tap Forgot password.'); return; }
    const { ok } = await sbCall('/recover', { email: em });
    if (ok) setNote('Password reset email sent — check your inbox.');
    else setErr('Could not send the reset email — check the address.');
  };
  const switchMode = (m) => { setMode(m); setErr(''); setNote(''); };
  const inp = {boxSizing: 'border-box', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, color: '#fff', padding: '14px 16px', fontSize: 16, outline: 'none'};
  const tabBtn = (active) => ({flex: 1, padding: '11px 0', borderRadius: 12, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14.5, fontWeight: 700, background: active ? 'linear-gradient(135deg,#f6c453,#de9b2d)' : 'transparent', color: active ? '#231a04' : 'var(--muted)'});
  const disabled = busy || !email.trim() || !pass || (mode === 'signup' && (name.trim().length < 2 || !pass2));
  return (
    <div style={{minHeight: '100dvh', background: '#050505', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 28, textAlign: 'center', position: 'relative'}}>
      <img src="/logo.png" alt="" style={{width: 92, height: 92, objectFit: 'contain', marginBottom: 10}} onError={e => { e.currentTarget.style.display = 'none'; }} />
      <div style={{fontFamily: 'Cinzel, serif', fontSize: 25, fontWeight: 800, letterSpacing: 2, marginBottom: 4}}>ТОЈИ СОМОН</div>
      <div style={{color: 'var(--gold)', letterSpacing: 5, fontSize: 11, marginBottom: 26}}>CINEMA</div>
      <div style={{display: 'flex', gap: 4, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 4, width: '100%', maxWidth: 340, marginBottom: 20}}>
        <button style={tabBtn(mode === 'signin')} onClick={() => switchMode('signin')}>Sign in</button>
        <button style={tabBtn(mode === 'signup')} onClick={() => switchMode('signup')}>Sign up</button>
      </div>
      <p style={{color: 'var(--muted)', fontSize: 13.5, lineHeight: 1.55, maxWidth: 330, margin: '0 0 18px'}}>{mode === 'signup'
        ? 'Create your Toji Somon account with your email and a password.'
        : 'Sign in with the email and password of your Toji Somon account.'}</p>
      <div style={{width: '100%', maxWidth: 340}}>
        {mode === 'signup' && <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" autoComplete="name" style={{...inp, width: '100%', marginBottom: 8}} />}
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" inputMode="email" autoComplete="email" style={{...inp, width: '100%', marginBottom: 8}} onKeyDown={e => { if (e.key === 'Enter' && !disabled) submit(); }} />
        <input value={pass} onChange={e => setPass(e.target.value)} placeholder="Password" type="password" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} style={{...inp, width: '100%', marginBottom: mode === 'signup' ? 8 : 0}} onKeyDown={e => { if (e.key === 'Enter' && !disabled) submit(); }} />
        {mode === 'signup' && <input value={pass2} onChange={e => setPass2(e.target.value)} placeholder="Repeat password" type="password" autoComplete="new-password" style={{...inp, width: '100%'}} onKeyDown={e => { if (e.key === 'Enter' && !disabled) submit(); }} />}
        {err && <div style={{color: '#f87171', fontSize: 13, marginTop: 10}}>{err}</div>}
        {note && <div style={{color: 'var(--muted)', fontSize: 13, marginTop: 10}}>{note}</div>}
        <button className="btn-gold" disabled={disabled} onClick={submit} style={{width: '100%', padding: '14px 0', marginTop: 14, borderRadius: 14, fontSize: 15, opacity: disabled ? 0.55 : 1}}>{busy ? 'Please wait…' : (mode === 'signup' ? 'Create my account' : 'Sign in')}</button>
        {mode === 'signin' && <button onClick={forgot} style={{background: 'none', border: 'none', color: 'var(--muted)', marginTop: 14, cursor: 'pointer', fontSize: 13.5, fontFamily: 'inherit'}}>Forgot password?</button>}
      </div>
    </div>
  );
}

function App() {
  const [history, setHistory] = useState([{ view: 'home' }]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [banInfo, setBanInfo] = useState(null);
  useEffect(() => { api.get('/api/me').then(d => { if (d && d.banned) setBanInfo(d); }).catch(() => {}); }, []);
  // Presence heartbeat: while the app is open, say "I'm here" once a minute.
  useEffect(() => {
    const ping = () => { apiPost('/api/presence', {}); };
    ping();
    const iv = setInterval(ping, 60000);
    const onVis = () => { if (!document.hidden) ping(); };
    document.addEventListener('visibilitychange', onVis);
    return () => { clearInterval(iv); document.removeEventListener('visibilitychange', onVis); };
  }, []);
  useEffect(() => { try { document.querySelector('.boot-splash')?.remove(); } catch (e) {} }, []); // dismiss boot splash
  useEffect(() => { api.get('/api/admin/check').then(d => setIsAdmin(!!d.isAdmin)).catch(() => {}); }, []);
  useEffect(() => {
    // Basic Telegram setup — no aggressive retries (was disrupting video)
    try {
      if (tg) {
        tg.ready();
        if (tg.expand) tg.expand();
        if (tg.setHeaderColor) tg.setHeaderColor('#000000');
        if (tg.setBackgroundColor) tg.setBackgroundColor('#000000');
        // Telegram top bar stays VISIBLE on every page (his call 2026-10-20);
        // it hides only while a video is fullscreen (handled in VideoPage).
      }
    } catch {}
  }, []);
  const route = history[history.length - 1];
  const go = (view, id) => { setHistory(h => [...h, { view, id }]); window.scrollTo(0, 0); };
  const back = () => {
    // Back ALWAYS leaves (his rule): with nothing under this page, go home.
    setHistory(h => (h.length > 1 ? h.slice(0, -1) : [{ view: 'home' }]));
    window.scrollTo(0, 0);
  };
  const deepDone = useRef(false);
  useEffect(() => {
    // Typed content deep link → open exactly that show/season/episode/movie.
    if (deepDone.current) return;
    deepDone.current = true;
    const target = parseDeepLink(startParam());
    if (!target) return;
    if (target.view === 'movie') {
      if (target.trailer) window.__somonTrailerFor = target.id;
      go('movie', target.id);
    } else if (target.view === 'reel') {
      window.__somonReelFor = target.itemKey;
      go('tsreels');
    } else if (target.view === 'episode') {
      go('episode', target.id);
    } else if (target.view === 'series') {
      if (target.episode != null) {
        api.get('/api/series/' + target.id).then(d => {
          const ep = (d.episodes || []).find(e => (e.season || 1) === (target.season || 1) && e.episode_number === target.episode);
          if (ep) go('episode', ep.id); else go('series', target.id);
        }).catch(() => go('series', target.id));
      } else {
        if (target.season != null) window.__somonSeasonFor = { id: target.id, season: target.season };
        go('series', target.id);
      }
    }
  }, []);
  const [webUser, setWebUser] = useState(getSession());
  const inTelegram = !!((window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe && window.Telegram.WebApp.initDataUnsafe.user) || (tg && tg.initDataUnsafe && tg.initDataUnsafe.user));
  if (!inTelegram && !webUser) return (
    <LoginScreen onDone={(s) => { try { localStorage.setItem('somon_session', JSON.stringify(s)); } catch (e) {} setWebUser(s); }} />
  );
  if (banInfo) return (
    <div style={{minHeight: '100dvh', background: '#050505', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 28, textAlign: 'center'}}>
      <div style={{marginBottom: 14, color: '#ef4444'}}>{I.ban(52)}</div>
      <div style={{fontSize: 20, fontWeight: 800, marginBottom: 8}}>You are blocked</div>
      <div style={{color: 'var(--muted)', fontSize: 14, lineHeight: 1.55}}>Reason: posting sexual or violent content — 3 strikes.<br />Nothing in Toji Somon works for your account until the block ends.<br />Block ends: <b style={{color: '#fff'}}>{String(banInfo.until || '').slice(0, 10)}</b></div>
    </div>
  );
  return (
    <div>
      {route.view === 'home' && <Home go={go} />}
      {route.view === 'movie' && <MovieDetail id={route.id} go={go} back={back} />}
      {route.view === 'series' && <SeriesDetail id={route.id} go={go} back={back} />}
      {route.view === 'episode' && React.createElement(EpisodeDetail, {id: route.id, go: go, back: back})}
      {route.view === 'video' && React.createElement(VideoPage, {id: route.id, go: go, back: back})}
      {route.view === 'tsreels' && <ReelsPage key="ts" go={go} isAdmin={isAdmin} feed="ts" />}
      {route.view === 'reels' && <ReelsPage key="user" go={go} isAdmin={isAdmin} feed="user" />}
      {route.view === 'profile' && <ProfilePage go={go} userId={route.id} back={back} />}
      {route.view === 'chats' && <ChatsPage go={go} />}
      {route.view === 'chat' && <ChatPage id={route.id} back={() => go('chats')} go={go} />}
      {route.view === 'admin' && <Admin go={go} back={back} />}
      <div className="nav">
        <button className={route.view === 'home' ? 'active' : ''} onClick={() => { setHistory([{ view: 'home' }]); window.scrollTo(0, 0); }}>
          <span className="ico"><svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></svg></span>{t('home')}
        </button>
        <button className={route.view === 'tsreels' ? 'active' : ''} onClick={() => { setHistory([{ view: 'tsreels' }]); window.scrollTo(0, 0); }}>
          <span className="ico">{I.crown(23)}</span>TSReels
        </button>
        <button className={route.view === 'reels' ? 'active' : ''} onClick={() => { setHistory([{ view: 'reels' }]); window.scrollTo(0, 0); }}>
          <span className="ico"><svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2.5" y="2.5" width="19" height="19" rx="5.5"/><path d="M10.2 8.7l5.3 3.3-5.3 3.3z" fill="currentColor" stroke="none"/></svg></span>Reels
        </button>
        <button className={(route.view === 'chats' || route.view === 'chat') ? 'active' : ''} onClick={() => { setHistory([{ view: 'chats' }]); window.scrollTo(0, 0); }}>
          <span className="ico"><svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg></span>Chats
        </button>
        <button className={route.view === 'profile' ? 'active' : ''} onClick={() => { setHistory([{ view: 'profile' }]); window.scrollTo(0, 0); }}>
          <span className="ico"><svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>Profile
        </button>
        {isAdmin && (
          <button className={route.view === 'admin' ? 'active' : ''} onClick={() => go('admin')}>
            <span className="ico"><svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1.5" y1="14" x2="6.5" y2="14"/><line x1="9.5" y1="8" x2="14.5" y2="8"/><line x1="17.5" y1="16" x2="22.5" y2="16"/></svg></span>{t('admin')}
          </button>
        )}
        <button onClick={() => botLink('start')}>
          <span className="ico"><svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="9" width="16" height="11" rx="2.5"/><line x1="12" y1="9" x2="12" y2="5"/><circle cx="12" cy="4" r="1.3"/><line x1="9.5" y1="17.2" x2="14.5" y2="17.2"/></svg></span>{t('bot')}
        </button>
      </div>
    </div>
  );
}

// ── Error boundary: a render crash shows a reload screen, never a black screen ──
class RootBoundary extends React.Component {
  constructor(p) { super(p); this.state = { err: null }; }
  static getDerivedStateFromError(e) { return { err: e }; }
  render() {
    if (this.state.err) return (
      <div className="page" style={{ textAlign: 'center', paddingTop: 90 }}>
        <div style={{ marginBottom: 12, color: 'var(--muted)', display: 'flex', justifyContent: 'center' }}>{I.film(42)}</div>
        <h3 style={{ marginBottom: 8 }}>Something went wrong</h3>
        <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 18 }}>The app hit an error. Reload to continue.</p>
        <button className="btn" onClick={() => location.reload()}>Reload app</button>
      </div>
    );
    return this.props.children;
  }
}

window.__somon_booted = true; // React rendered — dismiss the 60s retry timer in index.html
ReactDOM.createRoot(document.getElementById('root')).render(<RootBoundary><App /></RootBoundary>);
