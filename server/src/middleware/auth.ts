import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserService } from '../database/sqlite';

export interface User {
  id?: number;
  email: string;
  password: string;
  name: string;
  plan: string;
  generations_used: number;
  generations_limit: number;
  last_reset_date: string;
}

export interface AuthRequest extends Request {
  user?: User;
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const user = await UserService.findById(parseInt(decoded.userId));

    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

export const checkGenerationLimit = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const canGenerate = await UserService.canGenerate(req.user);
    if (!canGenerate) {
      return res.status(429).json({ 
        error: 'Generation limit exceeded',
        plan: req.user.plan,
        used: req.user.generations_used,
        limit: req.user.generations_limit,
        message: 'Upgrade your plan or wait for daily reset'
      });
    }

    next();
  } catch (error) {
    console.error('Generation limit check error:', error);
    return res.status(500).json({ error: 'Failed to check generation limit' });
  }
};
