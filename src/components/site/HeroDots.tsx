/** A field of brand dots behind the hero windows that fades out toward its edges and drifts slowly (.hero-dots in index.css). */
export default function HeroDots({ className = "" }: { className?: string }) {
  return <div className={`hero-dots pointer-events-none ${className}`} aria-hidden="true" />;
}
