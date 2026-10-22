import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="site-root site-bg relative flex min-h-screen items-center justify-center overflow-hidden px-5">
      <div className="mesh pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="card relative w-full max-w-md rounded-3xl p-10 text-center">
        <p className="eyebrow">Page not found</p>
        <h1 className="gradient-text mt-5 font-display text-8xl font-extrabold tracking-tight">404</h1>
        <p className="mt-3 text-ink-2">
          There's nothing at <span className="font-code text-sm text-ink">{location.pathname}</span> — but plenty to learn back home.
        </p>
        <a href="/" className="btn btn-primary mt-8 px-6 py-3 text-sm">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
