<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-icon :icon="arrowBackOutline" @click="backRoute"></ion-icon>
      </ion-buttons>
      <ion-title class="cartilla-title">NUEVA CARTILLA</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content class="ion-padding" v-if="savedPrimer">
    <div class="primer-title">CARTILLA DE OBSERVACIÓN DE COMPORTAMIENTO</div>
    <form @submit="submitForm">
      <ion-input
        class="bottom-mr"
        fill="outline"
        label="Actividad observada"
        label-placement="floating"
        v-model="primerForm.primer.warned_activity"
        placeholder="Escriba la actividad observada"
        ref="refWarnedActivity"
        :class="{ 'input-error': !validationList[0] }"
        @ionInput="validateWarnerdActivity"
      ></ion-input>
      <ion-select
        class="bottom-mr"
        fill="outline"
        label="Especialidad"
        label-placement="floating"
        v-model="primerForm.primer.specialty_id"
        placeholder="Seleccione una especialidad"
        :searchable="true"
        :class="{ 'input-error': !validationList[3] }"
        ref="refSpecialty"
        @ionChange="validateSpecialty"
      >
        <ion-select-option
          v-for="specialty in especialidades"
          :value="specialty.id"
          :key="specialty.id"
          >{{ specialty.name }}</ion-select-option
        >
      </ion-select>
      <ion-select
        class="bottom-mr"
        fill="outline"
        label="Horario"
        label-placement="floating"
        v-model="primerForm.primer.horario_id"
        placeholder="Seleccione un horario"
        :searchable="true"
        :class="{ 'input-error': !validationList[3] }"
        ref="refHorario"
        @ionChange="validateHorario"
      >
        <ion-select-option
          v-for="horario in fhorario"
          :value="horario.id"
          :key="horario.id"
          >{{ horario.name }}</ion-select-option
        >
      </ion-select>
      <ion-row
        class="bottom-section"
        style="display: flex; justify-content: space-between"
      >
        <ion-col
          style="min-width: 50%"
          size="12"
          size-md="4"
          v-for="(button, index) in buttons"
          :key="index"
        >
          <ion-button
            style="width: 100%"
            class="button-option"
            expand="block"
            @click="buttonClicked(index)"
          >
            <ion-label>{{ button.text }}</ion-label>
          </ion-button>
        </ion-col>
      </ion-row>
      <ion-button expand="block" type="submit" :disabled="disableB"
        >Subir cartilla</ion-button
      >
    </form>
  </ion-content>
  <ion-content v-else>
    <div class="message-saved">
      <div class="custom-message">LA CARTILLA HA SIDO CREADA EXITOSAMENTE</div>
      <ion-icon :icon="checkmarkCircleOutline"></ion-icon>
      <!--<ion-button>ver</ion-button> -->
    </div></ion-content
  >
  <ion-alert
    :is-open="alertLenght"
    header="ALERTA"
    sub-header="CAMPOS IMCOMPLETOS"
    message="Se necesita por lo menos una Condicion y un Acto para registrar una cartilla"
    :buttons="['OK']"
    @didDismiss="alertLenght = false"
  ></ion-alert>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { usePrimerStore } from "../Store/primerStore";
