import router from "./router";
import store from "./store";
import { Message } from "element-ui";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { getToken } from "@/utils/auth";
import getPageTitle from "@/utils/get-page-title";

NProgress.configure({
  showSpinner: false
});

const whiteList = ["/login"];

router.beforeEach(async (to, from, next) => {
  NProgress.start();
  document.title = getPageTitle(to.meta.title);
  const hasToken = getToken();
  if (hasToken) {
    if (to.path === "/login") {
      next({
        path: "/"
      });
    } else {
      if (Object.keys(store.getters.apiMap).length > 0) {
        if (store.getters.hasGetRules) {
          next();
        } else {
          try {
            const { accessedRoutes, paths } = await store.dispatch(
              "user/generateRoutes"
            );
            router.addRoutes([
              ...accessedRoutes,
              {
                path: "*",
                redirect: "/404"
              }
            ]);
            next(
              paths.includes(to.path)
                ? {
                    ...to,
                    replace: true
                  }
                : { path: "/" }
            );
          } catch (error) {
            await store.dispatch("user/resetToken");
            Message.error(error || "Has Error");
            next(`/login?redirect=${to.path}`);
            NProgress.done();
          }
        }
      } else {
        try {
          const data = await store.dispatch("app/getApiMap");
          data &&
            next({
              ...to,
              replace: true
            });
        } catch (error) {
          await store.dispatch("user/resetToken");
          Message.error(error || "Has Error");
          next(`/login?redirect=${to.path}`);
          NProgress.done();
        }
      }
    }
    NProgress.done();
  } else {
    if (whiteList.includes(to.path)) {
      next();
    } else {
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});
