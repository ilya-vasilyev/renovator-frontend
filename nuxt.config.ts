// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,

  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },

  typescript: {
    shim: false,
  },

  modules: [
    "@pinia/nuxt",
    "@nuxt/ui",
    "@nuxtjs/google-fonts",
    "@nuxt/image",
    "@vueuse/nuxt",
  ],

  runtimeConfig: {
    public: {
      NUXT_PUBLIC_STRAPI_URL:
        process.env.NUXT_PUBLIC_STRAPI_URL || "http://localhost:1337",
    },
  },

  compatibilityDate: "2024-09-20",
});
