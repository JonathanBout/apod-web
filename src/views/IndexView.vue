<script setup lang="ts">
import { ref } from 'vue'
import api, { ApodResponse } from '@/nasaApi'
import { useRoute } from 'vue-router'

const date = (useRoute().query.date || new Date().toISOString().split('T')[0]) as string

let response = ref(new ApodResponse())

api.getApod(new Date(date)).then((r) => {
  response.value = r
})
</script>

<template>
  <main v-if="response.title && response.title != ''">
    <h1>{{ response.title }}</h1>
    <p>
      apod {{ new Date(response.date).toLocaleDateString() }}
      <span v-if="response.copyright">| &copy; {{ response.copyright }}</span>
    </p>
    <div v-if="response.media_type === 'video'">
      <iframe width="560" height="315" :src="response.url" frameborder="0" allowfullscreen></iframe>
    </div>
    <div v-else>
      <img :src="response.url" alt="NASA's Astronomy Picture of the Day" />
    </div>
    <p>{{ response.explanation }}</p>
    <a v-if="response.hdurl" :href="response.hdurl" download>Download HD Image</a>
  </main>
  <p v-else>Loading...</p>
</template>
