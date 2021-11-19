import axios from "axios";
import {
  Notification
} from "element-ui";
import Vue from "vue";
import store from "@/store";
import {
  getToken
} from "@/utils/auth";

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 50000 // request timeout
});

// request interceptor
service.interceptors.request.use(
  config => {
    config.headers = {
      "Content-Type": "application/json;charset=UTF-8;",
      "Access-Control-Allow-Origin": "*"
    };
    if (store.getters.token) {
      config.headers["access_token2"] = getToken();
    }
    return config;
  },
  error => {
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  response => {
    const {
      code,
      msg,
      message,
      data
    } = response.data;
    if (code !== 0) {
      Notification({
        title: '提示',
        type: "warning",
        duration: 5 * 1000,
        message: msg || message || '服务器开小差啦~',
      });
      return Promise.reject(new Error(msg || message || "服务器开小差啦~"));
    } else {
      return data;
    }
  },
  error => {
    console.log("err", error.response); // for debug
    const {
      data: {
        msg,
        message
      }
    } = error.response
    Notification({
      title: '提示',
      type: "warning",
      duration: 5 * 1000,
      message: msg || message || '服务器开小差啦~',
    });
    return Promise.reject(error);
  }
);

Vue.prototype.$get = (url, params) =>
  service({
    url,
    method: "get",
    params
  });

Vue.prototype.$post = (url, data) =>
  service({
    url,
    method: "post",
    data
  });

Vue.prototype.$put = (url, data) =>
  service({
    url,
    method: "put",
    data
  });

Vue.prototype.$delete = (url, params) =>
  service({
    url,
    method: "delete",
    params
  });

export default service;
