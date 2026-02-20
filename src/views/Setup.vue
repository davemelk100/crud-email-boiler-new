<template>
  <div class="setup">
    <h1>Setup Guide</h1>
    <p class="subtitle">Everything you need to clone, configure, and deploy this project.</p>

    <section>
      <h2>Prerequisites</h2>
      <table>
        <thead>
          <tr><th>Tool</th><th>Install</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>Node.js</strong> LTS (&gt;=18)</td><td><a href="https://nodejs.org" target="_blank">nodejs.org</a></td></tr>
          <tr><td><strong>Git</strong></td><td><a href="https://git-scm.com" target="_blank">git-scm.com</a></td></tr>
          <tr><td><strong>Supabase CLI</strong></td><td><code>brew install supabase/tap/supabase</code> or <code>npm install -g supabase</code></td></tr>
          <tr><td><strong>Netlify CLI</strong></td><td><code>npm install -g netlify-cli</code></td></tr>
        </tbody>
      </table>
      <p>Verify everything is installed:</p>
      <pre><code>node -v
git --version
supabase --version
netlify --version</code></pre>
    </section>

    <section>
      <h2>Project Structure</h2>
      <pre><code>/
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
        index.ts</code></pre>
    </section>

    <section>
      <h2>Quick Start</h2>
      <pre><code>git clone &lt;your-repo-url&gt;
cd crud-email-boiler
npm install
npm run dev</code></pre>
      <p>The Vite dev server starts at <strong>http://localhost:5173</strong> (or the next available port).</p>
    </section>

    <section>
      <h2>Local Development (Full Stack)</h2>

      <h3>1. Clone &amp; install</h3>
      <pre><code>git clone &lt;your-repo-url&gt;
cd crud-email-boiler
npm install</code></pre>

      <h3>2. Environment variables</h3>
      <pre><code>cp .env.example .env</code></pre>
      <p>Fill in your Supabase project values:</p>
      <pre><code>VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=&lt;your-local-anon-key&gt;
VITE_SUPABASE_GRAPHQL_URL=http://localhost:54321/graphql/v1</code></pre>

      <h3>3. Initialize Supabase</h3>
      <pre><code>supabase init</code></pre>

      <h3>4. Start local Supabase</h3>
      <pre><code>supabase start</code></pre>
      <p>This prints your local <code>anon key</code> and <code>API URL</code> — copy them into <code>.env</code>.</p>

      <h3>5. Apply database migrations</h3>
      <pre><code>supabase db push</code></pre>
      <p>This creates the <code>chat_threads</code> and <code>chat_messages</code> tables with RLS policies.</p>

      <h3>6. Serve Edge Functions locally</h3>
      <pre><code>supabase functions serve --no-verify-jwt</code></pre>
      <p>For Resend (contact form) to work locally:</p>
      <pre><code>supabase secrets set RESEND_API_KEY=your_key
supabase secrets set CONTACT_TO_EMAIL=you@example.com
supabase secrets set CONTACT_FROM_EMAIL=noreply@example.com</code></pre>
      <p>For the AI chat to work locally:</p>
      <pre><code>supabase secrets set AI_PROVIDER=openai
supabase secrets set AI_MODEL=gpt-4o
supabase secrets set OPENAI_API_KEY=your_key</code></pre>
      <p>Or for Anthropic:</p>
      <pre><code>supabase secrets set AI_PROVIDER=anthropic
supabase secrets set AI_MODEL=claude-sonnet-4-20250514
supabase secrets set ANTHROPIC_API_KEY=your_key</code></pre>

      <h3>7. Run frontend</h3>
      <pre><code>npm run dev</code></pre>
      <p>Open <strong>http://localhost:5173</strong></p>
    </section>

    <section>
      <h2>Environment Variables</h2>

      <h3>Frontend (.env)</h3>
      <table>
        <thead>
          <tr><th>Variable</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>VITE_SUPABASE_URL</code></td><td>Supabase project URL</td></tr>
          <tr><td><code>VITE_SUPABASE_ANON_KEY</code></td><td>Supabase anon/public key</td></tr>
          <tr><td><code>VITE_SUPABASE_GRAPHQL_URL</code></td><td>Supabase GraphQL endpoint</td></tr>
        </tbody>
      </table>

      <h3>Supabase Edge Function Secrets</h3>
      <p><strong>Contact function:</strong></p>
      <pre><code>supabase secrets set RESEND_API_KEY=...
