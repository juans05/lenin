<template>
  <ion-menu content-id="main-content" class="menu-primer" ref="menu">
    <ion-header class="primer-header">
      <div class="user-information">
        <div class="user-space">
          <ion-avatar class="user-avatar">
            <img
              alt="Silhouette of a person's head"
              src="https://ionicframework.com/docs/img/demos/avatar.svg"
            />
          </ion-avatar>
          <div class="user-data">
            <span class="user-name"
              >{{ auth.user?.firstname }} {{ auth.user?.lastname }}</span
            >
            <div class="space"></div>
            <span>{{ auth.user?.email }}</span>
          </div>
        </div>
      </div>
    </ion-header>
    <ion-content>
      <ul>
        <li v-if="auth.user?.role === 'ADMIN'" @click="openVerUsers">
          <ion-icon slot="start" :icon="peopleOutline"></ion-icon>
          <div>VER USUARIOS</div>
        </li>
        <li v-if="auth.user?.role === 'ADMIN'" @click="openCreateUsers">
          <ion-icon slot="start" :icon="personAddOutline"></ion-icon>
          <div>CREAR USUARIOS</div>
        </li>
        <li v-if="auth.user?.role === 'ADMIN'" @click="openReport">
          <ion-icon slot="start" :icon="documentTextOutline"></ion-icon>
          <div>REPORTE</div>
        </li>
        <li @click="logout">
          <ion-icon slot="start" :icon="logOutSharp"></ion-icon>
          <div>CERRAR SESIÓN</div>
        </li>
      </ul>
    </ion-content>
  </ion-menu>
  <ion-page id="main-content">
    <ion-header>
      <ion-toolbar :mode="'md'">
        <ion-buttons slot="start">
          <ion-menu-button class="color-custom"></ion-menu-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button
            class="add-primer-button"
            fill="solid"
            shape="round"
            color="primary"
            @click="pushPrimer"
          >
            Nueva Cartilla
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content> <primer-search /> </ion-content>
    <ion-modal ref="modal">
      <reporte-cartillas @back="modal.$el.dismiss()" />
    </ion-modal>
  </ion-page>
</template>

<script lang="ts">
import {
  IonButtons,
  IonButton,
  IonContent,
  IonHeader,
  IonMenu,
  IonMenuButton,
  IonPage,
  IonAvatar,
  IonBackButton,
  IonToolbar,
  IonIcon,
  IonNavLink,
  IonModal,
  IonRouterOutlet,
} from "@ionic/vue";
import { peopleOutline,personAddOutline,documentTextOutline, logOutSharp } from "ionicons/icons";
import PrimerSearch from "./PrimerSearch.vue";
import { useAuthStore } from "../Store/authStore";
import { useRouter } from "vue-router";
import BASE_URL from "../boot/config.js";
import { CapacitorHttp } from "@capacitor/core";
import { defineComponent, ref } from "vue";
import ReporteCartillas from "./reporteCartillas.vue";
export default defineComponent({
  components: {
    IonButtons,
    IonButton,
    IonContent,
    IonHeader,
    IonMenu,
    IonMenuButton,
    IonPage,
    IonAvatar,
    IonBackButton,
    IonToolbar,
    IonIcon,
    IonNavLink,
    IonRouterOutlet,
    PrimerSearch,
    ReporteCartillas,
    IonModal,
  },
  setup() {
    const router = useRouter();
    const auth = useAuthStore();
    const menu = ref();
    const modal = ref();
    const logout = async () => {
      try {
        const options = {
          url: BASE_URL + "/api/v1/auth/logout",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${useAuthStore.token}`,
          },
        };
        const response = await CapacitorHttp.post(options);
        if (response.status == 200) {
          auth.logout();
          router.replace({ name: "Login" });
        }
        console.log(response);
      } catch (error) {
        console.error(error);
      }
    };
    const pushPrimer = () => {
      router.push({ name: "Homecartillas" });
    };
    const openReport = () => {
      menu.value.$el.close();
      modal.value.$el.present();
    };
    const openCreateUsers = () => {
       router.push({ name: "Registro" });
    };
    const openVerUsers = () => {
       router.push({ name: "VerUsuarios" });
    };
    return {
      logout,
      documentTextOutline,
      personAddOutline,
      peopleOutline,
      logOutSharp,
      pushPrimer,
      auth,
      openCreateUsers,
      openVerUsers,
      modal,
      menu,
      openReport,
    };
  },
});
</script>

<style scoped lang="scss">
ion-button {
  --background: #f1b204 !important;
  --ion-color-contrast: black !important;
  font-size: 12px !important;
}
.color-custom {
  color: white;
}
.add-primer-button {
  font-size: 10px !important;
}
.header-md::after {
  background-image: none;
}
.menu-primer {
  .primer-header {
    padding-top: 25px;
    height: 100%;
    max-height: 250px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    .user-information {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 15px;
      .user-space {
        display: flex;
        flex-direction: row;
        align-items: center;
        color: black;
        .user-avatar {
          border: 2px solid #07166A;
          box-shadow: rgba(207, 126, 20, 0.25) 0px 6px 12px -2px,
            rgba(216, 127, 26, 0.3) 0px 3px 7px -3px;
        }
        .user-data {
          margin-left: 20px;
          font-size: 14px;
          text-align: center;
          .user-name {
            font-weight: bolder;
          }
          .space {
            height: 5px;
          }
        }
      }
    }
  }
  .primer-divider {
    hr.style-five {
      border: 0;
      height: 0; /* Firefox... */
      box-shadow: 0 0 10px 1px black;
    }
    hr.style-five:after {
      /* Not really supposed to work, but does */
      content: "\00a0"; /* Prevent margin collapse */
    }
  }
  .primer-body-menu {
    height: 100%;
  }
}
ion-toolbar {
  --ion-color-primary: white;

  --background: #07166A;
  --color: black;

  --border-width: 0;
  --border-style: none;
  --border-color: transparent;
  --padding-top: 5px;
  --padding-bottom: 5px;
}
ion-content {
  --color: black;
  ul {
    list-style: none;
    padding: 0;
    li {
      padding: 10px 0px;
      padding-left: 75px;
      color: black;
      display: flex;
      font-size: 13px;
      div {
        display: flex;
        align-items: center;
      }
      ion-icon {
        color: black;
        margin-right: 25px;
        font-size: 23px;
      }
    }
    li:active {
      background-color: rgb(230, 230, 230);
    }
  }
}
</style>
