import {
  startOfDay,
  endOfDay,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subMonths,
  startOfYear,
} from "date-fns";
import { CalendarRange } from "lucide-react";
import type { DateRange } from "@/lib/admin";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Presets that bound how much Firestore data a page reads. Default is the
// current month, so day-to-day use stays cheap; the user can widen it on demand.
export type RangePreset =
  | "today"
  | "yesterday"
  | "this-week"
  | "this-month"
  | "last-month"
  | "last-3-months"
  | "this-year"
  | "all";

export const DEFAULT_PRESET: RangePreset = "this-month";

// Kuwait/Gulf week starts on Saturday.
const WEEK_OPTS = { weekStartsOn: 6 as const };

export function presetToRange(preset: RangePreset): DateRange {
  const now = new Date();
  switch (preset) {
    case "today":
      return { since: startOfDay(now), until: endOfDay(now) };
    case "yesterday": {
      const y = subDays(now, 1);
      return { since: startOfDay(y), until: endOfDay(y) };
    }
    case "this-week":
      return { since: startOfWeek(now, WEEK_OPTS), until: endOfWeek(now, WEEK_OPTS) };
    case "this-month":
      return { since: startOfMonth(now), until: endOfMonth(now) };
    case "last-month": {
      const m = subMonths(now, 1);
      return { since: startOfMonth(m), until: endOfMonth(m) };
    }
    case "last-3-months":
      return { since: startOfMonth(subMonths(now, 2)), until: endOfMonth(now) };
    case "this-year":
      return { since: startOfYear(now), until: endOfMonth(now) };
    case "all":
      return {};
  }
}

// Order matters — this is the dropdown order (shortest range first).
export const PRESET_ORDER: RangePreset[] = [
  "today",
  "yesterday",
  "this-week",
  "this-month",
  "last-month",
  "last-3-months",
  "this-year",
  "all",
];

const LABELS: Record<RangePreset, string> = {
  today: "Today",
  yesterday: "Yesterday",
  "this-week": "This Week",
  "this-month": "This Month",
  "last-month": "Last Month",
  "last-3-months": "Last 3 Months",
  "this-year": "This Year",
  all: "All Time",
};

// Exposed so pages that filter client-side (e.g. Forms) reuse the same labels.
export const presetLabel = (p: RangePreset) => LABELS[p];

export function DateRangeFilter({
  value,
  onChange,
}: {
  value: RangePreset;
  onChange: (p: RangePreset) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <CalendarRange className="h-4 w-4 text-muted-foreground" />
      <Select value={value} onValueChange={(v) => onChange(v as RangePreset)}>
        <SelectTrigger className="h-9 w-[150px] bg-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {PRESET_ORDER.map((p) => (
            <SelectItem key={p} value={p}>
              {LABELS[p]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
