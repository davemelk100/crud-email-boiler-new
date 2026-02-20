<script setup lang="ts">
import { ref } from "vue";
import { env } from "@/services/config/env";
import { useAuthStore } from "@/stores/authStore";

const auth = useAuthStore();

const name = ref("");
const email = ref("");
const subject = ref("");
const message = ref("");
const honeypot = ref("");

const loading = ref(false);
const success = ref(false);
const error = ref("");

async function handleSubmit() {
  if (honeypot.value) return; // bot detected

  loading.value = true;
  error.value = "";
  success.value = false;

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "apikey": env.supabaseAnonKey,
      "Authorization": `Bearer ${auth.session?.access_token ?? env.supabaseAnonKey}`,
    };

    const res = await fetch(`${env.supabaseUrl}/functions/v1/contact`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: name.value,
        email: email.value,
        subject: subject.value,
        message: message.value,
      }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      throw new Error(body?.error || `Request failed (${res.status})`);
    }

    success.value = true;
    name.value = "";
    email.value = "";
    subject.value = "";
    message.value = "";
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : "Something went wrong";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div>
    <h1>Contact Us</h1>

    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="success" class="success">Message sent! We'll be in touch.</p>

    <form @submit.prevent="handleSubmit" class="form">
      <input v-model="name" type="text" placeholder="Name" required />
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="subject" type="text" placeholder="Subject" required />
      <textarea v-model="message" placeholder="Message" rows="5" required></textarea>

      <!-- honeypot -->
      <input
        v-model="honeypot"
        type="text"
        name="website"
        autocomplete="off"
        tabindex="-1"
        style="position: absolute; left: -9999px"
      />

      <button type="submit" :disabled="loading">
        {{ loading ? "Sending..." : "Send Message" }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.form {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin: 1rem 0;
  max-width: 480px;
}
.form input,
.form textarea {
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
.form button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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
