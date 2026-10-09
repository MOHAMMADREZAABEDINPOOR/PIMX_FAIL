import { lazy, Suspense, useEffect, useMemo, useRef, useState, type FormEvent, type MouseEvent, type PointerEvent, type ReactNode } from 'react';
import { AnimatePresence, motion, MotionConfig, useReducedMotion } from 'motion/react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Bookmark, Check, ChevronDown, Copy, ExternalLink, FileText, Grid2X2, Layers3, List, LoaderCircle, Menu, Moon, Plus, Search, Sparkles, Sun, X } from 'lucide-react';
import { SEED_STARTUPS, TECHNICAL_BLUEPRINTS } from './data';
import type { AIAnalysisResult, Startup } from './types';
import { PimxAdminDashboard } from './components/PimxAdminDashboard';

const FailureScene = lazy(() => import('./components/FailureScene'));
const FEATURED_IDS = ['wework', 'quibi', 'theranos', 'juicero'];
const REVIEWED_IDS = new Set(FEATURED_IDS);
const NUMBER = new Intl.NumberFormat('en-US');
const INDUSTRIES = [...new Set(SEED_STARTUPS.map(s => s.industry))].sort();
const REASONS = [...new Set(SEED_STARTUPS.map(s => s.primaryFailureReason))].sort();
const SOURCE_COUNT = SEED_STARTUPS.filter(s => safeSources(s).length).length;
const ORDERED = [...SEED_STARTUPS].sort((a, b) => {
  const ai = FEATURED_IDS.indexOf(a.id); const bi = FEATURED_IDS.indexOf(b.id);
  return (ai < 0 ? 10 : ai) - (bi < 0 ? 10 : bi);
});

function readStored<T>(key: string, fallback: T): T {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; } catch { return fallback; }
}
function store(key: string, value: unknown) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Storage may be disabled. */ } }
function routeId(path: string) {
  const match = path.match(/^\/(?:en\/)?startups\/([^/]+)\/?$/);
  try { return match ? decodeURIComponent(match[1]) : null; } catch { return null; }
}
function safeSources(startup: Startup) {
  return (startup.sourceUrls || []).filter(url => { try { return ['https:', 'http:'].includes(new URL(url).protocol); } catch { return false; } });
}
function sourceLabel(url: string) { return new URL(url).hostname.replace(/^www\./, ''); }
function years(s: Startup) { return `${typeof s.yearFounded === 'number' ? s.yearFounded : '—'} — ${typeof s.yearFailed === 'number' ? s.yearFailed : '—'}`; }
function outcome(s: Startup) { return s.id === 'wework' ? 'RESTRUCTURED' : s.id === 'theranos' ? 'DISSOLVED' : ['quibi', 'juicero'].includes(s.id) ? 'SHUT DOWN' : 'ARCHIVE RECORD'; }

function Brand({ onClick }: { onClick: () => void }) {
  return <a className="brand" href="/" onClick={e => { if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return; e.preventDefault(); onClick(); }} aria-label="PIMXFAIL home"><span className="brand-symbol" aria-hidden="true"><i /><i /><i /></span><span>PIMX<span className="brand-fail">FAIL</span></span></a>;
}

function Sheet({ title, eyebrow, onClose, children }: { title: string; eyebrow: string; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden'; ref.current?.focus();
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key !== 'Tab') return;
      const items = ref.current?.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input,select,textarea,[tabindex="0"]');
      if (!items?.length) return;
      const first = items[0]; const last = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === ref.current)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (document.activeElement === last || document.activeElement === ref.current)) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', handleKey);
    return () => { document.body.style.overflow = overflow; document.removeEventListener('keydown', handleKey); previous?.focus(); };
  }, [onClose]);
  return <motion.div className="sheet-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <motion.div className="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title" ref={ref} tabIndex={-1} initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 32, stiffness: 300 }}>
      <div className="sheet-heading"><div><span className="eyebrow">{eyebrow}</span><h2 id="sheet-title">{title}</h2></div><button className="icon-button" onClick={onClose} aria-label="Close dialog"><X size={22} /></button></div>{children}
    </motion.div>
  </motion.div>;
}

