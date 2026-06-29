import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Heart, Sparkle, Leaf, ShieldCheck, ArrowRight, RefreshCw,
  Home, BarChart3, Lock, BookOpen, Sun, Moon, Activity,
  Brain, LifeBuoy, ChevronDown, Waves,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Solace — A digital sanctuary for your mind" },
      { name: "description", content: "A private, encrypted emotional wellbeing portal. Reflect, breathe, and feel heard with research-backed tools." },
      { property: "og:title", content: "Solace — A digital sanctuary for your mind" },
      { property: "og:description", content: "Private emotional companion with end-to-end encrypted sessions." },
    ],
  }),
  component: Portal,
});

const reflections = [
  "You are allowed to take up space, exactly as you are today.",
  "Rest is not a reward for finishing — it is part of being human.",
  "Feelings are visitors. Greet them gently; they do not stay forever.",
  "Small, soft steps still carry you somewhere new.",
  "You don't have to think your way out. You can feel your way through.",
  "Breathing is a quiet kind of courage.",
];

const frameworks = [
  {
    icon: Activity,
    title: "Active Mood Pacing Detection",
    summary: "Real-time emotional tempo tracking that adapts response cadence.",
    body: "Drawing from Dialectical Behavior Therapy (DBT), Solace senses shifts in your linguistic rhythm — pace, valence, and intensity — and gently mirrors a regulated tempo back to you, helping co-regulate the nervous system without ever interrupting your flow.",
  },
  {
    icon: Brain,
    title: "Cognitive Behavioral Grounding",
    summary: "CBT-informed reframes delivered as gentle observations, not prescriptions.",
    body: "Rooted in Cognitive Behavioral Therapy and Acceptance & Commitment Therapy, Solace surfaces cognitive distortions you may be carrying and offers softer, evidence-based reframes — always as invitations, never as corrections.",
  },
  {
    icon: LifeBuoy,
    title: "Instant Crisis Safety Net",
    summary: "Always-on protocol that routes urgent moments to trusted human support.",
    body: "If language signals acute distress, Solace immediately surfaces region-appropriate hotlines and a one-tap warm handoff to professional crisis services — privacy-preserving and reviewed quarterly by licensed clinicians.",
  },
];

const moods = [
  { emoji: "😔", label: "Heavy" },
  { emoji: "😟", label: "Tense" },
  { emoji: "😐", label: "Steady" },
  { emoji: "🙂", label: "Light" },
  { emoji: "😊", label: "Bright" },
];

const LS_KEY = "solace.state.v1";

type PersistState = {
  dark: boolean;
  zeroLog: boolean;
  anonRoute: boolean;
  energy: number;
  mood: number;
  sessionCount: number;
};

const defaultState: PersistState = {
  dark: false,
  zeroLog: true,
  anonRoute: true,
  energy: 60,
  mood: 3,
  sessionCount: 1,
};

function loadState(): PersistState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return defaultState;
    return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    return defaultState;
  }
}

function greetingFor(mood: number, energy: number): { lead: string; name: string } {
  if (energy < 25 || mood <= 0) {
    return { lead: "Take it easy today,", name: "friend. I'm here for you." };
  }
  if (energy < 50 || mood === 1) {
    return { lead: "Glad you stopped by,", name: "friend. Let's slow down together." };
  }
  if (mood >= 4 && energy >= 70) {
    return { lead: "Wonderful to feel you bright,", name: "friend ✨" };
  }
  if (mood === 3) {
    return { lead: "Good to see you,", name: "friend. A steady kind of day." };
  }
  return { lead: "Good to see you,", name: "friend." };
}

