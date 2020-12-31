import request from "@/utils/request";

export function checkLoginRes({ username, password }) {
  return request({
    url: "/api/plat/v2/auth/logon",
    method: "post",
    data: {
      account: username,
      password
    }
  });
}

export function getUserinfoRes(token) {
  return request({
    url: "/api/userinfo",
    method: "get",
    params: { token }
  });
}

export function getViewUserMainRes(token) {
  return request({
    url: "/api/discovery/view/user/main",
    method: "get",
    params: { token }
  });
}
