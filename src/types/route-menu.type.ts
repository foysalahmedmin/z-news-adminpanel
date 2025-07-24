export type TRouteType = "layout" | "page" | "redirect" | "external";
export type TRouteStatus = "active" | "inactive" | "deprecated" | "beta";

export interface IRouteMeta {
  title?: string;
  description?: string;
  keywords?: string[];
  author?: string;
}

export interface IItem {
  readonly label?: string;
  readonly icon?: React.ReactElement | string;
  readonly path?: string;
  readonly index?: boolean;
  readonly type?: TRouteType;
  readonly status?: TRouteStatus;
  readonly asItem?: boolean;
  readonly asItemAlone?: boolean;
  readonly element?: React.ReactElement;
  readonly loader?: () => Promise<unknown> | unknown;
  readonly action?: () => Promise<unknown> | unknown;
  readonly base?: string;
  readonly bases?: readonly string[];
  readonly children?: readonly IItem[];
  readonly roles?: readonly string[];
  readonly categories?: readonly string[];
  readonly visible?: boolean;
  readonly invisible?: boolean;
  readonly hidden?: boolean;
  readonly meta?: IRouteMeta;
}

export interface IProcessedRoute {
  path?: string;
  element?: React.ReactElement;
  loader?: () => Promise<unknown> | unknown;
  action?: () => Promise<unknown> | unknown;
  index?: boolean;
  children?: IProcessedRoute[];
}

export interface IProcessedMenu {
  label: string;
  path?: string;
  icon?: React.ReactElement | string;
  base?: string;
  type?: TRouteType;
  status?: TRouteStatus;
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
