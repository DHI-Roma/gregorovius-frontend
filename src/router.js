import Vue from "vue";
import Router from "vue-router";
import { routes } from "./routes";

Vue.use(Router);

export const basePathLetters = "/letters";

export default new Router({
  mode: "history",
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
  routes
});
