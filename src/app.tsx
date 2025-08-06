import React, { useState } from 'react';
import Header from './components/Header';
import AuthModal from './components/AuthModal';
import ModeToggle from './components/ModeToggle';
import MainInput from './components/MainInput';
import EnhancementFields from './components/EnhancementFields';
import OutputSection from './components/OutputSection';
import QuickStart from './components/QuickStart';
import ApiService from './services/apiService';

export type AppMode = 'single' | 'agentic';

export interface AppState {
  mode: AppMode;
  mainIdea: string;
  context: string;
  industry: string;
  targetAudience: string;
  outputFormat: string;
  tone: string;
  length: string;
  // Single mode specific
  requirements: string;
  examples: string;
  reasoningStyle: string;
  aiRole: string;
  // Agentic mode specific
  taskDecomposition: string;
  agentCapabilities: string;
  workflowParams: string;
  advancedSettings: string;
}

const initialState: AppState = {
  mode: 'single',
  mainIdea: '',
  context: '',
  industry: '',
  targetAudience: '',
  outputFormat: 'detailed-explanation',
  tone: 'professional',
  length: 'detailed',
  requirements: '',
  examples: '',
  reasoningStyle: 'step-by-step',
  aiRole: '',
  taskDecomposition: '',
  agentCapabilities: '',
  workflowParams: '',
  advancedSettings: ''
};

function App() {
  const [state, setState] = useState<AppState>(initialState);
  const [showQuickStart, setShowQuickStart] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Check if user is already logged in on app load
  React.useEffect(() => {
    const checkAuth = async () => {
      if (ApiService.isAuthenticated()) {
        try {
          const userData = await ApiService.getCurrentUser();
          setUser(userData.user);
        } catch (error) {
          console.error('Auth check failed:', error);
          ApiService.logout();
        }
      }
    };
    checkAuth();
  }, []);

  const updateState = (updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const toggleMode = (newMode: AppMode) => {
    setState(prev => ({ ...prev, mode: newMode }));
  };

  const handleAuthSuccess = (userData: any) => {
    setUser(userData);
  };

  const handleLogout = () => {
    ApiService.logout();
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header 
        user={user}
        onAuthClick={() => setShowAuthModal(true)}
        onLogout={handleLogout}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showQuickStart && (
          <QuickStart onClose={() => setShowQuickStart(false)} />
        )}
        
        <div className="space-y-8">
          <ModeToggle 
            currentMode={state.mode} 
            onModeChange={toggleMode}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <MainInput 
                mode={state.mode}
                value={state.mainIdea}
                onChange={(value) => updateState({ mainIdea: value })}
              />
              
              <EnhancementFields 
                state={state}
                onChange={updateState}
              />
            </div>
            
            <div className="lg:sticky lg:top-8 lg:self-start">
              <OutputSection 
                state={state} 
                onAuthRequired={() => setShowAuthModal(true)}
              />
            </div>
          </div>
        </div>
      </main>
      
      {showAuthModal && (
        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
}

export default App;
