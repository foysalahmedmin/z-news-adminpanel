import type {
  IBreadcrumb,
  IItem,
  INavigationConfig,
  IProcessedMenu,
  IProcessedRoute,
} from "@/types/route-menu.type";

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

    return items.flatMap((item) => this.processItem(item, mergedConfig));
  }
}

// ----------------------------
// Utility Classes
// ----------------------------

class PathUtils {
  private static readonly TRIM_REGEX = /^\/|\/$/g;

  static trim(path: string = ""): string {
    return path?.replace(this.TRIM_REGEX, "") ?? "";
  }

  static join(paths: readonly string[] = []): string {
    if (!paths.length) return "";
    const processedPaths = paths.map((path) => this.trim(path)).filter(Boolean);
    return this.trim(processedPaths.join("/"));
  }

  static buildFullPath(
    initialPath: string = "/",
    path?: string,
    index?: true,
  ): string | undefined {
    if (index === true) return "/" + this.trim(initialPath);
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
    return !allowedRoles?.length
      ? defaultResult
      : Boolean(userRole && allowedRoles.includes(userRole));
  }

  static checkCategory(
    allowedCategories: readonly string[] | undefined,
    routeCategory: string | undefined,
    defaultResult: boolean = true,
  ): boolean {
    return !allowedCategories?.length
      ? defaultResult
      : Boolean(routeCategory && allowedCategories.includes(routeCategory));
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
    return (
      typeof route.path !== "undefined" ||
      Boolean(route.element) ||
      Boolean(route.children?.length)
    );
  }

  static shouldHideRoute(
    item: IItem,
    userRole?: string,
    category?: string,
  ): boolean {
    return (
      item.hidden ||
      !this.isValidRoute(item) ||
      !PermissionValidator.isItemAccessible(item, userRole, category)
    );
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

    return (
      isInvalid ||
      !PermissionValidator.isItemAccessible(item, userRole, category)
    );
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
    if (ItemValidator.shouldHideRoute(item, config.role, config.category)) {
      return [];
    }

    const { path, element, children, loader, action, index, type } = item;

    const baseRoute = {
      ...(typeof path !== "undefined" && { path }),
      ...(element && { element }),
      ...(loader && { loader }),
      ...(action && { action }),
    };

    // Index route (no children allowed)
    if (index) {
      return [{ ...baseRoute, index: true } as IProcessedRoute];
    }

    // Layout route with children
    if (children?.length && type === "layout") {
      return [
        {
          ...baseRoute,
          children: this.process(children, config),
        } as IProcessedRoute,
      ];
    }

    // Regular nested children (not layout)
    if (children?.length) {
      return this.process(children, config);
    }

    // Regular route without index and children
    return [baseRoute as IProcessedRoute];
  }
}

class MenuProcessor extends BaseProcessor<IProcessedMenu> {
  protected processItem(
    item: IItem,
    config: INavigationConfig,
  ): IProcessedMenu[] {
    // Early exit for invalid items
    if (ItemValidator.shouldHideMenu(item, config.role, config.category)) {
      return [];
    }

    const elements = this.buildMenuElement(item, config);

    // Early return if no children
    if (!item.children?.length) {
      return [elements];
    }

    return this.processItemWithChildren(item, elements, config);
  }

  private buildMenuElement(
    item: IItem,
    config: INavigationConfig,
  ): IProcessedMenu {
    const { icon, label, path, index, base, roles, type, status, categories } =
      item;
    const processedPath = PathUtils.buildFullPath(
      config.initialPath,
      path,
      index,
    );

    return {
      label: label || path || "",
      ...(processedPath && { path: processedPath }),
      ...(icon && { icon }),
      ...(base && { base }),
      ...(type && { type }),
      ...(status && { status }),
      ...(roles?.length && { roles: [...roles] }),
      ...(categories?.length && { categories: [...categories] }),
    };
  }

  private processItemWithChildren(
    item: IItem,
    elements: IProcessedMenu,
    config: INavigationConfig,
  ): IProcessedMenu[] {
    const { children, type, path, asItem, asItemAlone } = item;

    // Return just the element if asItemAlone is true
    if (asItemAlone) {
      return [elements];
    }

    const nextConfig = this.createNextConfig(config, type, path);

    if (type === "layout") {
      return asItem
        ? [{ ...elements, children: this.process(children!, nextConfig) }]
        : this.process(children!, nextConfig);
    }

    // Non-layout routes with children always return the element
    return [elements];
  }

  private createNextConfig(
    config: INavigationConfig,
    type?: string,
    path?: string,
  ): INavigationConfig {
    if (type !== "layout" || !path) {
      return config;
    }

    const newInitialPath =
      PathUtils.buildFullPath(config.initialPath, path)?.substring(1) ||
      config.initialPath;
    return { ...config, initialPath: newInitialPath };
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
    return { routes: this.routeProcessor.process(this.items, config) };
  }

  public getMenus(config: INavigationConfig = {}): {
    menus: IProcessedMenu[];
    indexes: Record<string, number[]>;
    breadcrumbs: Record<string, IBreadcrumb[]>;
  } {
    const menuConfig = { initialPath: "/", ...config };
    const menus = this.menuProcessor.process(this.items, menuConfig);

    const indexes: Record<string, number[]> = {};
    const breadcrumbs: Record<string, IBreadcrumb[]> = {};

    const processIndexPathMap = (
      items: readonly IProcessedMenu[],
      indexTrail: number[] = [],
      breadcrumbTrail: IBreadcrumb[] = [],
    ): void => {
      items.forEach((item, idx) => {
        const currentIndexTrail = [...indexTrail, idx];
        const breadcrumbItem: IBreadcrumb = {
          index: idx,
          label: item.label,
          ...(item.path && { path: item.path }),
        };
        const currentBreadcrumbTrail = [...breadcrumbTrail, breadcrumbItem];

        if (item.path) {
          indexes[item.path] = currentIndexTrail;
          breadcrumbs[item.path] = currentBreadcrumbTrail;
        }

        if (item.children?.length) {
          processIndexPathMap(
            item.children,
            currentIndexTrail,
            currentBreadcrumbTrail,
          );
        }
      });
    };

    processIndexPathMap(menus);
    return { menus, indexes, breadcrumbs };
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
        if (route.path === targetPath) return route;
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

    const validateItem = (route: IItem, parentPath = ""): void => {
      const fullPath = route.path
        ? PathUtils.join([parentPath, route.path])
        : parentPath;

      if (fullPath && paths.has(fullPath)) {
        errors.push(`Duplicate path found: ${fullPath}`);
      }

      if (fullPath) paths.add(fullPath);

      // Check label only if it's not an index route
      if (route.index !== true && !route.label) {
        errors.push(`Route with path "${fullPath}" is missing a label`);
      }

      route.children?.forEach((child) => validateItem(child, fullPath));
    };

    this.items.forEach((route) => validateItem(route));

    return { valid: errors.length === 0, errors };
  }
}
