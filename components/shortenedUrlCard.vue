<template>
  <div class="py-6 w-full">
    <div
      class="my-3 bg-white shadow rounded-lg"
      v-for="(shortenedUrl, index) in shortenedUrls"
      :key="index"
    >
      <div class="px-4 py-5 sm:p-6">
        <div class="flex items-center">
          <div v-html="srcSvg('check-circle')" style="stroke: green"></div>
          <h3 class=" px-2 text-lg leading-6 font-semibold text-gray-900">
            Your Shortened Url
          </h3>
        </div>
        <div
          class="mt-2 max-w-xl text-xs font-medium leading-5 text-gray-500 overflow-hidden"
        >
          <p>
            {{ shortenedUrl.url }}
          </p>
        </div>

        <div class="mt-3 text-sm leading-5">
          <a
            :href="shortenedUrl.shortened"
            target="_blank"
            class="font-medium text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150"
          >
            {{ shortenedUrl.shortened }} &rarr;
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'shortenedUrlCard',
  data() {
    return {

    }
  },
  props: ['shortenedUrls'],
  methods: {

  }
};
</script>

<style></style>
