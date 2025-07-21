import { Outlet } from "react-router";

const CommonLayout = () => {
  return (
    <>
      <div>
        <Outlet />
      </div>
    </>
  );
};

export default CommonLayout;
