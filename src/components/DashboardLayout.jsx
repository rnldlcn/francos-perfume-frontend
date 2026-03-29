import React from 'react';
import logo from '../assets/FrancoPerfumeLogo.png';

// 1. Accept the 'role' prop here
const DashboardLayout = ({ role }) => {
  return (
    <div className="flex h-screen bg-[#F7F7F9] text-[#333] font-montserrat text-[16px]">
      
      {/* SIDEBAR */}
      <div className="w-64 bg-[#1E1E1E] text-white flex flex-col">
        
        {/* LOGO AREA */}
        <div className="py-10 px-6 border-b border-[#333] flex flex-col items-center justify-center mb-4">
          <img 
            src={logo} 
            alt="Franco's Logo" 
            className="h-24 w-auto object-contain mb-6" 
          />
          <span className="text-[12px] tracking-widest text-gray-500 font-semibold uppercase">Main Menu</span>
        </div>
        
        {/* NAVIGATION */}
        <div className="p-6 flex flex-col gap-4">
          
          {/* LEVEL 1: Features everyone can see (Admin, Manager, Staff) */}
          <div className="flex items-center gap-2 cursor-pointer bg-[#333] p-2 rounded">
             <div className="w-4 h-4 bg-gray-400"></div>
             <p className="font-medium text-[#D4C4B0]">Dashboard</p>
          </div>
          <div className="flex items-center gap-2 cursor-pointer p-2 hover:bg-[#333] transition-colors rounded">
             <div className="w-4 h-4 bg-gray-500"></div>
             <p className="text-gray-300">Inventory</p>
          </div>
          <div className="flex items-center gap-2 cursor-pointer p-2 hover:bg-[#333] transition-colors rounded">
             <div className="w-4 h-4 bg-gray-500"></div>
             <p className="text-gray-300">Requests</p>
          </div>

          {/* LEVEL 2: Features ONLY Admin and Manager can see */}
          {(role === 'Manager' || role === 'Admin') && (
            <>
              <div className="flex items-center gap-2 cursor-pointer p-2 hover:bg-[#333] transition-colors rounded">
                 <div className="w-4 h-4 bg-gray-500"></div>
                 <p className="text-gray-300">Transactions</p>
              </div>
              <div className="flex items-center gap-2 cursor-pointer p-2 hover:bg-[#333] transition-colors rounded">
                 <div className="w-4 h-4 bg-gray-500"></div>
                 <p className="text-gray-300">Forecast</p>
              </div>
            </>
          )}

        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* HEADER */}
        <header className="h-16 bg-white border-b border-[#E5E5E5] flex items-center justify-between px-8 shadow-sm">
          <div className="flex gap-8 text-[14px] text-gray-600">
             <p><span className="font-semibold text-gray-800">Date:</span> YYYY/MM/DD</p>
             <p><span className="font-semibold text-gray-800">Location:</span> Sta. Lucia</p>
          </div>
          
          <div className="text-[14px] flex items-center gap-2 cursor-pointer font-medium hover:text-gray-600 transition-colors">
             {/* 2. Dynamically display the logged-in role in the top right corner */}
             <span>{role ? `${role} User` : 'User Name'}</span>
             <span className="text-xs">▼</span>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-8 overflow-auto">
          <h1 className="text-[48px] font-bold text-gray-900 mb-8 leading-none tracking-tight">
            Dashboard
          </h1>
          
          <div className="h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400">
            Main content goes here (Charts, Tables, etc.)
          </div>
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;