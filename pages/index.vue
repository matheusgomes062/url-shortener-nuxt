<template>
  <div class="w-full min-h-screen bg-gray-100">
    <div
      class="max-w-2xl mx-auto min-h-screen flex flex-col items-center justify-center px-4"
    >
      <div v-html="src('code')"></div>
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
            <div v-html="src('world')"></div>
          </div>
          <input
            class="text-gray-700 py-4 form-input block w-full rounded-none rounded-l-md pl-10 transition ease-in-out duration-150 font-semibold sm:text-sm sm:leading-5"
            placeholder="www.example.com"
            v-model="url"
          />
        </div>
        <button
          v-if="!loading"
          @click="shortenUrl"
          class="group -ml-px relative inline-flex items-center px-3 py-3 border border-indigo-300 text-sm leading-5 font-medium rounded-r-md text-white bg-indigo-700 hover:text-indigo-700 hover:bg-white focus:outline-none focus:shadow-outline-blue focus:border-indigo-300 active:bg-gray-100 active:text-indigo-700 transition ease-in-out duration-150"
        >
          <div v-html="src('arrow-circle-down')"></div>

          <span class="ml-2 text-sm font-semibold">Shorten</span>
        </button>
        <button
          v-else
          class="group -ml-px relative inline-flex items-center px-3 py-3 border border-indigo-300 text-sm leading-5 font-medium rounded-r-md text-white bg-indigo-700 hover:text-indigo-700 hover:bg-white focus:outline-none focus:shadow-outline-blue focus:border-indigo-300 active:bg-gray-100 active:text-indigo-700 transition ease-in-out duration-150"
        >
          <div v-html="src('light-bulb')"></div>
          <span class="ml-2 text-sm font-semibold">Shortening</span>
        </button>
      </div>

      <!-- Error Message -->
      <p
        v-show="errorMessage"
        class="text-xs font-semibold text-red-600 italic"
      >
        {{ errorMessage }}
      </p>

      <!-- Shortened Url -->
      <div class="py-6 w-full">
        <div
          class="my-3 bg-white shadow rounded-lg"
          v-for="(shortenedUrl, index) in shortenedUrls"
          :key="index"
        >
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <svg
                class="h-5 w-5 text-green-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
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
                v-bind:href="shortenedUrl.shortened"
                target="_blank"
                class="font-medium text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150"
              >
                {{ shortenedUrl.shortened }} &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
  methods: {
    src(iconName) {
      const src = require(`assets/icons/${iconName}.svg?raw`);
      return src;
    },
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
        var response = await this.$axios.$post("/shorten", {
          url: this.url
        });
        console.log("Successfully shortened URL", response.data);
        var shortenedUrl = `${this.$axios.defaults.baseURL}/${response.data}`;
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
