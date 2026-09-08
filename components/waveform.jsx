// Elemen visual khas SPIS Lab: garis sinyal / spektrum ala osiloskop.
// Dipakai di hero dan sebagai pembatas antar-bagian, menegaskan identitas
// "Signal Processing" alih-alih dekorasi generik.

export function WaveformBars({ className = "", tone = "signal" }) {
  const heights = [30, 55, 40, 80, 60, 95, 50, 70, 35, 85, 45, 65, 55, 90, 40];
  const color = tone === "signal" ? "bg-signal" : "bg-maroon";

  return (
    <div className={`flex items-end gap-[3px] ${className}`} aria-hidden="true">
      {heights.map((h, i) => (
        <span
          key={i}
          className={`w-[3px] ${color} ${
            i % 3 === 0 ? "animate-wave1" : i % 3 === 1 ? "animate-wave2" : "animate-wave3"
          }`}
          style={{ height: `${h}%`, transformOrigin: "bottom" }}
        />
      ))}
    </div>
  );
}

export function WaveformTrace({ className = "" }) {
  return (
    <svg
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M0,60 C 60,10 120,110 180,60 C 240,10 300,110 360,60 C 420,10 480,110 540,60 C 600,10 660,110 720,60 C 780,10 840,110 900,60 C 960,10 1020,110 1080,60 C 1110,35 1140,85 1200,60"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SectionDivider({ dark = false }) {
  return (
    <div
      className={`h-px w-full ${dark ? "bg-line-dark" : "bg-line"}`}
      aria-hidden="true"
    />
  );
}
