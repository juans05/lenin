import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import Contrasena from "../views/Contrasena.vue";
import Registro from "../views/RegistroUsuario.vue";
import VerUsuarios from "../views/ListaUsuarios.vue";
import HomeCartilla from "../views/HomeCartilla.vue";
import Login from "../views/Login.vue";
import Condiciones from "../views/todocartilla/Condiciones.vue";
import Actos from "../views/todocartilla/Actos.vue";
import Recursos from "../views/todocartilla/Recursos.vue";
import HomePage from "../views/HomePage.vue";
import TreeDesicion from "../views/TreeDesicion.vue";

import { useAuthStore } from "../Store/authStore";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: TreeDesicion,
  },

  {
    path: "/loading",
    name: "TreeDesicion",
    component: TreeDesicion,
    meta: { noCache: true },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { noCache: true },
  },
  {
    path: "/contrasena",
    name: "Contrasena",
    component: Contrasena,
    meta: { noCache: true },
  },
  {
    path: "/search",
    name: "Search",
    component: HomePage,
    meta: { noCache: true },
  },
  {
    path: "/homecartillas",
    name: "Homecartillas",
    component: HomeCartilla,
    meta: { noCache: true },
  },
  {
    path: "/condiciones",
    name: "Condiciones",
    component: Condiciones,
    meta: { noCache: true },
  },
  {
    path: "/actos",
    name: "Actos",
    component: Actos,
    meta: { noCache: true },
  },
  {
    path: "/recursos",
    name: "Recursos",
    component: Recursos,
    meta: { noCache: true },
  },
  {
    path: "/registro",
    name: "Registro",
    component: Registro,
    meta: { noCache: true },
  },
  {
    path: "/verusuarios",
    name: "VerUsuarios",
    component: VerUsuarios,
    meta: { noCache: true },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
