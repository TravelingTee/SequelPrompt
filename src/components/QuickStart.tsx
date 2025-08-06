import React from 'react';
import { X, Lightbulb, Zap, Target, GitBranch } from 'lucide-react';

interface QuickStartProps {
  onClose: () => void;
}

const QuickStart: React.FC<QuickStartProps> = ({ onClose }) => {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 mb-8 border border-purple-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg">
            <Lightbulb className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-xl text-gray-900">Welcome to Sequel Prompt</h3>
            <p className="text-gray-600">Transform your ideas into powerful AI prompts and workflows</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/60 rounded-xl p-4 border border-white/40">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-purple-500 rounded-lg">
              <Target className="w-5 h-5 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900">Single Prompts</h4>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Perfect for one-time tasks like writing, analysis, or creative work.
          </p>
          <div className="text-xs text-gray-500">
            <strong>Example:</strong> "Help me write a professional email declining a job offer"
          </div>
        </div>
        
        <div className="bg-white/60 rounded-xl p-4 border border-white/40">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-teal-500 rounded-lg">
              <GitBranch className="w-5 h-5 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900">Agentic Workflows</h4>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Complex multi-step processes that require planning and decision-making.
          </p>
          <div className="text-xs text-gray-500">
            <strong>Example:</strong> "Monitor competitor pricing and adjust my prices automatically"
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex items-center space-x-2 text-sm text-purple-700 bg-purple-100 p-3 rounded-lg">
        <Zap className="w-4 h-4" />
        <span><strong>Pro Tip:</strong> Start with a simple description - we'll help you add the technical details!</span>
      </div>
    </div>
  );
};

export default QuickStart;
