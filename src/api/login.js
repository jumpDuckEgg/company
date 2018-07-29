import request from '@/utils/request'

export function login(userName, password) {
  return request({
    url: '/user/login',
    method: 'post',
    data: {
      userName,
      password
    }
  })
}

export function getInfo() {
  return request({
    url: '/user/getCurrentUser',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
