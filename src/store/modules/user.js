/**
 * @copyright qy-vue-admin 1778486252@qq.com
 * @description 登录、获取用户信息、退出登录、清除accessToken逻辑，不建议修改
 */

import Vue from "vue";
import { getInfo, login, logout } from "@/api/user";
import {
    getAccessToken,
    removeAccessToken,
    setAccessToken,
} from "@/utils/accessToken";
import { resetRouter } from "@/router";
import { title, tokenName } from "@/config/settings";

const state = {
    accessToken: getAccessToken(),
    userName:localStorage.getItem('nickname')?localStorage.getItem('nickname'):'',
    avatar:localStorage.getItem('avatar')?localStorage.getItem('avatar'):'',
    permissions: [],
};
const getters = {
    accessToken: (state) => state.accessToken,
    userName: (state) => state.userName,
    avatar: (state) => state.avatar,
    permissions: (state) => state.permissions,
};
const mutations = {
    setAccessToken(state, accessToken) {
        state.accessToken = accessToken;
        setAccessToken(accessToken);
    },
    setUserName(state, userName) {
        state.userName = userName;
    },
    setAvatar(state, avatar) {
        state.avatar = avatar;
    },
    setPermissions(state, permissions) {
        state.permissions = permissions;
    },
};
const actions = {
    async login({ commit }, userInfo) {
        const { data } = await login(userInfo);
        const accessToken = data.access_token;
        if (accessToken) {
            commit("setAccessToken", accessToken);
            commit("setUserName", data.nickname);
            commit("setAvatar", data.avatar);
            localStorage.setItem("username", data.nickname);
            localStorage.setItem("avatar", data.avatar);
            const hour = new Date().getHours();
            const thisTime =
                hour < 8 ?
                "早上好" :
                hour <= 11 ?
                "上午好" :
                hour <= 13 ?
                "中午好" :
                hour < 18 ?
                "下午好" :
                "晚上好";
            Vue.prototype.$baseNotify(`欢迎登录${title}`, `${thisTime}！`);
        } else {
            Vue.prototype.$baseMessage(
                `登录接口异常，未正确返回${tokenName}...`,
                "error"
            );
        }
    },
    async getInfo({ commit, state }) {
        let data = {
            permissions: 'admin',
        };
        let { permissions} = data;
        if (permissions) {
            commit("setPermissions", permissions);
            return permissions;
        } else {
            Vue.prototype.$baseMessage("获取用户信息接口异常", "error");
            return false;
        }
    },
    async logout({ dispatch }) {
        await dispatch("tagsBar/delAllRoutes", null, { root: true });
        await dispatch("resetAccessToken");
        await resetRouter();
    },
    resetAccessToken({ commit }) {
        commit("setPermissions", []);
        commit("setAccessToken", "");
        removeAccessToken();
    },
};
export default { state, getters, mutations, actions };
