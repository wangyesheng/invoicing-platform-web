import request from '@/utils/request'

export function checkLoginRes({ username, password }) {
  return request({
    url: '/api/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getUserinfoRes(token) {
  return request({
    url: '/api/userinfo',
    method: 'get',
    params: { token }
  })
}
