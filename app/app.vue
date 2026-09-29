<template>
  <Toast position="top-right" />
  <NuxtRouteAnnouncer />
  <NuxtLayout name="public">
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
import Toast from "primevue/toast";
</script>
