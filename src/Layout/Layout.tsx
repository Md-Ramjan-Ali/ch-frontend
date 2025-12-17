 import { Outlet } from "react-router-dom";
 
const Layout: React.FC = () => {
  return (
    <div className=" ">
      {/* <Navbar /> */}
      <main>
        <Outlet />
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default Layout;
