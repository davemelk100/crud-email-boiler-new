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
      Setup.vue
  supabase/
    functions/
      contact/
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

      <h3>5. Serve Edge Function locally</h3>
      <pre><code>supabase functions serve contact --no-verify-jwt</code></pre>
      <p>For Resend to work locally, set these secrets:</p>
      <pre><code>supabase secrets set RESEND_API_KEY=your_key
supabase secrets set CONTACT_TO_EMAIL=you@example.com
supabase secrets set CONTACT_FROM_EMAIL=noreply@example.com</code></pre>

      <h3>6. Run frontend</h3>
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
      <p>Set via CLI:</p>
      <pre><code>supabase secrets set RESEND_API_KEY=...
supabase secrets set CONTACT_TO_EMAIL=...
supabase secrets set CONTACT_FROM_EMAIL=...</code></pre>
    </section>

    <section>
      <h2>Deploy</h2>

      <h3>1. Deploy Supabase Edge Function</h3>
      <pre><code>supabase functions deploy contact</code></pre>

      <h3>2. Set production secrets</h3>
      <pre><code>supabase secrets set RESEND_API_KEY=...
supabase secrets set CONTACT_TO_EMAIL=...
supabase secrets set CONTACT_FROM_EMAIL=...</code></pre>

      <h3>3. Deploy frontend to Netlify</h3>
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
