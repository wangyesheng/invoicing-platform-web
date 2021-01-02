import request from "@/utils/request";

export function getApisRes() {
  return request({
    url: "/api/discovery/api",
    method: "get"
  });
}

/**
 * 封装get方法
 * @param url
 * @param {*} params
 */
export function getRes(url, params) {
  return request({
    url: url,
    method: "get",
    params: {
      ...params
    }
  });
}

/**
 * 封装post方法
 * @param url
 * @param {*} data
 */
export function postRes(url, data) {
  return request({
    url: url,
    method: "post",
    data: {
      ...data
    }
  });
}