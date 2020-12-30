import { checkLoginRes, getUserinfoRes } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { asyncRoutes, constantRoutes, resetRouter } from '@/router'

function filterAsyncRoutes(routes, pages) {
  // debugger
  const accessedRoutes = []

  routes.forEach(route => {
    const tempRoute = { ...route }
    if (pages.includes(tempRoute.path)) {
      if (tempRoute.children) {
        tempRoute.children = filterAsyncRoutes(tempRoute.children, pages)
      }
      accessedRoutes.push(tempRoute)
    }
  })

  return accessedRoutes
}

const getDefaultState = () => {
  return {
    token: getToken(),
    userinfo: {},
    authRoutes: [],
    hasGetRules: false
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERINFO: (state, user) => {
    state.userinfo = user
  },
  SET_ROUTES: (state, routes) => {
    state.authRoutes = constantRoutes.concat(routes)
  },
  SET_RULES: (state, value) => {
    state.hasGetRules = value
  },
}

const actions = {
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      checkLoginRes({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  getUserinfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getUserinfoRes(state.token).then(response => {
        const { data } = response
        commit('SET_USERINFO', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  generateRoutes({ commit }, pages) {
    return new Promise(resolve => {
      const accessedRoutes = filterAsyncRoutes(asyncRoutes, pages)
      commit('SET_ROUTES', accessedRoutes)
      commit('SET_RULES', true)
      resolve(accessedRoutes)
    })
  },

  logout({ commit }) {
    return new Promise((resolve, reject) => {
      removeToken()
      resetRouter()
      commit('RESET_STATE')
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken()
      commit('RESET_STATE')
      resolve()
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

