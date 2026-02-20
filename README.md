# CRUD Email Boiler

Production-ready scaffold: **Vue 3 + Vite + TypeScript + Pinia + Vue Router** SPA deployed statically to **Netlify**, with **Supabase** (Auth, Postgres, RLS, Edge Functions) as the only backend. Email sent via **Resend** from a Supabase Edge Function.

---

## Prerequisites

| Tool | Install |
|------|---------|
| **Node.js** LTS (>=18) | [nodejs.org](https://nodejs.org) |
| **Git** | [git-scm.com](https://git-scm.com) |
| **Supabase CLI** | `brew install supabase/tap/supabase` or `npm install -g supabase` |
| **Netlify CLI** | `npm install -g netlify-cli` |

Verify:

```bash
node -v
git --version
supabase --version
netlify --version
```

---

## Project Structure

```
/
  README.md
  netlify.toml
  package.json
  vite.config.ts
  tsconfig.json
  .env.example
  index.html
  src/
    main.ts
    App.vue
    env.d.ts
    app/bootstrap.ts
    routes/
      index.ts
      guards.ts
    stores/
      authStore.ts
      chatStore.ts
    services/
      config/env.ts
      auth/supabaseClient.ts
      auth/authService.ts
      chat/chatService.ts
      api/graphqlClient.ts
    components/AppNav.vue
    views/
      Home.vue
      Dashboard.vue
      Chat.vue
      Contact.vue
      SignIn.vue
      SignUp.vue
      ForgotPassword.vue
      Setup.vue
  supabase/
    migrations/
      20260219000000_create_chat_tables.sql
    functions/
      contact/
        index.ts
      chat/
        index.ts
```

---

## Quick Start

```bash
git clone <your-repo-url>
cd crud-email-boiler
npm install
npm run dev
```

The Vite dev server will start at **http://localhost:5173** (or the next available port if 5173 is in use).

---

## Local Development (Full Stack)

### 1. Clone & install

```bash
git clone <your-repo-url>
cd crud-email-boiler
npm install
```

### 2. Environment variables

```bash
cp .env.example .env
```

Fill in your Supabase project values:

```
VITE_SUPABASE_URL=http://localhost:54321   # local Supabase
VITE_SUPABASE_ANON_KEY=<your-local-anon-key>
VITE_SUPABASE_GRAPHQL_URL=http://localhost:54321/graphql/v1
```

### 3. Initialize Supabase

```bash
supabase init
```

### 4. Start local Supabase

```bash
supabase start
```

This prints your local `anon key` and `API URL` — copy them into `.env`.

### 5. Apply database migrations

```bash
supabase db push
```

This creates the `chat_threads` and `chat_messages` tables with RLS policies.

### 6. Serve Edge Functions locally

```bash
supabase functions serve --no-verify-jwt
```

For Resend (contact form) to work locally, set env vars:

```bash
supabase secrets set RESEND_API_KEY=your_key
supabase secrets set CONTACT_TO_EMAIL=you@example.com
supabase secrets set CONTACT_FROM_EMAIL=noreply@example.com
```

For the AI chat to work locally, set your provider keys:

```bash
supabase secrets set AI_PROVIDER=openai
supabase secrets set AI_MODEL=gpt-4o
supabase secrets set OPENAI_API_KEY=your_key
```

Or for Anthropic:

```bash
supabase secrets set AI_PROVIDER=anthropic
supabase secrets set AI_MODEL=claude-sonnet-4-20250514
supabase secrets set ANTHROPIC_API_KEY=your_key
```

### 7. Run frontend

```bash
npm run dev
```

Open http://localhost:5173

---

## Environment Variables

### Frontend (.env)

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `VITE_SUPABASE_GRAPHQL_URL` | Supabase GraphQL endpoint |

### Supabase Edge Function Secrets

**Contact function:**

```bash
supabase secrets set RESEND_API_KEY=...
supabase secrets set CONTACT_TO_EMAIL=...
supabase secrets set CONTACT_FROM_EMAIL=...
```

**Chat function:**

```bash
supabase secrets set AI_PROVIDER=openai        # or "anthropic"
supabase secrets set AI_MODEL=gpt-4o           # or "claude-sonnet-4-20250514"
supabase secrets set OPENAI_API_KEY=...        # if using OpenAI
supabase secrets set ANTHROPIC_API_KEY=...     # if using Anthropic
```

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are auto-injected by Supabase.

---

## Deploy

### 1. Apply database migrations

```bash
supabase db push
```

### 2. Deploy Supabase Edge Functions

```bash
supabase functions deploy contact
supabase functions deploy chat
```

### 3. Set production secrets

```bash
# Contact function
supabase secrets set RESEND_API_KEY=...
supabase secrets set CONTACT_TO_EMAIL=...
supabase secrets set CONTACT_FROM_EMAIL=...

# Chat function
supabase secrets set AI_PROVIDER=openai
supabase secrets set AI_MODEL=gpt-4o
supabase secrets set OPENAI_API_KEY=...
```

### 4. Deploy frontend to Netlify

**Option A — CLI:**

```bash
netlify login
netlify init        # first time
netlify deploy --prod
```

**Option B — GitHub auto-deploy:**

1. Connect repo in Netlify dashboard
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add `VITE_*` env vars in Netlify dashboard

---

## Obtaining Keys & IDs via CLI

Where possible, use the CLI to retrieve keys and IDs instead of hunting through dashboards.

### Supabase (fully scriptable)

```bash
# List projects to get your project ref (ID)
supabase projects list

# Get anon key and service_role key
supabase projects api-keys --project-ref <your-ref>

# Local dev: get all keys at once
supabase status

# Output as env vars (copy-paste ready)
supabase status -o env

# With custom variable names for Vite
supabase status -o env \
  --override-name api.url=VITE_SUPABASE_URL \
  --override-name anon_key=VITE_SUPABASE_ANON_KEY
```

Your project URL is always `https://<project-ref>.supabase.co`

### Netlify (fully scriptable)

```bash
# Link your repo to a Netlify site
netlify link

# Get site ID, URL, admin URL
netlify status

# List, get, or set env vars
netlify env:list
netlify env:get VITE_SUPABASE_URL
netlify env:set VITE_SUPABASE_URL "https://xxx.supabase.co"

# Bulk import your entire .env file to Netlify
netlify env:import .env
```

### Resend (no official CLI)

Your first API key must be created at [resend.com/api-keys](https://resend.com/api-keys). Once you have one, you can list or create additional keys via the REST API:

```bash
# List existing API keys
curl -s https://api.resend.com/api-keys \
  -H "Authorization: Bearer re_xxxxxxxxxx"

# Create a new API key
curl -s -X POST https://api.resend.com/api-keys \
  -H "Authorization: Bearer re_xxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{"name": "my-new-key"}'
```

### Google OAuth (dashboard only)

Standard OAuth 2.0 Client IDs for Google Sign-In **cannot** be created or retrieved via the `gcloud` CLI. You must use the [Google Cloud Console](https://console.cloud.google.com/apis/credentials):

1. Create or select a project
2. Configure the OAuth consent screen
3. Create an OAuth 2.0 Client ID under Credentials
4. Copy the Client ID and Client Secret into your Supabase Auth provider settings

### GitHub OAuth (dashboard only)

OAuth App credentials **cannot** be managed via the `gh` CLI. Create your app at [github.com/settings/developers](https://github.com/settings/developers) and copy the Client ID and Client Secret.

### Recommended workflow

```bash
# 1. Get Supabase keys via CLI
supabase projects api-keys --project-ref <ref>

# 2. Manually add Google/GitHub/Resend keys to .env

# 3. Push everything to Netlify in one command
netlify env:import .env

# 4. Set Supabase Edge Function secrets
supabase secrets set RESEND_API_KEY=...
supabase secrets set CONTACT_TO_EMAIL=...
supabase secrets set CONTACT_FROM_EMAIL=...
supabase secrets set AI_PROVIDER=openai AI_MODEL=gpt-4o OPENAI_API_KEY=...
```

### Summary

| Service | CLI Retrievable | Dashboard Required |
|---------|----------------|-------------------|
| **Supabase** | Project ref, URL, anon key, service role key | Auth provider config |
| **Netlify** | Site ID, URL, env vars (read/write) | Custom domains |
| **Resend** | API keys (after first key exists) | First API key, domain verification |
| **Google** | None | OAuth Client ID & Secret |
| **GitHub** | None | OAuth App Client ID & Secret |

---

## Auth

Implemented in `src/services/auth/authService.ts`:

- `signUpWithEmailPassword`
- `signInWithEmailPassword`
- `signInWithMagicLink`
- `resetPassword`
- `signOut`
- `getSession`
- `onAuthStateChange`
- `signInWithOAuth(provider)` — supports `google`, `github`, `apple`, `azure`

Protected routes use the `authGuard` in `src/routes/guards.ts`.

---

## GraphQL

`src/services/api/graphqlClient.ts` provides a fetch-based GraphQL client that:

- Reads the endpoint from `VITE_SUPABASE_GRAPHQL_URL`
- Attaches `Authorization` header from the current session
- Includes example query and mutation

---

## Contact Edge Function

`supabase/functions/contact/index.ts`:

- Deno runtime
- POST only, CORS handled
- Validates `name`, `email`, `subject`, `message`
- Honeypot field check
- In-memory rate limiting (5 req/min per IP)
- HTML escaping
- Sends via Resend `v3/mail/send`
- Returns `{ ok: true }` on success

---

## AI Chat

Auth-gated chat agent with streaming responses and persistent conversation threads.

### Architecture

- **Database**: `chat_threads` and `chat_messages` tables with RLS (users only access their own data)
- **Edge Function** (`supabase/functions/chat/index.ts`): JWT-authenticated proxy to AI providers, streams responses as SSE
- **Service** (`src/services/chat/chatService.ts`): Frontend layer for thread/message CRUD and SSE stream parsing
- **Store** (`src/stores/chatStore.ts`): Pinia store with optimistic UI and streaming state
- **View** (`src/views/Chat.vue`): Threaded chat UI with sidebar, accessible at `/chat` (auth-required)

### Multi-Provider Support

Set `AI_PROVIDER` to switch between providers:

| Provider | `AI_PROVIDER` | `AI_MODEL` (default) | API Key Secret |
|----------|---------------|----------------------|----------------|
| OpenAI | `openai` | `gpt-4o` | `OPENAI_API_KEY` |
| Anthropic | `anthropic` | `claude-sonnet-4-20250514` | `ANTHROPIC_API_KEY` |

### Features

- Streaming responses with real-time SSE
- Persistent conversation threads in Supabase
- Thread sidebar with create/delete/switch
- Optimistic UI (user messages appear instantly)
- Mobile-responsive layout with slide-over sidebar
- Rate limiting (20 req/min per IP)
- Last 50 messages used as AI context per thread
