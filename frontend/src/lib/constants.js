import Cookies from "universal-cookie";

export const server_base_Url = "http://localhost:5000/";

export const accessTokenKey = "Tenant-Access-Token";
export const refreshTokenKey = "Tenant-Refresh-Token";
export const cookiesKey = "Tenant-Refresh-Token";

export function addCookeyKey({ refToken, accTkn }) {
  const cookies = new Cookies();
  cookies.set(cookiesKey, refToken, { path: "/" });
  localStorage.setItem(accessTokenKey, accTkn);
}

export function removeCookeyKey() {
  const cookies = new Cookies();
  cookies.remove(cookiesKey, { path: "/" });
  localStorage.removeItem(accessTokenKey);
}

export function getStoreToken() {
  return localStorage.getItem(accessTokenKey);
}
export function setStoreToken({ token }) {
  return localStorage.setItem(accessTokenKey, token);
}

export function getCookies() {
  const cookies = new Cookies();
  return cookies.get(cookiesKey);
}
