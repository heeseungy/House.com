<script setup>
import { RouterView } from "vue-router";
</script>

<template>
  <div class="container mt-5">
    <!-- 제목 Start -->
    <div class="row mb-3">
      <div class="col-lg-12">
        <h3 class="text-center" style="font-weight: bold; font-size: 30px;">공지사항</h3>
      </div>
    </div>
    <!-- 제목 End -->
    <router-view></router-view>
  </div>
</template>

<style scoped>
* {
  font-family: Orbit;
}
</style>
