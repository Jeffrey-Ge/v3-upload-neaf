import Cookies from 'js-cookie'

const TokenKey = 'token'
const RoleKey = 'roles'
const nameKey = 'name'
const enterpriseIdKey = 'enterpriseId'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getRoles() {
  return Cookies.get(RoleKey)
}

export function setRoles(role) {
  return Cookies.set(RoleKey, role)
}

export function removeRoles() {
  return Cookies.remove(RoleKey)
}

export function getName() {
  return Cookies.get(nameKey)
}

export function setName(name) {
  return Cookies.set(nameKey, name)
}

export function removeName() {
  return Cookies.remove(nameKey)
}

export function getEnterpriseId() {
  return Cookies.get(enterpriseIdKey)
}

export function setEnterpriseId(enterpriseId) {
  return Cookies.set(enterpriseIdKey, enterpriseId)
}

export function removeEnterpriseId() {
  return Cookies.remove(enterpriseIdKey)
}
