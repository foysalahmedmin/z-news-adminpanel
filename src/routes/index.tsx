import AuthWrapper from "@/components/wrappers/AuthWrapper";
import AuthLayout from "@/layouts/AuthLayout";
import CommonLayout from "@/layouts/CommonLayout";
import RootLayout from "@/layouts/RootLayout";
import UserLayout from "@/layouts/UserLayout";
import SignInPage from "@/pages/(auth)/SignInPage";
import SignUpPage from "@/pages/(auth)/SignUpPage";
import HomePage from "@/pages/(common)/HomePage";
import ErrorPage from "@/pages/(partial)/ErrorPage";
import NotFoundPage from "@/pages/(partial)/NotFoundPage";
import ProfilePage from "@/pages/(user)/ProfilePage";
import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <CommonLayout />,
        children: [{ index: true, element: <HomePage /> }],
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
        element: <AuthLayout />,
        children: [
          { path: "sign-in", element: <SignInPage /> },
          { path: "sign-up", element: <SignUpPage /> },
        ],
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
