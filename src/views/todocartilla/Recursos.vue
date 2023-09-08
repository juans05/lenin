<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-icon :icon="arrowBackOutline" @click="backRoute"></ion-icon>
      </ion-buttons>
      <ion-title class="cartilla-title">RECURSOS</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content>
    <div id="container">
      <audio-recorder @audio-recorded="onAudioRecorded"></audio-recorder>
    </div>
    <ion-card class="custom-card">
      <ion-card-header>
        <ion-card-title class="custom-tittle"
          >Selecciona las imágenes</ion-card-title
        >
      </ion-card-header>
      <ion-card-content>
        <input
          type="file"
          @change="onImageSelected"
          accept="image/*"
          multiple
        />
        <div v-if="selectedImages.length > 0">
          <h2>Imágenes seleccionadas:</h2>
          <div v-for="(image, index) in selectedImages" :key="index">
            <img
              :src="getObjectURL(image)"
              alt="Preview"
              style="max-width: 200px; max-height: 200px; margin-bottom: 10px"
            />
          </div>
        </div>
      </ion-card-content>
    </ion-card>
  </ion-content>
</template>

<script lang="ts">
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonButtons,
  IonToolbar,
  IonBackButton,
  IonIcon,
  IonCardTitle,
  IonCardHeader,
  IonCardContent,
  IonCard,
} from "@ionic/vue";
import { defineComponent, ref, onUnmounted } from "vue";
import { arrowBackOutline } from "ionicons/icons";
import { useRouter } from "vue-router";
import { usePrimerStore } from ".././../Store/primerStore";
import AudioRecorder from "../todocartilla/AudioRecorder.vue";

export default defineComponent({
  name: "Home",
  components: {
    IonContent,
    IonHeader,
    IonIcon,
    IonBackButton,
    IonPage,
    IonButtons,
    IonTitle,
    IonToolbar,
    AudioRecorder,
    IonCardTitle,
    IonCardHeader,
    IonCardContent,
    IonCard,
  },
  setup() {
    const router = useRouter();
    const primerStore = usePrimerStore();
    const selectedImages = ref([] as File[]);

    const onAudioRecorded = (audioFile: string) => {
      // Handle the recorded audio file
      console.log("Recorded audio file:", audioFile);
    };

    const backRoute = () => {
      primerStore.clearPrimer();
      router.go(-1);
    };

    const onImageSelected = (event: Event) => {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        const images = Array.from(input.files);
        selectedImages.value = images;
      }
    };

    const getObjectURL = (image: File) => {
      return URL.createObjectURL(image);
    };

    onUnmounted(() => {
      // Revoke object URLs when the component is unmounted
      selectedImages.value.forEach((image) =>
        URL.revokeObjectURL(getObjectURL(image))
      );
    });

    return {
      onAudioRecorded,
      arrowBackOutline,
      backRoute,
      onImageSelected,
      selectedImages,
      getObjectURL,
    };
  },
});
</script>

<style scoped lang="scss">
ion-toolbar {
  --ion-color-primary: white;

  --background: #07166A !important;
  --color: white;

  --border-width: 0;
  --border-style: none;
  --border-color: transparent;
  --padding-top: 5px;
  --padding-bottom: 5px;
  .cartilla-title {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    text-align: center;
    color: white;
    min-width: 100%;
  }
}
ion-icon {
  padding-left: 8px;
  color: white;
  font-size: 28px;
}
ion-content {
  --background: #ffffff;
  --color: black;
}
ion-card {
  box-shadow: none;
}

ion-toolbar {
  --background: #ffffff;
}
.bottom-mr {
  margin-bottom: 15px;
}
.button-option {
  --background: rgb(255, 240, 220);
  --color: #07166A;
  font-weight: bold;
}
.title-orange {
  color: white;
}
ion-nav-link {
  width: 100%;
}
ion-button {
  --background: #07166A;
  --color: #fcf8f5;
  --border-color: #07166A;
  width: 100%;
  text-align: left;
}

ion-toggle {
  --background: #ffffff;
  --color: white;
  --unchecked-color: white;
}

ion-title {
  font-size: 20px;
  font-weight: bold;
  color: white;
}

ion-col {
  display: flex;
  align-items: flex-start;
}

ion-row {
  padding: 10px 0;
}

.button-text {
  text-align: left;
}
.orange-text {
  color: #07166A;
}
.custom-card {
  background-color: white;
}
.custom-tittle {
  color: rgb(0, 0, 0);
}

.text-center {
  text-align: center;
}
</style>
