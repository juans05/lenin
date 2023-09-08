<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-icon :icon="arrowBackOutline" @click="cancelChanges()"></ion-icon>
      </ion-buttons>
      <ion-searchbar
        placeholder="Buscar parte del cuerpo"
        @ionInput="searchbarInput($event)"
      ></ion-searchbar>
    </ion-toolbar>
  </ion-header>

  <ion-content>
    <ion-list id="modal-list">
      <ion-item
        v-for="(item, index) in filteredItems"
        :key="item.value"
        @click="confirmChanges(item)"
      >
        <div class="index-list">
          <div class="prefix-item">{{ getLetterPrefix(item.id - 1) }}</div>
          <div class="item-name">{{ item.name }}</div>
        </div>
      </ion-item>
      <div style="height: 50px"></div>
    </ion-list>
  </ion-content>
</template>

<script lang="ts">
import {
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonTitle,
  IonIcon,
  IonSearchbar,
  IonToolbar,
} from "@ionic/vue";
import type { SearchbarCustomEvent } from "@ionic/vue";
import { defineComponent, ref } from "vue";
import { arrowBackOutline } from "ionicons/icons";

export default defineComponent({
  props: {
    items: Array,
    selectedItems: Object,
  },
  emits: ["selection-change", "selection-cancel"],
  components: {
    IonButton,
    IonButtons,
    IonCheckbox,
    IonContent,
    IonHeader,
    IonItem,
    IonList,
    IonTitle,
    IonSearchbar,
    IonToolbar,
    IonIcon,
  },
  setup(props, { emit }) {
    const filteredItems = ref([...props.items]);
    const workingSelectedValues = ref({ ...props.selectedItems });

    const confirmChanges = (item: Object) => {
      emit("selection-change", item);
    };

    const searchbarInput = (ev: SearchbarCustomEvent) => {
      filterList(ev.target.value);
    };

    /**
     * Update the rendered view with
     * the provided search query. If no
     * query is provided, all data
     * will be rendered.
     */
    const filterList = (searchQuery: string | undefined) => {
      /**
       * If no search query is defined,
       * return all options.
       */
      if (searchQuery === undefined) {
        filteredItems.value = [...props.items];
      } else {
        /**
         * Otherwise, normalize the search
         * query and check to see which items
         * contain the search query as a substring.
         */
        const normalizedQuery = searchQuery.toLowerCase();
        filteredItems.value = props.items.filter((item) => {
          return item.name.toLowerCase().includes(normalizedQuery);
        });
      }
    };
    const getLetterPrefix = (index: number) => {
      return index + 1 + ".";
    };
    const cancelChanges = () => {
      emit("selection-cancel");
    };
    return {
      filteredItems,
      workingSelectedValues,
      confirmChanges,
      searchbarInput,
      getLetterPrefix,
      arrowBackOutline,
      cancelChanges,
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
}

ion-list {
  --background: white;
  --color: black;
  background: white;
  ion-item {
    padding: 5px 0;
    --background: white;
    --color: black;
  }
}
ion-icon {
  padding-left: 8px;
  color: white;
  font-size: 28px;
}
ion-searchbar {
  width: 100%;
  --box-shadow: none;
}
.index-list {
  display: flex;
  align-items: center;
  text-transform: uppercase;
  .prefix-item {
    min-width: 25px;
    font-weight: bold;
  }
  .item-name {
    font-size: 14px;
  }
}
</style>
