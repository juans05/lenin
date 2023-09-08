<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-icon :icon="arrowBackOutline" @click="backRoute()"></ion-icon>
      </ion-buttons>
      <ion-title class="cartilla-title">CONDICIONES</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content class="ion-padding">
    <div class="loader-container" v-if="loader">
      <LoaderApp />
    </div>
    <ion-grid v-else>
      <div class="help-text">
        MARQUE LA CATEGORIA DE LAS CONDICIONES OBSERVADAS E INGRESE A LOS
        SELECCIONADOS
      </div>
      <ion-row v-for="(button, index) in listConditions" :key="index">
        <div class="divider-list"></div>
        <ion-col class="button-condition">
          <ion-button
            class="custom-label"
            :disabled="!button.checked"
            @click="openActModal(index)"
          >
            <div class="id-condition">
              <strong>{{ button.id }}.0</strong>
            </div>
            <span> {{ button.name }}</span>
          </ion-button>
        </ion-col>
        <ion-col class="selector-condition">
          <ion-toggle
            :checked="button.checked"
            @ionChange="toggleChanged(index)"
          ></ion-toggle>
        </ion-col>
      </ion-row>
    </ion-grid>
  </ion-content>
  <ion-footer>
    <ion-toolbar>
      <div class="save-options">
        <ion-button color="dark" @click="backRoute">CANCELAR</ion-button>
        <ion-button color="dark" @click="saveData" class="save-data"
          >GUARDAR</ion-button
        >
      </div></ion-toolbar
    ></ion-footer
  >
  <ion-modal ref="modal">
    <SelectedCategoryCondition
      :subCategories="
        JSON.parse(JSON.stringify(listConditions[selectedButton]))
      "
      @selection-cancel="modal.$el.dismiss()"
      @save-data="saveConditon"
    />
  </ion-modal>
  <ion-alert
    :is-open="isOpen"
    header="ALERTA"
    sub-header="CAMPOS IMCOMPLETOS"
    message="Las categorias seleccionadas deben tener por lo menos una subcategoria"
    :buttons="['OK']"
    @didDismiss="setOpen(false)"
  ></ion-alert>
</template>

<script lang="ts">
import {
  IonButton,
  IonCol,
  IonBackButton,
  IonContent,
  IonGrid,
  IonHeader,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
  IonToggle,
  IonLabel,
  IonButtons,
  IonNavLink,
  IonIcon,
  IonModal,
  IonFooter,
  IonAlert,
  IonRadioGroup,
  IonItem,
  IonRadio,
} from "@ionic/vue";
import { onMounted, ref, defineComponent, reactive } from "vue";
import LoaderApp from "../LoaderApp.vue";
import { arrowBackOutline } from "ionicons/icons";
import { useRouter } from "vue-router";
import SelectedCategoryCondition from "../todocartilla/SelectedCategotyCondition.vue";
import { useAuthStore } from "../../Store/authStore";
import { usePrimerStore } from "../../Store/primerStore";
import createApi from "../../boot/CapacitorHTTP";

