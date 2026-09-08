import { EarningsSection } from '@/components/EarningsSection';
import { type FormEvent, type ReactNode, useEffect, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  BriefcaseBusiness,
  Camera,
  Check,
  ChevronRight,
  Clipboard,
  Copy,
  FilePenLine,
  Hash,
  Home,
  Linkedin,
  Menu,
  Network,
  Plus,
  Search,
  Sparkles,
  Trash2,
  UserRound,
  UsersRound,
  X,
} from 'lucide-react';
import {
  Link,
  Route,
  Switch,
  Router as WouterRouter,
  useLocation,
} from 'wouter';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

type Channel = 'Instagram' | 'Facebook' | 'LinkedIn';
type Profile = {
  businessName: string;
  industry: string;
  audience: string;
  location: string;
  offer: string;
  voice: string;
  website: string;
};
type Draft = {
  id: string;
  channel: Channel;
  goal: string;
  tone: string;
  post: string;
  caption: string;
  cta: string;
  hashtags: string;
  createdAt: string;
};

const defaultProfile: Profile = {
  businessName: 'Juniper & Grain',
  industry: 'Neighborhood bakery',
  audience: 'Busy locals who love thoughtful, slow-made food',
  location: 'Portland, Oregon',
  offer: 'Sourdough loaves, seasonal pastries, and Saturday brunch',
  voice: 'Warm, bright, a little witty',
  website: 'juniperandgrain.co',
};

const sampleDraft: Draft = {
  id: 'sample-draft',
  channel: 'Instagram',
  goal: 'Promote an offer',
  tone: 'Warm & inviting',
  post: 'Your Saturday morning just found its happy place.',
  caption:
    'The ovens are humming and the first loaves are getting their golden edges. Drop by Juniper & Grain this weekend for our new lemon-thyme morning bun — flaky, bright, and gone before noon.\n\nBring a friend, take the long way home, and make a morning of it.',
  cta: 'Stop by this Saturday →',
  hashtags: '#PortlandEats  #SlowMade  #JuniperAndGrain  #WeekendRitual',
  createdAt: 'Today',
};

const goals = ['Promote an offer', 'Build awareness', 'Share an update', 'Start a conversation'];
const tones = ['Warm & inviting', 'Bright & playful', 'Clear & confident', 'Thoughtful & local'];

function readStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Local persistence is a convenience; the editor remains usable if storage is blocked.
  }
}

function makeDraft(profile: Profile, channel: Channel, goal: string, tone: string): Draft {
  const name = profile.businessName || 'your business';
  const offer = profile.offer || 'something worth making time for';
  const place = profile.location || 'your neighborhood';
  const isPlayful = tone === 'Bright & playful';
  const channelLead =
    channel === 'LinkedIn'
      ? `A small idea from ${name} that is making a big difference:`
      : channel === 'Facebook'
        ? `Good things are happening in ${place}.`
        : `A little ${name} moment for your feed.`;
  const goalLine =
    goal === 'Promote an offer'
      ? `This week, we’re making ${offer.toLowerCase()} the easiest yes of your day.`
      : goal === 'Build awareness'
        ? `Made with care for the people who make ${place} feel like home.`
        : goal === 'Share an update'
          ? `Here’s what’s new at ${name}: more of the good stuff, made more thoughtfully.`
          : `What is one small ritual you never skip in ${place}? We’ll go first.`;
  const post = isPlayful ? 'Make room for the good stuff.' : channelLead;
  const caption = `${channelLead}\n\n${goalLine} ${profile.voice ? `Our voice is simple: ${profile.voice.toLowerCase()}, never overcomplicated.` : ''}\n\nSave this for later, send it to your favorite person, or come say hello.`;
  return {
    id: `draft-${Date.now()}`,
    channel,
    goal,
    tone,
    post,
    caption,
    cta: goal === 'Start a conversation' ? 'Tell us yours →' : 'Come take a closer look →',
    hashtags: `#${name.replace(/[^a-zA-Z0-9]/g, '')} #${place.split(',')[0].replace(/\s/g, '')} #MadeWithCare #SmallBusiness`,
    createdAt: 'Just now',
  };
}

