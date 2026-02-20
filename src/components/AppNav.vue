<script setup lang="ts">
import { computed } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();

const userInitial = computed(() => {
  const email = auth.user?.email;
  return email ? email.charAt(0).toUpperCase() : "?";
});

const userEmail = computed(() => auth.user?.email ?? "");

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
        <router-link to="/setup">Readme</router-link>
        <router-link to="/contact">Contact</router-link>

        <router-link to="/chat">Chat</router-link>
        <router-link to="/reports">Reports</router-link>
        <template v-if="auth.isAuthenticated">
          <router-link to="/dashboard">Dashboard</router-link>
        </template>

        <div class="right-links">
          <template v-if="auth.isAuthenticated">
            <span class="avatar" :title="userEmail">{{ userInitial }}</span>
            <button class="link-btn" @click="handleSignOut">Sign Out</button>
          </template>
          <template v-else>
            <router-link to="/signin">Sign In</router-link>
          </template>
        </div>
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
  flex: 1;
  gap: 1rem;
  align-items: center;
  margin-left: 1.5rem;
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
.right-links {
  margin-left: auto;
  display: flex;
  gap: 0.75rem;
  align-items: center;
}
.icon-link {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}
.icon-label {
  font-size: 0.85rem;
}
.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #1a1a1a;
  color: #fff;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: default;
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
    justify-content: space-evenly;
    font-size: 0.85rem;
    margin-left: 0;
    gap: 0;
  }
  .right-links {
    margin-left: 0;
    gap: 0;
    justify-content: space-evenly;
  }
  .icon-link svg {
    display: none;
  }
}
</style>
