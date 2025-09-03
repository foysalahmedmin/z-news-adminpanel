import AuthWrapper from "@/components/wrappers/AuthWrapper";
import CategoriesDetailsPage from "@/pages/(common)/CategoriesDetailsPage";
import CategoriesPage from "@/pages/(common)/CategoriesPage";
import CommentsPage from "@/pages/(common)/CommentsPage";
import Dashboard from "@/pages/(common)/Dashboard";
import NewsArticlesAddPage from "@/pages/(common)/NewsArticlesAddPage";
import NewsArticlesDetailsPage from "@/pages/(common)/NewsArticlesDetailsPage";
import NewsArticlesEditPage from "@/pages/(common)/NewsArticlesEditPage";
import NewsArticlesPage from "@/pages/(common)/NewsArticlesPage";
import NotificationsPage from "@/pages/(common)/NotificationsPage";
import ReactionsPage from "@/pages/(common)/ReactionsPage";
import UsersPage from "@/pages/(common)/UsersPage";
import ProfilePage from "@/pages/(user)/ProfilePage";
import type { TItem } from "@/types/route-menu.type";
import { Outlet } from "react-router";

export const items: TItem[] = [
  {
    menuType: "title",
    name: "Dashboard",
  },
  {
    icon: "layout-template",
    index: true,
    name: "Dashboard",
    element: (
      <AuthWrapper>
        <Dashboard />
      </AuthWrapper>
    ),
  },
  {
    roles: ["supper-admin", "admin"],
    menuType: "title",
    name: "Management",
  },
  {
    roles: ["supper-admin", "admin"],
    icon: "users",
    path: "users",
    name: "Users",
    routeType: "layout",
    menuType: "item-without-children",
    element: (
      <AuthWrapper>
        <Outlet />
      </AuthWrapper>
    ),
    children: [
      {
        index: true,
        name: "Users",
        element: (
          <AuthWrapper roles={["supper-admin", "admin"]}>
            <UsersPage />
          </AuthWrapper>
        ),
        menuType: "invisible",
      },
      {
        path: ":id",
        element: (
          <AuthWrapper roles={["supper-admin", "admin"]}>
            <ProfilePage isUserView={true} />
          </AuthWrapper>
        ),
        menuType: "invisible",
      },
    ],
  },
  {
    roles: ["supper-admin", "admin", "editor", "author"],
    menuType: "title",
    name: "Categories",
  },
  {
    roles: ["supper-admin", "admin", "editor", "author"],
    icon: "blocks",
    path: "categories",
    name: "Categories",
    routeType: "layout",
    menuType: "item-without-children",
    element: (
      <AuthWrapper roles={["supper-admin", "admin", "editor", "author"]}>
        <Outlet />
      </AuthWrapper>
    ),
    children: [
      {
        index: true,
        name: "Categories",
        element: (
          <AuthWrapper roles={["supper-admin", "admin", "editor", "author"]}>
            <CategoriesPage />
          </AuthWrapper>
        ),
        menuType: "invisible",
      },
      {
        path: ":id",
        element: (
          <AuthWrapper roles={["supper-admin", "admin", "editor", "author"]}>
            <CategoriesDetailsPage />
          </AuthWrapper>
        ),
        menuType: "invisible",
      },
    ],
  },
  {
    roles: ["supper-admin", "admin", "author", "editor"],
    menuType: "title",
    name: "News",
  },
  {
    roles: ["supper-admin", "admin", "author", "editor"],
    icon: "newspaper",
    path: "news-articles",
    name: "News Articles",
    routeType: "layout",
    menuType: "item-without-children",
    element: (
      <AuthWrapper roles={["supper-admin", "admin", "author", "editor"]}>
        <Outlet />
      </AuthWrapper>
    ),
    children: [
      {
        index: true,
        name: "News Articles",
        element: (
          <AuthWrapper roles={["supper-admin", "admin", "author", "editor"]}>
            <NewsArticlesPage />
          </AuthWrapper>
        ),
        menuType: "invisible",
      },
      {
        roles: ["supper-admin", "admin", "author", "editor"],
        path: ":id",
        element: (
          <AuthWrapper roles={["supper-admin", "admin", "author", "editor"]}>
            <NewsArticlesDetailsPage />
          </AuthWrapper>
        ),
        menuType: "invisible",
      },
      {
        roles: ["supper-admin", "admin", "author"],
        path: "add",
        element: (
          <AuthWrapper roles={["supper-admin", "admin", "author"]}>
            <NewsArticlesAddPage />
          </AuthWrapper>
        ),
        menuType: "invisible",
      },
      {
        roles: ["supper-admin", "admin", "author", "editor"],
        path: "edit/:id",
        element: (
          <AuthWrapper roles={["supper-admin", "admin", "author", "editor"]}>
            <NewsArticlesEditPage />
          </AuthWrapper>
        ),
        menuType: "invisible",
      },
    ],
  },
  {
    roles: ["supper-admin", "admin", "author", "editor", "contributor"],
    menuType: "title",
    name: "Activities",
  },
  {
    roles: ["supper-admin", "admin", "author", "editor", "contributor"],
    icon: "message-square-quote",
    path: "comments",
    name: "Comments",
    element: (
      <AuthWrapper
        roles={["supper-admin", "admin", "author", "editor", "contributor"]}
      >
        <CommentsPage />
      </AuthWrapper>
    ),
  },
  {
    roles: ["supper-admin", "admin", "author", "editor", "contributor"],
    icon: "smile",
    path: "reactions",
    name: "Reactions",
    element: (
      <AuthWrapper
        roles={["supper-admin", "admin", "author", "editor", "contributor"]}
      >
        <ReactionsPage />
      </AuthWrapper>
    ),
  },
  {
    roles: ["supper-admin", "admin", "author", "editor", "contributor", "user"],
    menuType: "title",
    name: "Settings",
  },
  {
    icon: "bell",
    path: "notifications",
    name: "Notifications",
    element: (
      <AuthWrapper>
        <NotificationsPage />
      </AuthWrapper>
    ),
  },
  {
    menuType: "invisible",
    path: "user",
    element: (
      <AuthWrapper>
        <Outlet />
      </AuthWrapper>
    ),
    routeType: "layout",
    children: [
      {
        path: "profile",
        element: (
          <AuthWrapper>
            <ProfilePage />
          </AuthWrapper>
        ),
      },
    ],
  },
];
