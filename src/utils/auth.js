import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token';
const UserInfo = 'userInfo';

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  // Cookies.set('name', 'value', { expires: 365 });
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getUserInfo() {
  return localStorage.getItem(UserInfo)
}

export function setUserInfo(data) {
  return localStorage.setItem(UserInfo, JSON.stringify(data));
}

export function removeUserInfo() {
  return localStorage.removeItem(UserInfo)
}
