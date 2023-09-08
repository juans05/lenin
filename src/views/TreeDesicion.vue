<template>
  <ion-page>
    <div class="loader-background">
      <div class="color-gradient"></div>
    </div>
    <div class="logo-app">
      <img src="../assets/images/logoApp.png" alt="Logo App" /></div
  ></ion-page>
</template>

<script lang="ts">
import { IonPage } from "@ionic/vue";
import { useAuthStore } from "../Store/authStore";
import { useRouter } from "vue-router";
import { ref, onMounted, defineComponent } from "vue";
export default defineComponent({
  components: { IonPage },
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const chekAuth = () => {
      if (authStore.token /*|| authStore.user*/) {
        router.replace({ name: "Search" });
      } else {
        authStore.logout();
        router.replace({ name: "Login" });
      }
    };
    onMounted(() => {
      setTimeout(() => {
        chekAuth();
      }, 2000);
    });
    return {};
  },
});
</script>

<style scoped lang="scss">
.loader-background {
  height: 100%;
  width: 100%;
  .color-gradient {
    background-color: #07166A;
    height: 100vh;
    position: relative;
  }
}
.logo-app {
  position: absolute;
  z-index: 10;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    max-width: 180px;
  }
}
</style>
