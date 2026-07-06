<template>
  <NuxtPage />
</template>

<script setup lang="ts">
useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@400;500;800&family=Source+Sans+3:wght@400&display=swap'
    }
  ]
});
</script>

<style lang="css">
  html {
    background-color: rgb(244 244 245);
  }

  html.page-ready {
    transition: background-color 0.3s ease;
  }

  html[data-theme='light'] {
    color-scheme: light;
  }

  html[data-theme='dark'] {
    color-scheme: dark;
    background-color: rgb(24 24 27);
  }

  body {
    font-family: "Source Sans 3", sans-serif;
  }

  .employee-name {
    font-family: "Big Shoulders Display", sans-serif;
  }
</style>
