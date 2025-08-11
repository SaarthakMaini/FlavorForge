import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Types
interface Product {
  id: string;
  name: string;
  category: string;
  ingredients: string[];
  marketScore: number;
  region: string;
  targetDemographic: string;
  createdDate: string;
  status: 'active' | 'testing' | 'completed';
}

interface MarketTrend {
  id: string;
  ingredient: string;
  popularity: number;
  growthRate: number;
  region: string;
  category: string;
}

interface DashboardMetrics {
  totalProducts: number;
  successRate: number;
  activeUsers: number;
  trendingCategories: number;
  growthMetrics: {
    productsGrowth: number;
    successRateGrowth: number;
    usersGrowth: number;
  };
}

interface AppState {
  currentPage: string;
  isLoading: boolean;
  error: string | null;
  products: Product[];
  marketTrends: MarketTrend[];
  dashboardMetrics: DashboardMetrics | null;
  searchQuery: string;
  selectedCategory: string;
  selectedRegion: string;
}

// Actions
type AppAction =
  | { type: 'SET_PAGE'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'SET_MARKET_TRENDS'; payload: MarketTrend[] }
  | { type: 'SET_DASHBOARD_METRICS'; payload: DashboardMetrics }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_SELECTED_CATEGORY'; payload: string }
  | { type: 'SET_SELECTED_REGION'; payload: string }
  | { type: 'ADD_PRODUCT'; payload: Product };

// Initial state
const initialState: AppState = {
  currentPage: 'dashboard',
  isLoading: false,
  error: null,
  products: [],
  marketTrends: [],
  dashboardMetrics: null,
  searchQuery: '',
  selectedCategory: '',
  selectedRegion: '',
};

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_PAGE':
      return { ...state, currentPage: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    case 'SET_MARKET_TRENDS':
      return { ...state, marketTrends: action.payload };
    case 'SET_DASHBOARD_METRICS':
      return { ...state, dashboardMetrics: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_SELECTED_CATEGORY':
      return { ...state, selectedCategory: action.payload };
    case 'SET_SELECTED_REGION':
      return { ...state, selectedRegion: action.payload };
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] };
    default:
      return state;
  }
};

// Context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Provider
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Hook
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};