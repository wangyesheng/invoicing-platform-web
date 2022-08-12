import Vue from "vue";

import "normalize.css/normalize.css"; // A modern alternative to CSS resets

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import locale from "element-ui/lib/locale/lang/zh-CN"; // lang i18n
import DynamicForm from "vue-dynamic-form-component"; // 动态表单

import "@/styles/index.scss"; // global css

import "@/components";

import App from "./App";
import store from "./store";
import router from "./router";

import Print from "@/utils/print";
import JsonExcel from "vue-json-excel";

import "@/icons"; // icon
import "@/permission"; // permission control

Vue.component("download-excel", JsonExcel);

Vue.use(ElementUI, {
  size: "small",
  locale
});
Vue.use(DynamicForm);

Vue.use(Print);

Vue.config.productionTip = false;

new Vue({
  el: "#app",
  router,
  store,
  render: h => h(App)
});