function ChannelMark({ channel }: { channel: Channel }) {
  if (channel === 'Instagram') return <Camera size={16} strokeWidth={2.2} />;
  if (channel === 'Facebook') return <UsersRound size={16} strokeWidth={2.2} />;
  return <Linkedin size={16} strokeWidth={2.2} />;
}

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3" data-testid="link-logo">
      <span className="relative grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-[3px_3px_0_hsl(var(--accent))]">
        <Sparkles size={18} strokeWidth={2.6} />
      </span>
      <span className="text-[17px] font-bold tracking-[-0.04em]">MarketMate<span className="text-primary">.</span></span>
    </Link>
  );
}

function Navigation({ onNavigate }: { onNavigate?: () => void }) {
  const [location] = useLocation();
  const items = [
    { href: '/', label: 'Content studio', icon: Home, id: 'home' },
    { href: '/saved', label: 'Saved posts', icon: Bookmark, id: 'saved' },
    { href: '/profile', label: 'Business profile', icon: UserRound, id: 'profile' },
  ];
  return (
    <nav className="flex gap-1 md:flex-col" aria-label="Main navigation">
      {items.map((item) => {
        const active = location === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            data-testid={`link-${item.id}`}
            className={`group flex min-h-11 flex-1 items-center justify-center gap-3 rounded-xl px-3 text-sm font-semibold transition-all md:flex-none md:justify-start ${
              active
                ? 'bg-primary text-primary-foreground shadow-[3px_3px_0_hsl(var(--accent))]'
                : 'text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-foreground'
            }`}
          >
            <Icon size={18} strokeWidth={active ? 2.5 : 2} />
            <span className="hidden md:inline">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="app-noise min-h-[100dvh] bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] flex-col bg-sidebar px-5 py-6 text-sidebar-foreground md:flex">
        <Logo />
        <div className="mt-14">
          <p className="mb-3 px-3 font-mono-ui text-[10px] font-bold uppercase tracking-[0.18em] text-sidebar-foreground/40">Workspace</p>
          <Navigation />
        </div>
        <div className="mt-auto rounded-2xl border border-sidebar-border bg-sidebar-accent/60 p-4">
          <div className="mb-3 flex items-center gap-2 text-sidebar-primary">
            <Sparkles size={15} />
            <span className="font-mono-ui text-[10px] font-bold uppercase tracking-[0.15em]">Your creative sidekick</span>
          </div>
          <p className="text-sm leading-5 text-sidebar-foreground/65">Good content starts with knowing what makes your business special.</p>
        </div>
      </aside>
      <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between border-b border-border/70 bg-background/90 px-5 backdrop-blur-md md:hidden">
        <Logo />
        <button type="button" onClick={() => setMobileOpen(!mobileOpen)} className="grid size-10 place-items-center rounded-xl border border-border bg-card" aria-label="Toggle navigation" data-testid="button-toggle-navigation">
          {mobileOpen ? <X size={19} /> : <Menu size={20} />}
        </button>
      </header>
      {mobileOpen && (
        <div className="fixed inset-x-0 top-[68px] z-20 border-b border-border bg-sidebar p-4 text-sidebar-foreground shadow-lg md:hidden">
          <Navigation onNavigate={() => setMobileOpen(false)} />
        </div>
      )}
      <main className="min-h-[calc(100dvh-68px)] md:ml-[248px] md:min-h-[100dvh]">{children}</main>
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-sidebar px-3 py-2 md:hidden">
        <Navigation />
      </div>
    </div>
  );
}

function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: ReactNode; description: string; action?: ReactNode }) {
  return (
    <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="mb-2 font-mono-ui text-[10px] font-bold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
        <h1 className="text-balance text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.02] tracking-[-0.055em]">{title}</h1>
        <p className="mt-3 max-w-xl text-[15px] leading-6 text-muted-foreground">{description}</p>
      </div>
      {action}
    </header>
  );
}

function Studio({ profile, profileSaved, initialDraft, onDraftChange }: { profile: Profile; profileSaved: boolean; initialDraft: Draft | null; onDraftChange: (draft: Draft | null) => void }) {
  const [channel, setChannel] = useState<Channel>(initialDraft?.channel ?? 'Instagram');
  const [goal, setGoal] = useState(initialDraft?.goal ?? goals[0]);
  const [tone, setTone] = useState(initialDraft?.tone ?? tones[0]);
  const [draft, setDraft] = useState<Draft>(initialDraft ?? sampleDraft);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (initialDraft) {
      setDraft(initialDraft);
      setChannel(initialDraft.channel);
      setGoal(initialDraft.goal);
      setTone(initialDraft.tone);
    }
  }, [initialDraft]);

  const updateDraft = (key: keyof Pick<Draft, 'post' | 'caption' | 'cta' | 'hashtags'>, value: string) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setSaved(false);
  };

  const generate = () => {
    setGenerating(true);
    setNotice('');
    window.setTimeout(() => {
      const next = makeDraft(profile, channel, goal, tone);
      setDraft(next);
      onDraftChange(next);
      setGenerating(false);
      setSaved(false);
      setNotice('Fresh draft ready to make yours.');
    }, 650);
  };

  const copyDraft = async () => {
    const text = `${draft.post}\n\n${draft.caption}\n\n${draft.cta}\n\n${draft.hashtags}`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const area = document.createElement('textarea');
      area.value = text;
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      area.remove();
    }
    setCopied(true);
    setNotice('Copied to your clipboard.');
    window.setTimeout(() => setCopied(false), 1800);
  };

  const saveDraft = () => {
    const posts = readStorage<Draft[]>('marketmate-saved-posts', []);
    const next = { ...draft, id: draft.id === 'sample-draft' ? `saved-${Date.now()}` : draft.id, createdAt: 'Just now' };
    const withoutCurrent = posts.filter((post) => post.id !== next.id);
    writeStorage('marketmate-saved-posts', [next, ...withoutCurrent]);
    setDraft(next);
    setSaved(true);
    setNotice('Saved to your post library.');
  };

  return (
    <div className="page-enter mx-auto max-w-[1320px] px-5 py-8 pb-28 sm:px-8 lg:px-12 lg:py-12">
      <PageHeader
        eyebrow="Content studio"
        title={<>Make your next post<br className="hidden sm:block" /> feel like <span className="text-primary">you.</span></>}
        description="A little momentum for the words your business already has to say."
        action={<div className="hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground sm:flex"><span className="size-2 rounded-full bg-primary" /> Local workspace</div>}
      />
      {!profileSaved && (
        <div className="rise-in mb-7 flex flex-col gap-4 rounded-2xl border border-primary/25 bg-primary/10 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground"><Sparkles size={15} /></span>
            <div><p className="font-semibold">This sample is ready to remix.</p><p className="mt-0.5 text-sm text-muted-foreground">Add your business details and every draft will sound more like your brand.</p></div>
          </div>
          <Link href="/profile" className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-primary hover:underline" data-testid="link-create-profile">Create your profile <ArrowRight size={15} /></Link>
        </div>
      )}
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(285px,0.78fr)_minmax(530px,1.5fr)]">
        <section className="rise-in delay-1 rounded-2xl border border-card-border bg-card p-5 soft-shadow sm:p-6" aria-labelledby="brief-title">
          <div className="mb-6 flex items-center justify-between">
            <div><p className="font-mono-ui text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">01 / Brief</p><h2 id="brief-title" className="mt-1 text-xl font-bold tracking-[-0.035em]">Set the direction</h2></div>
            <span className="grid size-9 place-items-center rounded-xl bg-accent/25 text-accent-foreground"><Network size={18} /></span>
          </div>
          <fieldset className="mb-7">
            <legend className="mb-3 text-sm font-bold">Where is this going?</legend>
            <div className="grid grid-cols-3 gap-2">
              {(['Instagram', 'Facebook', 'LinkedIn'] as Channel[]).map((item) => (
                <button type="button" key={item} onClick={() => { setChannel(item); setSaved(false); }} className={`flex min-h-[76px] flex-col items-center justify-center gap-2 rounded-xl border text-xs font-bold transition-all ${channel === item ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground'}`} data-testid={`button-channel-${item.toLowerCase()}`} aria-pressed={channel === item}>
                  <ChannelMark channel={item} /><span>{item}</span>
                </button>
              ))}
            </div>
          </fieldset>
          <label className="mb-6 block text-sm font-bold" htmlFor="goal">What should it do?
            <select id="goal" value={goal} onChange={(event) => setGoal(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-input bg-background px-3 text-sm font-medium outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" data-testid="select-goal">
              {goals.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="mb-6 block text-sm font-bold" htmlFor="tone">How should it feel?
            <select id="tone" value={tone} onChange={(event) => setTone(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-input bg-background px-3 text-sm font-medium outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" data-testid="select-tone">
              {tones.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <div className="mb-6 rounded-xl bg-muted/70 p-4">
            <div className="mb-2 flex items-center gap-2 text-primary"><BriefcaseBusiness size={15} /><span className="font-mono-ui text-[10px] font-bold uppercase tracking-[0.14em]">Using profile</span></div>
            <p className="font-semibold">{profile.businessName}</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{profile.industry} · {profile.location}</p>
          </div>
          <button type="button" onClick={generate} disabled={generating} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-secondary px-4 text-sm font-bold text-secondary-foreground transition hover:-translate-y-0.5 hover:bg-secondary/90 disabled:cursor-wait disabled:opacity-70" data-testid="button-generate">
            {generating ? <><span className="size-4 animate-spin rounded-full border-2 border-secondary-foreground/30 border-t-secondary-foreground" />Writing your draft...</> : <><Sparkles size={17} />Generate draft<ChevronRight size={16} /></>}
          </button>
          <p className="mt-3 text-center font-mono-ui text-[9px] uppercase tracking-[0.12em] text-muted-foreground">No API · your ideas stay on this device</p>
        </section>

        <section className="rise-in delay-2 min-w-0 rounded-2xl border border-card-border bg-card soft-shadow" aria-labelledby="draft-title">
          <div className="flex flex-col gap-4 border-b border-border/70 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div><p className="font-mono-ui text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">02 / Your draft</p><h2 id="draft-title" className="mt-1 text-xl font-bold tracking-[-0.035em]">{draft.id === 'sample-draft' ? 'A starting point' : 'Ready to refine'}</h2></div>
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground"><ChannelMark channel={draft.channel} /><span>{draft.channel}</span><span className="mx-1 text-border">/</span><span>{draft.createdAt}</span></div>
          </div>
          <div className="space-y-5 p-5 sm:p-6">
            <div>
              <div className="mb-2 flex items-center justify-between"><label htmlFor="post-text" className="text-xs font-bold uppercase tracking-[0.13em] text-muted-foreground">Post opener</label><span className="font-mono-ui text-[10px] text-muted-foreground">{draft.post.length}/120</span></div>
              <textarea id="post-text" value={draft.post} maxLength={120} onChange={(event) => updateDraft('post', event.target.value)} className="min-h-[78px] w-full resize-y rounded-xl border border-input bg-background px-4 py-3 text-[19px] font-bold leading-7 tracking-[-0.025em] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" data-testid="textarea-post" />
            </div>
            <div>
              <label htmlFor="caption-text" className="mb-2 block text-xs font-bold uppercase tracking-[0.13em] text-muted-foreground">Caption</label>
              <textarea id="caption-text" value={draft.caption} onChange={(event) => updateDraft('caption', event.target.value)} className="min-h-[175px] w-full resize-y rounded-xl border border-input bg-background px-4 py-3 text-[15px] leading-6 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" data-testid="textarea-caption" />
            </div>
            <div className="grid gap-5 sm:grid-cols-[1fr_1fr]">
              <div><label htmlFor="cta-text" className="mb-2 block text-xs font-bold uppercase tracking-[0.13em] text-muted-foreground">Call to action</label><input id="cta-text" value={draft.cta} onChange={(event) => updateDraft('cta', event.target.value)} className="h-12 w-full rounded-xl border border-input bg-background px-4 text-sm font-bold outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" data-testid="input-cta" /></div>
              <div><label htmlFor="hashtags-text" className="mb-2 block text-xs font-bold uppercase tracking-[0.13em] text-muted-foreground">Hashtags</label><input id="hashtags-text" value={draft.hashtags} onChange={(event) => updateDraft('hashtags', event.target.value)} className="h-12 w-full rounded-xl border border-input bg-background px-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" data-testid="input-hashtags" /></div>
            </div>
          </div>
          <div className="flex flex-col-reverse gap-3 border-t border-border/70 bg-muted/35 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="min-h-5 text-sm font-semibold text-primary" aria-live="polite" data-testid="status-studio">{notice}</div>
            <div className="flex gap-2">
              <button type="button" onClick={copyDraft} className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-bold transition hover:border-primary hover:text-primary sm:flex-none" data-testid="button-copy">{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? 'Copied' : 'Copy all'}</button>
              <button type="button" onClick={saveDraft} className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground transition hover:-translate-y-0.5 hover:brightness-105 sm:flex-none" data-testid="button-save">{saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}{saved ? 'Saved' : 'Save post'}</button>
            </div>
          </div>
        </section>
      </div>
      <div className="mt-8 flex items-center gap-3 rounded-2xl border border-border/70 bg-card/55 p-4 text-sm text-muted-foreground">
        <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent/20 text-accent-foreground"><Hash size={16} /></div>
        <p><span className="font-semibold text-foreground">A useful nudge:</span> Read your draft out loud once. If it sounds like you, it is ready.</p>
      </div>
    </div>
  );
}

function SavedPage({ onEdit, onNewPost }: { onEdit: (post: Draft) => void; onNewPost: () => void }) {
  const [posts, setPosts] = useState<Draft[]>([]);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'All' | Channel>('All');
  useEffect(() => setPosts(readStorage<Draft[]>('marketmate-saved-posts', [])), []);
  const visible = useMemo(() => posts.filter((post) => {
    const matchesFilter = filter === 'All' || post.channel === filter;
    const text = `${post.post} ${post.caption} ${post.hashtags}`.toLowerCase();
    return matchesFilter && text.includes(query.toLowerCase());
  }), [posts, query, filter]);
  const remove = (id: string) => {
    const next = posts.filter((post) => post.id !== id);
    setPosts(next);
    writeStorage('marketmate-saved-posts', next);
  };
  return (
    <div className="page-enter mx-auto max-w-[1180px] px-5 py-8 pb-28 sm:px-8 lg:px-12 lg:py-12">
      <PageHeader eyebrow="Your library" title="Saved for a good day." description="The ideas you liked enough to keep. Pick one, polish it, and put it into the world." action={<Link href="/" onClick={onNewPost} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-secondary px-4 text-sm font-bold text-secondary-foreground transition hover:-translate-y-0.5" data-testid="link-new-post"><Plus size={17} />New post</Link>} />
      <div className="mb-7 flex flex-col gap-3 sm:flex-row">
        <label className="relative block flex-1"><Search size={17} className="absolute left-3.5 top-3.5 text-muted-foreground" /><input type="search" placeholder="Search saved posts" value={query} onChange={(event) => setQuery(event.target.value)} className="h-12 w-full rounded-xl border border-input bg-card pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" data-testid="input-search-saved" /></label>
        <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter by channel">
          {(['All', 'Instagram', 'Facebook', 'LinkedIn'] as const).map((item) => <button type="button" key={item} onClick={() => setFilter(item)} className={`h-12 shrink-0 rounded-xl border px-4 text-sm font-bold transition ${filter === item ? 'border-secondary bg-secondary text-secondary-foreground' : 'border-border bg-card text-muted-foreground hover:border-primary'}`} data-testid={`button-filter-${item.toLowerCase()}`}>{item}</button>)}
        </div>
      </div>
      {visible.length === 0 ? (
        <div className="rise-in rounded-2xl border border-dashed border-border bg-card/50 px-6 py-20 text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-accent/20 text-accent-foreground"><Bookmark size={24} /></span>
          <h2 className="mt-5 text-xl font-bold tracking-[-0.03em]">{posts.length === 0 ? 'Your library is ready when you are.' : 'Nothing matches that search.'}</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">{posts.length === 0 ? 'Generate a draft in the studio, then save the ones that feel like a keeper.' : 'Try another phrase or clear the filter to see more of your ideas.'}</p>
          {posts.length === 0 && <Link href="/" className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground" data-testid="link-start-saving">Start creating <ArrowRight size={16} /></Link>}
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {visible.map((post, index) => <article key={post.id} className={`rise-in rounded-2xl border border-card-border bg-card p-5 soft-shadow transition hover:-translate-y-1 hover:shadow-[0_16px_35px_rgba(24,35,36,.12)] sm:p-6`} style={{ animationDelay: `${index * 70}ms` }} data-testid={`card-saved-${post.id}`}>
            <div className="mb-5 flex items-center justify-between"><div className="flex items-center gap-2 text-xs font-bold text-primary"><span className="grid size-7 place-items-center rounded-lg bg-primary/10"><ChannelMark channel={post.channel} /></span>{post.channel}</div><span className="font-mono-ui text-[10px] text-muted-foreground">{post.createdAt}</span></div>
            <p className="text-xl font-bold leading-7 tracking-[-0.035em]">{post.post}</p>
            <p className="mt-4 line-clamp-4 whitespace-pre-line text-sm leading-6 text-muted-foreground">{post.caption}</p>
            <div className="mt-5 flex flex-wrap gap-2">{post.hashtags.split(' ').slice(0, 4).map((tag) => <span key={tag} className="rounded-full bg-muted px-2.5 py-1 font-mono-ui text-[10px] text-muted-foreground">{tag}</span>)}</div>
            <div className="mt-6 flex gap-2 border-t border-border/70 pt-4"><button type="button" onClick={() => onEdit(post)} className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-secondary px-3 text-sm font-bold text-secondary-foreground transition hover:bg-secondary/90" data-testid={`button-edit-${post.id}`}><FilePenLine size={15} />Edit draft</button><button type="button" onClick={() => remove(post.id)} className="grid size-10 place-items-center rounded-xl border border-border text-muted-foreground transition hover:border-destructive hover:text-destructive" aria-label={`Delete ${post.post}`} data-testid={`button-delete-${post.id}`}><Trash2 size={16} /></button></div>
          </article>)}
        </div>
      )}
    </div>
  );
}

function ProfilePage({ profile, onSave }: { profile: Profile; onSave: (profile: Profile) => void }) {
  const [form, setForm] = useState(profile);
  const [saved, setSaved] = useState(false);
  const update = (key: keyof Profile, value: string) => { setForm((current) => ({ ...current, [key]: value })); setSaved(false); };
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); onSave(form); setSaved(true); };
  const fields: { key: keyof Profile; label: string; placeholder: string; helper: string }[] = [
    { key: 'businessName', label: 'Business name', placeholder: 'e.g. Juniper & Grain', helper: 'What should show up in your content?' },
    { key: 'industry', label: 'Industry', placeholder: 'e.g. Neighborhood bakery', helper: 'A little context helps the ideas land.' },
    { key: 'audience', label: 'Who you serve', placeholder: 'e.g. Busy locals who love thoughtful food', helper: 'Be specific — “everyone” is hard to write for.' },
    { key: 'location', label: 'Location', placeholder: 'e.g. Portland, Oregon', helper: 'Local details make posts feel real.' },
    { key: 'offer', label: 'What you offer', placeholder: 'e.g. Sourdough, pastries, and Saturday brunch', helper: 'Products, services, or the reason people choose you.' },
    { key: 'voice', label: 'Brand voice', placeholder: 'e.g. Warm, bright, a little witty', helper: 'Three words is plenty.' },
    { key: 'website', label: 'Website', placeholder: 'e.g. juniperandgrain.co', helper: 'Optional — handy context for calls to action.' },
  ];
  return (
    <div className="page-enter mx-auto max-w-[1050px] px-5 py-8 pb-28 sm:px-8 lg:px-12 lg:py-12">
      <PageHeader eyebrow="Your context" title="Make it sound like your business." description="Give MarketMate the good stuff. Your profile is saved only on this device and used to shape every draft." />
      <div className="grid gap-6 lg:grid-cols-[.7fr_1.3fr]">
        <aside className="rise-in delay-1 h-fit rounded-2xl bg-secondary p-6 text-secondary-foreground sm:p-7">
          <span className="grid size-11 place-items-center rounded-xl bg-primary text-primary-foreground"><UserRound size={21} /></span>
          <h2 className="mt-8 text-2xl font-bold leading-tight tracking-[-0.04em]">The more specific,<br />the more you.</h2>
          <p className="mt-4 text-sm leading-6 text-secondary-foreground/65">MarketMate uses these details as creative guardrails — not a script. You can change them whenever your business changes.</p>
          <div className="mt-8 border-t border-secondary-foreground/15 pt-5"><div className="flex items-center gap-2 text-primary"><Check size={15} /><span className="text-sm font-bold">Saved locally</span></div><p className="mt-2 text-xs leading-5 text-secondary-foreground/55">No account, no upload, no marketing jargon.</p></div>
        </aside>
        <form onSubmit={submit} className="rise-in delay-2 rounded-2xl border border-card-border bg-card p-5 soft-shadow sm:p-7">
          <div className="mb-7 flex items-center justify-between border-b border-border/70 pb-5"><div><p className="font-mono-ui text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Business profile</p><h2 className="mt-1 text-xl font-bold tracking-[-0.035em]">The essentials</h2></div><span className="font-mono-ui text-[10px] text-muted-foreground">7 details</span></div>
          <div className="grid gap-x-5 gap-y-6 sm:grid-cols-2">
            {fields.map((field, index) => <label key={field.key} className={index === 2 || index === 4 ? 'sm:col-span-2' : ''} htmlFor={`profile-${field.key}`}><span className="mb-2 block text-sm font-bold">{field.label}{field.key === 'website' && <span className="ml-1 font-normal text-muted-foreground">(optional)</span>}</span><input id={`profile-${field.key}`} value={form[field.key]} onChange={(event) => update(field.key, event.target.value)} placeholder={field.placeholder} className="h-12 w-full rounded-xl border border-input bg-background px-4 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20" data-testid={`input-profile-${field.key}`} /><span className="mt-1.5 block text-[11px] leading-4 text-muted-foreground">{field.helper}</span></label>)}
          </div>
          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border/70 pt-6 sm:flex-row sm:items-center sm:justify-between"><span className="min-h-5 text-sm font-semibold text-primary" aria-live="polite" data-testid="status-profile">{saved ? 'Profile saved. Your next draft will know the difference.' : ''}</span><button type="submit" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground transition hover:-translate-y-0.5 hover:brightness-105" data-testid="button-save-profile">{saved ? <Check size={17} /> : <Clipboard size={17} />}{saved ? 'Saved' : 'Save profile'}</button></div>
        </form>
      </div>
    </div>
  );
}

function Router() {
  const [, setLocation] = useLocation();
  const [profile, setProfile] = useState<Profile>(() => readStorage('marketmate-profile', defaultProfile));
  const [profileSaved, setProfileSaved] = useState(() => Boolean(localStorage.getItem('marketmate-profile')));
  const [activeDraft, setActiveDraft] = useState<Draft | null>(() => readStorage<Draft | null>('marketmate-active-draft', null));
  const saveProfile = (next: Profile) => { setProfile(next); setProfileSaved(true); writeStorage('marketmate-profile', next); };
  const editPost = (post: Draft) => { setActiveDraft(post); writeStorage('marketmate-active-draft', post); setLocation('/'); };
  const newPost = () => { setActiveDraft(null); localStorage.removeItem('marketmate-active-draft'); };
  const clearDraft = (draft: Draft | null) => { setActiveDraft(draft); if (draft) writeStorage('marketmate-active-draft', draft); };
  return (
    <AppShell>
      <RoutedErrorBoundary>
        <Switch>
          <Route path="/">
            <Studio 
              profile={profile} 
              profileSaved={profileSaved} 
              initialDraft={activeDraft} 
              onDraftChange={clearDraft} 
            />
          </Route>
          <Route path="/earnings">
            <EarningsSection />
          </Route>
          <Route path="/saved">
            <SavedPage onEdit={editPost} onNewPost={newPost} />
          </Route>
          <Route path="/profile">
            <ProfilePage profile={profile} onSave={saveProfile} />
          </Route>
          <Route component={NotFound} />
        </Switch>
      </RoutedErrorBoundary>
    </AppShell>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;