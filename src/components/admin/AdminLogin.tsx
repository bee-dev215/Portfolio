import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Monogram } from "@/components/site/Navbar";
import { Field, inputCls } from "./fields";

/** Supabase's sign-in errors, reworded for the person at the keyboard. */
function explain(message: string) {
  if (/invalid login credentials/i.test(message)) return "Wrong email or password.";
  if (/email not confirmed/i.test(message)) return "This account's email isn't confirmed yet. In Supabase, open Authentication → Users and confirm it.";
  return message;
}

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError("Enter a valid email.");
    if (!password) return setError("Enter your password.");
    setLoading(true);
    // The admin page follows the session, so success needs nothing more here
    const { error: err } = await supabase!.auth.signInWithPassword({ email: email.trim(), password });
    if (err) setError(explain(err.message));
    setLoading(false);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-16">
      <div className="mesh pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="dot-grid pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative w-full max-w-md">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-subtle transition-colors hover:text-ink">
          <ArrowLeft className="h-4 w-4" /> Back to site
        </Link>
        <form onSubmit={submit} noValidate className="card shadow-soft rounded-3xl p-7 sm:p-9">
          <Monogram className="h-11 w-11" />
          <h1 className="mt-6 font-display text-2xl font-bold tracking-tight">Admin sign in</h1>
          <p className="mt-1.5 text-sm text-subtle">Sign in to read your messages and booked calls.</p>

          <div className="mt-7 space-y-5">
            <Field label="Email" htmlFor="admin-email">
              <input id="admin-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" autoFocus className={inputCls} />
            </Field>
            <Field label="Password" htmlFor="admin-password">
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className={`${inputCls} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-1.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-subtle hover:text-ink"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </Field>
          </div>

          {error && (
            <p role="alert" className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn btn-primary mt-7 w-full py-3.5 disabled:opacity-60">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />} Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
