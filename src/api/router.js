import request from "@/utils/request";

export function getRouterList(datas) {
 let data={
    access_token:localStorage.getItem('access_token')
 };
  return request({
    url: "/admin/index/auth_list",
    method: "post",
    data,
  });
}
