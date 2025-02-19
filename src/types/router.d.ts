import "vue-router";

type RouteNameEnum = "login";
declare module "vue-router" {
  interface RouteMeta extends AppRoute.RouteMeta {}
}
