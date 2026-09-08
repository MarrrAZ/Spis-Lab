export function Field({ label, children }) {
  return (
    <label className="block">
      <span className="font-mono text-xs uppercase tracking-wider text-slate-light">
        {label}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

export const inputClass =
  "w-full border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-maroon";
