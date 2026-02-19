import { createRouter, createWebHistory } from "vue-router";
import { authGuard } from "./guards";

import Home from "@/views/Home.vue";
import SignIn from "@/views/SignIn.vue";
import SignUp from "@/views/SignUp.vue";
import ForgotPassword from "@/views/ForgotPassword.vue";
import Dashboard from "@/views/Dashboard.vue";
import Contact from "@/views/Contact.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "Home", component: Home },
    { path: "/signin", name: "SignIn", component: SignIn },
    { path: "/signup", name: "SignUp", component: SignUp },
    { path: "/forgot-password", name: "ForgotPassword", component: ForgotPassword },
    {
      path: "/dashboard",
      name: "Dashboard",
      component: Dashboard,
      beforeEnter: authGuard,
    },
    { path: "/contact", name: "Contact", component: Contact },
  ],
});

export default router;
