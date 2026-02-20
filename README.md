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
    stores/authStore.ts
    services/
      config/env.ts
      auth/supabaseClient.ts
      auth/authService.ts
      api/graphqlClient.ts
    components/AppNav.vue
    views/
      Home.vue
      Dashboard.vue
      Contact.vue
      SignIn.vue
      SignUp.vue
      ForgotPassword.vue
  supabase/
    functions/
      contact/
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

### 5. Serve Edge Function locally

```bash
supabase functions serve contact --no-verify-jwt
```

For Resend to work locally, set env vars:

```bash
supabase secrets set RESEND_API_KEY=your_key
supabase secrets set CONTACT_TO_EMAIL=you@example.com
supabase secrets set CONTACT_FROM_EMAIL=noreply@example.com
```

### 6. Run frontend

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

Set via CLI:

```bash
supabase secrets set RESEND_API_KEY=...
supabase secrets set CONTACT_TO_EMAIL=...
supabase secrets set CONTACT_FROM_EMAIL=...
```

---

## Deploy

### 1. Deploy Supabase Edge Function

```bash
supabase functions deploy contact
```

### 2. Set production secrets

```bash
supabase secrets set RESEND_API_KEY=...
supabase secrets set CONTACT_TO_EMAIL=...
supabase secrets set CONTACT_FROM_EMAIL=...
```

### 3. Deploy frontend to Netlify

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