import {
  IonBackButton,
  IonTitle,
  IonButtons,
  IonToolbar,
  IonHeader,
  IonCol,
  IonRow,
  IonLabel,
  IonButton,
  IonGrid,
  IonContent,
  IonPage,
  IonIcon,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonAlert,
} from "@ionic/vue";
import { arrowBackOutline, checkmarkCircleOutline } from "ionicons/icons";
import { useAuthStore } from "../Store/authStore";
import createApi from "../boot/CapacitorHTTP";
export default defineComponent({
  components: {
    IonBackButton,
    IonTitle,
    IonButtons,
    IonToolbar,
    IonHeader,
    IonCol,
    IonRow,
    IonLabel,
    IonButton,
    IonGrid,
    IonContent,
    IonPage,
    IonIcon,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonAlert,
  },
  props: {
    name: { type: String },
  },
  setup() {
    const authStore = useAuthStore();
    const primerStore = usePrimerStore();
    const savedPrimer = ref(true);
    const minas = ref([]);
    const lugares = ref([]);
    const especialidades = ref([]);
    const fhorario = ref([]);
    const unidad = ref("");
    const mina = ref("");
    const especialidad = ref("");
    const lugar = ref("");
    const disableB = ref(false);
    const actividad = ref("");
    const router = useRouter();
    const refWarnedActivity = ref();
    const refWCompanyWorker = ref();
    const alertLenght = ref(false);
    const refPlace = ref();
    const refSpecialty = ref();
    const validationList = ref([true, true, true, true]);
    const api = createApi(authStore, router);

    const primerForm = ref({
      primer: {
        warned_activity: "",
        specialty_id: -1,
        horario_id: -1,
        user_id: 0,
      },
      acts: [],
      conditions: [],
    });
    const buttons = [
      {
        text: "Condiciones",
      },
      {
        text: "Actos",
      },
      /*
      {
        text: "Recursos",
      },
      */
    ];
    const getEspecialidad = async () => {
      try {
        const response = await api.get("/api/v1/specialty");
        especialidades.value = response.data;
      } catch (error) {
        console.error(error);
      }
    };
    const getHorario = async () => {
      try {
        const response = await api.get("/api/v1/horario");
        fhorario.value = response.data;
      } catch (error) {
        console.error(error);
      }
    };
    const submitForm = async (event: Object) => {
      event.preventDefault();
      validateWarnerdActivity();
      validateSpecialty();
      validateHorario();
      const todosSonTrue = validationList.value.every((element) => {
        return element === true;
      });

      if (todosSonTrue) {
        console.log(primerStore.getActs);
        console.log(primerStore.getConditions);

        disableB.value = true;
        const acts = JSON.parse(JSON.stringify(primerStore.getActs));
        const conditions = JSON.parse(
          JSON.stringify(primerStore.getConditions)
        );
        if (primerStore.getActs != null) {
          for (let i = 0; i < acts.length; i++) {
            const element = acts[i];
            if (element.checked) {
              for (let y = 0; y < element.subActs.length; y++) {
                const act = element.subActs[y];
                if (act.is_risk !== -1) {
                  primerForm.value.acts.push({
                    sub_act_id: act.id,
                    behavioral_barrier_id: act.bc.id,
                    body_part_id: act.pcel.id,
                    is_risk: act.is_risk,
                    comment_obs: act.comment,
                  });
                }
              }
            }
          }
        }
        if (primerStore.getConditions != null) {
          let risk;
          for (let x = 0; x < conditions.length; x++) {
            const element = conditions[x];
            if (element.checked) {
              for (let y = 0; y < element.subConditions.length; y++) {
                const condition = element.subConditions[y];
                if (condition.is_risk !== -1) {
                  switch (condition.riskLevel) {
                    case "alto":
                      risk = 1;
                      break;
                    case "medio":
                      risk = 2;
                      break;
                    case "bajo":
                      risk = 3;
                      break;
                  }
                  primerForm.value.conditions.push({
                    risk_id: risk,
                    is_risk: condition.is_risk,
                    sub_condition_id: condition.id,
                    comment_obs: condition.comment,
                  });
                }
              }
            }
          }
        }
        primerForm.value.primer.user_id = authStore.user?.id;
        console.log(primerForm.value);
        if (
          primerForm.value.acts.length == 0 ||
          primerForm.value.conditions.length == 0
        ) {
          alertLenght.value = true;
        } else {
          try {
            const response = await api.post(
              "/api/v1/primers/create",
              primerForm.value
            );
            if (response.status === 200) {
              savedPrimer.value = false;
              primerStore.clearPrimer();
            }
            console.log(response);
          } catch (error) {
            console.error(error);
          }
        }
      }
      disableB.value = false;
    };
    const buttonClicked = (index: number) => {
      primerStore.setPrimer(primerForm.value.primer);
      router.push({ name: buttons[index].text });
    };
    const backRoute = () => {
      primerStore.clearPrimer();
      router.go(-1);
    };
    /**Validators */
    const validateWarnerdActivity = () => {
      validationList.value[0] = true;
      const value = primerForm.value.primer.warned_activity;
      if (value === "") {
        validationList.value[0] = false;
        disableB.value = false;
      }
    };
    const validateSpecialty = () => {
      validationList.value[3] = true;
      const value = primerForm.value.primer.specialty_id;
      if (value === -1) {
        validationList.value[3] = false;
        disableB.value = false;
      }
    };
    const validateHorario = () => {
      validationList.value[3] = true;
      const value = primerForm.value.primer.horario_id;
      if (value === -1) {
        validationList.value[3] = false;
        disableB.value = false;
      }
    };
    onMounted(() => {
      if (primerStore.dataPrimer != null) {
        primerForm.value.primer = { ...primerStore.dataPrimer };
      }
      getEspecialidad();
      getHorario();
    });
    return {
      buttons,
      buttonClicked,
      backRoute,
      arrowBackOutline,
      checkmarkCircleOutline,
      submitForm,
      unidad,
      mina,
      minas,
      lugar,
      lugares,
      especialidad,
      especialidades,
      fhorario,
      actividad,
      primerForm,
      savedPrimer,
      refWarnedActivity,
      refWCompanyWorker,
      disableB,
      refPlace,
      refSpecialty,
      validateWarnerdActivity,
      validateHorario,
      validateSpecialty,
      validationList,
      alertLenght,
    };
  },
});
</script>

<style scoped lang="scss">
.input-error {
  --border-color: red !important;
  --color: red !important;
  --highlight-color-focused: red;
}
ion-toolbar {
  --ion-color-primary: white;

  --background: #07166a !important;
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
ion-content {
  .primer-title {
    text-align: center;
    padding-bottom: 10px;
    margin-bottom: 20px;
    border-bottom: 0.03rem solid #07166a;
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

ion-toolbar {
  --background: #ffffff;
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
    color: #07166a;
    font-size: 50px;
    margin-bottom: 25px;
  }
  ion-button {
    max-width: 80px;
  }
}
.button-option {
  --background: rgb(220, 234, 255);
  --color: #07166a;
  font-weight: bold;
}
.title-orange {
  color: white;
}
ion-nav-link {
  width: 100%;
}
ion-button {
  --background: #07166a;
  --color: #fcf8f5;
  --border-color: #07166a;
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
  color: #07166a;
}
.text-center {
  text-align: center;
}
</style>
