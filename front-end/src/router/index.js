import { createRouter, createWebHistory } from "vue-router";
import signin from "@/views/signin.vue";
import signup from "@/views/signup.vue";
import admin from "@/views/admin.vue";
import user from "@/views/user";

const routes = [
  {
    path: "/",
    name: "signin",
    component: signin,
  },
  {
    path: "/signup",
    name: "signup",
    component: signup,
  },
  {
    path: "/admin",
    name: "admin",
    component: admin,
  },
  {
    path: "/user",
    name: "user",
    component: user,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
