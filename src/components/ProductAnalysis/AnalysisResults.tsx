import React from 'react';
import { TrendingUp, Users, Award, Lightbulb, Loader } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  marketScore: number;
}

interface AnalysisData {
  overallScore: number;
  marketPotential: number;
  competitiveAnalysis: {
    competitors: number;
    marketShare: number;
  };
  recommendations: string[];
  trendAlignment: number;
}

interface AnalysisResultsProps {
  product: Product;
  results: AnalysisData | null;
  isAnalyzing: boolean;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ product, results, isAnalyzing }) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-yellow-600 bg-yellow-100';
    if (score >= 70) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 70) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
        <p className="text-sm text-gray-600">{product.category}</p>
      </div>

      {isAnalyzing ? (
        <div className="text-center py-8">
          <Loader className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Analyzing product with AI...</p>
        </div>
      ) : results ? (
        <div className="space-y-6">
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full font-bold text-2xl ${getScoreColor(results.overallScore)}`}>
              {results.overallScore}
            </div>
            <p className="text-sm text-gray-600 mt-2">Overall Score</p>
            <p className="text-xs text-gray-500">{getScoreLabel(results.overallScore)}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <TrendingUp className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-900">Market Potential</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">{results.marketPotential}%</p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Award className="w-4 h-4 text-purple-600 mr-2" />
                <span className="text-sm font-medium text-purple-900">Trend Alignment</span>
              </div>
              <p className="text-2xl font-bold text-purple-600">{results.trendAlignment}%</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Competitive Analysis
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Direct Competitors:</span>
                <span className="font-medium">{results.competitiveAnalysis.competitors}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Est. Market Share:</span>
                <span className="font-medium">{results.competitiveAnalysis.marketShare}%</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <Lightbulb className="w-4 h-4 mr-2" />
              AI Recommendations
            </h4>
            <div className="space-y-2">
              {results.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          Click "Analyze" to generate AI-powered insights
        </div>
      )}
    </div>
  );
};

export default AnalysisResults;