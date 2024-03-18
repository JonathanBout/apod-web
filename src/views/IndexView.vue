<script setup lang="ts">
import { ref, watch } from 'vue'
import { nasaApi as api, ApodResponse } from '@/nasaApi'
import { useRoute } from 'vue-router'

const route = useRoute()

const has_error = () => {
  return !!response.value.error || response.value.code < 200 || response.value.code >= 300
}

const addDays = (date: Date, count: number) => {
  const d = new Date(date)
  d.setDate(d.getDate() + count)
  return d
}

const pathFromDate = (date: Date) => {
  if (date < new Date('1995-06-16')) {
    return undefined
  } else if (date > new Date()) {
    return undefined
  }
  return `/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
}

const load = async () => {
  loading.value = true
  response.value = await api.getApod(date.value)
  document.title = get_title()
  loading.value = false
}

const get_title = () => {
  if (has_error()) {
    return response.value.title
  }
  return `Astronomy Picture Of the Day ${new Date(response.value.date).toLocaleDateString()}. ${
    response.value.title
  }`
}

const date = ref(new Date())
let response = ref(new ApodResponse())
let loading = ref(true)

const { year, month, day } = route.params
date.value.setFullYear(parseInt(year as string))
date.value.setMonth(parseInt(month as string) - 1)
date.value.setDate(parseInt(day as string))

load()

watch(() => route.params, load)
watch(date, load)
</script>

<template>
  <div class="apod">
    <div class="nav separated">
      <span>
        <a :href="pathFromDate(addDays(date, -1))">Previous Day</a>
      </span>
      <span>
        <a href="/random">Random</a>
      </span>
      <span>
        <input
          type="date"
          min="1995-06-16"
          :max="new Date().toISOString().slice(0, 10)"
          :value="date.toISOString().slice(0, 10)"
          @input="date = new Date(($event.target as any).value)"
        />
      </span>
      <span>
        <a href="/">Today</a>
      </span>
      <span>
        <a :href="pathFromDate(addDays(date, 1))">Next Day</a>
      </span>
    </div>
    <template v-if="has_error()">
      <h1>{{ response.title }}</h1>
      <p>{{ response.msg }}</p>
    </template>
    <template v-else-if="loading">
      <h1>Loading...</h1>
    </template>
    <template v-else>
      <h1>{{ response.title }}</h1>
      <div class="data separated">
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
        <p class="explanation">
          {{ response.explanation }}
        </p>
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

.nav form {
  display: inline-flex;
  gap: 1ch;
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
  display: block;
  width: 100%;
}

h1::before {
  z-index: -1;
  content: '';
  position: absolute;
  inset: 0;
  backdrop-filter: blur(10px);

  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 0) 100%);
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
    border: 1px solid black;
  }

  .explanation {
    line-height: 1.8em;
    max-width: 80ch;
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
