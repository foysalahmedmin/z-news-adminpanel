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
    type: "layout",
    children: [
      {
        index: true,
        label: "Dashboard",
        element: <Dashboard />,
      },
    ],
  },
  {
    invisible: true,
    path: "user",
    element: (
      <AuthWrapper>
        <UserLayout />
      </AuthWrapper>
    ),
    type: "layout",
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
    invisible: true,
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
    invisible: true,
    path: "*",
    element: <NotFoundPage />,
  },
];
