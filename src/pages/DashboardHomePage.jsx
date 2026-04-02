import { Boxes, Clock, TrendingUpDownIcon, TriangleAlert } from "lucide-react";
import StatusCard from "../components/general_components/StatusCard";

const DashboardHome = () => {
  return (
    <div className="animate-fade-in">
      <h1 className="text-[32px] font-bold text-custom-black mb-2 leading-none tracking-tight">
        Dashboard
      </h1>
      <p className="text-custom-gray text-sm mb-8">System overview and quick metrics.</p>
      
      {/* ADD AN IF STATEMENT TO CHECK IF MANAGER OR NOT? */}

      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
        <StatusCard
        title={"Total Inventory"}
        mainValue={"1,450"}
        subText="from last month"
        Icon={Boxes}
        color={"text-custom-green"}
        secondValue={"12% "}

        />
        <StatusCard 
          title={"Total Revenue"}
          mainValue={"₱"+"420.69K"}
          subText={"from last month"}
          Icon={TrendingUpDownIcon}
          color={"text-custom-green"}
          secondValue={"5% "}
        />

        <StatusCard 
          title={"Pending Requests"}
          mainValue={"5"}
          subText="outbound "
          Icon={Clock}
          color={"text-custom-blue"}
          secondValue={"3 "}
          thirdValue={"2 "}
          secondSubText={"inbound"}

        />

        <StatusCard 
          title={"Low Stock Perfumes"}
          mainValue={"3"}
          Icon={TriangleAlert}
          color={"text-custom-yellow"}
          secondValue={"Requires attention"}
        />

      </div>
  
      <div className="h-64 mt-8 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 bg-white">
        Metrics Dashboard Placeholder
        
      </div>
    </div>
  );
};

export default DashboardHome;