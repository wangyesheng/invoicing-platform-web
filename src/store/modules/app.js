import Cookies from 'js-cookie'
import {
  getApiMapRes
} from "@/api/user";

const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false
  },
  device: 'desktop',
  apiMap: {},
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_API_MAP(state, payload) {
    state.apiMap = payload
  }
}

const actions = {
  toggleSideBar({
    commit
  }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({
    commit
  }, {
    withoutAnimation
  }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({
    commit
  }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  getApiMap({
    commit
  }) {
    return new Promise(async (reslove, reject) => {
      try {
        const data = await getApiMapRes()
        commit('SET_API_MAP', data)
        reslove(true)
      } catch (error) {
        reject(error)
      }
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
