export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:mounted', () => {
    requestAnimationFrame(() => {
      document.documentElement.classList.add('nuxt-ready');
    });
  });
});
