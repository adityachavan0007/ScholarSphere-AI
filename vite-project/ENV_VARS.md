# Environment Variables Guide

This document outlines all required environment variables for the ScholarSphere AI project. All variables have been standardized to use the `NEXT_PUBLIC_` prefix for client-side accessibility where appropriate, enabling seamless integration between the Vite frontend and Next.js backend.

## Public Variables
These variables are safe to be exposed to the browser/client-side code.

*   `NEXT_PUBLIC_SUPABASE_URL`: The URL of your Supabase project instance. Used by both the frontend and backend to connect to the database.
*   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: The anonymous, publicly safe API key for Supabase. Used by the frontend client to perform basic, row-level-security protected operations.
*   `NEXT_PUBLIC_APP_URL`: The base URL of the frontend application (e.g., `http://localhost:5173` in development or `https://your-domain.com` in production). Used to configure CORS policies securely.

## Secret Variables (Server-Side Only)
These variables **MUST NOT** be exposed to the client. They are only used in the Next.js API routes (`/api/*`) and backend logic.

*   `SUPABASE_SERVICE_ROLE_KEY`: The master key for Supabase that bypasses Row Level Security (RLS). Used exclusively on the backend for administrative operations.
*   `GOOGLE_GENERATIVE_AI_API_KEY`: Your API key for Google Gemini. Used by the backend to power the AI Copilot features.
*   `OPENROUTER_API_KEY`: (Optional) Your OpenRouter or OpenAI API key. Serves as a fallback or alternative AI model provider in specific backend routes.

## Local Setup Instructions
1. Copy `.env.example` to a new file named `.env.local` (which is git-ignored).
2. Fill in the placeholders with your actual API keys.
3. Restart both the frontend and backend servers (`npm run dev:all`) to ensure the variables are loaded.
