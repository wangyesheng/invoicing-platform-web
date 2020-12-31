import request from "@/utils/request";

export function getApisRes() {
  return request({
    url: "/api/discovery/api",
    method: "get"
  });
}
