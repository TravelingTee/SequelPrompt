import React from 'react';
import { Zap, Sparkles, User, LogOut, CreditCard } from 'lucide-react';

interface HeaderProps {
  user: any;
  onAuthClick: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onAuthClick, onLogout }) => {

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <Sparkles className="w-4 h-4 text-purple-500 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Sequel Prompt
              </h1>
              <p className="text-sm text-gray-600">Transform ideas into powerful AI prompts & workflows</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex space-x-6">
              <a 
                href="#" 
                className="text-gray-600 hover:text-purple-600 transition-colors text-sm font-medium"
              >
                Templates
              </a>
              <a 
                href="#" 
                className="text-gray-600 hover:text-purple-600 transition-colors text-sm font-medium"
              >
                Examples
              </a>
              <a 
                href="#" 
                className="text-gray-600 hover:text-purple-600 transition-colors text-sm font-medium"
              >
                Guide
              </a>
            </nav>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-600 capitalize">
                    {user.plan} Plan • {user.generationsUsed}/{user.generationsLimit} used
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {user.plan === 'free' && (
                    <button className="flex items-center space-x-1 px-3 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-blue-700 transition-colors">
                      <CreditCard className="w-4 h-4" />
                      <span>Upgrade</span>
                    </button>
                  )}
                  <button
                    onClick={onLogout}
                    className="flex items-center space-x-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={onAuthClick}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-blue-700 transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
