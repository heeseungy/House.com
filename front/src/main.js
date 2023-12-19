import { createApp } from "vue";
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import App from "./App.vue";
import router from "./router";

// Bootstrap 추가
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'; // 'bootstrap-vue-3'로 변경
import { BootstrapVue3 } from 'bootstrap-vue-3'

// bootstrap setting
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
const app = createApp(App);

// pinia 새로고침시에도 영속성 유지
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);

app.use(router);
app.use(BootstrapVue3)

app.mount("#app");
