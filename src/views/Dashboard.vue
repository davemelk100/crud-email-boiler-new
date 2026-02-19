<script setup lang="ts">
import { useAuthStore } from "@/stores/authStore";

const auth = useAuthStore();
</script>

<template>
  <div>
    <h1>Dashboard</h1>
    <p>Logged in as {{ auth.user?.email }}</p>
  </div>
</template>
