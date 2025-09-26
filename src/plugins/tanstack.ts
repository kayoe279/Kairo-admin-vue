import { VueQueryPlugin } from "@tanstack/vue-query";
import { App } from "vue";

export const setupTanstackQuery = (app: App<Element>) => {
  app.use(VueQueryPlugin);
};
