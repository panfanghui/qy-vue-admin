import request from "@/utils/request";
// 获取用户列表
export function user_list(data) {
    data.access_token = localStorage.getItem('access_token');
    return request({
        url: "/admin/user/index",
        method: "POST",
        data
    });
}
// 用户编辑
export function user_edit(data) {
    data.access_token = localStorage.getItem('access_token');
    return request({
        url: "/admin/user/edit",
        method: "POST",
        data
    });
}
// 用户删除
export function user_del(data) {
    data.access_token = localStorage.getItem('access_token');
    return request({
        url: "/admin/user/delete",
        method: "POST",
        data
    });
}