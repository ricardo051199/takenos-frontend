import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function MetricCard({ title, value, subtitle, icon: Icon, trend }: MetricCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm mb-2">{title}</p>
          <h3 className="text-3xl mb-1">{value}</h3>
          {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
          {trend && (
            <div className={`text-sm mt-2 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </div>
          )}
        </div>
        <div className="bg-[#6D37D5]/10 p-3 rounded-lg">
          <Icon className="w-6 h-6 text-[#6D37D5]" />
        </div>
      </div>
    </div>
  );
}
