export default function GlowBackground() {
  return (
    <div className="absolute inset-0 rounded-3xl bg-[#071B52] overflow-hidden">
      {/* Subtle radial gradients */}
      <div className="pointer-events-none absolute -left-16 top-4 h-72 w-72 rounded-full bg-viz-primary/30 blur-[110px]" />
      <div className="pointer-events-none absolute -right-16 bottom-4 h-64 w-64 rounded-full bg-viz-accent/20 blur-[90px]" />
      {/* Very faint curved grid lines - simplified for now, could be SVG or background image */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'radial-gradient(#ffffff30 1px, transparent 1px), radial-gradient(#ffffff30 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }} />
    </div>
  );
}