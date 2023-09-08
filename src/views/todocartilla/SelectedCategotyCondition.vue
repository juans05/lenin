<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-icon :icon="arrowBackOutline" @click="backRoute"></ion-icon>
      </ion-buttons>
      <ion-title class="cartilla-title">SUB CATEGORIA</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <div class="content-container">
      <div class="title">
        {{ `${modifiedProps.id}.0 ${modifiedProps.name}` }}
      </div>
      <div class="help-text">
        MARQUE LAS SUBCATEGORIAS EN LAS QUE OBSERVA OPORTUNIDADES DE MEJORA O
        COMPORTAMIENTO RIESGOSO
      </div>
      <div class="sub-categories">
        <div
          class="sub-categorie"
          v-for="(subCat, index) in modifiedProps.subConditions"
          :key="subCat"
        >
          <div class="divider-custom"></div>

          <div class="container-sub-cat">
            <div class="header-subCat">
              <div
                class="id-subCat"
                :class="{ 'selected-danger': subCat.haveRisk }"
              >
                {{ `${modifiedProps.id}.${index + 1}` }}
              </div>
              <div class="subCat-name">
                {{ subCat.name }}
              </div>
            </div>
            <ion-radio-group
              :value="subCat.is_risk"
              :allow-empty-selection="true"
              class="check-stupi"
              @ion-change="changeSelected($event, index)"
            >
              <div class="container-check">
                <div class="content-checkbox">
                  <div class="checkbox-title">SEGURO</div>
                  <ion-radio
                    :value="0"
                    aria-label="Custom checkbox"
                  ></ion-radio>
                </div>
                <div class="content-checkbox">
                  <div class="checkbox-title">RIESGOSO</div>
                  <ion-radio
                    :value="1"
                    aria-label="Custom checkbox that is checked"
                  ></ion-radio>
                </div>
                <div class="content-checkbox">
                  <div class="checkbox-title">NO APLICA</div>
                  <ion-radio
                    :value="2"
                    aria-label="Custom checkbox"
                  ></ion-radio>
                </div>
              </div>
            </ion-radio-group>
            <div class="buttons-subCat">
              <div class="lists-subCat" v-if="subCat.is_risk == 1">
                <ion-radio-group
                  :allow-empty-selection="false"
                  :value="subCat.riskLevel"
                  @ion-change="changeSelect($event, index)"
                  ><ion-item style="--background: white">
                    <ion-radio
                      value="alto"
                      justify="space-between"
                      style="color: black"
                      >Alto</ion-radio
                    > </ion-item
                  ><ion-item style="--background: white">
                    <ion-radio
                      value="medio"
                      justify="space-between"
                      style="color: black"
                      >Medio</ion-radio
                    ></ion-item
                  ><ion-item style="--background: white">
                    <ion-radio
                      value="bajo"
                      justify="space-between"
                      style="color: black"
                      >Bajo</ion-radio
                    ></ion-item
                  >
                </ion-radio-group>
                <ion-input
                  label="COMENTARIO"
                  label-placement="floating"
                  fill="outline"
                  v-model="subCat.comment"
                  placeholder="INGRESE EL COMENTARIO"
                ></ion-input>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div></div>
  </ion-content>
  <div class="save-options">
    <ion-button @click="backRoute">CANCELAR</ion-button>
    <ion-button @click="saveData" class="save-data">GUARDAR</ion-button>
  </div>
  <ion-alert
    :is-open="isOpen"
    header="ALERTA"
    sub-header="CAMPOS IMCOMPLETOS"
    message="Selccione el Nivel de Riesgo e ingrese un Comentario para las sub categorias marcadas"
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
  IonCheckbox,
  IonSelect,
  IonFooter,
  IonSelectOption,
  IonModal,
  IonAlert,
  IonIcon,
  IonRadio,
  IonRadioGroup,
  IonItem,
  IonInput,
} from "@ionic/vue";
import { ref, onBeforeMount, defineComponent, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../Store/authStore";
import SelectBc from "./SelectBC.vue";
import SelectBp from "./SelectBP.vue";
import { arrowBackOutline } from "ionicons/icons";
import createApi from "../../boot/CapacitorHTTP";
export default defineComponent({
  components: {
    IonToolbar,
    IonTitle,
    IonHeader,
    IonButtons,
    IonContent,
    IonCheckbox,
    IonFooter,
    IonBackButton,
    IonSelectOption,
    IonSelect,
    SelectBc,
    SelectBp,
    IonModal,
    IonButton,
    IonAlert,
    IonIcon,
    IonRadio,
    IonRadioGroup,
    IonItem,
    IonInput,
  },
  emits: ["selection-cancel", "save-data"],

  props: {
    subCategories: { type: Object },
  },
  setup(props, { emit }) {
    const isOpen = ref(false);
    const auth = useAuthStore();
    const bodyParts = ref([]);
    const barriers = ref([]);
    const router = useRouter();
    const api = createApi(auth, router);
    const modifiedProps = ref({ ...props.subCategories });
    const getBodyParts = async () => {
      try {
        const response = await api.get("/api/v1/body-parts");
        if (response.status == 200) {
          bodyParts.value = [...response.data];
        }
      } catch (error) {
        console.error(error);
      }
    };
    const getBarriers = async () => {
      try {
        const response = await api.get("/api/v1/barriers");
        if (response.status == 200) {
          barriers.value = [...response.data];
        }
      } catch (error) {
        console.error(error);
      }
    };
    const saveData = () => {
      let errorData = false;
      for (
        let index = 0;
        index < modifiedProps.value.subConditions.length;
        index++
      ) {
        const element = modifiedProps.value.subConditions[index];
        if (
          element.is_risk == "1" &&
          (!element.riskLevel || !element.comment)
        ) {
          errorData = true;
          break;
        }
      }
      if (errorData) {
        setOpen(true);
      } else {
        emit("save-data", modifiedProps.value);
      }
    };
    const setOpen = (state: boolean) => {
      isOpen.value = state;
    };
    const backRoute = () => {
      emit("selection-cancel");
    };
    const changeSelect = (event: Object, i: number) => {
      const selection = event.detail.value;
      modifiedProps.value.subConditions[i].riskLevel = selection;
    };
    const changeSelected = (event: Object, i: number) => {
      const selection = event.detail.value;
      modifiedProps.value.subConditions[i].is_risk = selection;
      if (selection != 1) {
        modifiedProps.value.subConditions[i].riskLevel = "";
        modifiedProps.value.subConditions[i].comment = "";
      }
    };
    onMounted(() => {
      getBodyParts();
      getBarriers();
    });
    return {
      bodyParts,
      barriers,
      modifiedProps,
      saveData,
      isOpen,
      setOpen,
      arrowBackOutline,
      backRoute,
      changeSelect,
      changeSelected,
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
    font-weight: bold;
  }
}
ion-content {
  --padding-bottom: 70px;
  --color: black;
  :deep(.item-native) {
    --background: white;
  }
  .container-check {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 25px;
    margin-bottom: 15px;
    .checkbox-title {
      font-size: 13px;
    }
    .content-checkbox {
      display: flex;
      margin-right: 10px;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  }
}

ion-icon {
  padding-left: 8px;
  color: white;
  font-size: 28px;
}

.save-options {
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 50px;
  padding: 0;
  margin: 0;
  z-index: 5;
  background-color: #07166A;
  ion-button {
    --color: black;
    width: 45%;
    height: 34px;
    --background: white;
  }
  .save-data {
    --color: #07166A !important;
    font-weight: bold;
  }
}
.content-container {
  min-width: 100%;
  padding-bottom: 50px;
  .sub-categories {
    margin-top: 15px;
  }
  .sub-categorie {
    .divider-custom {
      height: 1px;
      width: 100%;
      border-top: 0.04rem solid #07166A;
      margin-bottom: 10px;
    }
    .container-sub-cat {
      padding: 0px 5px;
    }
    .header-subCat {
      display: flex;
      align-items: center;
      font-size: 13px;
      padding-bottom: 10px;
      .id-subCat {
        font-weight: bold;
        min-width: 35px;
        font-size: 15px;
      }
      .selected-danger {
        color: #07166A;
      }
      .subCat-name {
        text-align: justify;
        width: 100%;
      }
      ion-checkbox {
        padding-left: 15px;
        --size: 25px;
      }
    }
    .buttons-subCat {
      padding: 0 0 0 30px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      transition: height 0.5s;
      .lists-subCat {
        margin-bottom: 10px;
        width: 100%;
        overflow: hidden;
      }
    }
    ion-input {
      margin-top: 15px;
    }
  }
}
.title {
  padding: 8px;
  text-align: center;
  font-weight: bold;
  margin-bottom: 10px;
  text-transform: uppercase;
}
.help-text {
  font-size: 13px;
  text-align: justify;
  ul {
    padding-left: 20px;
    font-weight: bold;
  }
}
</style>