export default defineComponent({
  name: "Home",
  components: {
    IonButton,
    IonCol,
    IonContent,
    IonGrid,
    IonHeader,
    IonPage,
    IonRow,
    IonTitle,
    IonToolbar,
    IonToggle,
    IonLabel,
    IonBackButton,
    IonButtons,
    LoaderApp,
    IonNavLink,
    SelectedCategoryCondition,
    IonIcon,
    IonModal,
    IonFooter,
    IonAlert,
    IonRadioGroup,
    IonItem,
    IonRadio,
  },
  setup(props, { emit }) {
    const isOpen = ref(false);
    const modal = ref();
    const selectedButton = ref();
    const primerStore = usePrimerStore();
    const router = useRouter();
    const auth = useAuthStore();
    const listConditions = ref([]);
    const loader = ref(true);
    const api = createApi(auth, router);

    const toggleChanged = (buttonIndex: number) => {
      let selected = listConditions.value[buttonIndex];
      selected.checked = !selected.checked;
      if (!selected.checked) {
        clearSelected(buttonIndex);
      }
    };
    const clearSelected = (i: number) => {
      for (let y = 0; y < listConditions.value[i].subConditions.length; y++) {
        listConditions.value[i].subConditions[y] = {
          ...listConditions.value[i].subConditions[y],
          is_risk: -1,
          riskLevel: "",
          comment: "",
        };
      }
    };
    const getConditions = async () => {
      try {
        if (primerStore.conditions != null) {
          const conditions = JSON.parse(
            JSON.stringify(primerStore.getConditions)
          );
          listConditions.value = conditions;
          loader.value = false;
        } else {
          const response = await api.get("/api/v1/conditions");
          if (response.status == 200) {
            listConditions.value = [...response.data];
            for (let index = 0; index < listConditions.value.length; index++) {
              for (
                let y = 0;
                y < listConditions.value[index].subConditions.length;
                y++
              ) {
                listConditions.value[index].subConditions[y] = {
                  ...listConditions.value[index].subConditions[y],
                  is_risk: -1,
                  riskLevel: "",
                };
              }
              listConditions.value[index] = {
                ...listConditions.value[index],
                checked: false,
              };
            }
            loader.value = false;
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    const backRoute = () => {
      router.go(-1);
    };
    const openActModal = (selectedAct: number) => {
      selectedButton.value = selectedAct;
      modal.value.$el.present();
    };
    const saveData = () => {
      let errorPrimer = false;
      console.log(listConditions.value);
      for (let index = 0; index < listConditions.value.length; index++) {
        const element = listConditions.value[index];
        if (element.checked) {
          errorPrimer = !element.subConditions.some(
            (obj) => obj.is_risk !== -1
          );
          if (errorPrimer) {
            break;
          }
        }
      }
      if (errorPrimer) {
        setOpen(true);
      } else {
        primerStore.setConditions(listConditions.value);
        backRoute();
      }
    };
    const setOpen = (state: boolean) => {
      isOpen.value = state;
    };
    const saveConditon = (event: Object) => {
      listConditions.value[event.id - 1] = event;
      modal.value.$el.dismiss();
    };
    onMounted(() => {
      getConditions();
    });
    return {
      toggleChanged,
      listConditions,
      loader,
      arrowBackOutline,
      backRoute,
      modal,
      openActModal,
      selectedButton,
      saveData,
      isOpen,
      setOpen,
      saveConditon,
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
ion-footer {
  .save-options {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 0 10px;
  }
  ion-button {
    --background: white;
    --color: black;
    width: 100%;
  }
  .save-data {
    --color: #07166A !important;
    font-weight: bold;
  }
}
.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

ion-content {
  --background: #ffffff;
  --color: black;
}

ion-toolbar {
  --background: #ffffff;
}
ion-grid {
  padding: 10px 0px;
}

.help-text {
  text-align: center;
  margin-bottom: 10px;
  font-size: 15px;
}
ion-row {
  margin: 0 !important;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 0;
  .divider-list {
    height: 1px;
    width: 100%;
    border-top: 0.02rem solid #07166A;
    margin-bottom: 10px;
  }
  ion-col {
    display: flex;
    align-items: flex-start;
    padding: 0;
  }
  .button-condition {
    min-width: 85%;
    margin: 0;
    padding: 0;
    .id-condition {
      width: 100%;
      max-width: 34px;
      margin-right: 5px;
      font-weight: bolder;
      font-size: 15px;
    }
    ion-button {
      font-size: 12px;
      min-height: 62px !important;
      white-space: normal;
      word-break: break-word;
      padding: 0 !important;
      ion-nav-link {
        min-width: 110%;
        margin-right: 3px;
        padding: 0 7px;
        margin: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
      }
      span {
        padding: 0px;
        width: 100%;
        text-align: left;
      }
    }
  }
  .selector-condition {
    display: flex;
    justify-content: center;
  }
}

.title-orange {
  color: #07166A;
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
  --color: #07166A;
  --unchecked-color: #07166A;
}

ion-title {
  font-size: 20px;
  font-weight: bold;
  color: #07166A;
}

.button-text {
  text-align: left;
}
</style>
