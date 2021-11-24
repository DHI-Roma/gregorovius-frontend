import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueMatomo from "vue-matomo";
import "./quasar";

import { MATOMO_CONFIG } from "app/env";

Vue.config.productionTip = false;

if (MATOMO_CONFIG.enableMatomo) {
  Vue.use(VueMatomo, {
    host: MATOMO_CONFIG.host,
    siteId: MATOMO_CONFIG.siteId,
    router
  });
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
