// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss', 'convex-nuxt'],
  tailwindcss: {
    config: {
      darkMode: 'class',
    },
  },
  convex: {
    url: process.env.CONVEX_URL,
  },
  app: {
    head: {
      script: [
        {
          innerHTML: `(function(){var s=localStorage.getItem('theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;var t=s==='light'||s==='dark'?s:(d?'dark':'light');var r=document.documentElement;r.dataset.theme=t;r.style.colorScheme=t;r.classList.toggle('dark',t==='dark');r.style.backgroundColor=t==='dark'?'rgb(24 24 27)':'rgb(244 244 245)';})();`,
          type: 'text/javascript',
          tagPriority: 'critical',
        },
      ],
      style: [
        {
          innerHTML: `body{margin:0}#__nuxt{opacity:0}html.nuxt-ready #__nuxt{opacity:1;transition:opacity .12s ease}html[data-theme=dark]{background-color:rgb(24 24 27)}html[data-theme=light],html:not([data-theme]){background-color:rgb(244 244 245)}`,
          tagPriority: 'critical',
        },
      ],
      meta: [
        // Open Graph / Facebook
        { property: 'og:image', content: '/sharing.jpg' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:type', content: 'image/jpeg' },
        { property: 'og:type', content: 'website' },
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: '/sharing.jpg' },
      ]
    }
  },
  nitro: {
    // Configure for Netlify serverless
    preset: 'netlify',
  }
})