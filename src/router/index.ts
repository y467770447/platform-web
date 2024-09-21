import { type RouteRecordRaw, createRouter } from "vue-router"
import { history, flatMultiLevelRoutes } from "./helper"
import routeSettings from "@/config/route"

const Layouts = () => import("@/layouts/index.vue")

/**
 * 常驻路由
 * 除了 redirect/403/404/login 等隐藏页面，其他页面建议设置 Name 属性
 */
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/redirect",
    component: Layouts,
    meta: {
      hidden: true
    },
    children: [
      {
        path: ":path(.*)",
        component: () => import("@/views/redirect/index.vue")
      }
    ]
  },
  {
    path: "/403",
    component: () => import("@/views/error-page/403.vue"),
    meta: {
      hidden: true
    }
  },
  {
    path: "/404",
    component: () => import("@/views/error-page/404.vue"),
    meta: {
      hidden: true
    },
    alias: "/:pathMatch(.*)*"
  },
  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      hidden: true
    }
  },
  {
    path: "/",
    component: Layouts,
    redirect: "/home",
    children: [
      {
        path: "home",
        component: () => import("@/views/home/index.vue"),
        name: "home",
        meta: {
          title: "工作台",
          svgIcon: "dashboard",
          affix: true
        }
      }
    ]
  },
  {
    path: "/sjck",
    component: Layouts,
    redirect: "/sjck/gxx",
    name: "sjck",
    meta: {
      title: "数据仓库",
      svgIcon: "sjy"
    },
    children: [
      {
        path: "gxx",
        component: () => import("@/views/sjck/gxx.vue"),
        name: "sjck-gxx",
        meta: {
          title: "关系型"
        }
      },
      {
        path: "lsj",
        component: () => import("@/views/sjck/lsj.vue"),
        name: "sjck-lsj",
        meta: {
          title: "流数据"
        }
      },
      {
        path: "wdx",
        component: () => import("@/views/sjck/wdx.vue"),
        name: "sjck-wdx",
        meta: {
          title: "文档型"
        }
      },
      {
        path: "gxxAdd",
        component: () => import("@/views/sjck/gxxAdd.vue"),
        name: "sjck-gxx-add",
        meta: {
          title: "新建关系型数据",
          hidden: true,
          activeMenu: "/sjck/gxx"
        }
      },
      {
        path: "lsjAdd",
        component: () => import("@/views/sjck/lsjAdd.vue"),
        name: "sjck-lsj-add",
        meta: {
          title: "新建流数据型数据",
          hidden: true,
          activeMenu: "/sjck/lsj"
        }
      },
      {
        path: "wdxAdd",
        component: () => import("@/views/sjck/wdxAdd.vue"),
        name: "sjck-wdx-add",
        meta: {
          title: "新建文档型数据",
          hidden: true,
          activeMenu: "/sjck/wdx"
        }
      }
    ]
  },
  {
    path: "/sjy",
    component: Layouts,
    redirect: "/sjy/sjylb",
    name: "sjy",
    meta: {
      title: "数据源",
      svgIcon: "sjy"
    },
    children: [
      {
        path: "sjylb",
        component: () => import("@/views/sjy/sjylb.vue"),
        name: "sjy-sjylb",
        meta: {
          title: "数据源列表"
        }
      },
      {
        path: "sjyflgl",
        component: () => import("@/views/sjy/sjyflgl.vue"),
        name: "sjy-sjyflgl",
        meta: {
          title: "数据源分类管理"
        }
      }
    ]
  },
  {
    path: "/dataView",
    component: Layouts,
    redirect: "/dataView/index",
    name: "dataView",
    meta: {
      title: "数据集成",
      svgIcon: "sjlc"
    },
    children: [
      {
        path: "index",
        component: () => import("@/views/dataView/sjjc/index.vue"),
        name: "dataView-index",
        meta: {
          title: "数据流程"
          // svgIcon: "sjlc"
        }
      },
      {
        path: "rules",
        component: () => import("@/views/dataView/rules/index.vue"),
        name: "dataView-rules",
        meta: {
          title: "规则管理"
          // svgIcon: "rules"
        }
      },
      {
        path: "list",
        component: () => import("@/views/dataView/sjjc/list.vue"),
        name: "dataView-list",
        meta: {
          title: "数据流程",
          hidden: true,
          activeMenu: "/dataView/index"
        }
      },
      {
        path: "lcsj",
        component: () => import("@/views/dataView/sjjc/lcsj.vue"),
        name: "dataView-lcsj",
        meta: {
          title: "流程设计",
          hidden: true,
          activeMenu: "/dataView/index"
        }
      }
    ]
  },
  {
    path: "/task",
    component: Layouts,
    redirect: "/task/task-list",
    name: "task",
    meta: {
      title: "任务管理",
      svgIcon: "rwgl"
    },
    children: [
      {
        path: "task-list",
        component: () => import("@/views/task/list.vue"),
        name: "task-list",
        meta: {
          title: "任务队列"
        }
      },
      {
        path: "task-running",
        component: () => import("@/views/task/running.vue"),
        name: "task-running",
        meta: {
          title: "运行中任务"
        }
      },
      {
        path: "task-success",
        component: () => import("@/views/task/success.vue"),
        name: "task-success",
        meta: {
          title: "所有成功任务"
        }
      },
      {
        path: "task-wrong",
        component: () => import("@/views/task/wrong.vue"),
        name: "task-wrong",
        meta: {
          title: "所有失败任务"
        }
      }
    ]
  },
  {
    path: "/dataProvide",
    component: Layouts,
    redirect: "/dataProvide/index",
    name: "dataProvide",
    meta: {
      title: "数据提供",
      elIcon: "Grid"
    },
    children: [
      {
        path: "kllb",
        component: () => import("@/views/dataProvide/kllb/index.vue"),
        name: "dataProvide-kllb",
        meta: {
          title: "口令列表"
          // elIcon: "Grid"
        }
      },
      {
        path: "jklb",
        component: () => import("@/views/dataProvide/jklb/index.vue"),
        name: "dataProvide-jklb",
        meta: {
          title: "接口列表"
          // elIcon: "Grid"
        }
      }
    ]
  }
]