function Portal() {
  const [hydrated, setHydrated] = useState(false);
  const [dark, setDark] = useState(defaultState.dark);
  const [zeroLog, setZeroLog] = useState(defaultState.zeroLog);
  const [anonRoute, setAnonRoute] = useState(defaultState.anonRoute);
  const [expanded, setExpanded] = useState<number | null>(0);
  const [energy, setEnergy] = useState<number[]>([defaultState.energy]);
  const [mood, setMood] = useState(defaultState.mood);
  const [sessionCount, setSessionCount] = useState(defaultState.sessionCount);
  const [logCount, setLogCount] = useState(0);
  const [flash, setFlash] = useState<string | null>(null);
  const [qIndex, setQIndex] = useState(() => Math.floor(Math.random() * reflections.length));
  const quote = useMemo(() => reflections[qIndex], [qIndex]);
  const greeting = useMemo(() => greetingFor(mood, energy[0]), [mood, energy]);

  // Hydrate from localStorage once.
  useEffect(() => {
    const s = loadState();
    setDark(s.dark);
    setZeroLog(s.zeroLog);
    setAnonRoute(s.anonRoute);
    setEnergy([s.energy]);
    setMood(s.mood);
    setSessionCount(s.sessionCount + 1);
    setHydrated(true);
  }, []);

  // Persist on change.
  useEffect(() => {
    if (!hydrated) return;
    const payload: PersistState = {
      dark, zeroLog, anonRoute, energy: energy[0], mood, sessionCount,
    };
    try { window.localStorage.setItem(LS_KEY, JSON.stringify(payload)); } catch {}
  }, [hydrated, dark, zeroLog, anonRoute, energy, mood, sessionCount]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  // Count non-zero-log interactions as "logs".
  useEffect(() => {
    if (!hydrated) return;
    if (!zeroLog) setLogCount((n) => n + 1);
  }, [mood, energy, hydrated]); // eslint-disable-line react-hooks/exhaustive-deps

  const showFlash = (msg: string) => {
    setFlash(msg);
    window.setTimeout(() => setFlash(null), 2200);
  };

  const wipeVoiceflow = () => {
    try {
      const vf = (window as any).voiceflow?.chat;
      try { vf?.clear?.(); } catch {}
      try { vf?.proactive?.clear?.(); } catch {}
    } catch {}
  };

  // Destroy + reload the Voiceflow widget with the live mood/energy payload, then force-open it.
  const handleMoodUpdate = (currentMood: string, currentEnergyLevel: number) => {
    try {
      const vf = (window as any).voiceflow?.chat;
      if (!vf?.load) return;

      // Clear any existing chat instance to force a fresh session
      try { vf.destroy?.(); } catch {}

      // Re-load the widget passing the live payload variables
      vf.load({
        verify: { projectID: "6a41495a4ae39787070bd525" },
        url: "https://general-runtime.voiceflow.com",
        voice: { url: "https://runtime-api.voiceflow.com" },
        launch: {
          event: {
            type: "launch",
            payload: {
              user_mood: currentMood,
              user_energy: currentEnergyLevel,
            },
          },
        },
      });

      // Force open the chat bubble immediately
      window.setTimeout(() => {
        try { (window as any).voiceflow?.chat?.open?.(); } catch {}
      }, 500);
    } catch {}
  };

  const handleZeroLog = (v: boolean) => {
    setZeroLog(v);
    if (v) {
      setLogCount(0);
      wipeVoiceflow();
      showFlash("Chat memory wiped · zero-data mode on");
    } else {
      showFlash("Logging enabled for this session");
    }
  };

  const handleMoodSelect = (i: number) => {
    setMood(i);
    const label = moods[i]?.label?.toLowerCase() ?? "steady";
    handleMoodUpdate(label, energy[0]);
    showFlash(`Mood set · ${label}`);
  };

  const handleEnergyChange = (v: number[]) => {
    setEnergy(v);
  };

  // Debounce energy → Voiceflow widget reload so we don't destroy on every tick.
  useEffect(() => {
    if (!hydrated) return;
    const t = window.setTimeout(() => {
      const label = moods[mood]?.label?.toLowerCase() ?? "steady";
      handleMoodUpdate(label, energy[0]);
    }, 600);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [energy, hydrated]);

  const handleAnonRoute = (v: boolean) => {
    setAnonRoute(v);
    showFlash(v ? "Routing through anonymous relays" : "Identity attached to this session");
  };

  const nextQuote = () =>
    setQIndex((i) => (i + 1 + Math.floor(Math.random() * (reflections.length - 1))) % reflections.length);

  const navItems = [
    { icon: Home, label: "Home", active: true },
    { icon: BarChart3, label: "Analytics" },
    { icon: Lock, label: "Privacy" },
    { icon: BookOpen, label: "Resources" },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* animated aurora background */}
      <div className="pointer-events-none fixed inset-0 aurora opacity-80" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--background)_85%)]" />

      {/* Flash toast */}
      <div
        className={`pointer-events-none fixed left-1/2 top-6 z-50 -translate-x-1/2 rounded-full glass border border-primary/30 px-4 py-2 text-xs text-foreground shadow-lg transition-all duration-300 ${
          flash ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
        }`}
      >
        <span className="inline-flex items-center gap-2">
          <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-primary pulse-dot" />
          {flash}
        </span>
      </div>

      <div className="relative mx-auto flex max-w-[1400px] gap-6 p-4 md:p-6">
        {/* SIDEBAR */}
        <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] w-64 shrink-0 flex-col rounded-3xl glass p-5 md:flex">
          <div className="mb-8 flex items-center gap-2.5">
            <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/15">
              <span className="absolute inset-0 rounded-2xl bg-primary/20 breathe" />
              <Leaf className="relative h-4 w-4 text-primary" strokeWidth={1.8} />
            </span>
            <div>
              <div className="font-serif text-lg leading-none">Solace</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">sanctuary v2</div>
            </div>
          </div>

          <nav className="flex flex-col gap-1">
            {navItems.map(({ icon: Icon, label, active }) => (
              <button
                key={label}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                  active
                    ? "bg-primary/15 text-foreground"
                    : "text-muted-foreground hover:bg-card/60 hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={1.8} />
                {label}
                {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
              </button>
            ))}
          </nav>

          <div className="mt-auto space-y-3">
            <div className="rounded-2xl border border-border/60 bg-card/40 p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" /> End-to-end encrypted
              </div>
              <div className="mt-1 text-xs leading-relaxed text-muted-foreground/80">
                Your reflections never leave this device unencrypted.
              </div>
            </div>
            <button
              onClick={() => setDark((d) => !d)}
              className="flex w-full items-center justify-between rounded-xl border border-border/60 bg-card/40 px-3 py-2 text-xs text-muted-foreground transition hover:text-foreground"
            >
              <span className="flex items-center gap-2">
                {dark ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
                {dark ? "Dark" : "Light"} mode
              </span>
              <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] text-primary">toggle</span>
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <main className="min-w-0 flex-1 space-y-6">
          {/* Top bar */}
          <div className="flex items-center justify-between rounded-2xl glass px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 md:hidden">
                <Leaf className="h-4 w-4 text-primary" />
              </span>
              <div>
                <div className="text-xs text-muted-foreground transition-opacity duration-300">{greeting.lead}</div>
                <div className="font-serif text-base transition-all duration-300">
                  {greeting.name} ·{" "}
                  <span className="text-muted-foreground text-xs">session #{sessionCount.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden items-center gap-1.5 rounded-full bg-primary/12 px-3 py-1.5 text-xs text-primary sm:inline-flex">
                <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-primary pulse-dot" />
                secure
              </span>
              <button
                onClick={() => setDark((d) => !d)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-card/50 text-foreground/80 transition hover:text-foreground md:hidden"
              >
                {dark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* HERO + Privacy Panel */}
          <section className="grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3 rounded-3xl glass p-8 md:p-10 rise relative overflow-hidden">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[var(--sage)]/40 blur-3xl breathe" />
              <span className="relative inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                <Sparkle className="h-3 w-3 text-primary" /> a gentle companion
              </span>
              <h1 className="relative mt-5 font-serif text-4xl leading-[1.05] md:text-6xl">
                A safe space
                <br /> <em className="not-italic text-primary">for your thoughts.</em>
              </h1>
              <p className="relative mt-4 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
                Solace is a private digital sanctuary — encrypted, judgment-free, and always listening for what you actually need.
              </p>
              <div className="relative mt-7 flex flex-wrap gap-3">
                <button className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition hover:-translate-y-0.5">
                  Start reflecting
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </button>
                <button className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 px-5 py-3 text-sm transition hover:bg-card">
                  <Waves className="h-4 w-4 text-primary" /> 1-min breathwork
                </button>
              </div>
            </div>

            {/* PRIVACY SHIELD */}
            <div className="lg:col-span-2 rounded-3xl glass p-6 rise">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Privacy Control Panel</span>
                </div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">live</span>
              </div>

              <div className="mt-5 rounded-2xl border border-primary/20 bg-primary/8 p-4">
                <div className="flex items-center gap-3">
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[oklch(0.72_0.18_150)] pulse-dot" />
                  <div className="text-sm font-medium">Encrypted Session: <span className="text-primary">ACTIVE</span></div>
                </div>
                <div className="mt-1 pl-5 text-[11px] text-muted-foreground">AES-256 · forward secrecy · keys ephemeral to this tab</div>
              </div>

              <div className="mt-4 space-y-3">
                <PrivacyToggle
                  label="Zero-Data Logging Mode"
                  hint="Nothing you say is written to disk."
                  checked={zeroLog}
                  onChange={handleZeroLog}
                />
                <PrivacyToggle
                  label="Anonymous Chat Routing"
                  hint="Requests proxied through rotating relays."
                  checked={anonRoute}
                  onChange={handleAnonRoute}
                />
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                {[
                  { label: "Encrypted", value: "100%", active: true },
                  { label: "Logs", value: zeroLog ? "0" : String(logCount), active: zeroLog },
                  { label: "Identity", value: anonRoute ? "anon" : "linked", active: anonRoute },
                ].map((s) => (
                  <div
                    key={s.label}
                    className={`rounded-xl border py-2 transition-all duration-300 ${
                      s.active
                        ? "border-primary/30 bg-primary/10"
                        : "border-border/60 bg-card/40"
                    }`}
                  >
                    <div key={s.value} className="text-sm font-medium text-foreground rise">{s.value}</div>
                    <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* MOOD CHECK-IN */}
          <section className="rounded-3xl glass p-6 md:p-8 rise">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-primary">Mood check-in</p>
                <h2 className="mt-1 font-serif text-2xl md:text-3xl">How is your weather, right now?</h2>
              </div>
              <span className="text-xs text-muted-foreground">no streaks · no scores · just noticing</span>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div className="flex items-center justify-between gap-2 rounded-2xl border border-border/60 bg-card/40 p-4">
                {moods.map((m, i) => (
                  <button
                    key={m.label}
                    onClick={() => handleMoodSelect(i)}
                    className={`flex flex-1 flex-col items-center gap-1 rounded-xl py-2 transition ${
                      mood === i ? "bg-primary/15 scale-105" : "hover:bg-card/60"
                    }`}
                  >
                    <span className="text-2xl">{m.emoji}</span>
                    <span className={`text-[10px] uppercase tracking-wide ${mood === i ? "text-primary" : "text-muted-foreground"}`}>
                      {m.label}
                    </span>
                  </button>
                ))}
              </div>

              <div className="rounded-2xl border border-border/60 bg-card/40 p-5">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Energy level</span>
                  <span className="font-medium text-foreground">{energy[0]}%</span>
                </div>
                <Slider
                  value={energy}
                  onValueChange={handleEnergyChange}
                  max={100}
                  step={1}
                  className="mt-4"
                />
                <div className="mt-2 flex justify-between text-[10px] uppercase tracking-wide text-muted-foreground">
                  <span>depleted</span>
                  <span>steady</span>
                  <span>vibrant</span>
                </div>
              </div>
            </div>
          </section>

          {/* FRAMEWORK CARDS */}
          <section className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-primary">Therapeutic frameworks</p>
                <h2 className="mt-1 font-serif text-2xl md:text-3xl">Built on what actually helps.</h2>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {frameworks.map(({ icon: Icon, title, summary, body }, i) => {
                const open = expanded === i;
                return (
                  <article
                    key={title}
                    onClick={() => setExpanded(open ? null : i)}
                    className={`group cursor-pointer rounded-3xl glass p-6 transition-all duration-500 hover:-translate-y-1 ${
                      open ? "ring-1 ring-primary/40" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                        <Icon className="h-5 w-5" strokeWidth={1.7} />
                      </span>
                      <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
                    </div>
                    <h3 className="mt-5 font-serif text-lg leading-snug">{title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{summary}</p>
                    <div
                      className="grid transition-all duration-500"
                      style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
                    >
                      <div className="overflow-hidden">
                        <p className="mt-4 border-t border-border/60 pt-4 text-xs leading-relaxed text-foreground/80">
                          {body}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* REFLECTION */}
          <section className="rounded-3xl glass relative overflow-hidden p-8 md:p-12 rise">
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[var(--sage)]/40 blur-3xl" />
            <div className="absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-[var(--sand)]/50 blur-3xl" />
            <div className="relative">
              <p className="text-[10px] uppercase tracking-[0.22em] text-primary">Today's reflection</p>
              <blockquote
                key={qIndex}
                className="mt-5 font-serif text-2xl leading-snug md:text-4xl rise"
              >
                "{quote}"
              </blockquote>
              <div className="mt-8 flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Heart className="h-3.5 w-3.5 text-primary" /> a quiet note from Solace
                </span>
                <button
                  onClick={nextQuote}
                  className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-2 text-xs transition hover:bg-card"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Another
                </button>
              </div>
            </div>
          </section>

          <footer className="flex flex-col items-center justify-between gap-2 border-t border-border/60 py-6 text-xs text-muted-foreground md:flex-row">
            <div className="flex items-center gap-2">
              <Leaf className="h-3.5 w-3.5 text-primary" />
              <span className="font-serif text-sm text-foreground">Solace</span>
            </div>
            <p>Made slowly, with care. © {new Date().getFullYear()} Solace.</p>
          </footer>
        </main>
      </div>
    </div>
  );
}

function PrivacyToggle({
  label, hint, checked, onChange,
}: { label: string; hint: string; checked: boolean; onChange: (b: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-border/60 bg-card/40 p-3 transition hover:bg-card/60">
      <div className="min-w-0">
        <div className="text-sm font-medium">{label}</div>
        <div className="text-[11px] text-muted-foreground">{hint}</div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </label>
  );
}
