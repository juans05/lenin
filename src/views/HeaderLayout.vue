<template>
  <ion-header class="header-pages">
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-back-button default-href="/search"></ion-back-button>
      </ion-buttons>
      <ion-title style="color: #07166A">Formulario nueva cartilla</ion-title>
    </ion-toolbar>
  </ion-header>
</template>

<script setup lang="ts">
import {
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
} from "@ionic/vue";
</script>

<style scoped lang="scss">
ion-toolbar {
  --ion-color-primary: white;

  --background: transparent;
  --color: white;

  --border-width: 0;
  --border-style: none;
  --border-color: transparent;
  --padding-top: 5px;
  --padding-bottom: 5px;
}
.header-md::after {
  background-image: none;
}
</style>
