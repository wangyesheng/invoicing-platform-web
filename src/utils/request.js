import axios from "axios";
import { Message } from "element-ui";
import store from "@/store";
import { getToken } from "@/utils/auth";
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
});

// request interceptor
service.interceptors.request.use(
  config => {
    config.headers = {
      "Content-Type": "application/json;charset=UTF-8;",
      "Access-Control-Allow-Origin": "*"
    };
    if (store.getters.token) {
      config.headers["AccessToken2"] = getToken();
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
    const { code, msg, data } = response.data;
    if (code !== 0) {
      Message({
        message: msg || "Error",
        type: "error",
        duration: 5 * 1000
      });
      return Promise.reject(new Error(msg || "Error"));
    } else {
      return data;
    }
  },
  error => {
    console.log("err" + error); // for debug
    Message({
      message: error.message,
      type: "error",
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);

export default service;
