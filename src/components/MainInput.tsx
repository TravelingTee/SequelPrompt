import React from 'react';
import { Edit3, Users } from 'lucide-react';
import type { AppMode } from '../App';

interface MainInputProps {
  mode: AppMode;
  value: string;
  onChange: (value: string) => void;
}

const MainInput: React.FC<MainInputProps> = ({ mode, value, onChange }) => {
  const placeholder = mode === 'single' 
    ? "Describe what you want to accomplish with AI...\n\nExample: 'I need help writing a professional email to decline a job offer while maintaining a positive relationship with the company.'"
    : "Describe the complex task or workflow you want an AI agent to handle...\n\nExample: 'I want an AI agent that can monitor my competitor's pricing, analyze market trends, and automatically adjust my product prices while ensuring profitability and sending me daily reports.'";

  const maxLength = mode === 'single' ? 1000 : 2000;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-white/20">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg">
          <Edit3 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-lg text-gray-900">
            {mode === 'single' ? 'Describe Your Task' : 'Describe Your Workflow'}
          </h3>
          <p className="text-sm text-gray-600">
            {mode === 'single' 
              ? 'What do you want the AI to help you with?'
              : 'What complex process should the agent handle?'
            }
          </p>
        </div>
      </div>
      
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full min-h-[120px] p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-400"
          maxLength={maxLength}
        />
        <div className="absolute bottom-3 right-3 text-xs text-gray-400">
          {value.length}/{maxLength}
        </div>
      </div>
      
      {mode === 'agentic' && (
        <div className="mt-4 p-3 bg-teal-50 rounded-lg border border-teal-200">
          <div className="flex items-center space-x-2 text-teal-700">
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">Agent Workflow Tip</span>
          </div>
          <p className="text-xs text-teal-600 mt-1">
            Think about the steps a human would take, then describe how an AI agent could automate this process.
          </p>
        </div>
      )}
    </div>
  );
};

export default MainInput;
