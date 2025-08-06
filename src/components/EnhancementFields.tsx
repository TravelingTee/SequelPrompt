import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Settings, Target, FileText, Zap } from 'lucide-react';
import type { AppState } from '../App';

interface EnhancementFieldsProps {
  state: AppState;
  onChange: (updates: Partial<AppState>) => void;
}

const EnhancementFields: React.FC<EnhancementFieldsProps> = ({ state, onChange }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'Marketing',
    'E-commerce', 'Legal', 'Consulting', 'Real Estate', 'Manufacturing', 'Other'
  ];

  const outputFormats = state.mode === 'single' 
    ? [
        { value: 'detailed-explanation', label: 'Detailed Explanation' },
        { value: 'bullet-points', label: 'Bullet Points' },
        { value: 'step-by-step', label: 'Step-by-Step Guide' },
        { value: 'code', label: 'Code/Technical' },
        { value: 'creative', label: 'Creative Writing' },
        { value: 'analysis', label: 'Analysis/Report' }
      ]
    : [
        { value: 'system-prompt', label: 'System Prompt' },
        { value: 'workflow-spec', label: 'Workflow Specification' },
        { value: 'json-config', label: 'JSON Configuration' },
        { value: 'implementation-guide', label: 'Implementation Guide' }
      ];

  const tones = [
    'Professional', 'Casual', 'Technical', 'Creative', 'Formal', 
    'Friendly', 'Authoritative', 'Conversational'
  ];

  const lengths = [
    { value: 'brief', label: 'Brief' },
    { value: 'detailed', label: 'Detailed' },
    { value: 'comprehensive', label: 'Comprehensive' }
  ];

  return (
    <div className="space-y-6">
      {/* Universal Fields */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-white/20">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg">
            <Target className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-semibold text-lg text-gray-900">Context & Requirements</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Context & Background
            </label>
            <textarea
              value={state.context}
              onChange={(e) => onChange({ context: e.target.value })}
              placeholder="Provide relevant background information, constraints, or context..."
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry/Domain
              </label>
              <select
                value={state.industry}
                onChange={(e) => onChange({ industry: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select industry...</option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Audience
              </label>
              <input
                type="text"
                value={state.targetAudience}
                onChange={(e) => onChange({ targetAudience: e.target.value })}
                placeholder="e.g., executives, students, developers..."
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Output Preferences */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-white/20">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-semibold text-lg text-gray-900">Output Preferences</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Format
            </label>
            <select
              value={state.outputFormat}
              onChange={(e) => onChange({ outputFormat: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {outputFormats.map(format => (
                <option key={format.value} value={format.value}>{format.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tone
            </label>
            <select
              value={state.tone}
              onChange={(e) => onChange({ tone: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {tones.map(tone => (
                <option key={tone} value={tone.toLowerCase()}>{tone}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Length
            </label>
            <select
              value={state.length}
              onChange={(e) => onChange({ length: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {lengths.map(length => (
                <option key={length.value} value={length.value}>{length.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Mode-specific Fields */}
      {state.mode === 'single' ? (
        <SingleModeFields state={state} onChange={onChange} />
      ) : (
        <AgenticModeFields state={state} onChange={onChange} />
      )}

      {/* Advanced Options Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="w-full flex items-center justify-center space-x-2 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors border border-gray-200"
      >
        <Settings className="w-5 h-5 text-gray-600" />
        <span className="font-medium text-gray-700">Advanced Options</span>
        {showAdvanced ? (
          <ChevronUp className="w-5 h-5 text-gray-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-600" />
        )}
      </button>

      {showAdvanced && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-lg text-gray-900">Advanced Settings</h3>
          </div>
          
          {state.mode === 'single' ? (
            <AdvancedSingleFields state={state} onChange={onChange} />
          ) : (
            <AdvancedAgenticFields state={state} onChange={onChange} />
          )}
        </div>
      )}
    </div>
  );
};

const SingleModeFields: React.FC<{ state: AppState; onChange: (updates: Partial<AppState>) => void }> = ({ state, onChange }) => (
  <div className="bg-white rounded-2xl p-6 shadow-lg border border-white/20">
    <h3 className="font-semibold text-lg text-gray-900 mb-4">Single Prompt Specifics</h3>
    
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Specific Requirements
        </label>
        <textarea
          value={state.requirements}
          onChange={(e) => onChange({ requirements: e.target.value })}
          placeholder="Any constraints, must-include elements, or special considerations..."
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          rows={3}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Examples of Desired Output
        </label>
        <textarea
          value={state.examples}
          onChange={(e) => onChange({ examples: e.target.value })}
          placeholder="Provide examples of the style or format you want..."
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          rows={3}
        />
      </div>
    </div>
  </div>
);

const AgenticModeFields: React.FC<{ state: AppState; onChange: (updates: Partial<AppState>) => void }> = ({ state, onChange }) => (
  <div className="bg-white rounded-2xl p-6 shadow-lg border border-white/20">
    <h3 className="font-semibold text-lg text-gray-900 mb-4">Agentic Workflow Specifics</h3>
    
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Task Decomposition
        </label>
        <textarea
          value={state.taskDecomposition}
          onChange={(e) => onChange({ taskDecomposition: e.target.value })}
          placeholder="Break down the workflow into sub-tasks, dependencies, and decision points..."
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          rows={4}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Required Tools & Capabilities
        </label>
        <textarea
          value={state.agentCapabilities}
          onChange={(e) => onChange({ agentCapabilities: e.target.value })}
          placeholder="What tools, APIs, or capabilities does the agent need? (e.g., web scraping, email, databases, APIs)"
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          rows={3}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Success Criteria & Parameters
        </label>
        <textarea
          value={state.workflowParams}
          onChange={(e) => onChange({ workflowParams: e.target.value })}
          placeholder="Define success metrics, termination conditions, and quality standards..."
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          rows={3}
        />
      </div>
    </div>
  </div>
);

const AdvancedSingleFields: React.FC<{ state: AppState; onChange: (updates: Partial<AppState>) => void }> = ({ state, onChange }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Reasoning Style
        </label>
        <select
          value={state.reasoningStyle}
          onChange={(e) => onChange({ reasoningStyle: e.target.value })}
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="step-by-step">Step-by-Step</option>
          <option value="analytical">Analytical</option>
          <option value="creative">Creative</option>
          <option value="logical">Logical</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          AI Role/Perspective
        </label>
        <input
          type="text"
          value={state.aiRole}
          onChange={(e) => onChange({ aiRole: e.target.value })}
          placeholder="e.g., expert consultant, creative writer..."
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>
    </div>
  </div>
);

const AdvancedAgenticFields: React.FC<{ state: AppState; onChange: (updates: Partial<AppState>) => void }> = ({ state, onChange }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2
