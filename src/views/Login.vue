<template>
  <ion-content>
    <ion-page>
      <div class="login-card">
        <div class="color-gradient">
          <img src="../assets/images/logoAppWoCircle.png" alt="Logo App" />
          <span class="title">Inicio de Sessión</span>
          <form @submit="login">
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
              type="password"
              label-placement="floating"
              @keydown.enter="login"
            ></ion-input>
            <span class="password-reset">¿Olvidaste tu contraseña?</span>
            <ion-button type="submit" :disabled="disableB">Iniciar Sesión</ion-button>
          </form>
          <ion-footer>
           <p p class="footer-text">&copy; 2023 By. Techmo. Todos los derechos reservados</p>
         </ion-footer>
        </div>
      </div>
      
    </ion-page>
  </ion-content>
</template>

<script lang="ts">
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
} from "@ionic/vue";
import { Keyboard } from "@capacitor/keyboard";

export default defineComponent({
  name: "Login",
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
  },
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const disableB = ref(false);
    const credentials = ref({
      email: "",
      password: "",
    });
    const login = async (event: Object) => {
      disableB.value = true;
      event.preventDefault();

      console.log(credentials.value);

      const options = {
        url: BASE_URL + "/api/v1/auth/authenticate",
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
            message: "Credenciales Invalidas",
            duration: 1500,
            position: "bottom",
          });
          await toast.present();
        }

        if (response.data.access_token) {
          authStore.setToken(response.data.access_token);
          let user = {
            id: response.data.user_access,
            charge: response.data.charge,
            firstname: response.data.firstname,
            lastname: response.data.lastname,
            email: response.data.email,
            dni: response.data.dni,
            role: response.data.role,
          };
          authStore.setUser(user);
          router.push({ name: "Search" });
        }
      } catch (error) {
        console.log(error);
      }
    };
    return {
      credentials,
      login,
      disableB,
    };
  },
});
</script>

<style lang="scss" scoped>
.login-card {
  background-image: url("../assets/images/backgroundLogin.png");
  background-repeat: no-repeat;
  height: 100%;
  width: 100%;
  .color-gradient {
    background-color: rgba(29, 35, 122, 0.940);
    height: 100%;
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  img {
    height: 180px;
    width: 250px;
    margin: 15px 0;
  }
  .title {
    font-weight: bold;
    font-size: 20px;
    margin-bottom: 15px;
    color: white;
  }
  form {
    margin-top: 15px;
    width: 85%;
    display: flex;
    flex-direction: column;
    ion-input {
      margin-bottom: 15px;
      //background-color: white;
      --border-color: white;
      --color: white;
      --highlight-color-focused: white;
      font-weight: bold;
    }
    ion-button {
      margin-top: 40px;
      --background: white;
      --color: #07166A;
      font-weight: bolder;
    }
    .password-reset {
      color: white;
      font-weight: bolder;
      text-align: end;
    }
    .select-expanded {
      --border-color: rgb(255, 255, 255) !important;
      --highlight-color: rgb(255, 255, 255);
    }
  }
}
.footer-text {
  text-align: center;
  font-size: 12px;
}
</style>