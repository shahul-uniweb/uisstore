import { useState } from "react";
import { Clock, ChevronDown, Check } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// A time-of-day window, in hours 0..24 (24 = end of day). Applied CLIENT-SIDE on
// top of the date filter, so you can slice records to e.g. 12 AM – 1 PM across
// whatever date range is selected.
export type TimeWindow = { from: number; to: number };
export const ALL_HOURS: TimeWindow = { from: 0, to: 24 };

export function isAllHours(t: TimeWindow): boolean {
  return t.from <= 0 && t.to >= 24;
}

// Does a timestamp's local hour-of-day fall inside the window?
export function inTimeWindow(date: Date | null, t: TimeWindow): boolean {
  if (!date || isAllHours(t)) return true;
  const h = date.getHours() + date.getMinutes() / 60;
  return h >= t.from && h < t.to;
}

export function fmtHour(h: number): string {
  if (h >= 24) return "12 AM"; // midnight (end of day)
  const period = h < 12 ? "AM" : "PM";
  let hr = h % 12;
  if (hr === 0) hr = 12;
  return `${hr} ${period}`;
}

// A single scrollable "wheel" column of hour buttons.
function HourColumn({
  label,
  options,
  value,
  onPick,
  disabled,
}: {
  label: string;
  options: number[];
  value: number;
  onPick: (h: number) => void;
  disabled?: (h: number) => boolean;
}) {
  return (
    <div className="flex-1">
      <p className="mb-1.5 text-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
      <div className="h-44 snap-y overflow-y-auto rounded-xl border bg-muted/30 p-1">
        {options.map((h) => {
          const active = h === value;
          const off = disabled?.(h) ?? false;
          return (
            <button
              key={h}
              type="button"
              disabled={off}
              onClick={() => onPick(h)}
              className={`flex w-full snap-center items-center justify-between rounded-lg px-3 py-1.5 text-sm transition ${
                active
                  ? "bg-gradient-brand font-bold text-white shadow"
                  : off
                    ? "cursor-not-allowed text-muted-foreground/40"
                    : "hover:bg-white hover:shadow-sm"
              }`}
            >
              {fmtHour(h)}
              {active && <Check className="h-3.5 w-3.5" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function TimeRangeFilter({ value, onChange }: { value: TimeWindow; onChange: (t: TimeWindow) => void }) {
  const [open, setOpen] = useState(false);
  const all = isAllHours(value);
  const fromOptions = Array.from({ length: 24 }, (_, i) => i); // 12 AM .. 11 PM
  const toOptions = Array.from({ length: 24 }, (_, i) => i + 1); // 1 AM .. 12 AM (end)

  const setFrom = (from: number) => onChange({ from, to: Math.max(value.to, from + 1) });
  const setTo = (to: number) => onChange({ from: Math.min(value.from, to - 1), to });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={`inline-flex h-9 items-center gap-2 rounded-full border bg-white px-3.5 text-sm font-medium shadow-sm transition hover:shadow ${
            all ? "text-foreground" : "border-transparent text-white"
          }`}
          style={all ? undefined : { background: "var(--gradient-blue)" }}
        >
          <Clock className="h-4 w-4" />
          {all ? "All hours" : `${fmtHour(value.from)} – ${fmtHour(value.to)}`}
          <ChevronDown className="h-4 w-4 opacity-60" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-bold" style={{ color: "var(--brand-dark)" }}>
            Filter by time of day
          </p>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </div>

        {/* live preview */}
        <div className="mb-3 rounded-xl bg-gradient-to-r from-[#F3FBFF] to-[#FFF7FB] px-3 py-2 text-center">
          <span className="text-sm font-extrabold" style={{ color: "var(--brand-deep)", fontFamily: "'Space Grotesk', sans-serif" }}>
            {all ? "All hours" : `${fmtHour(value.from)} → ${fmtHour(value.to)}`}
          </span>
        </div>

        <div className="flex gap-2">
          <HourColumn label="From" options={fromOptions} value={value.from} onPick={setFrom} />
          <HourColumn label="To" options={toOptions} value={value.to} onPick={setTo} disabled={(h) => h <= value.from} />
        </div>

        <div className="mt-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onChange(ALL_HOURS)}
            className="text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            Reset to all hours
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-full bg-gradient-brand px-4 py-1.5 text-xs font-bold text-white shadow-glow hover:opacity-90"
          >
            Done
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
