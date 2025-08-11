import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/api';
import TrendingIngredients from './TrendingIngredients';
import CompetitorAnalysis from './CompetitorAnalysis';
import LoadingSpinner from '../common/LoadingSpinner';
import { Globe, TrendingUp, Users, Target } from 'lucide-react';

const MarketIntelligence: React.FC = () => {
  const { state, dispatch } = useApp();
  const [competitors, setCompetitors] = useState([]);
  const [isLoadingCompetitors, setIsLoadingCompetitors] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      setIsLoadingCompetitors(true);
      
      try {
        const [trendsResponse, competitorsResponse] = await Promise.all([
          apiService.getMarketTrends(state.selectedRegion, state.selectedCategory),
          apiService.getCompetitors(state.selectedCategory)
        ]);

        if (trendsResponse.success) {
          dispatch({ type: 'SET_MARKET_TRENDS', payload: trendsResponse.data });
        }

        if (competitorsResponse.success) {
          setCompetitors(competitorsResponse.data);
        }
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load market intelligence data' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
        setIsLoadingCompetitors(false);
      }
    };

    fetchData();
  }, [state.selectedRegion, state.selectedCategory, dispatch]);

  const regions = ['', 'North America', 'Europe', 'Asia-Pacific', 'Latin America', 'Global'];
  const categories = ['', 'Spices', 'Dairy Alternatives', 'Supplements', 'Snacks', 'Beverages'];

  if (state.isLoading && state.marketTrends.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Market Intelligence</h1>
          <p className="text-gray-600 mt-2">
            Discover trending ingredients and analyze competitive landscape
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
              <select
                value={state.selectedRegion}
                onChange={(e) => dispatch({ type: 'SET_SELECTED_REGION', payload: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Regions</option>
                {regions.slice(1).map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={state.selectedCategory}
                onChange={(e) => dispatch({ type: 'SET_SELECTED_CATEGORY', payload: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.slice(1).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Trending Ingredients</p>
                <p className="text-2xl font-bold text-gray-900">{state.marketTrends.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Competitors</p>
                <p className="text-2xl font-bold text-gray-900">{competitors.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Globe className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Global Reach</p>
                <p className="text-2xl font-bold text-gray-900">5</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Market Opportunities</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TrendingIngredients 
            trends={state.marketTrends} 
            isLoading={state.isLoading}
          />
          
          <CompetitorAnalysis 
            competitors={competitors}
            isLoading={isLoadingCompetitors}
          />
        </div>
      </div>
    </div>
  );
};

export default MarketIntelligence;