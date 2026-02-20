<script setup lang="ts">
import AppNav from "@/components/AppNav.vue";
</script>

<template>
  <AppNav />
  <main class="container">
    <router-view />
  </main>
</template>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
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
}
</style>
