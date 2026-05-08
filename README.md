# MyFrenchJour

Learn French vocabulary with spaced repetition. 1,860 words, 9 verb tenses, flashcard quiz.

## Setup

### 1. Supabase database
Go to your Supabase SQL editor and run the contents of `supabase-schema.sql`.

### 2. Environment variables
The `.env` file is pre-filled with your Supabase credentials. For Netlify, add these as environment variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### 3. Deploy to Netlify
1. Push this repo to GitHub
2. Connect the repo to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add the environment variables
6. Deploy

### 4. Custom domain
Point `myfrenchjour.com` to your Netlify site via your domain registrar's DNS settings.

## Local development

```bash
npm install
npm run dev
```

## Tech stack
- React + Vite
- Supabase (auth + database)
- React Router
- SM-2 spaced repetition algorithm
- CSS Modules
