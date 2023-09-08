<template>
  <ion-card class="custom-card">
    <ion-card-header>
      <ion-card-title class="custom-tittle"
        >GRABA TU VOZ CON LA INFORMACIÓN NECESARIA</ion-card-title
      >
    </ion-card-header>

    <ion-card-content>
      <div class="recording-status" v-if="isRecording">
        <ion-button
          @click="stopRecording"
          expand="full"
          :disabled="!isRecording"
        >
          Parar Grabación
        </ion-button>
        <p>{{ recordingDuration }}</p>
      </div>

      <div class="audio-controls" v-else>
        <ion-button
          @click="startRecording"
          expand="full"
          :disabled="isRecording"
        >
          Iniciar Grabación
        </ion-button>
        <!--  <div v-if="recordedChunks.length > 0">
          <p class="custom-tittle">Grabaciones:</p>
          <audio controls>
            <source :src="audioUrl" type="audio/mpeg" />
            Tu navegador no admite la reproducción de audio.
          </audio>
          <ion-button @click="downloadAudio" expand="full" color="secondary">
            Descargar Audio
          </ion-button>
        </div> -->
      </div>
    </ion-card-content>
  </ion-card>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";

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
  IonButton,
} from "@ionic/vue";
export default defineComponent({
  components: {
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
    IonButton,
  },
  data() {
    return {
      isRecording: false,
      mediaRecorder: null as MediaRecorder | null,
      recordedChunks: [] as Blob[],
      startTime: 0,
      recordingDuration: "Duración: 0:00",
      recordingFilePath: "",
    };
  },
  methods: {
    async startRecording() {},
    async stopRecording() {},
    updateRecordingDuration() {},
    downloadAudio() {

    },
  },
});
</script>

<style scoped lang="scss">
.recording-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}
.audio-controls {
  margin: 0;
  padding: 0;
}

ion-button {
  --background: #07166A;
  --color: #fcf8f5;
  --border-color: #07166A;
  width: 100%;
}
.custom-card {
  background-color: white;
}
.custom-tittle {
  color: rgb(0, 0, 0);
  font-size: 15px;
  text-align: center;
}
.recordings {
  margin-top: 20px;
}

.recordings h2 {
  margin-bottom: 10px;
}

.recordings ul {
  list-style-type: none;
  padding: 0;
}

.recordings li {
  margin-bottom: 5px;
}
</style>
