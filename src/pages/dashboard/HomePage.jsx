import { Boxes, Clock, TrendingUpDownIcon, TriangleAlertIcon, Loader2 } from "lucide-react";
import StatusCard from "../../components/shared/StatusCard";

// ADDED: isLoading prop to handle the loading animation state
const DashboardHome = ({ role, isLoading = false }) => {

  const isManager = role === 'manager';
  
  {
    /* 
    TEMP DATA 
    */
  }
  const cards = [
    // Note: The custom colors here (text-custom-green, etc.) will still work perfectly 
    // because we explicitly mapped them in your tailwind.config.js earlier!
    {title: "Total Inventory", mainValue: 1450, subText: "from last month", Icon: Boxes, color: "text-custom-green", secondValue: "+" + 12 + "%"},
    {title: "Pending Requests", mainValue: 5, subText: "outbound", Icon: Clock, color: "text-custom-blue", secondValue: 3, thirdValue: 2, secondSubText: "inbound"},
    {title: "Low Stock Perfumes", mainValue: 3, Icon: TriangleAlertIcon, color: "text-custom-yellow", secondValue: "Requires Attention"}
  ];

  if(isManager) {
    cards.push({title: "Total Revenue", mainValue: "₱"+420.69+"K", subText: "from last month", Icon: TrendingUpDownIcon, color: "text-custom-green", secondValue: 5 + "%"})
  };

  // ADDED: Loading state overlay
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh] animate-fade-in">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-medium">Loading dashboard metrics...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* FIXED: Replaced custom-black with text-foreground */}
      <h1 className="text-[32px] font-bold text-foreground mb-2 leading-none tracking-tight">
        Dashboard
      </h1>
      {/* FIXED: Replaced custom-gray with text-muted-foreground */}
      <p className="text-muted-foreground text-sm mb-8">System overview and quick metrics.</p>
      
      {
        /* 
          ADD A STATEMENT THAT CHANGES THE COLORS OF THE STATUS DEPENDING WHETHER ITS POSITIVE OR NOT
          THIS IS TO BE DONE IN THE FUTURE
        */
      }

      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
        {cards.map((card, index) => (
          <StatusCard 
            key={index}
            title={card.title}
            mainValue={card.mainValue}
            subText={card.subText}
            Icon={card.Icon}
            color={card.color}
            secondValue={card.secondValue}
            thirdValue={card.thirdValue}
            secondSubText={card.secondSubText}
          />
        ))}
      </div>
  
      {/* FIXED: Replaced hardcoded gray/white borders and backgrounds with semantic variables */}
      <div className="h-64 mt-8 border-2 border-dashed border-border rounded-lg flex items-center justify-center text-muted-foreground bg-card">
        Metrics Dashboard Placeholder
      </div>
    </div>
  );
};

export default DashboardHome;