import Layout from "@/layout";

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/eos-app-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true
  },

  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true
  },
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/dashboard/index"),
        meta: { title: "工作台", icon: "dashboard" }
      }
    ]
  }
];

export const asyncRoutes = [
  {
    path: "/sys",
    component: Layout,
    name: "SYS",
    redirect: "/sys/user",
    meta: { title: "系统管理", icon: "system" },
    children: [
      {
        path: "/sys/user",
        name: "SYS_USER",
        component: () => import("@/views/sys/user"),
        meta: { title: "用户管理" }
      },
      {
        path: "/sys/role",
        name: "SYS_ROLE",
        component: () => import("@/views/sys/role"),
        meta: { title: "角色管理" }
      },
      {
        path: "/sys/permission",
        name: "SYS_PERMISSION",
        component: () => import("@/views/sys/permission"),
        meta: { title: "权限管理" }
      }
      // {
      //   path: "/sys/api",
      //   name: "SYS_API_REQUEST",
      //   component: () => import("@/views/sys/api"),
      //   meta: { title: "接口管理" }
      // },
    ]
  },
  {
    path: "/bidding",
    component: Layout,
    children: [
      {
        path: "/bidding",
        name: "BIDDING",
        component: () => import("@/views/bidding/index"),
        meta: { title: "招标管理", icon: "dashboard" }
      }
    ]
  }
];
