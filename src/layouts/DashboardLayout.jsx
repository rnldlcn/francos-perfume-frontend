import { UseAuth } from "@/auth/UseAuth";
import { Outlet } from "react-router-dom";
import Header from "../components/shared/Header";
import Sidebar from "../components/shared/Sidebar";

const DashboardLayout = () => {
  const { activeRole, email: userEmail } = UseAuth();

  return (
    <div className="flex h-screen bg-[#F7F7F9] text-[#333] font-montserrat text-[16px]">
      <Sidebar/>
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Header/>
        <main className="flex-1 p-8 overflow-auto bg-[#F7F7F9]">
          <Outlet context={{ activeRole, userEmail }} />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
