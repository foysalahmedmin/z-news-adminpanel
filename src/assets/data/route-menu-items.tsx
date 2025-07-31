import AuthWrapper from "@/components/wrappers/AuthWrapper";
import AuthLayout from "@/layouts/AuthLayout";
import CommonLayout from "@/layouts/CommonLayout";
import UserLayout from "@/layouts/UserLayout";
import SignInPage from "@/pages/(auth)/SignInPage";
import SignUpPage from "@/pages/(auth)/SignUpPage";
import CategoryPage from "@/pages/(common)/CategoryPage";
import Dashboard from "@/pages/(common)/Dashboard";
import NotFoundPage from "@/pages/(partial)/NotFoundPage";
import ProfilePage from "@/pages/(user)/ProfilePage";
import type { TItem } from "@/types/route-menu.type";

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
        name: "Management",
      },
      {
        icon: "blocks",
        path: "categories",
        name: "Categories",
        element: <CategoryPage />,
      },
      {
        icon: "newspaper",
        path: "news",
        name: "News Article",
        element: <Dashboard />,
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
