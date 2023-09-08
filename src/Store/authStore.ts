import { defineStore } from "pinia";
import { createPersistedState } from "pinia-plugin-persistedstate";

interface AuthState {
  token: string | null;
  user: User | null;
}

interface User {
  id: number;
  charge: string;
  firstname: string;
  lastname: string;
  email: string;
  dni: string;
  role: string;
}

export const useAuthStore = defineStore({
  id: "auth",
  state: (): AuthState => ({
    token: null,
    user: null,
  }),
  persist: true,
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    setToken(token: string) {
      this.token = token;
    },
    setUser(user: User) {
      this.user = user;
    },
    logout() {
      this.token = null;
      this.user = null;
    },
  },
});
