import request from "@/utils/request";
// 角色列表
export function role_list(data) {
    data.access_token = localStorage.getItem('access_token');
    return request({
        url: "/admin/role/index",
        method: "post",
        data,
    });
}
//编辑角色
export function role_edit(data) {
    data.access_token = localStorage.getItem('access_token');
    return request({
        url: "/admin/role/edit",
        method: "post",
        data,
    });
}
// 搜索角色
export function role_detail(data) {
    data.access_token = localStorage.getItem('access_token');
    return request({
        url: "/admin/role/find",
        method: "post",
        data,
    });
}
// 角色删除
export function role_del(data) {
    data.access_token = localStorage.getItem('access_token');
    return request({
        url: "/admin/role/delete",
        method: "post",
        data,
    });
}