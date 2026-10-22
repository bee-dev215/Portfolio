import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="site-root site-bg flex min-h-screen items-center justify-center px-5">
      <div className="hud w-full max-w-md border border-line bg-paper-2 p-8 text-center">
        <p className="flex items-center justify-center gap-2 font-code text-[11px] uppercase tracking-[0.2em] text-muted2">
          <span className="led" /> Signal lost
        </p>
        <h1 className="glow-text extrude-sm mt-5 font-display text-7xl font-bold text-beam">404</h1>
        <p className="mt-3 text-muted2">
          No route found at <span className="font-code text-ink">{location.pathname}</span>
        </p>
        <a
          href="/"
          className="btn-signal press cut-sm mt-8 inline-flex items-center bg-signal px-6 py-3 font-display text-sm font-semibold uppercase tracking-wide text-on-signal transition-colors hover:bg-signal-hi"
        >
          Return to base
        </a>
      </div>
    </div>
  );
};

export default NotFound;
