import type React from "react";

// ----------------------------
// Types & Interfaces
// ----------------------------

export type RouteType = "layout" | "page" | "redirect" | "external";
export type RouteStatus = "active" | "inactive" | "deprecated" | "beta";

export interface IRouteMeta {
  title?: string;
  description?: string;
  keywords?: string[];
  author?: string;
}

export interface IItem {
  readonly label: string;
  readonly icon: React.ReactElement | string;
  readonly path: string;
  readonly index?: boolean;
  readonly type?: RouteType;
  readonly status?: RouteStatus;
  readonly asItem: boolean;
  readonly asItemAlone: boolean;
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
  path?: string;
  label?: string;
  icon?: React.ReactElement | string;
  base?: string;
  type?: RouteType;
  status?: RouteStatus;
  roles?: readonly string[];
  categories?: readonly string[];
  children?: IProcessedMenu[];
}

export interface INavigationConfig {
  readonly role?: string;
  readonly category?: string;
  readonly initialPath?: string;
}

// ----------------------------
// Abstract Classes & Interfaces
// ----------------------------

abstract class BaseProcessor<T> {
  protected readonly userRole?: string;
  protected readonly category?: string;

  constructor(config: INavigationConfig = {}) {
    this.userRole = config.role;
    this.category = config.category;
  }

  protected abstract processItem(item: IItem, config: INavigationConfig): T[];

  public process(items: readonly IItem[], config: INavigationConfig = {}): T[] {
    if (!items?.length) return [];

    const mergedConfig = {
      ...config,
      role: config.role ?? this.userRole,
      category: config.category ?? this.category,
    };

    return items.reduce<T[]>((acc, item) => {
      return acc.concat(this.processItem(item, mergedConfig));
    }, []);
  }
}

// ----------------------------
// Utility Classes
// ----------------------------

class PathUtils {
  static trim(path: string = ""): string {
    return path?.replace(/^\/|\/$/g, "") ?? "";
  }

  static join(paths: readonly string[] = []): string {
    if (!paths.length) return "";
    const processedPaths = paths.map((path) => this.trim(path)).filter(Boolean);
    return this.trim(processedPaths.join("/"));
  }

  static buildFullPath(
    initialPath: string = "/",
    path?: string,
  ): string | undefined {
    if (!path && path !== "") return undefined;
    if (path.includes(":")) return undefined;
    return "/" + this.join([initialPath, path]);
  }
}

class PermissionValidator {
  static checkRole(
    allowedRoles: readonly string[] | undefined,
    userRole: string | undefined,
    defaultResult: boolean = true,
  ): boolean {
    if (!allowedRoles?.length) return defaultResult;
    return Boolean(userRole && allowedRoles.includes(userRole));
  }

  static checkCategory(
    allowedCategories: readonly string[] | undefined,
    routeCategory: string | undefined,
    defaultResult: boolean = true,
  ): boolean {
    if (!allowedCategories?.length) return defaultResult;
    return Boolean(routeCategory && allowedCategories.includes(routeCategory));
  }

  static isItemAccessible(
    item: IItem,
    userRole?: string,
    category?: string,
  ): boolean {
    return (
      this.checkRole(item.roles, userRole) &&
      this.checkCategory(item.categories, category)
    );
  }
}

class ItemValidator {
  static isValidRoute(route: IItem): boolean {
    const hasPath = typeof route.path !== "undefined";
    const hasElement = Boolean(route.element);
    const hasChildren = Boolean(route.children?.length);

    return hasPath || hasElement || hasChildren;
  }

  static shouldHideRoute(
    item: IItem,
    userRole?: string,
    category?: string,
  ): boolean {
    if (item.hidden || !this.isValidRoute(item)) return true;
    return !PermissionValidator.isItemAccessible(item, userRole, category);
  }

  static shouldHideMenu(
    item: IItem,
    userRole?: string,
    category?: string,
  ): boolean {
    const hasValidPath =
      (item.path || item.path === "") && !item.path.includes(":");
    const hasChildren = Boolean(item.children?.length);
    const hasLabel = Boolean(item.label);
    const isParameterizedWithoutVisible =
      item.path?.includes(":") && !hasChildren && !item.visible;

    const isInvalid =
      item.hidden ||
      item.invisible ||
      (!hasValidPath && !hasChildren && !hasLabel) ||
      isParameterizedWithoutVisible;

    if (isInvalid) return true;

    return !PermissionValidator.isItemAccessible(item, userRole, category);
  }
}

// ----------------------------
// Processors
// ----------------------------

class RouteProcessor extends BaseProcessor<IProcessedRoute> {
  protected processItem(
    item: IItem,
    config: INavigationConfig,
  ): IProcessedRoute[] {
    const { path, element, children, loader, action, index, type } = item;

    if (ItemValidator.shouldHideRoute(item, config.role, config.category)) {
      return [];
    }

    const routeEntry: IProcessedRoute = {
      ...(typeof path !== "undefined" && { path }),
      ...(element && { element }),
      ...(loader && { loader }),
      ...(action && { action }),
      ...(index && { index }),
    };

    if (children?.length && type === "layout") {
      return [
        {
          ...routeEntry,
          children: this.process(children, config),
        },
      ];
    } else if (children?.length) {
      return this.process(children, config);
    } else {
      return [routeEntry];
    }
  }
}

