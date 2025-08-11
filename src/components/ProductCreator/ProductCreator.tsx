import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/api';
import StepIndicator from './StepIndicator';
import { Plus, ArrowRight, ArrowLeft, Sparkles, Check } from 'lucide-react';

interface ProductFormData {
  name: string;
  category: string;
  ingredients: string[];
  targetDemographic: string;
  region: string;
  description: string;
}

const ProductCreator: React.FC = () => {
  const { dispatch } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    category: '',
    ingredients: [],
    targetDemographic: '',
    region: '',
    description: '',
  });

  const [newIngredient, setNewIngredient] = useState('');
  const [aiSuggestions] = useState([
    'Turmeric (trending +23%)',
    'Oat Milk (growing +18%)',
    'Plant Protein (+31%)',
    'Coconut Oil (stable)',
    'Chia Seeds (+15%)',
  ]);

  const categories = ['Snacks', 'Beverages', 'Supplements', 'Dairy', 'Frozen', 'Bakery'];
  const regions = ['North America', 'Europe', 'Asia-Pacific', 'Latin America', 'Middle East', 'Global'];
  const demographics = [
    'Health-conscious millennials',
    'Fitness enthusiasts',
    'Parents with young children',
    'Senior citizens',
    'Busy professionals',
    'Students',
  ];

  const steps = [
    { id: 1, title: 'Basic Info', description: 'Product name and category' },
    { id: 2, title: 'Ingredients', description: 'Select key ingredients' },
    { id: 3, title: 'Market Details', description: 'Target audience and region' },
    { id: 4, title: 'Review', description: 'Finalize and submit' },
  ];

  const addIngredient = (ingredient: string) => {
    if (ingredient && !formData.ingredients.includes(ingredient)) {
      setFormData({
        ...formData,
        ingredients: [...formData.ingredients, ingredient],
      });
      setNewIngredient('');
    }
  };

  const removeIngredient = (ingredient: string) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients.filter(i => i !== ingredient),
    });
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await apiService.createProduct(formData);
      if (response.success) {
        dispatch({ type: 'ADD_PRODUCT', payload: response.data });
        setIsSuccess(true);
        setTimeout(() => {
          dispatch({ type: 'SET_PAGE', payload: 'analysis' });
        }, 2000);
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create product' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.name && formData.category;
      case 2:
        return formData.ingredients.length > 0;
      case 3:
        return formData.targetDemographic && formData.region;
      case 4:
        return true;
      default:
        return false;
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Created Successfully!</h2>
          <p className="text-gray-600">Redirecting to analysis page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Product Creator</h1>
          <p className="text-gray-600 mt-2">
            Create innovative products with AI-powered market insights
          </p>
        </div>

        <StepIndicator steps={steps} currentStep={currentStep} />

        <div className="bg-white rounded-xl shadow-sm p-8 mt-8">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Tropical Fusion Energy Bar"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of your product concept..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Ingredients *
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newIngredient}
                    onChange={(e) => setNewIngredient(e.target.value)}
                    placeholder="Enter ingredient name"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && addIngredient(newIngredient)}
                  />
                  <button
                    type="button"
                    onClick={() => addIngredient(newIngredient)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-3 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI-Powered Trending Ingredients
                </h4>
                <div className="flex flex-wrap gap-2">
                  {aiSuggestions.map(suggestion => (
                    <button
                      key={suggestion}
                      onClick={() => addIngredient(suggestion.split(' (')[0])}
                      className="px-3 py-1 bg-white text-blue-700 rounded-full text-sm hover:bg-blue-100 transition-colors duration-200"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              {formData.ingredients.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Ingredients:</h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.ingredients.map(ingredient => (
                      <span
                        key={ingredient}
                        className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                      >
                        {ingredient}
                        <button
                          type="button"
                          onClick={() => removeIngredient(ingredient)}
                          className="ml-2 text-green-600 hover:text-green-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Demographic *
                </label>
                <select
                  value={formData.targetDemographic}
                  onChange={(e) => setFormData({ ...formData, targetDemographic: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select target demographic</option>
                  {demographics.map(demo => (
                    <option key={demo} value={demo}>{demo}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Region *
                </label>
                <select
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select target region</option>
                  {regions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Review Your Product</h3>
              
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div>
                  <strong className="text-gray-700">Product Name:</strong>
                  <p className="text-gray-900">{formData.name}</p>
                </div>
                
                <div>
                  <strong className="text-gray-700">Category:</strong>
                  <p className="text-gray-900">{formData.category}</p>
                </div>
                
                <div>
                  <strong className="text-gray-700">Ingredients:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {formData.ingredients.map(ingredient => (
                      <span key={ingredient} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <strong className="text-gray-700">Target Demographic:</strong>
                  <p className="text-gray-900">{formData.targetDemographic}</p>
                </div>
                
                <div>
                  <strong className="text-gray-700">Region:</strong>
                  <p className="text-gray-900">{formData.region}</p>
                </div>
                
                {formData.description && (
                  <div>
                    <strong className="text-gray-700">Description:</strong>
                    <p className="text-gray-900">{formData.description}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="flex items-center px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </button>

            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!isStepValid(currentStep)}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || !isStepValid(currentStep)}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isSubmitting ? 'Creating...' : 'Create Product'}
                <Sparkles className="w-4 h-4 ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCreator;