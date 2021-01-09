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

export const constantRoutes = [{
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
    children: [{
      path: "dashboard",
      name: "Dashboard",
      component: () => import("@/views/dashboard/index"),
      meta: {
        title: "工作台",
        icon: "dashboard"
      }
    }]
  }
];

export const asyncRoutes = [{
    path: "/sys",
    component: Layout,
    name: "SYS",
    redirect: "/sys/user",
    meta: {
      title: "系统设置",
      icon: "system"
    },
    children: [{
        path: "/sys/user",
        name: "SYS_USER",
        component: () => import("@/views/sys/user"),
        meta: {
          title: "用户管理"
        }
      },
      {
        path: "/sys/role",
        name: "SYS_ROLE",
        component: () => import("@/views/sys/role"),
        meta: {
          title: "角色管理"
        }
      },
      {
        path: "/sys/permission",
        name: "SYS_PERMISSION",
        component: () => import("@/views/sys/permission"),
        meta: {
          title: "权限管理"
        }
      },
      {
        path: "/part/operation",
        name: "PART_OPERATION",
        component: () => import("@/views/part/operation"),
        meta: {
          title: "新建部件"
        }
      },
      {
        path: "/part/index",
        name: "PART",
        component: () => import("@/views/part/index"),
        meta: {
          title: "部件管理"
        }
      }
    ]
  },
  {
    path: "/bidding",
    component: Layout,
    redirect: "/bidding/index",
    meta: {
      title: "招标管理",
      icon: "bidding"
    },
    children: [{
        path: "/bidding/operation",
        name: "BIDDING_OPERATION",
        component: () => import("@/views/bidding/operation"),
        meta: {
          title: "新建标书"
        }
      },
      {
        path: "/bidding/index",
        name: "BIDDING",
        component: () => import("@/views/bidding/index"),
        meta: {
          title: "标书管理"
        }
      },
      {
        path: "/bivving/index",
        name: "BIVVING",
        component: () => import("@/views/bivving/index"),
        meta: {
          title: "竞标管理"
        }
      },
      {
        path: "/bivving/hall",
        name: "BIVVING_HALL",
        component: () => import("@/views/bivving/hall"),
        meta: {
          title: "竞标大厅"
        }
      }
    ]
  },
  {
    path: "/po",
    component: Layout,
    redirect: "/po/index",
    meta: {
      title: "采购管理",
      icon: "purchase"
    },
    children: [{
        path: "/po/operation",
        name: "PO_OPERATION",
        component: () => import("@/views/po/operation"),
        meta: {
          title: "新建合同"
        }
      },
      {
        path: "/po/index",
        name: "PO",
        component: () => import("@/views/po/index"),
        meta: {
          title: "采购管理"
        }
      }
    ]
  },
  {
    path: "/ship",
    component: Layout,
    redirect: "/ship/index",
    meta: {
      title: "发货管理",
      icon: "deliver"
    },
    children: [{
        path: "/ship/operation",
        name: "SHIP_OPERATION",
        component: () => import("@/views/ship/operation"),
        meta: {
          title: "新建发货单"
        }
      },
      {
        path: "/ship/index",
        name: "SHIP",
        component: () => import("@/views/ship/index"),
        meta: {
          title: "发货单管理"
        }
      }, {
        path: "/ship/express",
        name: "EXPRESS",
        component: () => import("@/views/ship/express"),
        meta: {
          title: "物流查询"
        }
      }
    ]
  },
  {
    path: "/recp",
    component: Layout,
    redirect: "/receipt/index",
    meta: {
      title: "收货管理",
      icon: "receiver"
    },
    children: [{
        path: "/receipt/operation",
        name: "RECP_OPERATION",
        component: () => import("@/views/receipt/operation"),
        meta: {
          title: "新建收货单"
        }
      },
      {
        path: "/receipt/index",
        name: "RECP",
        component: () => import("@/views/receipt/index"),
        meta: {
          title: "收货单管理"
        }
      }
    ]
  },
  {
    path: "/in",
    component: Layout,
    redirect: "/invoice/index",
    meta: {
      title: "发票管理",
      icon: "invoice"
    },
    children: [{
        path: "/invoice/operation",
        name: "IN_OPERATION",
        component: () => import("@/views/invoice/operation"),
        meta: {
          title: "新建发票"
        }
      },
      {
        path: "/invoice/index",
        name: "IN",
        component: () => import("@/views/invoice/index"),
        meta: {
          title: "发票管理"
        }
      }
    ]
  }
];
