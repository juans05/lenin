<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-icon :icon="arrowBackOutline" @click="backRoute()"></ion-icon>
      </ion-buttons>
      <ion-title class="cartilla-title">ACTOS</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content class="ion-padding">
    <div class="message-void" v-if="!acts?.length">
      PARECE QUE ESTA CARTILLA NO TIENE ACTOS REGITRADOS
    </div>
    <ion-grid v-else>
      <ion-row v-for="(button, index) in listActs" :key="index">
        <div class="divider-list"></div>
        <ion-col class="button-condition">
          <ion-button class="custom-label" @click="openActModal(index)">
            <div class="id-condition">
              <strong>{{ button.id }}.0</strong>
            </div>
            <span> {{ button.name }}</span>
          </ion-button>
        </ion-col>
      </ion-row>
    </ion-grid>
  </ion-content>
  <ion-modal ref="modal">
    <view-act-category
      :subCategories="JSON.parse(JSON.stringify(selectedButton))"
      :category="JSON.parse(JSON.stringify(selectedCategory))"
      @selection-cancel="modal.$el.dismiss()"
    />
  </ion-modal>
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
} from "@ionic/vue";
import { ref, defineComponent, onMounted } from "vue";
import { arrowBackOutline } from "ionicons/icons";
import ViewActCategory from "../todocartilla/ViewActCategory.vue";

export default defineComponent({
  name: "Home",
  props: { acts: { type: Array } },
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
    IonNavLink,
    IonIcon,
    IonModal,
    IonFooter,
    IonAlert,
    ViewActCategory,
  },
  emits: ["back"],
  setup(props, { emit }) {
    const selectedCategory = ref();
    const modal = ref();
    const selectedButton = ref();
    const listActs = ref([]);
    const listConditions = ref([]);
    const toggleChanged = (buttonIndex: number) => {
      let selected = listConditions.value[buttonIndex];
      selected.checked = !selected.checked;
      if (!selected.checked) {
        clearSelected(buttonIndex);
      }
    };
    const backRoute = () => {
      emit("back");
    };
    const openActModal = (selectedAct: number) => {
      selectedCategory.value = listActs.value[selectedAct];
      let subCategories = [];
      props.acts?.forEach((obj) => {
        if (obj.sub_act_id.act_id.id === selectedCategory.value.id) {
          subCategories.push(obj);
        }
      });
      selectedButton.value = subCategories;
      console.log(selectedButton.value);
      modal.value.$el.present();
    };
    const parseData = () => {
      const uniqueActs = [];
      const ids = [];

      props.acts?.forEach((obj) => {
        if (!ids.includes(obj.sub_act_id.act_id.id)) {
          uniqueActs.push(obj.sub_act_id.act_id);
          ids.push(obj.sub_act_id.act_id.id);
        }
      });
      uniqueActs.forEach((obj) => {
        listActs.value.push(obj);
      });
    };
    onMounted(() => {
      parseData();
    });
    return {
      toggleChanged,
      listConditions,
      arrowBackOutline,
      backRoute,
      modal,
      openActModal,
      selectedButton,
      listActs,
      selectedCategory,
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
.message-void {
  display: flex;
  justify-content: center;
  text-align: center;
  align-items: center;
  height: 92%;
  width: 100%;
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
ion-row {
  margin: 0 !important;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 0;
  .divider-list {
    height: 1px;
    width: 100%;
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
