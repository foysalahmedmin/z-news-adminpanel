import { RouterProvider } from "react-router";
import { Slide, ToastContainer } from "react-toastify";
import SettingApplier from "./components/appliers/SettingApplier";
import { router } from "./routes";

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
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
