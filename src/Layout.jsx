// Layout.jsx — renders Header once, on every route, via Outlet
import { Outlet } from "react-router-dom";
import Header from "./components/Header";

function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;