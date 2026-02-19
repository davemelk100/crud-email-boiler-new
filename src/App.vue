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
  font-family: system-ui, -apple-system, sans-serif;
  color: #1a1a1a;
  background: #fafafa;
}
.container {
  max-width: 720px;
  margin: 2rem auto;
  padding: 0 1rem;
}
</style>
