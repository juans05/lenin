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
        {{ `${category.id}.0 ${category.name}` }}
      </div>
      <div class="help-text">
        SUBCATEGORIAS EN LAS QUE OBSERVA OPORTUNIDADES DE MEJORA O
        COMPORTAMIENTO RIESGOSO
      </div>
      <div class="sub-categories">
        <div
          class="sub-categorie"
          v-for="(subCat, index) in modifiedProps"
          :key="subCat"
        >
          <div class="divider-custom"></div>
          <div class="container-sub-cat">
            <div class="header-subCat">
              <div class="id-subCat">
                {{ `${category.id}.${subCat.index}` }}
              </div>
              <div class="subCat-name">
                {{ subCat.sub_act_id.name }}
              </div>
            </div>
            <ion-radio-group
              :value="subCat.is_risk"
              :allow-empty-selection="true"
              class="check-stupi"
            >
              <div class="container-check">
                <div class="content-checkbox">
                  <div class="checkbox-title">SEGURO</div>
                  <ion-radio
                    :value="0"
                    :disabled="true"
                    aria-label="Custom checkbox"
                  ></ion-radio>
                </div>
                <div class="content-checkbox">
                  <div class="checkbox-title">RIESGOSO</div>
                  <ion-radio
                    :value="1"
                    :disabled="true"
                    aria-label="Custom checkbox that is checked"
                  ></ion-radio>
                </div>
                <div class="content-checkbox">
                  <div class="checkbox-title">NO APLICA</div>
                  <ion-radio
                    :value="2"
                    :disabled="true"
                    aria-label="Custom checkbox"
                  ></ion-radio>
                </div>
              </div>
            </ion-radio-group>
            <div class="buttons-subCat" v-if="subCat.is_risk == 1">
              <ion-input
                class="bottom-mr"
                fill="outline"
                label="Barrera de comportamiento"
                label-placement="floating"
                :value="subCat.behavioral_barrier_id.name"
                :readonly="true"
              ></ion-input>
              <ion-input
                class="bottom-mr"
                fill="outline"
                label="Parte del cuerpo afectada"
                label-placement="floating"
                :value="subCat.body_part_id.name"
                :readonly="true"
              ></ion-input>
              <ion-input
                label="COMENTARIO"
                label-placement="floating"
                fill="outline"
                v-model="subCat.comment_obs"
                :readonly="true"
              ></ion-input>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div></div>
  </ion-content>
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
  IonInput,
  IonRadioGroup,
  IonItem,
  IonRadio,
} from "@ionic/vue";
import { ref, defineComponent, onMounted } from "vue";
import SelectBc from "./SelectBC.vue";
import SelectBp from "./SelectBP.vue";
import { arrowBackOutline } from "ionicons/icons";
import { useIndexStore } from "../../Store/indexStore";
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
    IonInput,
    IonRadioGroup,
    IonItem,
    IonRadio,
  },
  emits: ["selection-cancel", "save-data"],

  props: {
    subCategories: { type: Object },
    category: { type: Object },
  },
  setup(props, { emit }) {
    const modifiedProps = ref(JSON.parse(JSON.stringify(props.subCategories)));
    const indexStore = useIndexStore();
    const backRoute = () => {
      emit("selection-cancel");
    };
    const setIndex = () => {
      for (let index = 0; index < modifiedProps.value.length; index++) {
        let ctInx = indexStore.getIndexAct(
          props.category.id,
          modifiedProps.value[index].sub_act_id.name
        );
        modifiedProps.value[index] = {
          ...modifiedProps.value[index],
          index: ctInx,
        };
      }
    };
    onMounted(() => {
      setIndex();
    });
    return {
      modifiedProps,
      arrowBackOutline,
      backRoute,
      indexStore,
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
  .container-check {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 25px;
    margin-bottom: 10px;
    .checkbox-title {
      font-size: 13px;
    }
    .content-checkbox {
      display: flex;
      margin-right: 15px;
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
ion-input {
  margin: 15px 0;
  text-transform: uppercase;
  font-size: 15px;
  font-weight: bold;
  :deep(input) {
    font-size: 13px !important;
    font-weight: 400 !important;
  }
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
      padding: 0 0 0 35px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      transition: height 0.5s;
      .lists-subCat {
        margin-bottom: 10px;
        width: 100%;
        overflow: hidden;
        .select-barrier,
        .select-body {
          position: relative;
          display: inline-block;
          width: 100%;
          padding: 5px 0;
          margin-bottom: 5px;

          .title-list {
            font-size: 12px;
            padding-top: -15px;
            position: absolute;
            top: 0px;
            left: 10px;
            z-index: 1;
            background-color: white;
            padding: 0 4px;
          }
          .wrapper {
            font-size: 15px;
            text-transform: uppercase;
            border: 1px solid #b3b3b3;
            padding: 12px;
            border-radius: 5px;
            min-width: 100%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
}
ion-content {
  --background: #ffffff;
  --color: black;
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
