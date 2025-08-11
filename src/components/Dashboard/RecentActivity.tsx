import React from 'react';
import { Package, Clock, TrendingUp } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  marketScore: number;
  status: 'active' | 'testing' | 'completed';
  createdDate: string;
}

interface RecentActivityProps {
  products: Product[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ products }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'testing':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-blue-600" />
          Recent Products
        </h3>
      </div>
      
      <div className="p-6">
        {products.length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No recent products found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {products.map(product => (
              <div 
                key={product.id} 
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{product.name}</h4>
                      <p className="text-sm text-gray-600">{product.category}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 text-gray-400 mr-1" />
                      <span className={`font-semibold ${getScoreColor(product.marketScore)}`}>
                        {product.marketScore}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">Market Score</p>
                  </div>
                  
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                    {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;