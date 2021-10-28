import request from "@/utils/request";

export function checkLoginRes({
  username,
  password
}) {
  return request({
    url: "/api/core/v2/auth/logon",
    method: "post",
    data: {
      account: username,
      password
    }
  });
}

export function getApiMapRes() {
  return request({
    url: "/apidoc/vuex",
    method: "get",
  });
}
