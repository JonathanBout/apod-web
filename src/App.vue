<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <main>
    <RouterView />
  </main>
  <div class="flex-filler"></div>
  <footer class="copyright-notice">
    &copy; <a href="https://jonathanbout.com">Jonathan Bout</a>, {{ new Date().getFullYear() }}. All
    rights for media belong to their respective owners.
  </footer>
</template>
