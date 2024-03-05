<script setup lang="ts">
import { ref } from 'vue'
import api, { ApodResponse } from '@/nasaApi'
import { useRoute } from 'vue-router'

const route = useRoute()

const year = route.params.year as string
const month = route.params.month as string
const day = route.params.day as string

const date = new Date()
date.setFullYear(parseInt(year))
date.setMonth(parseInt(month) - 1)
date.setDate(parseInt(day))

let response = ref(new ApodResponse())
let loading = ref(true)

api.getApod(date).then((r) => {
  response.value = r
  loading.value = false
})
</script>

<template>
  <main v-if="!loading">
    <h1 class="image-title">{{ response.title }}</h1>
    <p>
      <span>apod {{ new Date(response.date).toLocaleDateString() }}</span>
      <span class="left-bar" v-if="response.copyright">&copy; {{ response.copyright }}</span>
      <span class="left-bar" v-if="response.hdurl">
        <a :href="response.hdurl" target="_blank" download>Download HD Image</a>
      </span>
    </p>
    <div id="container">
      <div class="media">
        <iframe
          v-if="response.media_type === 'video'"
          class="media-video"
          :src="response.url"
          frameborder="0"
        ></iframe>
        <img
          class="media-image"
          v-else
          :src="response.url"
          alt="NASA's Astronomy Picture of the Day"
        />
      </div>
      <div class="explanation">
        <p>{{ response.explanation }}</p>
      </div>
    </div>
  </main>
  <p v-else>Loading...</p>
</template>

<style lang="less">
.left-bar {
  &:before {
    content: '|';
    display: inline-block;
    margin-inline: 1ch;
    transform: translateY(-1px);
  }
}

h1.image-title {
  position: sticky;
  top: 0px;
  z-index: 1000;
  background-blend-mode: overlay;
  backdrop-filter: blur(100px);
  font-size: 2.5rem;
}

#container {
  display: grid;
  grid-template-columns: auto 1fr;
  @media (width < 850px) {
    grid-template-rows: auto 1fr;
    grid-template-columns: 1fr;
  }
  flex-direction: row;
  width: 100%;
  gap: 1em;

  .explanation {
    line-height: 1.7em;
    min-width: 500px;
  }

  .media {
    display: contents;

    .media-video {
      width: 100%;
      aspect-ratio: 16 / 9;
    }
    .media-image {
      max-width: 100%;
      max-height: 500px;
    }
  }
}
</style>
