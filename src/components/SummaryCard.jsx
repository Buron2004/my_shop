import { ArrowUp, ArrowDown } from 'lucide-react';

function SummaryCard({ label, value, icon: Icon, color = 'indigo', trend }) {
  const colorStyles = {
    indigo: 'bg-indigo-50 text-indigo-600',
    green: 'bg-green-50 text-green-600',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600',
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow min-w-0">
      <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${colorStyles[color]}`}>
        <Icon size={20} strokeWidth={2} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider break-words leading-snug">
          {label}
        </p>
        <div className="flex items-baseline gap-2 mt-1">
          <p className="text-lg sm:text-xl font-bold text-gray-900 break-words">{value}</p>
          {trend !== undefined && (
            <span className={`flex items-center text-xs font-semibold ${trend >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              {trend >= 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
              {Math.abs(trend)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default SummaryCard;