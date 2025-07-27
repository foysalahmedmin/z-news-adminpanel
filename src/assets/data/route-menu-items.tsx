import AuthWrapper from "@/components/wrappers/AuthWrapper";
import AuthLayout from "@/layouts/AuthLayout";
import CommonLayout from "@/layouts/CommonLayout";
import UserLayout from "@/layouts/UserLayout";
import SignInPage from "@/pages/(auth)/SignInPage";
import SignUpPage from "@/pages/(auth)/SignUpPage";
import Dashboard from "@/pages/(common)/Dashboard";
import NotFoundPage from "@/pages/(partial)/NotFoundPage";
import ProfilePage from "@/pages/(user)/ProfilePage";
import type { IItem } from "@/types/route-menu.type";

export const items: IItem[] = [
  {
    path: "",
    element: <CommonLayout />,
    routeType: "layout",
    children: [
      {
        menuType: "title",
        label: "Dashboard",
      },
      {
        icon: "layout-template",
        index: true,
        label: "Dashboard",
        element: <Dashboard />,
      },
      {
        menuType: "title",
        label: "Management",
      },
      {
        icon: "blocks",
        path: "categories",
        label: "Categories",
        element: <Dashboard />,
      },
      {
        icon: "newspaper",
        path: "news",
        label: "News Article",
        element: <Dashboard />,
      },
      {
        icon: "message-square-quote",
        path: "comments",
        label: "Comments",
        element: <Dashboard />,
      },
      {
        icon: "smile",
        path: "reactions",
        label: "Reactions",
        element: <Dashboard />,
      },
      {
        icon: "users",
        path: "users",
        label: "Users",
        element: <Dashboard />,
      },
      {
        menuType: "title",
        label: "Settings",
      },
      {
        icon: "bell",
        path: "notifications",
        label: "Notifications",
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
        path: "sign-in",
        element: <SignInPage />,
      },
      {
        path: "sign-up",
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
