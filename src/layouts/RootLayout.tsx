import MenuApplier from "@/components/appliers/MenuApplier";
import SettingApplier from "@/components/appliers/SettingApplier";
import { Outlet } from "react-router";
import { Slide, ToastContainer } from "react-toastify";
import NotificationApplier from "../components/appliers/NotificationApplier";

const RootLayout = () => {
  return (
    <>
      <MenuApplier />
      <SettingApplier />
      <NotificationApplier />
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        stacked
        theme="light"
        transition={Slide}
      />
      <Outlet />
    </>
  );
};

export default RootLayout;
