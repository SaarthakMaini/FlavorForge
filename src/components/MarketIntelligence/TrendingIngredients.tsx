import React from 'react';
import { TrendingUp, TrendingDown, Globe } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

interface MarketTrend {
  id: string;
  ingredient: string;
  popularity: number;
  growthRate: number;
  region: string;
  category: string;
}

interface TrendingIngredientsProps {
  trends: MarketTrend[];
  isLoading: boolean;
}

const TrendingIngredients: React.FC<TrendingIngredientsProps> = ({ trends, isLoading }) => {
  const getPopularityColor = (popularity: number) => {
    if (popularity >= 90) return 'bg-green-500';
    if (popularity >= 80) return 'bg-yellow-500';
    if (popularity >= 70) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getGrowthIcon = (growthRate: number) => {
    return growthRate >= 0 ? (
      <TrendingUp className="w-4 h-4 text-green-600" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-600" />
    );
  };

  const getGrowthColor = (growthRate: number) => {
    return growthRate >= 0 ? 'text-green-600' : 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Trending Ingredients</h3>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Trending Ingredients</h3>
        <p className="text-sm text-gray-600 mt-1">Based on market analysis and consumer demand</p>
      </div>

      <div className="p-6">
        {trends.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">📈</div>
            <p className="text-gray-500">No trending ingredients found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {trends.map((trend, index) => (
              <div key={trend.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-150">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full text-blue-600 font-semibold text-sm">
                    {index + 1}
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900">{trend.ingredient}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                        {trend.category}
                      </span>
                      <div className="flex items-center text-xs text-gray-500">
                        <Globe className="w-3 h-3 mr-1" />
                        {trend.region}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center mb-1">
                    <div className="w-12 h-2 bg-gray-200 rounded-full mr-2">
                      <div
                        className={`h-full rounded-full ${getPopularityColor(trend.popularity)}`}
                        style={{ width: `${trend.popularity}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{trend.popularity}%</span>
                  </div>
                  
                  <div className="flex items-center">
                    {getGrowthIcon(trend.growthRate)}
                    <span className={`text-sm font-medium ml-1 ${getGrowthColor(trend.growthRate)}`}>
                      {trend.growthRate >= 0 ? '+' : ''}{trend.growthRate.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendingIngredients;