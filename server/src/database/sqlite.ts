import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import bcrypt from 'bcryptjs';

const db = new sqlite3.Database('./data.db');

// Promisify database methods
const dbRun = promisify(db.run.bind(db));
const dbGet = promisify(db.get.bind(db));
const dbAll = promisify(db.all.bind(db));

// Initialize database tables
export const initDatabase = async () => {
  await dbRun(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      plan TEXT DEFAULT 'free',
      generations_used INTEGER DEFAULT 0,
      generations_limit INTEGER DEFAULT 3,
      last_reset_date TEXT DEFAULT CURRENT_TIMESTAMP,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS generations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      input TEXT NOT NULL,
      output TEXT NOT NULL,
      tokens_used INTEGER NOT NULL,
      cost REAL NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);
};

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

export const UserService = {
  async create(userData: Omit<User, 'id'>): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    const result = await dbRun(
      `INSERT INTO users (email, password, name, plan, generations_used, generations_limit) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userData.email, hashedPassword, userData.name, userData.plan, userData.generations_used, userData.generations_limit]
    );
    
    const user = await dbGet('SELECT * FROM users WHERE id = ?', [(result as any).lastID]);
    return user as User;
  },

  async findByEmail(email: string): Promise<User | null> {
    const user = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
    return user as User || null;
  },

  async findById(id: number): Promise<User | null> {
    const user = await dbGet('SELECT * FROM users WHERE id = ?', [id]);
    return user as User || null;
  },

  async updateUsage(id: number, generationsUsed: number): Promise<void> {
    await dbRun('UPDATE users SET generations_used = ? WHERE id = ?', [generationsUsed, id]);
  },

  async canGenerate(user: User): Promise<boolean> {
    // Check if we need to reset daily usage
    const now = new Date();
    const lastReset = new Date(user.last_reset_date);
    const daysSinceReset = Math.floor((now.getTime() - lastReset.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceReset >= 1) {
      await dbRun('UPDATE users SET generations_used = 0, last_reset_date = ? WHERE id = ?', [now.toISOString(), user.id]);
      user.generations_used = 0;
    }
    
    return user.generations_used < user.generations_limit;
  },

  async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
};

export const GenerationService = {
  async create(generationData: any): Promise<void> {
    await dbRun(
      `INSERT INTO generations (user_id, type, input, output, tokens_used, cost) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        generationData.userId,
        generationData.type,
        JSON.stringify(generationData.input),
        generationData.output,
        generationData.tokensUsed,
        generationData.cost
      ]
    );
  },

  async getHistory(userId: number, page: number = 1, limit: number = 10): Promise<any[]> {
    const offset = (page - 1) * limit;
    const generations = await dbAll(
      'SELECT * FROM generations WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [userId, limit, offset]
    );
    return generations;
  }
};

export { db, dbRun, dbGet, dbAll };
