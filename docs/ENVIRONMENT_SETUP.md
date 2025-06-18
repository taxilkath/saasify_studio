# Environment Variables Setup Guide

This guide will help you set up all the necessary environment variables for SaaSify Studio.

## Quick Start

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your actual values in `.env.local`

3. Never commit `.env.local` to version control (it's already in `.gitignore`)

## Required Services Setup

### 1. Database (PostgreSQL)

You have several options for PostgreSQL:

#### Option A: Local PostgreSQL
```bash
# Install PostgreSQL locally
# macOS with Homebrew:
brew install postgresql
brew services start postgresql

# Create database
createdb saasifydb

# Your DATABASE_URL:
DATABASE_URL="postgresql://username:password@localhost:5432/saasifydb?schema=public"
```

#### Option B: Neon (Recommended for development)
1. Go to [Neon](https://neon.tech/)
2. Create a free account
3. Create a new project
4. Copy the connection string to `DATABASE_URL`

#### Option C: Supabase
1. Go to [Supabase](https://supabase.com/)
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string to `DATABASE_URL`

#### Option D: Docker (using docker-compose.yml)
```bash
# Start the database
docker-compose up db -d

# Your DATABASE_URL:
DATABASE_URL="postgresql://user:password@localhost:5432/saasifydb?schema=public"
```

### 2. Authentication (Clerk)

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application
3. Choose your authentication methods (email/password recommended)
4. Copy the API keys:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (starts with `pk_`)
   - `CLERK_SECRET_KEY` (starts with `sk_`)

### 3. AI Services (OpenAI)

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an account and add billing information
3. Go to [API Keys](https://platform.openai.com/api-keys)
4. Create a new API key
5. Copy the key to `OPENAI_API_KEY`

**Note:** The `gpt-4o-mini` model is cost-effective for development. You can change this in production.

### 4. Supabase (Optional)

If you want to use Supabase features:

1. Go to [Supabase](https://app.supabase.com/)
2. Create a new project
3. Go to Settings > API
4. Copy:
   - Project URL to `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key to `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` `secret` key to `SUPABASE_SERVICE_ROLE_KEY`

## Environment Variables Reference

### Database
- `DATABASE_URL`: PostgreSQL connection string for Prisma

### Authentication (Clerk)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Public key for client-side Clerk
- `CLERK_SECRET_KEY`: Secret key for server-side Clerk
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL`: Sign-in page URL
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL`: Sign-up page URL
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL`: Redirect after sign-in
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL`: Redirect after sign-up

### AI Services
- `OPENAI_API_KEY`: OpenAI API key for blueprint generation
- `OPENAI_MODEL`: AI model to use (default: gpt-4o-mini)

### Supabase (Optional)
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key

### Development
- `NODE_ENV`: Environment (development/production)
- `NEXT_PUBLIC_APP_URL`: Your app's URL

## After Setting Up Environment Variables

1. **Initialize the database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Verify everything works:**
   - Visit `http://localhost:3000`
   - Try signing up/signing in
   - Create a test project to verify AI integration

## Production Deployment

For production (Vercel, Netlify, etc.):

1. Set the same environment variables in your deployment platform
2. Update `NEXT_PUBLIC_APP_URL` to your production domain
3. Use production database URLs
4. Consider using production-grade AI models

## Troubleshooting

### Database Issues
- Ensure PostgreSQL is running
- Check connection string format
- Verify database exists
- Run `npx prisma db push` to sync schema

### Authentication Issues
- Verify Clerk keys are correct
- Check that redirect URLs match your setup
- Ensure you're using the right environment (development/production)

### AI Issues
- Verify OpenAI API key is valid
- Check you have sufficient credits
- Ensure the model name is correct

### General Issues
- Restart the development server after changing environment variables
- Check the browser console and server logs for errors
- Verify all required environment variables are set