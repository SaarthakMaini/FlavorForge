import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navigation from './components/Navigation/Navigation';
import Dashboard from './components/Dashboard/Dashboard';
import ProductCreator from './components/ProductCreator/ProductCreator';
import ProductAnalysis from './components/ProductAnalysis/ProductAnalysis';
import MarketIntelligence from './components/MarketIntelligence/MarketIntelligence';

const AppContent: React.FC = () => {
  const { state } = useApp();

  const renderCurrentPage = () => {
    switch (state.currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'creator':
        return <ProductCreator />;
      case 'analysis':
        return <ProductAnalysis />;
      case 'intelligence':
        return <MarketIntelligence />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main>
        {renderCurrentPage()}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App