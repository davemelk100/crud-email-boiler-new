<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();

const menuOpen = ref(false);
const mobileMenuRef = ref<HTMLElement | null>(null);
const desktopMenuRef = ref<HTMLElement | null>(null);

const userInitial = computed(() => {
  const email = auth.user?.email;
  return email ? email.charAt(0).toUpperCase() : "?";
});

const userEmail = computed(() => auth.user?.email ?? "");

function toggleMenu() {
  menuOpen.value = !menuOpen.value;
}

function closeMenu(e: MouseEvent) {
  const target = e.target as Node;
  const inMobile = mobileMenuRef.value?.contains(target);
  const inDesktop = desktopMenuRef.value?.contains(target);
  if (!inMobile && !inDesktop) {
    menuOpen.value = false;
  }
}

onMounted(() => document.addEventListener("click", closeMenu));
onUnmounted(() => document.removeEventListener("click", closeMenu));

async function handleSignOut() {
  menuOpen.value = false;
  await auth.signOut();
  router.push({ name: "Home" });
}
</script>

<template>
  <div class="mobile-top-bar">
    <router-link to="/" class="mobile-brand">CrudEmail</router-link>
    <div class="avatar-wrapper" ref="mobileMenuRef">
      <button class="avatar-trigger" :title="userEmail" @click="toggleMenu">
        <span class="avatar">{{ userInitial }}</span>
        <span class="caret">&#9662;</span>
      </button>
      <div v-if="menuOpen" class="avatar-menu">
        <template v-if="auth.isAuthenticated">
          <router-link to="/dashboard" @click="menuOpen = false">Dashboard</router-link>
          <button class="menu-btn" @click="handleSignOut">Sign Out</button>
        </template>
        <template v-else>
          <router-link to="/signin" @click="menuOpen = false">Sign In</router-link>
        </template>
      </div>
    </div>
  </div>

  <nav class="nav">
    <div class="nav-inner">
      <router-link to="/" class="brand">CrudEmail</router-link>

      <div class="links">
        <router-link to="/setup">README</router-link>

        <router-link to="/chat">Chat</router-link>
        <router-link to="/reports">Reports</router-link>
        <div class="right-links">
          <div class="avatar-wrapper desktop-avatar" ref="desktopMenuRef">
            <button class="avatar-trigger" :title="userEmail" @click="toggleMenu">
        <span class="avatar">{{ userInitial }}</span>
        <span class="caret">&#9662;</span>
      </button>
            <div v-if="menuOpen" class="avatar-menu">
              <template v-if="auth.isAuthenticated">
                <router-link to="/dashboard" @click="menuOpen = false">Dashboard</router-link>
                <button class="menu-btn" @click="handleSignOut">Sign Out</button>
              </template>
              <template v-else>
                <router-link to="/signin" @click="menuOpen = false">Sign In</router-link>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.mobile-top-bar {
  display: none;
}
.mobile-brand {
  font-weight: 700;
  font-size: 1.1rem;
  text-decoration: none;
  color: #1a1a1a;
}

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
.avatar-wrapper {
  position: relative;
}
.avatar-trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-family: inherit;
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
}
.caret {
  font-size: 2rem;
  line-height: 1;
  color: #555;
}
.avatar-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 140px;
  z-index: 200;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.avatar-menu a,
.avatar-menu .menu-btn {
  display: block;
  width: 100%;
  padding: 0.5rem 0.75rem;
  text-decoration: none;
  color: #555;
  font: inherit;
  font-size: 0.9rem;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
}
.avatar-menu a:hover,
.avatar-menu .menu-btn:hover {
  background: #f5f5f5;
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
    padding: 0.75rem 0.75rem;
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
  .desktop-avatar {
    display: none;
  }
  .mobile-top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    max-width: 720px;
    margin: 0 auto;
    padding: 0.5rem 1rem;
    z-index: 101;
  }
}
</style>
