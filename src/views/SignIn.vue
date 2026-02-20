<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";
import { authService, type OAuthProvider } from "@/services/auth/authService";

const auth = useAuthStore();
const router = useRouter();

const email = ref("");
const password = ref("");
const error = ref("");
const magicLinkSent = ref(false);

async function handleSubmit() {
  error.value = "";
  try {
    await auth.signIn(email.value, password.value);
    router.push({ name: "Dashboard" });
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : "Sign in failed";
  }
}

async function handleMagicLink() {
  error.value = "";
  try {
    await auth.signInMagicLink(email.value);
    magicLinkSent.value = true;
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : "Magic link failed";
  }
}

function handleOAuth(provider: OAuthProvider) {
  authService.signInWithOAuth(provider);
}
</script>

<template>
  <div>
    <h1>Sign In</h1>

    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="magicLinkSent" class="success">Check your email for the magic link.</p>

    <form @submit.prevent="handleSubmit" class="form">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Sign In</button>
    </form>

    <div class="alt-actions">
      <button class="link-btn" @click="handleMagicLink" :disabled="!email">
        Send Magic Link
      </button>
      <router-link to="/forgot-password">Forgot Password?</router-link>
      <router-link to="/signup">Create Account</router-link>
    </div>

    <hr />

    <div class="oauth">
      <button @click="handleOAuth('google')">Google</button>
      <button @click="handleOAuth('github')">GitHub</button>
      <button @click="handleOAuth('apple')">Apple</button>
      <button @click="handleOAuth('azure')">Azure</button>
    </div>
  </div>
</template>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin: 1rem 0;
  max-width: 360px;
}
.form input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font: inherit;
}
.form button,
.oauth button {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #1a1a1a;
  color: #fff;
  cursor: pointer;
  font: inherit;
}
.alt-actions {
  display: flex;
  gap: 1rem;
  margin: 0.5rem 0 1rem;
}
.alt-actions a {
  color: #555;
}
.link-btn {
  background: none;
  border: none;
  color: #555;
  cursor: pointer;
  font: inherit;
  padding: 0;
  text-decoration: underline;
}
.oauth {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}
.oauth button {
  background: #fff;
  color: #1a1a1a;
}

@media (max-width: 640px) {
  .form {
    max-width: 100%;
  }
  .alt-actions {
    flex-wrap: wrap;
  }
  .oauth {
    flex-wrap: wrap;
  }
}
.error {
  color: #d32f2f;
}
.success {
  color: #2e7d32;
}
hr {
  border: none;
  border-top: 1px solid #e5e5e5;
  margin: 1rem 0;
}
</style>
