import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

const DashboardLayout = () => {

  const [menuOpen, setMenuOpen] = useState(false);


  return (
    <div className="flex min-h-screen bg-background">

      <Sidebar
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />


      <div className="flex min-w-0 flex-1 flex-col">

        <Navbar
          onMenuClick={() => setMenuOpen(true)}
        />


        <main className="flex-1">
          <Outlet />
        </main>


      </div>

    </div>
  );
};


export default DashboardLayout;