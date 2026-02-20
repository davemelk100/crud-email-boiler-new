<template>
  <div class="home">
    <h1>CRUD Email Boiler</h1>
    <p class="subtitle">A production-ready starter app for building authenticated web applications with a built-in contact form.</p>

    <section>
      <h2>What It Does</h2>
      <ul>
        <li>User authentication with email/password, magic links, and OAuth (Google, GitHub, Apple, Azure)</li>
        <li>Protected routes with automatic session management</li>
        <li>Contact form that sends emails via Resend, with rate limiting, honeypot spam protection, and input validation</li>
        <li>GraphQL client wired up and ready for your data layer</li>
      </ul>
    </section>

    <section>
      <h2>How It's Built</h2>
      <ul>
        <li><strong>Vue 3</strong> with Composition API and <code>&lt;script setup&gt;</code></li>
        <li><strong>TypeScript</strong> for type safety across the entire codebase</li>
        <li><strong>Vite</strong> for fast dev server and optimized production builds</li>
        <li><strong>Pinia</strong> for state management (auth store)</li>
        <li><strong>Vue Router</strong> with navigation guards for protected pages</li>
        <li><strong>Supabase</strong> for authentication, Postgres database, and serverless edge functions</li>
        <li><strong>Resend</strong> for transactional email delivery</li>
        <li><strong>Netlify</strong> for static site deployment</li>
      </ul>
    </section>

    <section>
      <h2>Get Started</h2>
      <p><router-link to="/signup">Create an account</router-link> to access the dashboard, or <router-link to="/contact">send a message</router-link> to try the contact form.</p>
    </section>
  </div>
</template>

<style scoped>
.home {
  line-height: 1.7;
}
.subtitle {
  font-size: 1.1rem;
  color: #555;
  margin: 0.5rem 0 2rem;
}
section {
  margin-bottom: 2rem;
}
h2 {
  margin-bottom: 0.5rem;
}
ul {
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
a {
  color: #1a1a1a;
  font-weight: 600;
}
</style>
