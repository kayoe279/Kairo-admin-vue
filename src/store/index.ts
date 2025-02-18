import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import type { App } from "vue";

export * from "./modules/appSetting";
export * from "./modules/user";
export * from "./modules/route";
export * from "./modules/tabs";
export * from "./modules/themeSetting";
export * from "./modules/user";
export * from "./modules/screenLock";

const store = createPinia();

export function setupStore(app: App<Element>) {
  store.use(piniaPluginPersistedstate);
  app.use(store);
}

export { store };
