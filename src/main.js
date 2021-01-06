import Vue from "vue";

import "normalize.css/normalize.css"; // A modern alternative to CSS resets

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import locale from "element-ui/lib/locale/lang/zh-CN"; // lang i18n

import "@/styles/index.scss"; // global css

import "@/config/ui";

import App from "./App";
import store from "./store";
import router from "./router";

import "@/icons"; // icon
import "@/permission"; // permission control
import { getRes, postRes, putRes, deleteRes } from "@/utils/request";
import BaiduMap from 'vue-baidu-map';
 
Vue.use(BaiduMap, {
    ak: 'GpRqD2Sowifs********RRRRVl9'
});

Vue.prototype.$get = getRes;
Vue.prototype.$post = postRes;
Vue.prototype.$put = putRes;
Vue.prototype.$delete = deleteRes;

Vue.use(ElementUI, { size: "small", locale });

Vue.config.productionTip = false;

new Vue({
  el: "#app",
  router,
  store,
  render: h => h(App)
});
