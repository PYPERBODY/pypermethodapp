import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowRight, LockKeyhole, LogOut, Mail } from "lucide-react";
import { supabase, supabaseConfigMessage, isSupabaseConfigured } from "../../../lib/supabaseClient";

type AuthMode = "signin" | "signup" | "forgot" | "reset";
type AuthUser = { email?: string } | null;

export function useGuideAuth() {
  const [user, setUser] = useState<AuthUser>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setUser(data.session?.user ? { email: data.session.user.email || undefined } : null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? { email: session.user.email || undefined } : null);
      setLoading(false);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
  }

  return { user, loading, signOut, authUnavailable: !isSupabaseConfigured };
}

export function ProtectedGuide({ children }: { children: ReactNode }) {
  const auth = useGuideAuth();

  if (auth.loading) return <AuthLoading />;
  if (!auth.user) return <AuthScreen authUnavailable={auth.authUnavailable} />;

  return <>{children}</>;
}

export function AuthLoading() {
  return (
    <AuthFrame eyebrow="Session loading">
      <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6 text-center">
        <div className="mono-label mb-3">Checking secure guide access</div>
        <h1>The PYPER Method</h1>
        <p className="mt-3 text-sm text-[var(--soft-text)]">Preparing Your PYPER Method Guide.</p>
      </div>
    </AuthFrame>
  );
}

export function AuthScreen({ authUnavailable = false }: { authUnavailable?: boolean }) {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("alex.demo@example.com");
  const [password, setPassword] = useState("fictional-demo-password");
  const [fullName, setFullName] = useState("Alex Demo");
  const [message, setMessage] = useState<string | null>(authUnavailable ? supabaseConfigMessage : null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const title = useMemo(() => {
    if (mode === "signup") return "Create guide access";
    if (mode === "forgot") return "Reset guide password";
    if (mode === "reset") return "Reset password placeholder";
    return "Sign in to Your PYPER Method Guide";
  }, [mode]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!supabase) {
      setMessage(supabaseConfigMessage);
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "signup") {
        const { error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (authError) throw authError;
        setMessage("Check your email to confirm access to The PYPER Method Interactive Guide.");
      } else if (mode === "forgot") {
        const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin,
        });
        if (authError) throw authError;
        setMessage("Password reset email sent if this fictional test account exists.");
      } else if (mode === "reset") {
        setMessage("Password update UI is reserved for Supabase recovery sessions. This placeholder is ready for Phase 6 routing.");
      } else {
        const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
        if (authError) throw authError;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed. Check details and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthFrame eyebrow="Protected guide access">
      <div className="grid min-h-[calc(100vh-4rem)] items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <div className="mono-label mb-3">The PYPER Method Interactive Guide</div>
          <h1>{title}</h1>
          <p className="mt-4 max-w-xl text-[var(--soft-text)]">
            Authentication protects guide progress, tracker entries, the PYPER Body-Care Plan, and future guide-related support features. This is a protected guide experience, not a general medical account.
          </p>
          <div className="mt-6 grid gap-3 text-sm">
            <Notice icon={<LockKeyhole size={16} />}>Private tracking data is hidden until sign-in.</Notice>
            <Notice icon={<AlertTriangle size={16} />}>Do not use The Guide for emergencies.</Notice>
            <Notice icon={<Mail size={16} />}>Use fictional test users only during development.</Notice>
          </div>
        </div>

        <form onSubmit={submit} className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
          <div className="mb-5 flex flex-wrap gap-2" role="tablist" aria-label="Authentication mode">
            {[
              ["signin", "Sign in"],
              ["signup", "Sign up"],
              ["forgot", "Forgot password"],
              ["reset", "Reset placeholder"],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => { setMode(key as AuthMode); setError(null); setMessage(authUnavailable ? supabaseConfigMessage : null); }}
                className={`rounded-md px-3 py-2 text-sm ${mode === key ? "bg-[var(--graphite)] text-[var(--porcelain)]" : "border border-[var(--border)] hover:bg-[var(--ivory)]"}`}
                role="tab"
                aria-selected={mode === key}
              >
                {label}
              </button>
            ))}
          </div>

          {mode === "signup" && (
            <AuthField label="Full name">
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="auth-input" autoComplete="name" />
            </AuthField>
          )}

          <AuthField label="Email">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="auth-input" autoComplete="email" required />
          </AuthField>

          {mode !== "forgot" && mode !== "reset" && (
            <AuthField label="Password">
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="auth-input" autoComplete={mode === "signup" ? "new-password" : "current-password"} required />
            </AuthField>
          )}

          {error && <div className="mb-4 rounded-md border border-[#8a2a2a]/30 bg-[#fdf4f4] p-3 text-sm text-[#8a2a2a]">{error}</div>}
          {message && <div className="mb-4 rounded-md border border-[var(--border)] bg-[var(--ivory)] p-3 text-sm">{message}</div>}

          <button disabled={submitting || authUnavailable} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-[var(--graphite)] px-5 py-3 text-sm text-[var(--porcelain)] disabled:cursor-not-allowed disabled:opacity-50">
            {submitting ? "Working..." : mode === "signup" ? "Create guide access" : mode === "forgot" ? "Send reset email" : mode === "reset" ? "Show reset placeholder" : "Sign in"}
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </AuthFrame>
  );
}

export function SignOutButton({ onSignOut }: { onSignOut: () => void }) {
  return (
    <button onClick={onSignOut} className="inline-flex min-h-10 items-center gap-2 rounded-md border border-[var(--border)] px-3 py-2 text-sm hover:bg-[var(--bone)]">
      <LogOut size={14} /> Sign out
    </button>
  );
}

function AuthFrame({ eyebrow, children }: { eyebrow: string; children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[var(--porcelain)] px-5 py-8 text-[var(--graphite)] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <div className="mono-label mb-2">{eyebrow}</div>
          <div style={{ fontFamily: "var(--font-serif)" }} className="text-2xl tracking-tight">The PYPER Method</div>
        </div>
        {children}
      </div>
    </main>
  );
}

function AuthField({ label, children }: { label: string; children: ReactNode }) {
  return <label className="mb-4 block"><span className="mono-label mb-2 block">{label}</span>{children}</label>;
}

function Notice({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return <div className="flex items-start gap-3 rounded-md border border-[var(--border)] bg-[var(--card)] p-3">{icon}<span>{children}</span></div>;
}
