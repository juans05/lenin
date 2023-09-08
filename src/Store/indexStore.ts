import { defineStore } from "pinia";
import { createPersistedState } from "pinia-plugin-persistedstate";

interface Index {
  acts: Array<any>;
  conditions: Array<any>;
}

export const useIndexStore = defineStore({
  id: "index",
  state: (): Index => ({
    acts: [],
    conditions: [],
  }),
  persist: true,
  actions: {
    setActs(acts: Array<any>) {
      this.acts = acts;
    },
    setConditions(conditions: Array<any>) {
      this.conditions = conditions;
    },
    clearIndex() {
      this.conditions = [];
      this.acts = [];
    },
    getIndexAct(id: number, sbCtId: string): number {
      let inCond = -2;
      for (let i = 0; i < this.acts[id - 1].subActs.length; i++) {
        const el = this.acts[id - 1].subActs[i];
        if (sbCtId == el.name) {
          inCond = i;
          break;
        }
      }
      return inCond + 1;
    },
    getIndexCond(id: number, sbCtId: string): any {
      let inCond = -2;
      for (let i = 0; i < this.conditions[id - 1].subConditions.length; i++) {
        const el = this.conditions[id - 1].subConditions[i];
        if (sbCtId == el.name) {
          inCond = i;
          break;
        }
      }
      return inCond + 1;
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
