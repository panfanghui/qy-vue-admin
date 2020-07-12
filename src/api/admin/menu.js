import request from "@/utils/request";
// 菜单列表
export function menu_list(data) {
    data.access_token = localStorage.getItem('access_token');
    return request({
        url: "/admin/menu/index",
        method: "post",
        data
    });
}
// 添加/编辑
export function menu_add(data) {
    data.access_token = localStorage.getItem('access_token');
    return request({
        url: "/admin/menu/edit",
        method: "post",
        data
    });
}
// 删除
export function menu_del(data) {
    data.access_token = localStorage.getItem('access_token');
    return request({
        url: "/admin/menu/delete",
        method: "post",
        data
    });
}