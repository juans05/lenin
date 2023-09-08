<template>
    <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-icon :icon="arrowBackOutline" @click="backRoute()"></ion-icon>
      </ion-buttons>
      <ion-title class="cartilla-title">REGISTRO DE USUARIOS</ion-title>
    </ion-toolbar>
  </ion-header>
    <ion-content class="ion-padding" v-if="savedRegister">
      <ion-page>
        <div class="register-card">
          <div class="form-container">
            <span class="title">Ingresa un nuevo usuario</span>
            <form @submit="register">
              <ion-input
                class="select-expanded"
                label="Nombres"
                fill="outline"
                type="text"
                ref="inputRef"
                label-placement="floating"
                v-model="credentials.firstname"
                placeholder="Nombres"
              ></ion-input>
              <ion-input
                class="select-expanded"
                label="Apellidos"
                fill="outline"
                type="text"
                ref="inputRef"
                label-placement="floating"
                v-model="credentials.lastname"
                placeholder="Apellidos"
              ></ion-input>
              <ion-input
                class="select-expanded"
                label="DNI"
                fill="outline"
                type="number"
                ref="inputRef"
                label-placement="floating"
                v-model="credentials.dni"
                placeholder="Dni"
              ></ion-input>
              <ion-input
                class="select-expanded"
                label="Correo electronico"
                fill="outline"
                type="email"
                ref="inputRef"
                label-placement="floating"
                v-model="credentials.email"
                placeholder="ejemplo@gmail.com"
              ></ion-input>
              <ion-input
                class="select-expanded"
                fill="outline"
                label="Contraseña"
                v-model="credentials.password"
                type="text"
                label-placement="floating"
                placeholder="Contraseña"
              ></ion-input>
              <ion-select
                class="bottom-mr"
                fill="outline"
                label="Cargo"
                label-placement="floating"
                v-model="credentials.cargo"
                placeholder="Seleccione un cargo"
                >
                  <ion-select-option value="Capataz">Capataz</ion-select-option>
                  <ion-select-option value="Supervisor">Supervisor</ion-select-option>
                  <ion-select-option value="Observador">Observador</ion-select-option>
                </ion-select>
              <ion-select
                class="bottom-mr"
                fill="outline"
                label="Usuario"
                label-placement="floating"
                v-model="credentials.role"
                placeholder="Seleccione un tipo de usuario"
                >
                  <ion-select-option value="MANAGER">MANAGER</ion-select-option>
                  <ion-select-option value="ADMIN">ADMIN</ion-select-option>
                </ion-select>
              <ion-button type="submit" :disabled="disableB">Registrar Usuario</ion-button>
            </form>
          </div>
        </div>
      </ion-page>
    </ion-content>
    <ion-content v-else>
    <div class="message-saved">
      <div class="custom-message">SE CREO EL USUARIO CORRECTAMENTE</div>
      <ion-icon :icon="checkmarkCircleOutline"></ion-icon>
      <!--<ion-button>ver</ion-button> -->
    </div></ion-content>
    
  </template>
  
  <script lang="ts">
  import { arrowBackOutline,checkmarkCircleOutline } from "ionicons/icons";
  import { defineComponent, ref, onMounted, onUnmounted, computed } from "vue";
  import { useAuthStore } from "../Store/authStore";
  import { useRouter } from "vue-router";
  import { CapacitorHttp } from "@capacitor/core";
  import BASE_URL from "../boot/config.js";
  import {
    IonItem,
    IonGrid,
    IonRow,
    IonCol,
    IonInput,
    IonPage,
    IonButton,
    IonContent,
    IonFooter,
    toastController,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonIcon,
    IonTitle,
    IonSelect,
    IonSelectOption,
  } from "@ionic/vue";
  import { Keyboard } from "@capacitor/keyboard";
  
  export default defineComponent({
    name: "Register",
    components: {
      IonItem,
      IonGrid,
      IonRow,
      IonCol,
      IonInput,
      IonButton,
      IonPage,
      IonContent,
      IonFooter,
      IonHeader,
      IonToolbar,
      IonButtons,
      IonIcon,
      IonTitle,
      IonSelect,
      IonSelectOption,
    },
    setup() {
      const backRoute = () => {
         router.go(-1);
    };
      const router = useRouter();
      const authStore = useAuthStore();
      const disableB = ref(false);
      const savedRegister = ref(true);
      const credentials = ref({
        firstname: "",
        lastname: "",
        dni: "",
        email: "",
        password: "",
        cargo: "",
        role: "",
      });
      const register = async (event: Object) => {
        disableB.value = true;
        event.preventDefault();
  
        console.log(credentials.value);
  
        const options = {
          url: BASE_URL + "/api/v1/auth/register",
          headers: {
            "Content-Type": "application/json",
          },
          data: { ...credentials.value },
        };
        try {
          const response = await CapacitorHttp.post(options);
          if (response.status === 403) {
            disableB.value = false;
            const toast = await toastController.create({
              message: "Rellena todos los campos",
              duration: 1500,
              position: "bottom",
            });
            await toast.present();
          }
  
          if (response.data.access_token) {
            savedRegister.value = false;
          }
        } catch (error) {
          console.log(error);
        }
      };
      return {
        backRoute,
        arrowBackOutline,
        savedRegister,
        credentials,
        register,
        disableB,
        checkmarkCircleOutline,
      };
    },
  });
  </script>

  
<style lang="scss" scoped>
.register-card {
  background-repeat: no-repeat;
  height: 100%;
  width: 100%;
  .color-gradient {
    background-color: rgba(255, 255, 255, 0.904);
    height: 100%;
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .title {
    font-weight: bold;
    font-size: 20px;
    color: #07166A;
  }
  form {
    margin-top: 15px;
    width: 85%;
    display: flex;
    flex-direction: column;
    ion-input {
      margin-bottom: 15px;
      //background-color: white;
      --color: rgb(0, 0, 0);
      --highlight-color-focused: white;
      font-weight: bold;
    }
    ion-select {
      margin-bottom: 15px;
      //background-color: white;
      --border-color: #000000;
      --color: rgb(0, 0, 0);
      --highlight-color-focused: white;
      font-weight: bold;
    }
    ion-button {
      --background: #07166A;
      --color: #fcf8f5;
      --border-color: #07166A;
      width: 100%;
      text-align: left;
    }
    .password-reset {
      color: white;
      font-weight: bolder;
      text-align: end;
    }
    .select-expanded {
      --border-color: rgb(0, 0, 0) !important;
      --highlight-color: #07166A;
    }
  }
}

.message-saved {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  height: 100%;
  color: black;
  .custom-message {
    margin-bottom: 25px;
  }
  ion-icon {
    color: #07166A;
    font-size: 50px;
    margin-bottom: 25px;
  }
  ion-button {
    max-width: 80px;
  }
}
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
.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  margin-top: 20px;
  width: 100%;
}
ion-content {
  .primer-title {
    text-align: center;
    padding-bottom: 10px;
    margin-bottom: 20px;
    border-bottom: 0.03rem solid #07166A;
  }
  .bottom-mr {
    margin-bottom: 20px;
  }
  ion-input {
    --highlight-color-invalid: red;
  }
}
ion-content {
  --background: #ffffff;
  --color: black;
}
</style>
