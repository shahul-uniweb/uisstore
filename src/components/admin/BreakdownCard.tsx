import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// A titled card listing labelled rows with a percentage bar — used for the
// Top Sources / Browsers / Devices / Countries breakdowns on the analytics view.
export function BreakdownCard({
  title,
  icon: Icon,
  rows,
  total,
  color = "#E61C83",
  emptyText = "No data yet.",
}: {
  title: string;
  icon: LucideIcon;
  rows: { label: string; value: number; prefix?: string }[];
  total: number;
  color?: string;
  emptyText?: string;
}) {
  return (
    <Card className="border-none shadow-soft">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-bold">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-3">
        {rows.length === 0 && <p className="text-xs text-muted-foreground">{emptyText}</p>}
        {rows.map((r) => {
          const pct = total > 0 ? Math.round((r.value / total) * 100) : 0;
          return (
            <div key={r.label}>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 font-medium">
                  {r.prefix && <span>{r.prefix}</span>}
                  {r.label}
                </span>
                <span className="text-xs font-semibold text-muted-foreground">
                  {r.value} · {pct}%
                </span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
