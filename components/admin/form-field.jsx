export function Field({ label, children }) {
  return (
    <label className="block">
      <span className="font-mono text-xs uppercase tracking-wider text-white/60">
        {label}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

export const inputClass =
  "w-full border border-white/20 bg-spis-deep px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-maroon";
