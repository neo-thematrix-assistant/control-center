"use client";

interface KPICardProps {
  label: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
}

export default function KPICard({ label, value, change, trend, icon }: KPICardProps) {
  const trendColor = trend === "up" ? "text-green-400" : trend === "down" ? "text-red-400" : "text-[var(--text-muted)]";

  return (
    <div className="kpi-card flex items-start justify-between">
      <div>
        <p className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] mb-1">{label}</p>
        <p className="text-2xl font-bold text-[var(--text-primary)]">{value}</p>
        {change && (
          <p className={`text-[11px] mt-1 ${trendColor}`}>
            {trend === "up" && "+"}
            {change}
          </p>
        )}
      </div>
      {icon && <div className="text-[var(--text-muted)] mt-1">{icon}</div>}
    </div>
  );
}
