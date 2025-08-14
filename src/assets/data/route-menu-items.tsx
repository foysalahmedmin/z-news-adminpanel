import AuthWrapper from "@/components/wrappers/AuthWrapper";
import AuthLayout from "@/layouts/AuthLayout";
import CommonLayout from "@/layouts/CommonLayout";
import UserLayout from "@/layouts/UserLayout";
import SignInPage from "@/pages/(auth)/SignInPage";
import SignUpPage from "@/pages/(auth)/SignUpPage";
import CategoriesDetailsPage from "@/pages/(common)/CategoriesDetailsPage";
import CategoriesPage from "@/pages/(common)/CategoriesPage";
import Dashboard from "@/pages/(common)/Dashboard";
import NewsArticlesAddPage from "@/pages/(common)/NewsArticlesAddPage";
import NewsArticlesDetailsPage from "@/pages/(common)/NewsArticlesDetailsPage";
import NewsArticlesEditPage from "@/pages/(common)/NewsArticlesEditPage";
import NewsArticlesPage from "@/pages/(common)/NewsArticlesPage";
import NotFoundPage from "@/pages/(partial)/NotFoundPage";
import ProfilePage from "@/pages/(user)/ProfilePage";
import type { TItem } from "@/types/route-menu.type";
import { Outlet } from "react-router";

export const items: TItem[] = [
  {
    path: "",
    element: <CommonLayout />,
    routeType: "layout",
    children: [
      {
        menuType: "title",
        name: "Dashboard",
      },
      {
        icon: "layout-template",
        index: true,
        name: "Dashboard",
        element: <Dashboard />,
      },
      {
        menuType: "title",
        name: "Categories",
      },
      {
        icon: "blocks",
        path: "categories",
        name: "Categories",
        routeType: "layout",
        menuType: "item-without-children",
        element: <Outlet />,
        children: [
          {
            index: true,
            name: "Categories",
            element: <CategoriesPage />,
            menuType: "invisible",
          },
          {
            path: ":id",
            element: <CategoriesDetailsPage />,
            menuType: "invisible",
          },
        ],
      },
      {
        menuType: "title",
        name: "News",
      },
      {
        icon: "newspaper",
        path: "news-articles",
        name: "News Articles",
        routeType: "layout",
        menuType: "item-without-children",
        element: <Outlet />,
        children: [
          {
            index: true,
            name: "News Articles",
            element: <NewsArticlesPage />,
            menuType: "invisible",
          },
          {
            path: ":id",
            element: <NewsArticlesDetailsPage />,
            menuType: "invisible",
          },
          {
            path: "add",
            element: <NewsArticlesAddPage />,
            menuType: "invisible",
          },
          {
            path: "edit/:id",
            element: <NewsArticlesEditPage />,
            menuType: "invisible",
          },
        ],
      },
      {
        icon: "scroll-text",
        path: "news-headlines",
        name: "News Headlines",
        routeType: "layout",
        menuType: "item-without-children",
        element: <Outlet />,
        children: [
          {
            index: true,
            name: "News Headlines",
            element: <CategoriesPage />,
            menuType: "invisible",
          },
          {
            path: ":id",
            element: <CategoriesDetailsPage />,
            menuType: "invisible",
          },
        ],
      },
      {
        icon: "zap",
        path: "news-breaks",
        name: "News Breaks",
        routeType: "layout",
        menuType: "item-without-children",
        element: <Outlet />,
        children: [
          {
            index: true,
            name: "News Breaks",
            element: <CategoriesPage />,
            menuType: "invisible",
          },
          {
            path: ":id",
            element: <CategoriesDetailsPage />,
            menuType: "invisible",
          },
        ],
      },
      {
        menuType: "title",
        name: "Activities",
      },
      {
        icon: "message-square-quote",
        path: "comments",
        name: "Comments",
        element: <Dashboard />,
      },
      {
        icon: "smile",
        path: "reactions",
        name: "Reactions",
        element: <Dashboard />,
      },
      {
        menuType: "title",
        name: "Management",
      },
      {
        icon: "users",
        path: "users",
        name: "Users",
        element: <Dashboard />,
      },
      {
        menuType: "title",
        name: "Settings",
      },
      {
        icon: "bell",
        path: "notifications",
        name: "Notifications",
        element: <Dashboard />,
      },
    ],
  },
  {
    menuType: "invisible",
    path: "user",
    element: (
      <AuthWrapper>
        <UserLayout />
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
  {
    menuType: "invisible",
    routeType: "layout",
    path: "auth",
    element: <AuthLayout />,
    children: [
      {
        path: "signin",
        element: <SignInPage />,
      },
      {
        path: "signup",
        element: <SignUpPage />,
      },
    ],
  },
  {
    menuType: "invisible",
    path: "*",
    element: <NotFoundPage />,
  },
];
