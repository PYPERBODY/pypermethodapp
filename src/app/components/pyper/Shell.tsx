import { ReactNode } from "react";
import {
  Home,
  BookOpen,
  Activity,
  Bell,
  TrendingUp,
  Sparkles,
  ShieldAlert,
  LifeBuoy,
} from "lucide-react";

export type TabKey =
  | "today"
  | "method"
  | "trackers"
  | "reminders"
  | "progress"
  | "edit"
  | "safety"
  | "support";

const NAV: { key: TabKey; label: string; icon: any }[] = [
  { key: "today", label: "Today", icon: Home },
  { key: "method", label: "Method", icon: BookOpen },
  { key: "trackers", label: "Trackers", icon: Activity },
  { key: "reminders", label: "Reminders", icon: Bell },
  { key: "progress", label: "Progress", icon: TrendingUp },
  { key: "edit", label: "The PYPER Edit", icon: Sparkles },
  { key: "safety", label: "Safety", icon: ShieldAlert },
  { key: "support", label: "Support", icon: LifeBuoy },
];

const MOBILE_NAV: { key: TabKey; label: string; icon: any }[] = [
  { key: "today", label: "Today", icon: Home },
  { key: "method", label: "Method", icon: BookOpen },
  { key: "trackers", label: "Track", icon: Activity },
  { key: "safety", label: "Safety", icon: ShieldAlert },
  { key: "support", label: "Support", icon: LifeBuoy },
];

export function Shell({
  active,
  onChange,
  children,
}: {
  active: TabKey;
  onChange: (k: TabKey) => void;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-[var(--porcelain)] text-[var(--graphite)] flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-[var(--border)] bg-[var(--ivory)] px-6 py-8 sticky top-0 h-screen">
        <div className="mb-10">
          <div className="mono-label mb-2">Member Portal</div>
          <div style={{ fontFamily: "var(--font-serif)" }} className="text-2xl tracking-tight">
            PYPER
          </div>
        </div>
        <nav className="flex flex-col gap-1">
          {NAV.map((n) => {
            const Icon = n.icon;
            const isActive = active === n.key;
            return (
              <button
                key={n.key}
                onClick={() => onChange(n.key)}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-md text-left transition-colors ${
                  isActive
                    ? "bg-[var(--graphite)] text-[var(--porcelain)]"
                    : "text-[var(--graphite)] hover:bg-[var(--bone)]"
                }`}
              >
                <Icon size={16} strokeWidth={1.5} />
                <span className="text-sm">{n.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="mt-auto pt-8">
          <div className="rule mb-4" />
          <div className="mono-label mb-1">Phase</div>
          <div className="text-sm">Active Transformation</div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 pb-24 lg:pb-12">
        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-30 bg-[var(--porcelain)]/90 backdrop-blur border-b border-[var(--border)] px-5 py-3 flex items-center justify-between">
          <div>
            <div className="mono-label">Member Portal</div>
            <div style={{ fontFamily: "var(--font-serif)" }} className="text-lg leading-none mt-0.5">
              PYPER
            </div>
          </div>
          <div className="mono-label">Active Transformation</div>
        </header>

        <div className="px-5 sm:px-8 lg:px-12 py-6 lg:py-10 max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[var(--ivory)] border-t border-[var(--border)]">
        <div className="grid grid-cols-5">
          {MOBILE_NAV.map((n) => {
            const Icon = n.icon;
            const isActive = active === n.key;
            return (
              <button
                key={n.key}
                onClick={() => onChange(n.key)}
                className={`flex flex-col items-center gap-1 py-3 ${
                  isActive ? "text-[var(--graphite)]" : "text-[var(--steel)]"
                }`}
              >
                <Icon size={20} strokeWidth={1.5} />
                <span className="mono-label" style={{ fontSize: "0.625rem" }}>
                  {n.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-8">
      <div className="mono-label mb-3">{eyebrow}</div>
      <h1>{title}</h1>
      {subtitle && <p className="mt-3 max-w-2xl">{subtitle}</p>}
      <div className="rule mt-6" />
    </div>
  );
}

export function Surface({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-[var(--card)] border border-[var(--border)] rounded-lg ${className}`}
    >
      {children}
    </div>
  );
}
