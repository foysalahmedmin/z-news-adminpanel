import { RouterProvider } from "react-router";
import { Slide, ToastContainer } from "react-toastify";
import RouteMenuApplier from "./components/appliers/RouteMenuApplier";
import SettingApplier from "./components/appliers/SettingApplier";
import useAppRouter from "./hooks/states/useRouter";

const App = () => {
  const router = useAppRouter();
  return (
    <>
      <RouteMenuApplier />
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
      <RouterProvider router={router} />
    </>
  );
};

export default App;
