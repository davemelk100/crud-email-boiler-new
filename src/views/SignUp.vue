<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "@/stores/authStore";

const auth = useAuthStore();

const email = ref("");
const password = ref("");
const error = ref("");
const success = ref(false);

async function handleSubmit() {
  error.value = "";
  try {
    await auth.signUp(email.value, password.value);
    success.value = true;
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : "Sign up failed";
  }
}
</script>

<template>
  <div>
    <h1>Sign Up</h1>

    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="success" class="success">Check your email to confirm your account.</p>

    <form v-if="!success" @submit.prevent="handleSubmit" class="form">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" minlength="8" required />
      <button type="submit">Sign Up</button>
    </form>

    <p><router-link to="/signin">Already have an account? Sign In</router-link></p>
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
.form button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background: #1a1a1a;
  color: #fff;
  cursor: pointer;
  font: inherit;
}
.error {
  color: #d32f2f;
}
.success {
  color: #2e7d32;
}

@media (max-width: 640px) {
  .form {
    max-width: 100%;
  }
}
</style>
