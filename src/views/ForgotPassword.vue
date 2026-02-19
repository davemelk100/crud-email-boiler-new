<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "@/stores/authStore";

const auth = useAuthStore();

const email = ref("");
const error = ref("");
const sent = ref(false);

async function handleSubmit() {
  error.value = "";
  try {
    await auth.forgotPassword(email.value);
    sent.value = true;
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : "Request failed";
  }
}
</script>

<template>
  <div>
    <h1>Forgot Password</h1>

    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="sent" class="success">Check your email for a reset link.</p>

    <form v-if="!sent" @submit.prevent="handleSubmit" class="form">
      <input v-model="email" type="email" placeholder="Email" required />
      <button type="submit">Send Reset Link</button>
    </form>

    <p><router-link to="/signin">Back to Sign In</router-link></p>
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
</style>
