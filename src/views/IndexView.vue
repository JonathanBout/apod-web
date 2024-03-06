<script setup lang="ts">
import { ref } from 'vue'
import api, { ApodResponse } from '@/nasaApi'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const year = parseInt(route.params.year as string)
const month = parseInt(route.params.month as string)
const day = parseInt(route.params.day as string)

const date = new Date()
date.setFullYear(year)
date.setMonth(month - 1)
date.setDate(day)

let response = ref(new ApodResponse())
let loading = ref(true)

const has_error = () => {
  return response.value.code < 200 || response.value.code >= 300
}

const addDays = (date: Date, count: number) => {
  const d = new Date(date)
  d.setDate(d.getDate() + count)
  return d
}

const pathFromDate = (date: Date) => {
  console.log('pathFromDate', date)
  return `/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
}

const navigateToDate = (date: Date) => {
  const newPath = pathFromDate(date)
  router.replace({ path: newPath, force: true })
  console.log('navigateToDate', newPath)
}

api.getApod(date).then((r) => {
  response.value = r
  loading.value = false
  route.meta.title = r.title
})
</script>

<template>
  <div class="apod">
    <div class="nav">
      <span>
        <a :href="pathFromDate(addDays(date, -1))">Previous Day</a>
      </span>
      <span>
        <input
          type="date"
          :value="date.toISOString().slice(0, 10)"
          @input="(event) => navigateToDate(new Date(event.target!.value))"
        />
      </span>
      <span>
        <a :href="pathFromDate(addDays(date, 1))">Next Day</a>
      </span>
    </div>
    <template v-if="has_error()">
      <h1>Error</h1>
      <p>{{ response.msg }}</p>
    </template>
    <template v-else-if="loading">
      <h1>Loading...</h1>
    </template>
    <template v-else>
      <h1>{{ response.title }}</h1>
      <div class="data">
        <span>Astronomy Picture Of the Day {{ new Date(response.date).toLocaleDateString() }}</span>
        <span class="left-bar" v-if="response.copyright">&copy; {{ response.copyright }}</span>
        <span class="left-bar" v-if="response.hdurl">
          <a :href="response.hdurl" target="_blank" download>Download HD Image</a>
        </span>
      </div>
      <div class="apod-container">
        <iframe
          v-if="response.media_type === 'video'"
          class="media media-video"
          :src="response.url"
          frameborder="0"
        ></iframe>
        <img
          v-else
          class="media media-image"
          :src="response.url"
          alt="NASA's Astronomy Picture of the Day"
          width="500px"
        />
        <div class="explanation">
          <p>{{ response.explanation }}</p>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="less" scoped>
.apod {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.nav * + *,
.data * + * {
  &:before {
    content: '|';
    display: inline-block;
    margin-inline: 1ch;
    transform: translateY(-1px);
  }
}

.apod {
  position: relative;
  inset: 0;
}

h1 {
  position: sticky;
  width: 100%;
  text-align: center;
  top: 0;
  z-index: 1;
  backdrop-filter: blur(10px);
}

.apod-container {
  display: grid;
  position: relative;
  grid-template-columns: auto auto;
  grid-template-rows: 100%;
  gap: 2ch;
  margin: 10px;
  height: 100%;
  max-width: 1500px;

  .media-video {
    width: 50dvw;
    aspect-ratio: 16 / 9;
  }

  .media-image {
    width: 100%;
    max-height: 100%;
  }

  .explanation {
    line-height: 1.8em;
  }

  @media (max-width: 1000px) {
    grid-template-columns: 100%;
    grid-template-rows: auto auto;
    .media-video {
      width: 100%;
    }
  }
}
</style>
