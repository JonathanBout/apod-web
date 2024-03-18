<script setup lang="ts">
import { RouterView } from 'vue-router'

import { Header, FlexFiller, Footer } from './components'
</script>

<template>
  <Header />
  <main>
    <RouterView />
  </main>
  <FlexFiller />
  <Footer />
</template>
