import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/api';
import ProductTable from './ProductTable';
import AnalysisResults from './AnalysisResults';
import { Search, Filter, BarChart3 } from 'lucide-react';

const ProductAnalysis: React.FC = () => {
  const { state, dispatch } = useApp();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const response = await apiService.getProducts({
          search: state.searchQuery,
          category: state.selectedCategory,
          page: page,
          limit: 10,
        });
        if (response.success) {
          dispatch({ type: 'SET_PRODUCTS', payload: response.data.products });
          setTotalPages(response.data.totalPages || 1);
        }
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load products' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    fetchProducts();
  }, [state.searchQuery, state.selectedCategory, page, dispatch]);

  const handleAnalyze = async (product: any) => {
    setSelectedProduct(product);
    setIsAnalyzing(true);
    try {
      const response = await apiService.analyzeProduct(product);
      if (response.success) {
        setAnalysisResults(response.data);
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to analyze product' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const categories = ['', 'Snacks', 'Beverages', 'Supplements', 'Dairy', 'Frozen', 'Bakery'];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Product Analysis</h1>
          <p className="text-gray-600 mt-2">
            Analyze product performance and get AI-powered insights
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={state.searchQuery}
                  onChange={(e) => {
                    setPage(1);
                    dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value });
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={state.selectedCategory}
                  onChange={(e) => {
                    setPage(1);
                    dispatch({ type: 'SET_SELECTED_CATEGORY', payload: e.target.value });
                  }}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="">All Categories</option>
                  {categories.slice(1).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ProductTable 
              products={state.products} 
              onAnalyze={handleAnalyze}
              isLoading={state.isLoading}
            />

            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-4">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className={`px-4 py-2 rounded ${page === 1 ? 'bg-gray-200 text-gray-500' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                >
                  Previous
                </button>
                <span className="text-gray-600">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className={`px-4 py-2 rounded ${page === totalPages ? 'bg-gray-200 text-gray-500' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                >
                  Next
                </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            {selectedProduct ? (
              <AnalysisResults 
                product={selectedProduct}
                results={analysisResults}
                isAnalyzing={isAnalyzing}
              />
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Product</h3>
                <p className="text-gray-500 text-sm">
                  Click on the analyze button next to any product to see detailed AI-powered insights
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductAnalysis;
