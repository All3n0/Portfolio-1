"use client";
import { useId, type ReactNode } from "react";

/* ---------- Layout ---------- */

export function SimShell({ controls, children }: { controls: ReactNode; children: ReactNode }) {
  return (
    <div className="grid lg:grid-cols-[300px_1fr] gap-6">
      <aside className="rounded-xl border border-line bg-surface p-5 space-y-5 h-fit lg:sticky lg:top-24">{controls}</aside>
      <div className="space-y-6 min-w-0">{children}</div>
    </div>
  );
}

export function Panel({ title, children, aside }: { title?: string; children: ReactNode; aside?: ReactNode }) {
  return (
    <section className="rounded-xl border border-line bg-surface p-5 min-w-0">
      {(title || aside) && (
        <div className="flex items-center justify-between gap-3 mb-3">
          {title && <h3 className="text-sm font-semibold text-ink">{title}</h3>}
          {aside}
        </div>
      )}
      {children}
    </section>
  );
}

export function ControlGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="space-y-4">
      <legend className="text-xs font-semibold text-faint mb-3">{title}</legend>
      {children}
    </fieldset>
  );
}

/* ---------- Controls ---------- */

export function Slider({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
  format,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (v: number) => void;
  format?: (v: number) => string;
}) {
  const id = useId();
  const decimals = step < 1 ? Math.max(0, Math.ceil(-Math.log10(step))) : 0;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2 mb-2">
        <label htmlFor={id} className="text-sm text-ink-2">
          {label}
        </label>
        <span className="text-sm text-ink tabular-nums" style={{ fontFamily: "var(--font-mono)" }}>
          {format ? format(value) : value.toFixed(decimals)}
          {unit && <span className="text-faint ml-1">{unit}</span>}
        </span>
      </div>
      <input
        id={id}
        type="range"
        className="sim-range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </div>
  );
}

