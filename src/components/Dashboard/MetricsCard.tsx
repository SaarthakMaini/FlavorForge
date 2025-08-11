import React from 'react';
import { DivideIcon as LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface MetricsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  growth: number;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

const MetricsCard: React.FC<MetricsCardProps> = ({ title, value, icon: Icon, growth, color }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
  };

  const bgColorClasses = {
    blue: 'bg-blue-50',
    green: 'bg-green-50',
    purple: 'bg-purple-50',
    orange: 'bg-orange-50',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          
          <div className="flex items-center mt-2">
            {growth >= 0 ? (
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm font-medium ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {growth >= 0 ? '+' : ''}{growth.toFixed(1)}%
            </span>
            <span className="text-xs text-gray-500 ml-1">vs last month</span>
          </div>
        </div>
        
        <div className={`p-3 rounded-lg ${bgColorClasses[color]}`}>
          <div className={`w-8 h-8 bg-gradient-to-r ${colorClasses[color]} rounded-md flex items-center justify-center`}>
            <Icon className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsCard;