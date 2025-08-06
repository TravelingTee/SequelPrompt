import React from 'react';
import { MessageSquare, GitBranch, Lightbulb, Cpu } from 'lucide-react';
import type { AppMode } from '../App';

interface ModeToggleProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

const ModeToggle: React.FC<ModeToggleProps> = ({ currentMode, onModeChange }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-white/20">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your AI Approach</h2>
        <p className="text-gray-600">Select the type of AI solution you want to create</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => onModeChange('single')}
          className={`p-6 rounded-xl border-2 transition-all duration-300 text-left ${
            currentMode === 'single'
              ? 'border-purple-500 bg-purple-50 shadow-lg scale-105'
              : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
          }`}
        >
          <div className="flex items-center space-x-3 mb-3">
            <div className={`p-2 rounded-lg ${
              currentMode === 'single' ? 'bg-purple-500' : 'bg-gray-400'
            }`}>
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-lg">Single Prompt</h3>
          </div>
          <p className="text-gray-600 text-sm mb-3">
            Perfect for one-time tasks, quick questions, or straightforward AI interactions.
          </p>
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <Lightbulb className="w-4 h-4" />
            <span>Best for: Writing, analysis, Q&A, creative tasks</span>
          </div>
        </button>
        
        <button
          onClick={() => onModeChange('agentic')}
          className={`p-6 rounded-xl border-2 transition-all duration-300 text-left ${
            currentMode === 'agentic'
              ? 'border-teal-500 bg-teal-50 shadow-lg scale-105'
              : 'border-gray-200 hover:border-teal-300 hover:shadow-md'
          }`}
        >
          <div className="flex items-center space-x-3 mb-3">
            <div className={`p-2 rounded-lg ${
              currentMode === 'agentic' ? 'bg-teal-500' : 'bg-gray-400'
            }`}>
              <GitBranch className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-lg">Agentic Workflow</h3>
          </div>
          <p className="text-gray-600 text-sm mb-3">
            Complex multi-step processes that require planning, decision-making, and tool usage.
          </p>
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <Cpu className="w-4 h-4" />
            <span>Best for: Automation, research, complex problem-solving</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ModeToggle;