function CaseCard({ startup: s, index, saved, onSave, onOpen }: { startup: Startup; index: number; saved: boolean; onSave: () => void; onOpen: (e: MouseEvent<HTMLAnchorElement>) => void }) {
  const ref = useRef<HTMLElement>(null);
  const tilt = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    ref.current?.style.setProperty('--rx', `${-(e.clientY - r.top - r.height / 2) / r.height * 5}deg`);
    ref.current?.style.setProperty('--ry', `${(e.clientX - r.left - r.width / 2) / r.width * 5}deg`);
  };
  return <motion.article ref={ref} className={`case-card case-${s.id}`} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.4, delay: Math.min(index % 4, 3) * 0.06 }} onPointerMove={tilt} onPointerLeave={() => { ref.current?.style.setProperty('--rx', '0deg'); ref.current?.style.setProperty('--ry', '0deg'); }}>
    <div className="case-visual"><span className="case-number">CASE / {String(SEED_STARTUPS.findIndex(item => item.id === s.id) + 1).padStart(4, '0')}</span><button className={`bookmark-button ${saved ? 'is-saved' : ''}`} onClick={onSave} aria-label={`${saved ? 'Unsave' : 'Save'} ${s.name}`} aria-pressed={saved}><Bookmark size={17} fill={saved ? 'currentColor' : 'none'} /></button>
      <div className="case-art" aria-hidden="true"><div className="art-ring" /><div className="art-grid" /><span className="company-wordmark">{s.name}</span><div className="art-line" /></div><span className="outcome"><i />{outcome(s)}</span><span className="case-years">{years(s)}</span>
    </div>
    <a className="case-content" href={`/startups/${encodeURIComponent(s.id)}`} onClick={onOpen}><span className="case-industry">{s.industry}</span><div className="case-title"><h3>{s.name}</h3><span className="case-arrow"><ArrowUpRight size={20} /></span></div><p>{s.slogan}</p><div className="case-bottom"><span>{s.primaryFailureReason}</span><span>{safeSources(s).length ? <FileText size={13} /> : <span className="pending-dot" />}<span className="sr-only">{safeSources(s).length ? 'Sources linked' : 'Source review pending'}</span></span></div></a>
  </motion.article>;
}

