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
