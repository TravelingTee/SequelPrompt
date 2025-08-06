import React, { useState, useEffect } from 'react';
import { Copy, Download, Sparkles, CheckCircle, FileText, Code, GitBranch, AlertCircle, Settings, Play, LogIn } from 'lucide-react';
import type { AppState } from '../App';
import LLMService, { type GenerationResult } from '../services/llmService';
import ApiService from '../services/apiService';

interface OutputSectionProps {
  state: AppState;
  onAuthRequired: () => void;
}

const OutputSection: React.FC<OutputSectionProps> = ({ state, onAuthRequired }) => {
  const [generatedOutput, setGeneratedOutput] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [tokensUsed, setTokensUsed] = useState<number>();
  const [generationsRemaining, setGenerationsRemaining] = useState<number | null>();
  const llmService = LLMService.getInstance();

  const generateOutput = async () => {
    if (!LLMService.isConfigured()) {
      onAuthRequired();
      return;
    }

    setIsGenerating(true);
    setError('');
    
    try {
      const result = state.mode === 'single' 
        ? await llmService.generateSinglePrompt(state)
        : await llmService.generateAgenticWorkflow(state);
      
      setGeneratedOutput(result.content);
      setTokensUsed(result.tokensUsed);
      setGenerationsRemaining(result.generationsRemaining);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const canGenerate = state.mainIdea.trim().length > 0;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const downloadOutput = () => {
    const blob = new Blob([generatedOutput], { type: 'text/