supabase secrets set CONTACT_TO_EMAIL=...
supabase secrets set CONTACT_FROM_EMAIL=...</code></pre>
      <p><strong>Chat function:</strong></p>
      <pre><code>supabase secrets set AI_PROVIDER=openai        # or "anthropic"
supabase secrets set AI_MODEL=gpt-4o           # or "claude-sonnet-4-20250514"
supabase secrets set OPENAI_API_KEY=...        # if using OpenAI
supabase secrets set ANTHROPIC_API_KEY=...     # if using Anthropic</code></pre>
      <p><code>SUPABASE_URL</code> and <code>SUPABASE_SERVICE_ROLE_KEY</code> are auto-injected by Supabase.</p>
    </section>

    <section>
      <h2>Deploy</h2>

      <h3>1. Apply database migrations</h3>
      <pre><code>supabase db push</code></pre>

      <h3>2. Deploy Supabase Edge Functions</h3>
      <pre><code>supabase functions deploy contact
supabase functions deploy chat</code></pre>

      <h3>3. Set production secrets</h3>
      <pre><code># Contact function
supabase secrets set RESEND_API_KEY=...
supabase secrets set CONTACT_TO_EMAIL=...
supabase secrets set CONTACT_FROM_EMAIL=...

# Chat function
supabase secrets set AI_PROVIDER=openai
supabase secrets set AI_MODEL=gpt-4o
supabase secrets set OPENAI_API_KEY=...</code></pre>

      <h3>4. Deploy frontend to Netlify</h3>
      <p><strong>Option A — CLI:</strong></p>
      <pre><code>netlify login
netlify init        # first time
netlify deploy --prod</code></pre>
      <p><strong>Option B — GitHub auto-deploy:</strong></p>
      <ol>
        <li>Connect repo in Netlify dashboard</li>
        <li>Build command: <code>npm run build</code></li>
        <li>Publish directory: <code>dist</code></li>
        <li>Add <code>VITE_*</code> env vars in Netlify dashboard</li>
      </ol>
    </section>

    <section>
      <h2>Obtaining Keys &amp; IDs via CLI</h2>
      <p>Where possible, use the CLI to retrieve keys and IDs instead of hunting through dashboards.</p>

      <h3>Supabase (fully scriptable)</h3>
      <pre><code># List projects to get your project ref (ID)
supabase projects list

# Get anon key and service_role key
supabase projects api-keys --project-ref &lt;your-ref&gt;

# Local dev: get all keys at once
supabase status

# Output as env vars (copy-paste ready)
supabase status -o env

# With custom variable names for Vite
supabase status -o env \
  --override-name api.url=VITE_SUPABASE_URL \
  --override-name anon_key=VITE_SUPABASE_ANON_KEY</code></pre>
      <p>Your project URL is always <code>https://&lt;project-ref&gt;.supabase.co</code></p>

      <h3>Netlify (fully scriptable)</h3>
      <pre><code># Link your repo to a Netlify site
netlify link

# Get site ID, URL, admin URL
netlify status

# List, get, or set env vars
netlify env:list
netlify env:get VITE_SUPABASE_URL
netlify env:set VITE_SUPABASE_URL "https://xxx.supabase.co"

# Bulk import your entire .env file to Netlify
netlify env:import .env</code></pre>

      <h3>Resend (no official CLI)</h3>
      <p>Your first API key must be created at <a href="https://resend.com/api-keys" target="_blank">resend.com/api-keys</a>. Once you have one, you can list or create additional keys via the REST API:</p>
      <pre><code># List existing API keys
