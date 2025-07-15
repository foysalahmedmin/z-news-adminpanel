import { Provider } from "react-redux";
import { RouterProvider } from "react-router";
import { Slide, ToastContainer } from "react-toastify";
import store from "./redux/store";
import { router } from "./routes";

const App = () => {
  return (
    <>
      <Provider store={store}>
        <RouterProvider router={router} />
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
      </Provider>
    </>
  );
};

export default App;
