<template>
  <ion-app>
    <router-view></router-view>
  </ion-app>
</template>

<script setup lang="ts">
import {
  IonApp,
  IonRouterOutlet,
  createAnimation,
  Animation,
} from "@ionic/vue";
</script>
<style lang="scss">
ion-app {
  background-color: #07166A;
}
</style>
