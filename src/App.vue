<script setup lang="ts">
import AppNav from "@/components/AppNav.vue";
import SocialShare from "@/components/SocialShare.vue";
</script>

<template>
  <a href="#main-content" class="skip-link">Skip to content</a>
  <AppNav />
  <main id="main-content" class="container">
    <router-view />
  </main>
  <SocialShare />
</template>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.skip-link {
  position: absolute;
  top: -100%;
  left: 0;
  background: #1a1a1a;
  color: #fff;
  padding: 0.5rem 1rem;
  z-index: 200;
  text-decoration: none;
  font-size: 0.9rem;
}
.skip-link:focus {
  top: 0;
}
body {
  font-family: 'Nunito Sans', system-ui, -apple-system, sans-serif;
  color: #1a1a1a;
  background: #fafafa;
}
.container {
  max-width: 720px;
  margin: 2rem auto;
  padding: 0 1rem;
}

@media (max-width: 640px) {
  .container {
    margin: 1.5rem auto;
    padding-bottom: 4rem;
  }
  .social-share {
    margin-bottom: 4rem;
  }
}
</style>
