<template>
  <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
    <ion-refresher-content></ion-refresher-content>
  </ion-refresher>
  <div class="content-search">
    <div class="welcome">¡Bienvenido de nuevo!</div>
    <div class="title-section">Busqueda de cartillas</div>
    <div class="primer-search">
      <form @submit="submitForm">
        <ion-input fill="outline" placeholder="Codigo de cartilla"></ion-input>
        <ion-button shape="round" expand="full">BUSCAR</ion-button>
      </form>
    </div>
    <div class="primers-list">
      <div class="loader-container" v-if="loading">
        <LoaderApp />
      </div>
      <div v-else>
        <div class="container-content" v-if="primers.length">
          <div v-for="(primer, index) in primers" :key="index">
            <ion-card @click="targetView(index)">
              <ion-card-header>
                <ion-card-subtitle>SLO-CDS-{{ primer.id }}</ion-card-subtitle>
                <ion-card-subtitle>{{
                  primer.warned_activity
                }}</ion-card-subtitle>
                <ion-card-title>{{ getDate(primer.dateSave) }}</ion-card-title>
              </ion-card-header>
            </ion-card>
          </div>
          <div class="pagination-section">
            <ion-button :disabled="checkDisabledBack()" @click="backPagination">
              <ion-icon
                slot="icon-only"
                color="white"
                :icon="caretBackOutline"
              ></ion-icon>
            </ion-button>
            <ion-button
              :disabled="checkDisabledForward()"
              @click="forwardPagination"
            >
              <ion-icon
                slot="icon-only"
                color="white"
                :icon="caretForwardOutline"
              ></ion-icon>
            </ion-button>
          </div>
        </div>
        <div class="no-primers" v-else>Aun no has registrado una cartilla</div>
      </div>
    </div>
  </div>
  <ion-modal ref="modal">
    <view-primer
      :primer="JSON.parse(JSON.stringify(selectedView))"
      @back="modal.$el.dismiss()"
    />
  </ion-modal>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import {
  IonInput,
  IonButton,
  IonCard,
  IonCardTitle,
  IonCardSubtitle,
  IonCardHeader,
  IonIcon,
  IonCardContent,
  IonRefresher,
  IonRefresherContent,
  IonModal,
} from "@ionic/vue";
import { useAuthStore } from "../Store/authStore";
import { useRouter } from "vue-router";
import BASE_URL from "../boot/config.js";
import { CapacitorHttp } from "@capacitor/core";
import { caretBackOutline, caretForwardOutline } from "ionicons/icons";
import ViewPrimer from "./ViewPrimer.vue";
import LoaderApp from "./LoaderApp.vue";
import createApi from "../boot/CapacitorHTTP";
import { useIndexStore } from "@/Store/indexStore";
export default defineComponent({
  components: {
    IonButton,
    IonInput,
    LoaderApp,
    IonModal,
    IonCard,
    IonCardTitle,
    IonCardSubtitle,
    IonCardHeader,
    IonCardContent,
    IonIcon,
    IonRefresher,
    IonRefresherContent,
    ViewPrimer,
  },
  setup() {
    const authStore = useAuthStore();
    const indexStore = useIndexStore();
    const submitForm = () => {};
    const selectedView = ref();
    const modal = ref();
    const primers = ref([]);
    const loading = ref(true);
    const paginator = ref(0);
    const router = useRouter();
    const definPagination = ref({
      first: true,
      last: true,
    });
    const api = createApi(authStore, router);
    const getPrimers = async () => {
      try {
        const response = await api.get(
          `/api/v1/primers/list?id=${authStore.user.id}&page=${paginator.value}`
        );
        if (response.status === 200) {
          primers.value = response.data.content;
          definPagination.value = {
            first: response.data.first,
            last: response.data.last,
          };
          console.log(definPagination.value);

          loading.value = false;
        }
        console.log(response);
      } catch (error) {
        console.error(error);
      }
    };
    const getDate = (textoFecha: string) => {
      console.log(textoFecha);

      const fecha = new Date(textoFecha);

      const horas = fecha.getHours();
      const minutos = fecha.getMinutes();
      const segundos = fecha.getSeconds();
      const dia = fecha.getDate();
      const mes = fecha.toLocaleString("es-ES", { month: "long" });
      const anio = fecha.getFullYear();

      const resultado = `${horas.toString().padStart(2, "0")}:${minutos
        .toString()
        .padStart(2, "0")}:${segundos.toString().padStart(2, "0")} - ${dia
        .toString()
        .padStart(2, "0")} ${mes} ${anio}`;

      return resultado;
    };
    const forwardPagination = async () => {
      paginator.value++;
      await getPrimers();
    };
    const backPagination = async () => {
      paginator.value--;
      await getPrimers();
    };
    const checkDisabledBack = () => {
      return (
        (definPagination.value.last == true && paginator.value == 0) ||
        paginator.value == 0
      );
    };
    const checkDisabledForward = () => {
      return definPagination.value.last == true;
    };
    const handleRefresh = async (event: CustomEvent) => {
      await getPrimers();
      event.target.complete();
    };
    const targetView = (i: number) => {
      selectedView.value = primers.value[i];
      modal.value.$el.present();
    };
    const setIndex = async () => {
      try {
        const acts = await api.get("/api/v1/acts");
        if (acts.status === 200) {
          indexStore.acts = [...acts.data];
        }
        const conditons = await api.get("/api/v1/conditions");
        if (conditons.status === 200) {
          indexStore.conditions = [...conditons.data];
        }
      } catch (error) {
        console.log(error);
      }
    };
    onMounted(() => {
      getPrimers();
      if (!indexStore.getActs?.length || !indexStore.getConditions?.length) {
        setIndex();
      }
    });
    return {
      submitForm,
      primers,
      loading,
      getDate,
      caretBackOutline,
      caretForwardOutline,
      backPagination,
      forwardPagination,
      definPagination,
      paginator,
      checkDisabledBack,
      checkDisabledForward,
      handleRefresh,
      modal,
      targetView,
      selectedView,
    };
  },
});
</script>

<style scoped lang="scss">
* {
  color: black;
}
ion-card {
  --background: white;
  margin: 0;
  margin-bottom: 15px;
  box-shadow: none;
  display: flex;
  flex-direction: column;
  border: 0.04rem solid #07166A;
  ion-card-title {
    font-size: 15px;
    text-align: right;
    font-style: italic;
  }
  ion-card-subtitle {
    font-weight: bold;
  }
  .warned {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
.content-search {
  padding: 15px;
  .primers-list {
    margin-top: 10px;
    min-height: 100%;
    .no-primers {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .pagination-section {
    display: flex;
    justify-content: center;
    padding: 10px 0;
  }
}
.loader-container {
  margin-top: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.title-section {
  margin: 15px 0 15px;
  font-weight: bold;
}
ion-button {
  margin-top: 10px;
  --background: #07166A;
  color: white;
  font-weight: bolder;
}
</style>
