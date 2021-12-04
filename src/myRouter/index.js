/*
更新视图但不重新请求页面实现思路
  1.Hash --- 利用 URL 中的hash("#");
  2.利用 History interface 在HTML5中新增的方法。
*/
let Vue;

class VueRouter {
  constructor(option) {
    this.option = option;
    // 实现数据响应式,current变化渲染页面
    Vue.util.defineReactive(
      this,
      "current",
      window.location.hash.slice(1) || "/"
    );
    // 监听url事件
    window.addEventListener("hashchange", () => {
      this.current = window.location.hash.slice(1);
    });
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
      // 找到routes数组里面与current相同的的path，并给出component
      let component = null;
      const { current, option } = this.$router;
      const route = option.routes.find((route) => route.path === current);
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