curl -s https://api.resend.com/api-keys \
  -H "Authorization: Bearer re_xxxxxxxxxx"

# Create a new API key
curl -s -X POST https://api.resend.com/api-keys \
  -H "Authorization: Bearer re_xxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{"name": "my-new-key"}'</code></pre>

      <h3>Google OAuth (dashboard only)</h3>
      <p>Standard OAuth 2.0 Client IDs for Google Sign-In <strong>cannot</strong> be created or retrieved via the <code>gcloud</code> CLI. You must use the <a href="https://console.cloud.google.com/apis/credentials" target="_blank">Google Cloud Console</a>:</p>
      <ol>
        <li>Create or select a project</li>
        <li>Configure the OAuth consent screen</li>
        <li>Create an OAuth 2.0 Client ID under Credentials</li>
        <li>Copy the Client ID and Client Secret into your Supabase Auth provider settings</li>
      </ol>

      <h3>GitHub OAuth (dashboard only)</h3>
      <p>OAuth App credentials <strong>cannot</strong> be managed via the <code>gh</code> CLI. Create your app at <a href="https://github.com/settings/developers" target="_blank">github.com/settings/developers</a> and copy the Client ID and Client Secret.</p>

      <h3>Recommended workflow</h3>
      <pre><code># 1. Get Supabase keys via CLI
supabase projects api-keys --project-ref &lt;ref&gt;

# 2. Manually add Google/GitHub/Resend keys to .env

# 3. Push everything to Netlify in one command
netlify env:import .env

