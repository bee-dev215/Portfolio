import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, Lock, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { claimAdmin } from "@/lib/portfolioApi";
import { Field, inputCls } from "./fields";

export default function AdminLogin({ setupMode, onAuthed }: { setupMode: boolean; onAuthed: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Enter a valid email");
    if (password.length < 8) return setError("Password must be at least 8 characters");
    if (setupMode && password !== confirm) return setError("Passwords do not match");

    setLoading(true);
    try {
      if (setupMode) {
        const { data, error: err } = await supabase.auth.signUp({ email, password });
        if (err) throw err;
        if (!data.session) {
          // Email confirmation may be required; try signing in directly
          const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
          if (signInErr) {
            setInfo("Account created. Please confirm your email, then sign in here to finish setup.");
            return;
          }
        }
        const ok = await claimAdmin();
        if (!ok) throw new Error("An admin account already exists.");
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
      }
      onAuthed();
    } catch (err) {
      setError((err as Error).message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pf-root relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <div className="pf-grid-bg pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute left-1/2 top-1/4 h-80 w-[600px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />

      <div className="relative w-full max-w-md">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back to portfolio
        </Link>
        <form onSubmit={submit} noValidate className="rounded-2xl border border-white/10 bg-zinc-950/80 p-8 backdrop-blur">
          <div className="mb-6 grid h-12 w-12 place-items-center rounded-xl bg-emerald-400/10 text-emerald-300">
            {setupMode ? <ShieldCheck className="h-6 w-6" /> : <Lock className="h-6 w-6" />}
          </div>
          <h1 className="text-2xl font-semibold text-white">{setupMode ? "Create admin account" : "Admin sign in"}</h1>
          <p className="mt-1.5 text-sm text-zinc-500">
            {setupMode
              ? "No admin exists yet. The first account created here becomes the only admin."
              : "Sign in to manage your projects and employment history."}
          </p>

          <div className="mt-6 space-y-4">
            <Field label="Email">
              <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="you@example.com" />
            </Field>
            <Field label="Password">
              <input type="password" autoComplete={setupMode ? "new-password" : "current-password"} value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} placeholder="••••••••" />
            </Field>
            {setupMode && (
              <Field label="Confirm password">
                <input type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={inputCls} placeholder="••••••••" />
              </Field>
            )}
          </div>

          {error && <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}
          {info && <p className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">{info}</p>}

          <button type="submit" disabled={loading} className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-400 py-3 text-sm font-medium text-zinc-950 hover:bg-emerald-300 disabled:opacity-60">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {setupMode ? "Create account & continue" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
