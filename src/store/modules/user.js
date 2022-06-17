import { checkLoginRes } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { asyncRoutes, constantRoutes, resetRouter } from "@/router";

function filterAsyncRoutes(routes, pages) {
  const accessedRoutes = [];

  routes.forEach(route => {
    const tempRoute = {
      ...route,
      children: []
    };
    if (pages.find(p => p.includes(tempRoute.path))) {
      if (route.children) {
        tempRoute.children = filterAsyncRoutes(route.children, pages);
      }
      accessedRoutes.push(tempRoute);
    }
  });

  return accessedRoutes;
}

const getDefaultState = () => {
  return {
    token: getToken(),
    userinfo: JSON.parse(localStorage.getItem("platform_userinfo")) || {},
    authRoutes: [],
    hasGetRules: false
  };
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: state => {
    Object.assign(state, getDefaultState());
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_USERINFO: (state, user) => {
    state.userinfo = user;
  },
  SET_ROUTES: (state, routes) => {
    state.authRoutes = constantRoutes.concat(routes);
  },
  SET_RULES: (state, value) => {
    state.hasGetRules = value;
  }
};

const actions = {
  login({ commit }, userInfo) {
    const { username, password } = userInfo;
    return new Promise(async (resolve, reject) => {
      try {
        const response = await checkLoginRes({
          username: username.trim(),
          password: password
        });
        setToken(response.token);
        commit("SET_USERINFO", response);
        localStorage.setItem("platform_userinfo", JSON.stringify(response));
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  },

  getUserinfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getUserinfoRes(state.token)
        .then(response => {
          const { data } = response;
          commit("SET_USERINFO", data);
          resolve(data);
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  generateRoutes({ commit }) {
    return new Promise(resolve => {
      const accessedRoutes = filterAsyncRoutes(
        asyncRoutes,
        state.userinfo.funs.map(x => x.funRoute)
      );
      commit("SET_ROUTES", accessedRoutes);
      commit("SET_RULES", true);
      resolve(accessedRoutes);
    });
  },

  clearUserState({ commit }) {
    return new Promise((resolve, reject) => {
      localStorage.setItem("platform_userinfo", "{}");
      removeToken();
      commit("RESET_STATE");
      resetRouter();
      resolve();
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken();
      commit("RESET_STATE");
      resolve();
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
