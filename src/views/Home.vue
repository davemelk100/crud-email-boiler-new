<template>
  <div class="home">
    <h1>CRUD Email Boiler</h1>
    <p class="subtitle">Ship authenticated apps fast. Auth, email, and a GraphQL-ready data layer — all wired up so you can focus on your product.</p>

    <section>
      <h2>What You Get</h2>
      <ul>
        <li>Email/password, magic link, and OAuth sign-in out of the box</li>
        <li>Protected routes with automatic session handling</li>
        <li>Contact form with Resend delivery, rate limiting, and spam protection</li>
        <li>GraphQL client ready for your data layer</li>
      </ul>
    </section>

    <section>
      <h2>Built With</h2>
      <ul>
        <li><strong>Vue 3</strong> + TypeScript + Vite</li>
        <li><strong>Pinia</strong> for state, <strong>Vue Router</strong> for navigation guards</li>
        <li><strong>Supabase</strong> for auth, Postgres, and edge functions</li>
        <li><strong>Resend</strong> for transactional email</li>
        <li><strong>Netlify</strong> for static deployment</li>
      </ul>
    </section>

    <section>
      <h2>Get Started</h2>
      <p>
        <router-link to="/signup">Create an account</router-link> to explore the dashboard,
        <router-link to="/contact">send a message</router-link> to try the contact form, or
        read the <router-link to="/setup">setup guide</router-link> to run it yourself.
      </p>
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