export default function App() {
  const reducedMotion = useReducedMotion();
  const [path, setPath] = useState(window.location.pathname);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => { try { return localStorage.getItem('graveyard_theme') === 'dark' ? 'dark' : 'light'; } catch { return 'light'; } });
  const [bookmarks, setBookmarks] = useState<string[]>(() => { const v = readStored<unknown>('graveyard_bookmarks', []); return Array.isArray(v) ? v.filter(i => typeof i === 'string') : []; });
  const [query, setQuery] = useState('');
  const [industry, setIndustry] = useState('all');
  const [reason, setReason] = useState('all');
  const [collection, setCollection] = useState<'all' | 'saved'>('all');
  const [sort, setSort] = useState('featured');
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [visible, setVisible] = useState(12);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [panel, setPanel] = useState<'analysis' | 'contribute' | 'blueprints' | null>(null);
  const [toast, setToast] = useState('');
  const [blueprintId, setBlueprintId] = useState(TECHNICAL_BLUEPRINTS[0]?.id);
  const [drafts, setDrafts] = useState<{ name: string; source: string; note: string }[]>(() => { const v = readStored<unknown>('pimxfail_research_drafts', []); return Array.isArray(v) ? v.filter(i => typeof i?.name === 'string' && typeof i?.source === 'string' && typeof i?.note === 'string') : []; });
  const [draftSaved, setDraftSaved] = useState(false);
  const [analysis, setAnalysis] = useState<(AIAnalysisResult & { simulated?: boolean }) | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState('');
  const selectedId = routeId(path);
  const selected = selectedId ? SEED_STARTUPS.find(s => s.id === selectedId) : null;
  const archiveRef = useRef<HTMLElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const visitLogged = useRef(false);
  const closePanel = useMemo(() => () => setPanel(null), []);

  useEffect(() => { const pop = () => { setPath(window.location.pathname); setPanel(null); }; window.addEventListener('popstate', pop); return () => window.removeEventListener('popstate', pop); }, []);
  useEffect(() => {
    if (visitLogged.current) return;
    visitLogged.current = true;
    const ua = navigator.userAgent;
    const browser = /Edg\//.test(ua) ? 'Edge' : /Firefox\//.test(ua) ? 'Firefox' : /Chrome\//.test(ua) ? 'Chrome' : /Safari\//.test(ua) ? 'Safari' : 'Not detected';
    const os = /Android/.test(ua) ? 'Android' : /iPhone|iPad|iPod/.test(ua) ? 'iOS' : /Windows/.test(ua) ? 'Windows' : /Macintosh/.test(ua) ? 'macOS' : /Linux/.test(ua) ? 'Linux' : 'Not detected';
    const device = /iPad|Tablet/.test(ua) ? 'Tablet' : /Mobi|iPhone|Android/.test(ua) ? 'Mobile' : 'Desktop';
    const connection = (navigator as Navigator & { connection?: { effectiveType?: string } }).connection?.effectiveType;
    void fetch('/api/visits', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ browser, os, device, screenRes: `${window.screen.width}x${window.screen.height}`, connType: connection || 'Not collected', location: 'Not collected', path: window.location.pathname }) }).catch(() => {});
  }, []);
  useEffect(() => { store('graveyard_bookmarks', bookmarks); }, [bookmarks]);
  useEffect(() => { store('pimxfail_research_drafts', drafts); }, [drafts]);
  useEffect(() => { try { localStorage.setItem('graveyard_theme', theme); } catch {} document.documentElement.dataset.theme = theme; }, [theme]);
  useEffect(() => { setVisible(12); }, [query, industry, reason, collection, sort]);
  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);
  useEffect(() => {
    document.title = selected ? `${selected.name} — The case study | PIMXFAIL` : selectedId ? 'Case not found | PIMXFAIL' : 'PIMXFAIL — Build on what broke.';
    document.querySelector('meta[name="description"]')?.setAttribute('content', selected ? selected.slogan : 'Explore startup shutdowns, restructurings, and the lessons they leave behind. A searchable archive with original source links.');
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
    canonical.href = `${window.location.origin}${selected ? `/startups/${encodeURIComponent(selected.id)}` : '/'}`;
  }, [selected, selectedId]);
  const notify = (message: string) => { setToast(message); if (toastTimer.current) clearTimeout(toastTimer.current); toastTimer.current = setTimeout(() => setToast(''), 3500); };
  const navigate = (next: string) => { if (window.location.pathname !== next) window.history.pushState({}, '', next); setPath(next); setMobileMenu(false); window.scrollTo({ top: 0, behavior: 'instant' }); };
  const home = () => navigate('/');
  const browse = () => { if (selectedId || path.startsWith('/pimxfailadmin')) { navigate('/'); requestAnimationFrame(() => archiveRef.current?.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth' })); } else archiveRef.current?.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth' }); setMobileMenu(false); };
  const toggleSave = (id: string) => setBookmarks(current => current.includes(id) ? current.filter(v => v !== id) : [...current, id]);
  const openCase = (id: string, e?: MouseEvent<HTMLAnchorElement>) => { if (e && (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey)) return; e?.preventDefault(); navigate(`/startups/${encodeURIComponent(id)}`); };
  const copy = async (value: string, label: string) => { try { await navigator.clipboard.writeText(value); notify(label); } catch { notify('Copy unavailable. Select the text or copy the address from your browser.'); } };
  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    const records = ORDERED.filter(s => (!search || [s.name, s.slogan, s.postMortem, s.primaryFailureReason, ...s.founders].some(v => v.toLowerCase().includes(search))) && (industry === 'all' || s.industry === industry) && (reason === 'all' || s.primaryFailureReason === reason) && (collection !== 'saved' || bookmarks.includes(s.id)));
    if (sort === 'name') records.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'recent') records.sort((a, b) => (typeof b.yearFailed === 'number' ? b.yearFailed : 0) - (typeof a.yearFailed === 'number' ? a.yearFailed : 0));
    return records;
  }, [query, industry, reason, collection, sort, bookmarks]);
  const reset = () => { setQuery(''); setIndustry('all'); setReason('all'); setCollection('all'); setSort('featured'); };
  const activeBlueprint = TECHNICAL_BLUEPRINTS.find(b => b.id === blueprintId);
  const runAnalysis = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); const data = Object.fromEntries(new FormData(e.currentTarget));
    setAnalyzing(true); setAnalysis(null); setAnalysisError('');
    try {
      const response = await fetch('/api/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data), signal: AbortSignal.timeout(60000) });
      if (!response.ok) throw new Error('The analysis service is unavailable. Please try again.');
      const result = await response.json();
      if (typeof result.analysis !== 'string' || !Array.isArray(result.lessons) || !Array.isArray(result.mistakes) || typeof result.pathway !== 'string') throw new Error('The service returned an incomplete analysis. Please try again.');
      setAnalysis(result);
    } catch (error) { setAnalysisError(error instanceof Error ? error.message : 'Unable to connect to the analysis service.'); }
    finally { setAnalyzing(false); }
  };
  const saveDraft = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); const data = new FormData(e.currentTarget); const source = String(data.get('source')).trim();
    try { if (!['https:', 'http:'].includes(new URL(source).protocol)) throw new Error(); } catch { notify('Add a valid public source URL beginning with https:// or http://.'); return; }
    setDrafts(current => [...current, { name: String(data.get('name')).trim(), source, note: String(data.get('note')).trim() }]); setDraftSaved(true); e.currentTarget.reset();
  };

  if (path.startsWith('/pimxfailadmin')) return <PimxAdminDashboard theme={theme} onBackToApp={home} />;

  return <MotionConfig reducedMotion="user"><div className="app">
    <a className="skip-link" href="#main-content">Skip to content</a>
    <header className="site-header"><div className="header-inner"><Brand onClick={home} /><nav className="desktop-nav" aria-label="Main navigation"><button onClick={browse}>The archive <span>{NUMBER.format(SEED_STARTUPS.length)}</span></button><button onClick={() => setPanel('blueprints')}>Blueprints</button><a href={selectedId ? '/#methodology' : '#methodology'} onClick={selectedId ? e => { e.preventDefault(); home(); requestAnimationFrame(() => document.getElementById('methodology')?.scrollIntoView()); } : undefined}>Our approach</a></nav><div className="header-actions"><button className="icon-button theme-button" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`} onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>{theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}</button><button className="contribute-button" onClick={() => { setDraftSaved(false); setPanel('contribute'); }}>Submit a case <Plus size={16} /></button><button className="icon-button mobile-menu-button" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Toggle navigation" aria-expanded={mobileMenu}>{mobileMenu ? <X size={22} /> : <Menu size={22} />}</button></div></div><AnimatePresence>{mobileMenu && <motion.nav className="mobile-nav" aria-label="Mobile navigation" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}><button onClick={browse}>Explore the archive</button><button onClick={() => { setPanel('blueprints'); setMobileMenu(false); }}>Technical blueprints</button><button onClick={() => { setPanel('contribute'); setMobileMenu(false); }}>Submit a case</button></motion.nav>}</AnimatePresence></header>
    <main id="main-content">
      {selectedId ? selected ? <motion.div className="report page-width" key={selected.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <button className="back-link" onClick={browse}><ArrowLeft size={17} /> Back to the archive</button><div className="report-top"><span className="eyebrow">THE CASE STUDY / {outcome(selected)}</span><div><button className="icon-button" aria-label="Copy case link" onClick={() => copy(window.location.href, 'Case link copied.')}><Copy size={18} /></button><button className={`icon-button ${bookmarks.includes(selected.id) ? 'is-saved' : ''}`} aria-label={`${bookmarks.includes(selected.id) ? 'Unsave' : 'Save'} ${selected.name}`} aria-pressed={bookmarks.includes(selected.id)} onClick={() => toggleSave(selected.id)}><Bookmark size={18} fill={bookmarks.includes(selected.id) ? 'currentColor' : 'none'} /></button></div></div>
        <h1 className="report-title">{selected.name}<span>.</span></h1><p className="report-deck">{selected.slogan}</p><div className="report-facts"><div><span>INDUSTRY</span><strong>{selected.industry}</strong></div><div><span>FOUNDED / RECORDED EVENT</span><strong>{years(selected)}</strong></div><div><span>REPORTED FUNDING</span><strong>{selected.fundingRaised}</strong></div><div><span>COUNTRY</span><strong>{selected.country}</strong></div></div>
        <div className="report-layout"><article className="report-story"><span className="eyebrow">01 / WHAT HAPPENED</span><h2>The story behind<br />the outcome.</h2>{selected.postMortem.split(/\n\n/).map((p, i) => <p key={i}>{p}</p>)}<div className="failure-callout"><span className="eyebrow">THE CENTRAL CHALLENGE</span><h3>{selected.primaryFailureReason}</h3><p>{selected.detailedFailureReason}</p></div><span className="eyebrow">02 / LESSONS TO TAKE FORWARD</span><h2>What we can learn.</h2><p className="interpretation-note">Editorial takeaways based on the case; these are interpretations, not findings from the linked sources.</p><ol className="lessons-list">{selected.lessonsLearned.map((lesson, i) => <li key={i}><span>{String(i + 1).padStart(2, '0')}</span><p>{lesson}</p></li>)}</ol></article><aside className="report-aside"><Layers3 size={26} /><h3>Follow the evidence.</h3><p>{REVIEWED_IDS.has(selected.id) ? 'The summary and sources for this featured case were reviewed during this redesign.' : 'This is an existing catalog entry. Its details have not been independently reviewed during this redesign.'}</p><div className="founders"><span className="eyebrow">RECORDED FOUNDERS</span>{selected.founders.map(f => <span key={f}>{f}</span>)}</div><span className="eyebrow">SOURCE MATERIAL</span>{safeSources(selected).length ? safeSources(selected).map((url, i) => <a className="source-link" key={url} href={url} target="_blank" rel="noopener noreferrer"><span>{String(i + 1).padStart(2, '0')} / {sourceLabel(url)}</span><ExternalLink size={15} /></a>) : <p className="source-pending">No public source is linked to this record yet. Treat its factual claims as unverified.</p>}<p className="source-footnote">Funding is the amount reported in the catalog, not a measure of investor losses. The event year can refer to a closure, sale, or restructuring.</p></aside></div><div className="report-next"><span className="eyebrow">KEEP EXPLORING</span><h2>One story. More perspective.</h2><button className="primary-button" onClick={browse}>Explore more cases <ArrowRight size={18} /></button></div>
      </motion.div> : <div className="not-found page-width"><span className="eyebrow">CASE / NOT FOUND</span><h1>This chapter<br />is missing.</h1><p>There is no case at this address. Search the archive to find the company you have in mind.</p><button className="primary-button" onClick={browse}>Return to the archive <ArrowRight size={18} /></button></div> : <>
        <section className="hero page-width"><div className="hero-copy"><motion.div className="hero-label" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><span className="status-dot" /> THE STARTUP FAILURE ARCHIVE</motion.div><motion.h1 initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>Build on<br />what <span className="hero-broke">broke<span className="period">.</span><svg viewBox="0 0 370 18" aria-hidden="true"><path d="M3 11 Q130 0 365 8 M45 15 Q190 5 330 12" /></svg></span></motion.h1><motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>Big ideas. Hard landings. Lasting lessons.<br />Explore the companies that stumbled—and the<br className="desktop-break" /> decisions every builder can learn from.</motion.p><motion.div className="hero-cta" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}><button className="primary-button" onClick={browse}>Explore the archive <ArrowUpRight size={20} /></button><button className="text-button" onClick={() => setPanel('analysis')}>Find your blind spots <ArrowRight size={17} /></button></motion.div><div className="hero-caption"><span className="caption-line" /> FAILURE IS AN EVENT. LEARNING IS A CHOICE.</div></div><motion.div className="hero-visual" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9 }}><Suspense fallback={<div className="scene-loading"><Layers3 size={44} /><span>ASSEMBLING THE STRUCTURE</span></div>}><FailureScene reducedMotion={!!reducedMotion} /></Suspense><div className="scene-sticker"><ArrowDown size={16} /><span>LESS HYPE.<br />MORE HINDSIGHT.</span></div></motion.div></section>
        <section className="stats-strip page-width" aria-label="Archive statistics"><div className="stats-intro"><span className="eyebrow">BEHIND EVERY NUMBER,<br />A STORY WORTH READING.</span><ArrowDown size={20} /></div><div><strong>{NUMBER.format(SEED_STARTUPS.length)}<span>↗</span></strong><span>Records in the archive</span></div><div><strong>{REVIEWED_IDS.size}</strong><span>Featured cases reviewed</span></div><div><strong>{NUMBER.format(SOURCE_COUNT)}</strong><span>Records with source links</span></div></section>
        <section className="archive page-width" id="archive" ref={archiveRef}><div className="section-intro"><div><span className="eyebrow">01 / THE ARCHIVE</span><h2>Great ambition.<br /><span>Real consequences.</span></h2></div><p>A closer look at what happened, why it mattered,<br className="desktop-break" /> and what comes next. Start with a story.</p></div><div className="archive-toolbar"><div className="collection-tabs" role="group" aria-label="Choose collection"><button className={collection === 'all' ? 'active' : ''} onClick={() => setCollection('all')}>All cases <span>{NUMBER.format(SEED_STARTUPS.length)}</span></button><button className={collection === 'saved' ? 'active' : ''} onClick={() => setCollection('saved')}><Bookmark size={15} /> Saved <span>{bookmarks.filter(id => SEED_STARTUPS.some(s => s.id === id)).length}</span></button></div><div className="search-field"><Search size={18} /><input aria-label="Search the archive" type="search" placeholder="A company, founder, or lesson…" value={query} onChange={e => setQuery(e.target.value)} /><span className="search-hint">SEARCH</span></div></div>
          <div className="filter-row"><div className="filter-fields"><label className="filter-select"><span>Industry</span><select aria-label="Filter by industry" value={industry} onChange={e => setIndustry(e.target.value)}><option value="all">All industries</option>{INDUSTRIES.map(v => <option key={v}>{v}</option>)}</select><ChevronDown size={14} /></label><label className="filter-select"><span>Failure reason</span><select aria-label="Filter by failure reason" value={reason} onChange={e => setReason(e.target.value)}><option value="all">All reasons</option>{REASONS.map(v => <option key={v}>{v}</option>)}</select><ChevronDown size={14} /></label>{(query || industry !== 'all' || reason !== 'all') && <button className="reset-button" onClick={reset}>Clear filters <X size={13} /></button>}</div><div className="sort-layout"><label className="sort-select"><select aria-label="Sort cases" value={sort} onChange={e => setSort(e.target.value)}><option value="featured">Featured first</option><option value="recent">Event year: newest</option><option value="name">Name: A–Z</option></select><ChevronDown size={14} /></label><div className="layout-switch" role="group" aria-label="Archive layout"><button className={layout === 'grid' ? 'active' : ''} onClick={() => setLayout('grid')} aria-label="Grid view" aria-pressed={layout === 'grid'}><Grid2X2 size={16} /></button><button className={layout === 'list' ? 'active' : ''} onClick={() => setLayout('list')} aria-label="List view" aria-pressed={layout === 'list'}><List size={17} /></button></div></div></div><div className="results-caption" role="status"><span>{NUMBER.format(filtered.length)} {filtered.length === 1 ? 'case' : 'cases'} {collection === 'saved' ? 'saved' : 'to explore'}</span><span><i className="tiny-dot" /> Closures, acquisitions & restructurings</span></div>
          {filtered.length ? <div className={`case-grid ${layout === 'list' ? 'list-layout' : ''}`} key={`${query}|${industry}|${reason}|${collection}|${sort}`}>{filtered.slice(0, visible).map((s, i) => <CaseCard key={s.id} startup={s} index={i} saved={bookmarks.includes(s.id)} onSave={() => toggleSave(s.id)} onOpen={e => openCase(s.id, e)} />)}</div> : <div className="empty-state"><Search size={30} /><h3>{collection === 'saved' && !query && industry === 'all' && reason === 'all' ? 'Your next lesson is waiting.' : 'No matching stories. Yet.'}</h3><p>{collection === 'saved' ? 'Save a case with its bookmark button to return to it here.' : 'Try a different company, founder, industry, or failure reason.'}</p><button className="secondary-button" onClick={reset}>Explore all cases <ArrowRight size={17} /></button></div>}{visible < filtered.length && <div className="load-more"><span>Showing {Math.min(visible, filtered.length)} of {NUMBER.format(filtered.length)} cases</span><button className="secondary-button" onClick={() => setVisible(v => v + 12)}>More stories to learn from <Plus size={17} /></button></div>}
        </section>
        <section className="insight-section page-width"><div className="insight-art" aria-hidden="true"><div className="orbital orbital-one" /><div className="orbital orbital-two" /><div className="orbital orbital-three" /><span className="insight-star">✳</span><span className="insight-art-label">PATTERN / RECOGNITION</span></div><div className="insight-copy"><span className="eyebrow">02 / CONNECT THE DOTS</span><h2>Hindsight.<br />Meet foresight.</h2><p>Bring your idea, business model, or hardest question. Use the analysis workspace to explore possible risks and questions to test before your next big move.</p><button className="primary-button" onClick={() => setPanel('analysis')}>Open the analysis workspace <ArrowUpRight size={19} /></button><span className="insight-footnote">Scenario analysis. Your assumptions, made visible.</span></div></section>
        <section className="methodology page-width" id="methodology"><div className="methodology-heading"><span className="eyebrow">03 / OUR APPROACH</span><h2>Curiosity, with<br />a paper trail.</h2><p>Failure rarely has one cause. Our goal is to make these stories easier to explore, without turning hindsight into certainty.</p><a href="https://github.com/MOHAMMADREZAABEDINPOOR/PIMX_FAIL" target="_blank" rel="noopener noreferrer" className="text-button">Explore the project <ArrowUpRight size={17} /></a></div><div className="methodology-items"><div><span>01</span><div><h3>Start with the source.</h3><p>Case pages link to available public references. A source link is a starting point, not proof that every claim has been verified. Records without links are marked accordingly.</p></div></div><div><span>02</span><div><h3>Keep the context.</h3><p>A shutdown, acquisition, and bankruptcy are different outcomes. Dates refer to the recorded event; reported funding does not equal money lost.</p></div></div><div><span>03</span><div><h3>Separate facts from takeaways.</h3><p>Lessons are editorial interpretations. We omit the catalog’s numerical risk scores because they are not audited measurements. Analysis results stay separate from historical records.</p></div></div></div></section>
        <section className="closing-section page-width"><span className="eyebrow">THE NEXT CHAPTER IS YOURS.</span><div><h2>Learn. Build. <em>Repeat.</em></h2><button className="round-button" onClick={browse} aria-label="Back to the archive"><ArrowUpRight size={35} /></button></div></section>
      </>}
    </main>
    <footer className="site-footer page-width"><Brand onClick={home} /><p>An independent archive. A little less hindsight wasted.</p><a href="https://github.com/MOHAMMADREZAABEDINPOOR/PIMX_FAIL" target="_blank" rel="noopener noreferrer">GitHub <ArrowUpRight size={15} /></a><span>© {new Date().getFullYear()} PIMX</span></footer>
    <AnimatePresence>{panel && <Sheet title={panel === 'analysis' ? 'Find your blind spots.' : panel === 'contribute' ? 'Every story adds perspective.' : 'Under the hood.'} eyebrow={panel === 'analysis' ? 'THE ANALYSIS WORKSPACE' : panel === 'contribute' ? 'RESEARCH NOTES' : 'TECHNICAL BLUEPRINTS'} onClose={closePanel}>
      {panel === 'analysis' ? <><p className="sheet-description">Describe your scenario. Explore potential risks, challenge your assumptions, and decide what evidence to look for next.</p><form className="workspace-form" onSubmit={runAnalysis}><label>Company or idea<input name="name" placeholder="What are you building?" required maxLength={150} /></label><label>Industry<input name="industry" placeholder="e.g. Consumer hardware" required maxLength={150} /></label><label>Your scenario<textarea name="description" rows={5} placeholder="Describe your customers, product, business model, and the problem you want to understand." required maxLength={6000} /></label><label>Known concerns <span>(optional)</span><textarea name="failureReasons" rows={2} placeholder="What feels uncertain?" maxLength={2000} /></label><button className="primary-button" type="submit" disabled={analyzing}>{analyzing ? <><LoaderCircle size={18} className="spin" /> Exploring your scenario…</> : <>Explore possible risks <Sparkles size={18} /></>}</button></form>{analysisError && <p className="form-error" role="alert">{analysisError}</p>}{analysis && <div className="analysis-result" role="status"><span className="eyebrow">{analysis.simulated ? 'GENERAL PROMPTS / NO AI PROVIDER CONNECTED' : 'AI-GENERATED SCENARIO ANALYSIS'}</span><p className="analysis-disclosure">{analysis.simulated ? 'The server returned general reflection prompts. They are not an assessment of your company and do not establish company facts.' : 'Based on your description. This is a generated interpretation, not verified company research.'}</p><h3>Points to examine</h3><p>{analysis.analysis}</p><h3>Assumptions to challenge</h3><ul>{analysis.mistakes.map((item, i) => <li key={i}>{item}</li>)}</ul><h3>Next steps to consider</h3><ul>{analysis.lessons.map((item, i) => <li key={i}>{item}</li>)}</ul><div className="analysis-pathway"><span className="eyebrow">A POSSIBLE PATH FORWARD</span><p>{analysis.pathway}</p></div></div>}</> : panel === 'contribute' ? <><p className="sheet-description">Know a case worth studying? Collect the company name, a public source, and your notes. Drafts are saved in this browser for your own research; they are not published to the archive.</p>{draftSaved && <div className="success-message" role="status"><Check size={20} /><span>Research draft saved in this browser.</span></div>}<form className="workspace-form" onSubmit={saveDraft}><label>Company name<input name="name" required maxLength={150} placeholder="The company behind the story" /></label><label>Public source URL<input name="source" type="url" required placeholder="https://…" maxLength={2000} /></label><label>What happened?<textarea name="note" required rows={5} maxLength={6000} placeholder="Add context, the event date, and what this source establishes." /></label><button className="primary-button" type="submit">Save a research draft <Plus size={18} /></button></form>{drafts.length > 0 && <div className="draft-list"><h3>Your research drafts <span>{drafts.length}</span></h3>{drafts.map((d, i) => <div key={`${d.name}-${i}`}><h4>{d.name}</h4><p>{d.note}</p>{/^https?:\/\//i.test(d.source) && <a href={d.source} target="_blank" rel="noopener noreferrer">Read the source <ExternalLink size={13} /></a>}<button className="text-button" onClick={() => setDrafts(current => current.filter((_, index) => index !== i))}>Remove draft <X size={13} /></button></div>)}</div>}</> : <><p className="sheet-description">Explore the architecture, data contracts, and research tools behind PIMXFAIL.</p><div className="blueprint-tabs">{TECHNICAL_BLUEPRINTS.map(b => <button key={b.id} className={b.id === blueprintId ? 'active' : ''} onClick={() => setBlueprintId(b.id)}>{b.title}</button>)}</div>{activeBlueprint && <div className="blueprint-content"><span className="eyebrow">{activeBlueprint.category}</span><h3>{activeBlueprint.title}</h3><p>{activeBlueprint.description}</p><div className="code-heading"><span>{activeBlueprint.codeLanguage}</span><button onClick={() => copy(activeBlueprint.code, 'Blueprint copied.')}><Copy size={14} /> Copy</button></div><pre><code>{activeBlueprint.code}</code></pre></div>}</>}
    </Sheet>}</AnimatePresence>
    <AnimatePresence>{toast && <motion.div className="toast" role="status" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>{toast}<button aria-label="Dismiss notification" onClick={() => setToast('')}><X size={15} /></button></motion.div>}</AnimatePresence>
  </div></MotionConfig>;
}
