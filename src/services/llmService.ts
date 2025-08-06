import ApiService from './apiService';
import type { AppState } from '../App';

export interface GenerationResult {
  content: string;
  tokensUsed?: number;
  cost?: number;
  generationsRemaining?: number | null;
}

export class LLMService {
  private static instance: LLMService;
  
  static getInstance(): LLMService {
    if (!LLMService.instance) {
      LLMService.instance = new LLMService();
    }
    return LLMService.instance;
  }

  async generateSinglePrompt(state: AppState): Promise<GenerationResult> {
    try {
      const response = await ApiService.generateSinglePrompt({
        mainIdea: state.mainIdea,
        context: state.context,
        industry: state.industry,
        targetAudience: state.targetAudience,
        outputFormat: state.outputFormat,
        tone: state.tone,
        length: state.length,
        requirements: state.requirements,
        examples: state.examples
      });

      return {
        content: response.content,
        tokensUsed: response.tokensUsed,
        cost: response.cost,
        generationsRemaining: response.generationsRemaining
      };
    } catch (error: any) {
      console.error('Error generating single prompt:', error);
      throw new Error(error.message || 'Failed to generate optimized prompt');
    }
  }

  async generateAgenticWorkflow(state: AppState): Promise<GenerationResult> {
    try {
      const response = await ApiService.generateAgenticWorkflow({
        mainIdea: state.mainIdea,
        context: state.context,
        industry: state.industry,
        targetAudience: state.targetAudience,
        outputFormat: state.outputFormat,
        tone: state.tone,
        length: state.length,
        taskDecomposition: state.taskDecomposition,
        agentCapabilities: state.agentCapabilities,
        workflowParams: state.workflowParams,
        advancedSettings: state.advancedSettings
      });

      return {
        content: response.content,
        tokensUsed: response.tokensUsed,
        cost: response.cost,
        generationsRemaining: response.generationsRemaining
      };
    } catch (error: any) {
      console.error('Error generating agentic workflow:', error);
      throw new Error(error.message || 'Failed to generate agent workflow');
    }
  }

  // Utility method to check if user is authenticated
  static isConfigured(): boolean {
    return ApiService.isAuthenticated();
  }
}

export default LLMService;
