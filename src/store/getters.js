const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  apiMap: state => state.app.apiMap,
  token: state => state.user.token,
  userinfo: state => state.user.userinfo,
  hasGetRules: state => state.user.hasGetRules,
  permission_routes: state => state.user.authRoutes,
}
export default getters
