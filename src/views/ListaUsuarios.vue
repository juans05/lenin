<template>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-icon :icon="arrowBackOutline" @click="backRoute()"></ion-icon>
        </ion-buttons>
        <ion-title class="cartilla-title">Lista de usuarios</ion-title>
      </ion-toolbar>
    </ion-header>
    <IonContent>
    <div v-for="user in users" :key="user.id">
            <ion-card >
              <ion-card-header>
                <ion-card-title>Usuario-{{ user.id }}</ion-card-title>
                <ion-card-subtitle>Nombre: {{user.firstname}}</ion-card-subtitle>
                <ion-card-subtitle>Apellido: {{user.lastname}}</ion-card-subtitle>
                <ion-card-subtitle>Email: {{user.email}}</ion-card-subtitle>
                <ion-card-subtitle>Cargo: {{user.cargo}}</ion-card-subtitle>
                <ion-card-subtitle>Dni: {{user.dni}}</ion-card-subtitle>
              </ion-card-header>
            </ion-card>
          </div>
          </IonContent>
  </template>
  
  <script lang="ts">
  import { arrowBackOutline } from "ionicons/icons";
  import { defineComponent, ref, onMounted, onUnmounted } from "vue";
  import { useAuthStore } from "../Store/authStore";
  import { useRouter } from "vue-router";
  import { CapacitorHttp } from "@capacitor/core";
  import createApi from "../boot/CapacitorHTTP";
  import BASE_URL from "../boot/config.js";
  import {
    IonItem,
    IonList,
    IonPage,
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonIcon,
    IonTitle,
    IonCard,
    IonCardTitle,
    IonCardSubtitle,
    IonCardHeader,
  } from "@ionic/vue";
  
  export default defineComponent({
    name: "Register",
    components: {
      IonItem,
      IonList,
      IonPage,
      IonContent,
      IonHeader,
      IonToolbar,
      IonButtons,
      IonIcon,
      IonTitle,
      IonCard,
      IonCardTitle,
      IonCardSubtitle,
      IonCardHeader,
    },
    setup() {
      const authStore = useAuthStore();
      const router = useRouter();
      const users = ref([]);
      const api = createApi(authStore, router);
      const backRoute = () => {
        router.go(-1);
      };
  
      const loadUsers = async () => {
        try {
            const response = await api.get("/api/v1/usuarios");
  
          if (response.status === 200) {
            users.value = response.data;
            console.log(users.value);
          } else {
            console.error("Error al obtener los usuarios");
          }
        } catch (error) {
          console.error("Error al realizar la solicitud HTTP", error);
        }
      };
  
  
      onMounted(() => {
        loadUsers();
      });
  
      return {
        users,
        backRoute,
        arrowBackOutline,
      };
    },
  });
  </script>
  
  <style lang="scss" scoped>
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
    ion-icon {
      padding-left: 8px;
      color: white;
      font-size: 28px;
    }
  }
  ion-card {
  --background: white;
  margin-bottom: 15px;
  box-shadow: none;
  display: flex;
  flex-direction: column;
  border: 0.04rem solid #07166A;
  ion-card-title {
    color: black;
  }
  ion-card-subtitle {
    font-weight: bold;
    color: black;
  }
  .warned {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
  .white-text {
    color: white;
  }
  </style>