import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import VueNativeSock from "vue-native-websocket";

Vue.use(VueNativeSock, process.env.VUE_APP_WSS_SERVER, {
  format: "json",
  reconnection: true,
  connectManually: true,
  reconnectionAttempts: 20,
});

Vue.config.productionTip = false;
Vue.http = Vue.prototype.$http = axios;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