export function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <p className="text-sm text-ink-2 mb-2">{label}</p>
      <div role="radiogroup" aria-label={label} className="grid gap-1 p-1 rounded-lg bg-surface-2 border border-line" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={o.value === value}
            onClick={() => onChange(o.value)}
            className={`px-2 py-1.5 rounded-md text-xs font-medium transition-colors ${
              o.value === value ? "bg-accent text-on-accent" : "text-muted hover:text-ink"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function PresetButtons({ presets, onPick }: { presets: { label: string }[]; onPick: (i: number) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {presets.map((p, i) => (
        <button
          key={p.label}
          type="button"
          onClick={() => onPick(i)}
          className="px-3 py-1.5 rounded-md text-xs border border-line text-ink-2 hover:border-accent hover:text-accent transition-colors"
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}

/* ---------- Readouts ---------- */

export type Tone = "normal" | "good" | "warn" | "bad";

export function Readout({
  label,
  value,
  unit,
  hint,
  tone = "normal",
  large = false,
}: {
  label: string;
  value: string;
  unit?: string;
  hint?: string;
  tone?: Tone;
  large?: boolean;
}) {
  const toneClass =
    tone === "good" ? "text-emerald-500" : tone === "warn" ? "text-amber-500" : tone === "bad" ? "text-red-500" : "text-ink";
  return (
    <div className="rounded-lg bg-surface-2 border border-line px-4 py-3 min-w-0">
      <p className="text-xs text-faint mb-1">{label}</p>
      <p className={`${large ? "text-2xl" : "text-lg"} tabular-nums ${toneClass}`} style={{ fontFamily: "var(--font-mono)" }}>
        {value}
        {unit && <span className="text-sm text-faint ml-1">{unit}</span>}
      </p>
      {hint && <p className="text-xs text-muted mt-1 leading-snug">{hint}</p>}
    </div>
  );
}

export function ReadoutGrid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">{children}</div>;
}

export function Callout({ tone = "normal", children }: { tone?: Tone; children: ReactNode }) {
  const border =
    tone === "good" ? "border-emerald-500/40" : tone === "warn" ? "border-amber-500/50" : tone === "bad" ? "border-red-500/50" : "border-accent/40";
  return <div className={`rounded-lg border ${border} bg-accent-soft px-4 py-3 text-sm text-ink-2 leading-relaxed`}>{children}</div>;
}

/* ---------- Plot ---------- */

export type Series = {
  points: [number, number][];
  label: string;
  color?: "accent" | "alt" | "muted";
  dashed?: boolean;
};

function niceTicks(min: number, max: number, count = 5) {
  const span = max - min || 1;
  const step0 = span / count;
  const mag = Math.pow(10, Math.floor(Math.log10(step0)));
  const norm = step0 / mag;
  const step = (norm < 1.5 ? 1 : norm < 3 ? 2 : norm < 7 ? 5 : 10) * mag;
  const ticks: number[] = [];
  for (let v = Math.ceil(min / step) * step; v <= max + step * 1e-6; v += step) ticks.push(Math.abs(v) < step * 1e-9 ? 0 : v);
  return ticks;
}

function fmtTick(v: number) {
  const a = Math.abs(v);
  if (a >= 10000) return `${(v / 1000).toFixed(0)}k`;
  if (a >= 100) return v.toFixed(0);
  if (a >= 1) return Number(v.toFixed(1)).toString();
  return Number(v.toFixed(2)).toString();
}

const COLORS = { accent: "var(--accent)", alt: "var(--accent-alt)", muted: "var(--faint)" };

export function Plot({
  series,
  xLabel,
  yLabel,
  height = 220,
  xDomain,
  yDomain,
  invertY = false,
  markers = [],
  zeroLine = true,
  ariaLabel,
}: {
  series: Series[];
  xLabel: string;
  yLabel: string;
  height?: number;
  xDomain?: [number, number];
  yDomain?: [number, number];
  invertY?: boolean;
  markers?: { x: number; y: number; label?: string }[];
  zeroLine?: boolean;
  ariaLabel: string;
}) {
  const W = 640;
  const H = height;
  const pad = { l: 52, r: 16, t: 14, b: 40 };
  const all = series.flatMap((s) => s.points);
  const xs = all.map((p) => p[0]);
  const ys = all.map((p) => p[1]);
  const [x0, x1] = xDomain ?? [Math.min(...xs), Math.max(...xs)];
  let [y0, y1] = yDomain ?? [Math.min(...ys), Math.max(...ys)];
  if (!yDomain) {
    const m = (y1 - y0 || Math.abs(y1) || 1) * 0.08;
    y0 -= m;
    y1 += m;
  }
  const sx = (x: number) => pad.l + ((x - x0) / (x1 - x0 || 1)) * (W - pad.l - pad.r);
  const plotHeight = H - pad.t - pad.b;
  const syRaw = (y: number) => pad.t + ((y1 - y) / (y1 - y0 || 1)) * (H - pad.t - pad.b);
  const sy = invertY ? (y: number) => pad.t + plotHeight - (syRaw(y) - pad.t) : syRaw;
  const xt = niceTicks(x0, x1, 6);
  const yt = niceTicks(y0, y1, 5);
  const plotH = H - pad.t - pad.b;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label={ariaLabel}>
        {yt.map((t) => (
          <g key={`y${t}`}>
            <line x1={pad.l} x2={W - pad.r} y1={sy(t)} y2={sy(t)} stroke="var(--line)" strokeWidth={1} />
            <text x={pad.l - 8} y={sy(t)} textAnchor="end" dominantBaseline="middle" fontSize={11} fill="var(--faint)" style={{ fontFamily: "var(--font-mono)" }}>
              {fmtTick(t)}
            </text>
          </g>
        ))}
        {xt.map((t) => (
          <g key={`x${t}`}>
            <line x1={sx(t)} x2={sx(t)} y1={pad.t} y2={H - pad.b} stroke="var(--line)" strokeWidth={1} strokeOpacity={0.5} />
            <text x={sx(t)} y={H - pad.b + 16} textAnchor="middle" fontSize={11} fill="var(--faint)" style={{ fontFamily: "var(--font-mono)" }}>
              {fmtTick(t)}
            </text>
          </g>
        ))}
        {zeroLine && y0 < 0 && y1 > 0 && (
          <line x1={pad.l} x2={W - pad.r} y1={sy(0)} y2={sy(0)} stroke="var(--line-strong)" strokeWidth={1} />
        )}
        <text x={(pad.l + W - pad.r) / 2} y={H - 6} textAnchor="middle" fontSize={12} fill="var(--muted)">
          {xLabel}
        </text>
        <text x={14} y={pad.t + plotH / 2} textAnchor="middle" fontSize={12} fill="var(--muted)" transform={`rotate(-90 14 ${pad.t + plotH / 2})`}>
          {yLabel}
        </text>
        <defs>
          <clipPath id={`clip-${ariaLabel.replace(/\W/g, "")}`}>
            <rect x={pad.l} y={pad.t - 2} width={W - pad.l - pad.r} height={plotH + 4} />
          </clipPath>
        </defs>
        <g clipPath={`url(#clip-${ariaLabel.replace(/\W/g, "")})`}>
          {series.map((s) => (
            <polyline
              key={s.label}
              fill="none"
              stroke={COLORS[s.color ?? "accent"]}
              strokeWidth={2}
              strokeDasharray={s.dashed ? "6 5" : undefined}
              strokeLinejoin="round"
              strokeLinecap="round"
              points={s.points.map(([x, y]) => `${sx(x).toFixed(1)},${sy(y).toFixed(1)}`).join(" ")}
            />
          ))}
          {markers.map((m, i) => (
            <g key={i}>
              <circle cx={sx(m.x)} cy={sy(m.y)} r={5} fill="var(--surface)" stroke="var(--accent)" strokeWidth={2} />
              {m.label && (
                <text x={sx(m.x) + 9} y={sy(m.y) - 9} fontSize={11} fill="var(--ink-2)" style={{ fontFamily: "var(--font-mono)" }}>
                  {m.label}
                </text>
              )}
            </g>
          ))}
        </g>
      </svg>
      {series.length > 1 && (
        <div className="flex flex-wrap gap-4 mt-2 pl-[8%] text-xs text-muted">
          {series.map((s) => (
            <span key={s.label} className="inline-flex items-center gap-2">
              <svg width="22" height="6" aria-hidden>
                <line x1="0" x2="22" y1="3" y2="3" stroke={COLORS[s.color ?? "accent"]} strokeWidth={2} strokeDasharray={s.dashed ? "5 4" : undefined} />
              </svg>
              {s.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export const fmt = (v: number, d = 2) => (Number.isFinite(v) ? v.toFixed(d) : "—");
