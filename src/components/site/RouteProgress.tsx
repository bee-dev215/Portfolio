import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { isNavigating, subscribeNavigation } from "@/lib/route-preload";

/**
 * A thin gradient bar across the top of the window while a clicked page is still loading, so a click always shows
 * it was heard. It waits a moment before appearing (fast loads never flash it) and fills to the end when the page lands.
 */
export default function RouteProgress() {
  const busy = useSyncExternalStore(subscribeNavigation, isNavigating);
  const [phase, setPhase] = useState<"idle" | "loading" | "done">("idle");
  const timer = useRef<number>();
  const started = useRef(0);

  useEffect(() => {
    window.clearTimeout(timer.current);
    if (busy) {
      started.current = performance.now();
      setPhase("loading");
    } else setPhase((p) => (p !== "loading" ? p : performance.now() - started.current < 150 ? "idle" : "done"));
  }, [busy]);

  useEffect(() => {
    if (phase === "done") timer.current = window.setTimeout(() => setPhase("idle"), 450);
    return () => window.clearTimeout(timer.current);
  }, [phase]);

  if (phase === "idle") return null;
  return <div className={`route-bar ${phase === "done" ? "is-done" : ""}`} role="progressbar" aria-label="Loading page" />;
}
