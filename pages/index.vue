<template>
  <div class="w-full min-h-screen bg-gray-100">
    <div
      class="max-w-2xl mx-auto min-h-screen flex flex-col items-center justify-center px-4 py-4"
    >
      <div v-html="srcSvg('code')"></div>
      <!-- Header -->
      <h1 class="text-gray-900 font-black text-5xl uppercase text-center">
        URL Shortener
      </h1>
      <h2 class="text-indigo-700 text-sm font-semibold italic">
        A free URL Shortener
      </h2>

      <!-- Url Imput -->
      <div class="w-full mt-6 flex rounded-md shadow-sm">
        <div class="relative flex-grow focus-within:z-10">
          <div
            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
          >
            <div v-html="srcSvg('world')"></div>
          </div>
          <input
            class="text-gray-700 py-4 form-input block w-full rounded-none rounded-l-md pl-10 transition ease-in-out duration-150 font-semibold sm:text-sm sm:leading-5"
            placeholder="www.example.com"
            v-model="url"
          />
        </div>
        <button
          @click="shortenUrl"
          class="group -ml-px relative inline-flex items-center px-3 py-3 border border-indigo-300 text-sm leading-5 font-medium rounded-r-md text-white bg-indigo-700 hover:text-indigo-700 hover:bg-white focus:outline-none focus:shadow-outline-blue focus:border-indigo-300 active:bg-gray-100 active:text-indigo-700 transition ease-in-out duration-150"
        >
          <div v-if="!loading" class="inline-flex items-center">
            <div v-html="srcSvg('arrow-circle-down')"></div>
            <span class="ml-2 text-sm font-semibold">Shorten</span>
          </div>
          <div v-else class="inline-flex items-center">
            <div v-html="srcSvg('light-bulb')"></div>
            <span class="ml-2 text-sm font-semibold">Shortening</span>
          </div>
        </button>
      </div>

      <!-- Error Message -->
      <p
        v-show="errorMessage"
        class="text-xs font-semibold text-red-600 italic my-2"
      >
        {{ errorMessage }}
      </p>

      <shrotenedUrlCard :shortenedUrls="shortenedUrls" />
    </div>
  </div>
</template>

<script>
import shrotenedUrlCard from "~/components/shortenedUrlCard.vue";

export default {
  name: "urlShortener",
  data() {
    return {
      url: null,
      shortenedUrls: [],
      errorMessage: null,
      loading: false
    };
  },
  components: {
    shrotenedUrlCard
  },
  methods: {
    async shortenUrl() {
      console.log("Trying to shorten URL.", this.url);
      // Confirm the URL has been entered
      if (this.isNullOrWhitespace(this.url)) {
        this.errorMessage = "A URL is required.";
        return;
      }

      // Confirm the URL entered is a URL
      var regex = new RegExp(
        "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
          "(\\#[-a-z\\d_]*)?$",
        "i"
      );

      if (this.url.match(regex) === null) {
        this.errorMessage = "URL is invalid.";
        return;
      }

      // Send the data to the backend API
      try {
        this.loading = true;
        var response = await $axios.$post("/shorten", {
          url: this.url
        });
        console.log("Successfully shortened URL", response.data);
        var shortenedUrl = `${$axios.defaults.baseURL}/${response.data}`;
        this.shortenedUrls.unshift({
          url: this.url,
          shortened: shortenedUrl
        });
        this.errorMessage = null;
        this.url = null;
      } catch (error) {
        console.log(error);
        // Error is a HTTP error
        if (error.response) {
          this.errorMessage = error.response.errorMessage;
        } else {
          this.errorMessage = "Sorry, the API is offline. Try again later.";
        }
      }
      this.loading = false;
    },
    isNullOrWhitespace(str) {
      return str === null || str.match(/^ *$/) !== null;
    }
  }
};
</script>

<style></style>
