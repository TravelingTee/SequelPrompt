import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateToken, checkGenerationLimit, AuthRequest } from '../middleware/auth';
import { OpenAIService } from '../services/openaiService';
import { UserService, GenerationService } from '../database/sqlite';

const router = express.Router();

// Generate single prompt
router.post('/single', [
  authenticateToken,
  checkGenerationLimit,
  body('mainIdea').trim().isLength({ min: 10 }),
  body('outputFormat').isIn(['detailed-explanation', 'bullet-points', 'step-by-step', 'code', 'creative', 'analysis']),
  body('tone').isIn(['professional', 'casual', 'technical', 'creative', 'formal', 'friendly', 'authoritative', 'conversational']),
  body('length').isIn(['brief', 'detailed', 'comprehensive'])
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = req.user!;
    const input = {
      type: 'single' as const,
      ...req.body
    };

    // Generate prompt using OpenAI
    const result = await OpenAIService.generateSinglePrompt(input);

    // Save generation record
    await GenerationService.create({
      userId: user.id,
      type: 'single',
      input,
      output: result.content,
      tokensUsed: result.tokensUsed,
      cost: result.cost
    });

    // Increment user usage
    await UserService.updateUsage(user.id!, user.generations_used + 1);

    res.json({
      content: result.content,
      tokensUsed: result.tokensUsed,
      cost: result.cost,
      generationsRemaining: user.plan === 'free' ? user.generations_limit - user.generations_used - 1 : null
    });
  } catch (error) {
    console.error('Single generation error:', error);
    res.status(500).json({ error: 'Failed to generate prompt' });
  }
});

// Generate agentic workflow
router.post('/agentic', [
  authenticateToken,
  checkGenerationLimit,
  body('mainIdea').trim().isLength({ min: 10 }),
  body('outputFormat').isIn(['system-prompt', 'workflow-spec', 'json-config', 'implementation-guide']),
  body('tone').isIn(['professional', 'casual', 'technical', 'creative', 'formal', 'friendly', 'authoritative', 'conversational']),
  body('length').isIn(['brief', 'detailed', 'comprehensive'])
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = req.user!;
    const input = {
      type: 'agentic' as const,
      ...req.body
    };

    // Generate workflow using OpenAI
    const result = await OpenAIService.generateAgenticWorkflow(input);

    // Save generation record
    await GenerationService.create({
      userId: user.id,
      type: 'agentic',
      input,
      output: result.content,
      tokensUsed: result.tokensUsed,
      cost: result.cost
    });

    // Increment user usage
    await UserService.updateUsage(user.id!, user.generations_used + 1);

    res.json({
      content: result.content,
      tokensUsed: result.tokensUsed,
      cost: result.cost,
      generationsRemaining: user.plan === 'free' ? user.generations_limit - user.generations_used - 1 : null
    });
  } catch (error) {
    console.error('Agentic generation error:', error);
    res.status(500).json({ error: 'Failed to generate workflow' });
  }
});

// Get user's generation history
router.get('/history', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const user = req.user!;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const generations = await GenerationService.getHistory(user.id!, page, limit);

    res.json({
      generations,
      pagination: {
        page,
        limit,
        total: generations.length,
        pages: Math.ceil(generations.length / limit)
      }
    });
  } catch (error) {
    console.error('Generation history error:', error);
    res.status(500).json({ error: 'Failed to get generation history' });
  }
});

export default router;
