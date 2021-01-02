import request from "@/utils/request";

/**
 * 招标查询
 * @param {*} condition
 */
export function getBiddingsByConditionRes(condition) {
  return request({
    url: "/api/plat/v2/bid/query",
    method: "get",
    params: {
      ...condition
    }
  });
}

/**
 * 获取指定招标主表信息
 * @param {*} nbr
 */
export function getMainBiddingsByNbrRes(nbr) {
  return request({
    url: "/api/plat/v2/bid",
    method: "get",
    params: {
      nbr
    }
  });
}

/**
 * 获取指定招标的所有行信息
 * @param {*} nbr
 */
export function getlinesByNbrRes(nbr) {
  return request({
    url: "/api/plat/v2/bid/det",
    method: "get",
    params: {
      nbr
    }
  });
}

/**
 * 获取招标指定行
 * @param {*} nbr
 * @param {*} line
 */
export function getSingleBiddingLineRes(nbr, line) {
  return request({
    url: "/api/plat/v2/bid/line",
    method: "get",
    params: {
      nbr,
      line
    }
  });
}
