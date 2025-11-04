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

  body {
    font-family: "Source Sans 3", sans-serif;
  }

  .employee-name {
    font-family: "Big Shoulders Display", sans-serif;
  }
</style>
