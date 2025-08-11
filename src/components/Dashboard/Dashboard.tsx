import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/api';
import MetricsCard from './MetricsCard';
import RecentActivity from './RecentActivity';
import LoadingSpinner from '../common/LoadingSpinner';
import { TrendingUp, Users, Package, Target } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { state, dispatch } = useApp();

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const [metricsResponse, productsResponse] = await Promise.all([
          apiService.getDashboardMetrics(),
          apiService.getProducts({ limit: 5 })
        ]);

        if (metricsResponse.success) {
          dispatch({ type: 'SET_DASHBOARD_METRICS', payload: metricsResponse.data });
        }

        if (productsResponse.success) {
          dispatch({ type: 'SET_PRODUCTS', payload: productsResponse.data.products });
        }
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load dashboard data' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    fetchData();
  }, [dispatch]);

  if (state.isLoading && !state.dashboardMetrics) {
    return <LoadingSpinner />;
  }

  if (state.error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">⚠️</div>
          <p className="text-gray-600">{state.error}</p>
        </div>
      </div>
    );
  }

  const metrics = state.dashboardMetrics;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Monitor your product development performance and market insights
          </p>
        </div>

        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricsCard
              title="Total Products"
              value={metrics.totalProducts.toString()}
              icon={Package}
              growth={metrics.growthMetrics.productsGrowth}
              color="blue"
            />
            <MetricsCard
              title="Success Rate"
              value={`${metrics.successRate}%`}
              icon={Target}
              growth={metrics.growthMetrics.successRateGrowth}
              color="green"
            />
            <MetricsCard
              title="Active Users"
              value={metrics.activeUsers.toLocaleString()}
              icon={Users}
              growth={metrics.growthMetrics.usersGrowth}
              color="purple"
            />
            <MetricsCard
              title="Trending Categories"
              value={metrics.trendingCategories.toString()}
              icon={TrendingUp}
              growth={12.5}
              color="orange"
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentActivity products={state.products} />
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button 
                onClick={() => dispatch({ type: 'SET_PAGE', payload: 'creator' })}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
              >
                Create New Product
              </button>
              <button 
                onClick={() => dispatch({ type: 'SET_PAGE', payload: 'analysis' })}
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium"
              >
                Analyze Product
              </button>
              <button 
                onClick={() => dispatch({ type: 'SET_PAGE', payload: 'intelligence' })}
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium"
              >
                Market Insights
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;