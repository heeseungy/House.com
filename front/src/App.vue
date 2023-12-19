<script setup>
import { RouterView } from "vue-router";
import TheHeadingNavber from "./components/layout/TheHeadingNavbar.vue";
</script>

<template>
  <div>
    <TheHeadingNavber></TheHeadingNavber>
    <router-view></router-view>
  </div>
</template>

<style scoped></style>
