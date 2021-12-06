import Vue from "vue";
import VueRouter from "../myRouter/index3";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import("../views/About.vue"),
    children: [
      {
        path: "/about/info",
        component: () => import("../views/Info.vue"),
      },
    ],
  },
];

const router = new VueRouter({
  // mode: "history",
  // base: process.env.BASE_URL,
  routes,
});

export default router;
