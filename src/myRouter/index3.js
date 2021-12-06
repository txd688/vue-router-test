/*
更新视图但不重新请求页面实现思路
  1.Hash --- 利用 URL 中的hash("#");
  2.利用 History interface 在HTML5中新增的方法。
*/
let Vue;
/*
参数：option = {
  routes:[{...},{...}]
}
*/
class VueRouter {
  constructor(option) {
    this.$options = option;
    // 缓存path和route映射关系
    this.routeMap = {};
    option.routes.forEach((route) => {
      this.routeMap[route.path] = route;
    });

    this.current = window.location.hash.slice(1) || "/";
    Vue.util.defineReactive(this, "matched", []);
    this.match();
    // 监听url事件
    window.addEventListener("hashchange", this.onHashChange.bind(this));
    window.addEventListener("load", this.onHashChange.bind(this));
  }
  onHashChange() {
    this.current = window.location.hash.slice(1);
    this.matched = [];
    this.match();
  }
  match(routes) {
    routes = routes || this.$options.routes;
    for (const route of routes) {
      if (route.path === "/" && this.current === "/") {
        this.matched.push(route);
        return;
      }
      if (route.path !== "/" && this.current.indexOf(route.path) != -1) {
        this.matched.push(route);
        if (route.children) {
          this.match(route.children);
        }
        return;
      }
    }
  }
}

// 实现插件(use)
VueRouter.install = function (_Vue) {
  Vue = _Vue;
  // 混入
  Vue.mixin({
    /* 
    beforeCreate 此阶段为实例初始化之后，数据观察和事件机制都未形成。
    在
      new Vue({
        router,
        store,
        render: (h) => h(App),
      }).$mount("#app");
    之后初始化之后执行，此时已经new VueRouter了，得到了router实例
    */
    beforeCreate() {
      if (this.$options.router) {
        Vue.prototype.$router = this.$options.router;
      }
    },
  });
  // 注册组件
  Vue.component("router-view", {
    render(h) {
      this.$vnode.data.routerView = true;
      let depth = 0;
      let parent = this.$parent;
      while (parent) {
        const vnodeData = parent.$vnode && parent.$vnode.data;
        if (vnodeData && vnodeData.routerView) {
          depth++;
        }
        parent = parent.$parent;
      }

      let component = null;
      const route = this.$router.matched[depth];
      if (route) {
        component = route.component;
      }
      return h(component);
    },
  });

  Vue.component("router-link", {
    props: {
      to: {
        type: String,
        require: true,
      },
    },
    render(h) {
      // <router-link to="/about">About</router-link>
      return h(
        "a",
        {
          attrs: {
            href: "#" + this.to,
          },
        },
        this.$slots.default
      );
    },
  });
};

export default VueRouter;
