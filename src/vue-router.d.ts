import { RouteMeta as AppRouteMeta } from "@/types";
import "vue-router";

declare module "vue-router" {
  interface RouteMeta extends AppRouteMeta {}
}
