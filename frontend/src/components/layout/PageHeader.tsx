type Props = {
  title: string;
  subtitle?: string;
  badge?: { label: string; color?: "indigo" | "green" | "amber" | "blue" };
  actions?: React.ReactNode;
};

const badgeColors = {
  indigo: "bg-indigo-100 text-indigo-700",
  green: "bg-green-100 text-green-700",
  amber: "bg-amber-100 text-amber-700",
  blue: "bg-blue-100 text-blue-700",
};

export default function PageHeader({ title, subtitle, badge, actions }: Props) {
  return (
    <div className="flex items-start justify-between mb-7">
      <div>
        <div className="flex items-center gap-2.5 mb-1">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h1>
          {badge && (
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${badgeColors[badge.color ?? "indigo"]}`}>
              {badge.label}
            </span>
          )}
        </div>
        {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
