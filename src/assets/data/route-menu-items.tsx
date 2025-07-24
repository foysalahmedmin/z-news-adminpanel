import AuthWrapper from "@/components/wrappers/AuthWrapper";
import AuthLayout from "@/layouts/AuthLayout";
import CommonLayout from "@/layouts/CommonLayout";
import UserLayout from "@/layouts/UserLayout";
import SignInPage from "@/pages/(auth)/SignInPage";
import SignUpPage from "@/pages/(auth)/SignUpPage";
import HomePage from "@/pages/(common)/HomePage";
import NotFoundPage from "@/pages/(partial)/NotFoundPage";
import ProfilePage from "@/pages/(user)/ProfilePage";
import type { IItem } from "@/types/route-menu.type";

export const items: IItem[] = [
  {
    path: "",
    element: <CommonLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
  {
    path: "user",
    element: (
      <AuthWrapper>
        <UserLayout />
      </AuthWrapper>
    ),
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
    path: "auth",
    invisible: true,
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
    path: "*",
    element: <NotFoundPage />,
  },
];
