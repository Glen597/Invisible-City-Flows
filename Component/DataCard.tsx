type Props = {
  title: string;
  value?: string | number;
  subtitle?: string;
  className?: string;
};

export default function DataCard({ title, value, subtitle, className }: Props) {
  return (
    <div className={`bg-white rounded-xl p-4 shadow-sm border border-gray-100 ${className || ''}`}>
      <div className="text-xs uppercase tracking-wide text-gray-500">
        {title}
      </div>

      <div className="mt-2 text-2xl font-semibold text-gray-900">
        {value ?? "—"}
      </div>

      {subtitle && (
        <div className="mt-1 text-xs text-gray-500">
          {subtitle}
        </div>
      )}
    </div>
  );
}