/**
 * 动态路由
 * 用来放置有权限 (Roles 属性) 的路由
 * 必须带有 Name 属性
 */
export const dynamicRoutes: RouteRecordRaw[] = [
  {
    path: "/permission",
    component: Layouts,
    redirect: "/permission/page",
    name: "Permission",
    meta: {
      title: "系统管理",
      svgIcon: "lock",
      roles: ["admin", "editor"], // 可以在根路由中设置角色
      alwaysShow: true // 将始终显示根菜单
    },
    children: [
      {
        path: "page",
        component: () => import("@/views/permission/page.vue"),
        name: "PagePermission",
        meta: {
          title: "用户管理",
          roles: ["admin"] // 或者在子导航中设置角色
        }
      },
      {
        path: "department",
        component: () => import("@/views/permission/page.vue"),
        name: "PagePermission",
        meta: {
          title: "部门管理",
          roles: ["admin"] // 或者在子导航中设置角色
        }
      },
      {
        path: "directive",
        component: () => import("@/views/permission/directive.vue"),
        name: "DirectivePermission",
        meta: {
          title: "角色管理" // 如果未设置角色，则表示：该页面不需要权限，但会继承根路由的角色
        }
      }
    ]
  }
]

const router = createRouter({
  history,
  routes: routeSettings.thirdLevelRouteCache ? flatMultiLevelRoutes(constantRoutes) : constantRoutes
})

/** 重置路由 */
export function resetRouter() {
  // 注意：所有动态路由路由必须带有 Name 属性，否则可能会不能完全重置干净
  try {
    router.getRoutes().forEach((route) => {
      const { name, meta } = route
      if (name && meta.roles?.length) {
        router.hasRoute(name) && router.removeRoute(name)
      }
    })
  } catch {
    // 强制刷新浏览器也行，只是交互体验不是很好
    window.location.reload()
  }
}

export default router