# 4. Set Supabase Edge Function secrets
supabase secrets set RESEND_API_KEY=...
supabase secrets set CONTACT_TO_EMAIL=...
supabase secrets set CONTACT_FROM_EMAIL=...
supabase secrets set AI_PROVIDER=openai AI_MODEL=gpt-4o OPENAI_API_KEY=...</code></pre>

      <table>
        <thead>
          <tr><th>Service</th><th>CLI Retrievable</th><th>Dashboard Required</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>Supabase</strong></td><td>Project ref, URL, anon key, service role key</td><td>Auth provider config</td></tr>
          <tr><td><strong>Netlify</strong></td><td>Site ID, URL, env vars (read/write)</td><td>Custom domains</td></tr>
          <tr><td><strong>Resend</strong></td><td>API keys (after first key exists)</td><td>First API key, domain verification</td></tr>
          <tr><td><strong>Google</strong></td><td>None</td><td>OAuth Client ID &amp; Secret</td></tr>
          <tr><td><strong>GitHub</strong></td><td>None</td><td>OAuth App Client ID &amp; Secret</td></tr>
        </tbody>
      </table>
    </section>

    <section>
      <h2>Auth</h2>
      <p>Implemented in <code>src/services/auth/authService.ts</code>:</p>
      <ul>
        <li><code>signUpWithEmailPassword</code></li>
        <li><code>signInWithEmailPassword</code></li>
        <li><code>signInWithMagicLink</code></li>
        <li><code>resetPassword</code></li>
        <li><code>signOut</code></li>
        <li><code>getSession</code></li>
        <li><code>onAuthStateChange</code></li>
        <li><code>signInWithOAuth(provider)</code> — supports <code>google</code>, <code>github</code>, <code>apple</code>, <code>azure</code></li>
      </ul>
      <p>Protected routes use the <code>authGuard</code> in <code>src/routes/guards.ts</code>.</p>
    </section>

    <section>
      <h2>GraphQL</h2>
      <p><code>src/services/api/graphqlClient.ts</code> provides a fetch-based GraphQL client that:</p>
      <ul>
        <li>Reads the endpoint from <code>VITE_SUPABASE_GRAPHQL_URL</code></li>
        <li>Attaches <code>Authorization</code> header from the current session</li>
        <li>Includes example query and mutation</li>
      </ul>
    </section>

    <section>
      <h2>Contact Edge Function</h2>
      <p><code>supabase/functions/contact/index.ts</code>:</p>
      <ul>
        <li>Deno runtime</li>
        <li>POST only, CORS handled</li>
        <li>Validates <code>name</code>, <code>email</code>, <code>subject</code>, <code>message</code></li>
        <li>Honeypot field check</li>
        <li>In-memory rate limiting (5 req/min per IP)</li>
        <li>HTML escaping</li>
        <li>Sends via Resend</li>
        <li>Returns <code>{ ok: true }</code> on success</li>
      </ul>
    </section>

    <section>
      <h2>AI Chat</h2>
      <p>Auth-gated chat agent with streaming responses and persistent conversation threads.</p>

      <h3>Architecture</h3>
      <ul>
        <li><strong>Database</strong>: <code>chat_threads</code> and <code>chat_messages</code> tables with RLS (users only access their own data)</li>
        <li><strong>Edge Function</strong> (<code>supabase/functions/chat/index.ts</code>): JWT-authenticated proxy to AI providers, streams responses as SSE</li>
        <li><strong>Service</strong> (<code>src/services/chat/chatService.ts</code>): Frontend layer for thread/message CRUD and SSE stream parsing</li>
        <li><strong>Store</strong> (<code>src/stores/chatStore.ts</code>): Pinia store with optimistic UI and streaming state</li>
        <li><strong>View</strong> (<code>src/views/Chat.vue</code>): Threaded chat UI with sidebar, accessible at <code>/chat</code> (auth-required)</li>
      </ul>

      <h3>Multi-Provider Support</h3>
      <p>Set <code>AI_PROVIDER</code> to switch between providers:</p>
      <table>
        <thead>
          <tr><th>Provider</th><th><code>AI_PROVIDER</code></th><th>Default Model</th><th>API Key Secret</th></tr>
        </thead>
        <tbody>
          <tr><td>OpenAI</td><td><code>openai</code></td><td><code>gpt-4o</code></td><td><code>OPENAI_API_KEY</code></td></tr>
          <tr><td>Anthropic</td><td><code>anthropic</code></td><td><code>claude-sonnet-4-20250514</code></td><td><code>ANTHROPIC_API_KEY</code></td></tr>
        </tbody>
      </table>

      <h3>Features</h3>
      <ul>
        <li>Streaming responses with real-time SSE</li>
        <li>Persistent conversation threads in Supabase</li>
        <li>Thread sidebar with create/delete/switch</li>
        <li>Optimistic UI (user messages appear instantly)</li>
        <li>Mobile-responsive layout with slide-over sidebar</li>
        <li>Rate limiting (20 req/min per IP)</li>
        <li>Last 50 messages used as AI context per thread</li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.setup {
  line-height: 1.7;
}
.subtitle {
  font-size: 1.1rem;
  color: #555;
  margin: 0.5rem 0 2rem;
}
section {
  margin-bottom: 2.5rem;
}
h2 {
  margin-bottom: 0.5rem;
}
h3 {
  margin: 1.25rem 0 0.4rem;
  font-size: 1rem;
}
ul, ol {
  padding-left: 1.25rem;
}
li {
  margin-bottom: 0.35rem;
}
code {
  background: #eee;
  padding: 0.1rem 0.3rem;
  border-radius: 3px;
  font-size: 0.9em;
}
pre {
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 0.75rem 1rem;
  overflow-x: auto;
  margin: 0.5rem 0;
}
pre code {
  background: none;
  padding: 0;
  font-size: 0.85em;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin: 0.5rem 0;
}
th, td {
  text-align: left;
  padding: 0.4rem 0.75rem;
  border: 1px solid #e0e0e0;
}
th {
  background: #f5f5f5;
  font-weight: 600;
}
a {
  color: #1a1a1a;
  font-weight: 600;
}
</style>
