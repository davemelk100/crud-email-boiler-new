<script setup lang="ts">
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();

async function handleSignOut() {
  await auth.signOut();
  router.push({ name: "Home" });
}
</script>

<template>
  <nav class="nav">
    <div class="nav-inner">
      <router-link to="/" class="brand">CrudEmail</router-link>

      <div class="links">
        <router-link to="/">Home</router-link>
        <router-link to="/contact">Contact</router-link>

        <template v-if="auth.isAuthenticated">
          <router-link to="/dashboard">Dashboard</router-link>
          <button class="link-btn" @click="handleSignOut">Sign Out</button>
        </template>
        <template v-else>
          <router-link to="/signin">Sign In</router-link>
          <router-link to="/signup">Sign Up</router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.nav {
  background: #fff;
  border-bottom: 1px solid #e5e5e5;
  padding: 0.75rem 1rem;
}
.nav-inner {
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.brand {
  font-weight: 700;
  font-size: 1.1rem;
  text-decoration: none;
  color: #1a1a1a;
}
.links {
  display: flex;
  gap: 1rem;
  align-items: center;
}
.links a {
  text-decoration: none;
  color: #555;
}
.links a:hover,
.links a.router-link-active {
  color: #1a1a1a;
}
.link-btn {
  background: none;
  border: none;
  color: #555;
  cursor: pointer;
  font: inherit;
  padding: 0;
}
.link-btn:hover {
  color: #1a1a1a;
}

@media (max-width: 640px) {
  .nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    top: auto;
    border-bottom: none;
    border-top: 1px solid #e5e5e5;
    padding: 0.5rem 0.75rem;
    z-index: 100;
    box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.06);
  }
  .brand {
    display: none;
  }
  .nav-inner {
    justify-content: center;
  }
  .links {
    gap: 1.25rem;
    font-size: 0.85rem;
  }
}
</style>
