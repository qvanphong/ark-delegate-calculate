import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import "ant-design-vue/dist/antd.css";
import "./assets/tailwind.css";
import "./assets/tailwind.css";

Vue.config.productionTip = false;

new Vue({
  store,
  render: (h) => h(App),
}).$mount("#app");
