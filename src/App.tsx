import { RouterProvider } from "react-router";
import { Slide, ToastContainer } from "react-toastify";
import MenuApplier from "./components/appliers/MenuApplier";
import SettingApplier from "./components/appliers/SettingApplier";
import useAppRouter from "./hooks/states/useRouter";

const App = () => {
  const router = useAppRouter();
  return (
    <>
      <RouterProvider router={router} />
      <MenuApplier />
      <SettingApplier />
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
    </>
  );
};

export default App;
