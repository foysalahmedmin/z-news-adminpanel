export type TItemStatus = "active" | "inactive" | "deprecated" | "beta";
export type TRouteType = "layout" | "page" | "redirect" | "external";
export type TMenuType =
  | "visible"
  | "invisible"
  | "title"
  | "item"
  | "item-without-path"
  | "item-without-children";

export type TRouteMeta = {
  title?: string;
  description?: string;
  keywords?: string[];
  author?: string;
};

export interface IItem {
  readonly label?: string;
  readonly icon?: string;
  readonly path?: string;
  readonly index?: true;
  readonly status?: TItemStatus;
  readonly routeType?: TRouteType;
  readonly menuType?: TMenuType;
  readonly element?: React.ReactElement;
  readonly loader?: () => Promise<unknown> | unknown;
  readonly action?: () => Promise<unknown> | unknown;
  readonly badge?: string;
  readonly badges?: readonly string[];
  readonly children?: readonly IItem[];
  readonly roles?: readonly string[];
  readonly categories?: readonly string[];
  readonly hidden?: boolean;
  readonly meta?: TRouteMeta;
}

export interface IProcessedWithIndexRoute {
  path?: string;
  element?: React.ReactElement;
  loader?: () => Promise<unknown> | unknown;
  action?: () => Promise<unknown> | unknown;
  index?: true;
  children?: undefined;
}

export interface IProcessedWithoutIndexRoute {
  path?: string;
  element?: React.ReactElement;
  loader?: () => Promise<unknown> | unknown;
  action?: () => Promise<unknown> | unknown;
  index?: false;
  children?: IProcessedRoute[];
}

export type IProcessedRoute =
  | IProcessedWithIndexRoute
  | IProcessedWithoutIndexRoute;

export interface IProcessedMenu {
  label: string;
  path?: string;
  icon?: string;
  badge?: string;
  badges?: string[];
  routeType?: TRouteType;
  menuType?: TMenuType;
  status?: TItemStatus;
  roles?: string[];
  categories?: string[];
  children?: IProcessedMenu[];
}

export interface INavigationConfig {
  readonly role?: string;
  readonly category?: string;
  readonly initialPath?: string;
}

export interface IBreadcrumb {
  index: number;
  label: string;
  path?: string;
}
