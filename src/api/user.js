import request from "@/utils/request";
import { encryptedData } from "@/utils/encrypt";
import { loginRSA } from "@/config/settings";

export async function login(data) {
  if (loginRSA) {
    data = await encryptedData(data);
  }
  return request({
    url: "/admin/login/login",
    method: "post",
    data,
  });
}

export function getInfo(data) {
  data.access_token = localStorage.getItem('access_token');
  return request({
    url: "/admin/user/user_info",
    method: "post",
    data: {
      data
    },
  });
}

export function logout() {
  return request({
    url: "/logout",
    method: "post",
  });
}
export function register() {
  return request({
    url: "/register",
    method: "post",
  });
}
