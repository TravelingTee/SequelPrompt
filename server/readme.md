# Sequel Prompt Backend API

A complete backend API server for the Sequel Prompt application with authentication, billing, and secure OpenAI integration.

## Features

- 🔐 **JWT Authentication** - Secure user registration and login
- 💳 **Stripe Integration** - Subscription billing and payment processing
- 🤖 **OpenAI Integration** - Secure API key management and generation
- 📊 **Usage Tracking** - Monitor generations and enforce limits
- 🛡️ **Security** - Rate limiting, CORS, helmet protection
- 📈 **Scalable** - SQLite database with proper indexing

## Quick Start

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
```

Edit `.env` with your actual values:
- `JWT_SECRET` - A secure random string for JWT signing
- `OPENAI_API_KEY` - Your OpenAI API key
- `STRIPE_SECRET_KEY` - Your Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Your Stripe webhook secret

### 3. Start Development Server
```bash
npm run dev
```

The API will be available at `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Generation
- `POST /api/generation/single` - Generate single prompt
- `POST /api/generation/agentic` - Generate agentic workflow
- `GET /api/generation/history` - Get user's generation history

### Billing
- `POST /api/billing/create-checkout-session` - Create Stripe checkout
- `POST /api/billing/create-portal-session` - Create billing portal

## Database Schema

### User Model
- Email, password, name
- Plan (free, pro, enterprise)
- Generation usage tracking
- Daily limits and reset logic

### Generation Model
- User reference
- Generation type (single/agentic)
- Input parameters
- Generated output
- Token usage and cost tracking

## Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Protection**: Configurable allowed origins
- **Helmet**: Security headers
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Express-validator for all inputs
- **Password Hashing**: bcrypt with salt rounds

## Deployment

### Production Environment Variables
```bash
NODE_ENV=production
PORT=3001
JWT_SECRET=your-super-secure-jwt-secret
OPENAI_API_KEY=your-openai-key
STRIPE_SECRET_KEY=your-stripe-secret
STRIPE_WEBHOOK_SECRET=your-webhook-secret
CORS_ORIGINS=https://your-frontend-domain.com
```

### Build and Start
```bash
npm run build
npm start
```

## Development

### Available Scripts
- `npm run dev` - Development with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests

## Support

For issues or questions, please check the API documentation or create an issue in the repository.
