import React from 'react';
import { Building, Package, PieChart } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

interface Competitor {
  id: string;
  name: string;
  marketShare: number;
  products: number;
  category: string;
}

interface CompetitorAnalysisProps {
  competitors: Competitor[];
  isLoading: boolean;
}

const CompetitorAnalysis: React.FC<CompetitorAnalysisProps> = ({ competitors, isLoading }) => {
  const getMarketShareColor = (share: number) => {
    if (share >= 15) return 'text-red-600 bg-red-100';
    if (share >= 10) return 'text-yellow-600 bg-yellow-100';
    if (share >= 5) return 'text-blue-600 bg-blue-100';
    return 'text-green-600 bg-green-100';
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Competitor Analysis</h3>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Competitor Analysis</h3>
        <p className="text-sm text-gray-600 mt-1">Key players in the market landscape</p>
      </div>

      <div className="p-6">
        {competitors.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">🏢</div>
            <p className="text-gray-500">No competitor data available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {competitors.map((competitor, index) => (
              <div key={competitor.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors duration-150">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg flex items-center justify-center">
                      <Building className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{competitor.name}</h4>
                      <p className="text-sm text-gray-600">{competitor.category}</p>
                    </div>
                  </div>
                  
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getMarketShareColor(competitor.marketShare)}`}>
                    {competitor.marketShare}% Share
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Package className="w-4 h-4 mr-2" />
                    <span>{competitor.products} products</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <PieChart className="w-4 h-4 mr-2" />
                    <span>Market position #{index + 1}</span>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>Market Share</span>
                    <span>{competitor.marketShare}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${competitor.marketShare}%` }}
                    />
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

export default CompetitorAnalysis;