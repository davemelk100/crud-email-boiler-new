import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "@/App.vue";
import router from "@/routes";
import { useAuthStore } from "@/stores/authStore";

export async function bootstrap() {
  const app = createApp(App);
  const pinia = createPinia();

  app.use(pinia);
  app.use(router);

  const auth = useAuthStore();
  await auth.init();

  app.mount("#app");
}
