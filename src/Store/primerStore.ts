import { defineStore } from "pinia";
import { createPersistedState } from "pinia-plugin-persistedstate";

interface Primer {
  acts: Array | null;
  conditions: Array | null;
  dataPrimer: Object | null;
}

export const usePrimerStore = defineStore({
  id: "primer",
  state: (): Primer => ({
    acts: null,
    conditions: null,
    dataPrimer: null,
  }),
  persist: true,
  actions: {
    setActs(acts: Array) {
      this.acts = acts;
    },
    setConditions(conditions: Array) {
      this.conditions = conditions;
    },
    setPrimer(primer: Object) {
      this.dataPrimer = primer;
    },
    clearPrimer() {
      this.dataPrimer = null;
      this.conditions = null;
      this.acts = null;
    },
    getAtc() {
      return this.acts;
    },
  },
  getters: {
    getActs(): Array<any> | null {
      return this.acts;
    },
    getConditions(): Array<any> | null {
      return this.conditions;
    },
  },
});