class MenuProcessor extends BaseProcessor<IProcessedMenu> {
  protected processItem(
    item: IItem,
    config: INavigationConfig,
  ): IProcessedMenu[] {
    const {
      path,
      label,
      icon,
      children,
      base,
      roles,
      type,
      status,
      asItem,
      asItemAlone,
      categories,
    } = item;

    if (ItemValidator.shouldHideMenu(item, config.role, config.category)) {
      return [];
    }

    const elements: IProcessedMenu = {
      ...(PathUtils.buildFullPath(config.initialPath, path) && {
        path: PathUtils.buildFullPath(config.initialPath, path),
      }),
      ...(label && { label }),
      ...(icon && { icon }),
      ...(base && { base }),
      ...(type && { type }),
      ...(status && { status }),
      ...(roles && { roles }),
      ...(categories && { categories }),
    };

    const nextConfig = {
      ...config,
      initialPath:
        type === "layout" && path
          ? PathUtils.buildFullPath(config.initialPath, path)?.substring(1) ||
            config.initialPath
          : config.initialPath,
    };

    if (children?.length && type !== "layout" && !asItemAlone) {
      return [
        {
          ...elements,
          children: this.process(children, nextConfig),
        },
      ];
    } else if (children?.length && type === "layout" && asItem) {
      return [
        {
          ...elements,
          children: this.process(children, nextConfig),
        },
      ];
    } else if (
      children?.length &&
      type === "layout" &&
      !asItem &&
      !asItemAlone
    ) {
      return this.process(children, nextConfig);
    } else {
      return [elements];
    }
  }
}

// ----------------------------
// Main Navigation System
// ----------------------------

export class RouteMenu {
  private readonly items: readonly IItem[];
  private readonly routeProcessor: RouteProcessor;
  private readonly menuProcessor: MenuProcessor;

  constructor(items: readonly IItem[]) {
    this.items = Object.freeze([...items]);
    this.routeProcessor = new RouteProcessor();
    this.menuProcessor = new MenuProcessor();
  }

  public getRoutes(config: Pick<INavigationConfig, "role"> = {}): {
    routes: IProcessedRoute[];
  } {
    const routes = this.routeProcessor.process(this.items, config) || [];

    return { routes };
  }

  public getMenus(config: INavigationConfig = {}): {
    menus: IProcessedMenu[];
    indexPathMap: Record<string, number[]>;
  } {
    const menuConfig = {
      initialPath: "/",
      ...config,
    };
    const menus = this.menuProcessor.process(this.items, menuConfig);

    const indexPathMap: Record<string, number[]> = {};

    const processIndexPathMap = (
      items: readonly IProcessedMenu[],
      trail: number[] = [],
    ) => {
      items.forEach((item, idx) => {
        const currentTrail = [...trail, idx];
        if (item.path) {
          indexPathMap[item.path] = currentTrail;
        }
        if (item.children?.length) {
          processIndexPathMap(item.children, currentTrail);
        }
      });
    };

    processIndexPathMap(menus);

    return { menus, indexPathMap };
  }

  public getItems(): readonly IItem[] {
    return this.items;
  }

  public getItemsByRole(role: string): IItem[] {
    const filterByRole = (routes: readonly IItem[]): IItem[] => {
      return routes.reduce<IItem[]>((acc, route) => {
        if (PermissionValidator.checkRole(route.roles, role)) {
          const filteredChildren = route.children
            ? filterByRole(route.children)
            : undefined;
          acc.push({
            ...route,
            ...(filteredChildren && { children: filteredChildren }),
          });
        }
        return acc;
      }, []);
    };

    return filterByRole(this.items);
  }

  public getItemsByCategory(category: string): IItem[] {
    const filterByCategory = (routes: readonly IItem[]): IItem[] => {
      return routes.reduce<IItem[]>((acc, route) => {
        if (PermissionValidator.checkCategory(route.categories, category)) {
          const filteredChildren = route.children
            ? filterByCategory(route.children)
            : undefined;
          acc.push({
            ...route,
            ...(filteredChildren && { children: filteredChildren }),
          });
        }
        return acc;
      }, []);
    };

    return filterByCategory(this.items);
  }

  public findItemByPath(path: string): IItem | undefined {
    const findRoute = (
      routes: readonly IItem[],
      targetPath: string,
    ): IItem | undefined => {
      for (const route of routes) {
        if (route.path === targetPath) {
          return route;
        }
        if (route.children) {
          const found = findRoute(route.children, targetPath);
          if (found) return found;
        }
      }
      return undefined;
    };

    return findRoute(this.items, path);
  }

  public validateItems(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const paths = new Set<string>();

    const validateItem = (route: IItem, parentPath: string = ""): void => {
      const fullPath = PathUtils.join([parentPath, route.path]);

      if (paths.has(fullPath) && fullPath) {
        errors.push(`Duplicate path found: ${fullPath}`);
      }

      if (fullPath) {
        paths.add(fullPath);
      }

      if (!route.label) {
        errors.push(`Route with path "${fullPath}" is missing a label`);
      }

      if (route.children) {
        route.children.forEach((child) => validateItem(child, fullPath));
      }
    };

    this.items.forEach((route) => validateItem(route));

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
