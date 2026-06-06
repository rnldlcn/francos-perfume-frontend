import { useEffect, useState } from 'react';
import ProfileDropdown from './ProfileDropdown';

const Header = ({ user, onLogout, onSwitchAccess }) => {
  const [currentDate, setCurrentDate] = useState("");
  const [userLocation, setUserLocation] = useState("Loading...");
  
  useEffect(() => {
    try {
      // Set the current date safely
      const options = { timeZone: 'Asia/Manila', year: 'numeric', month: '2-digit', day: '2-digit' };
      const formattedDate = new Intl.DateTimeFormat('en-CA', options).format(new Date());
      setCurrentDate(formattedDate.replace(/-/g, '/'));

      // Retrieve the predetermined branch ID
      const branchId = sessionStorage.getItem('branchId');
      
      switch(branchId) {
        case "1": setUserLocation("Warehouse"); break;
        case "2": setUserLocation("Sta. Lucia"); break;
        case "3": setUserLocation("Riverbanks"); break;
        default: setUserLocation("Unknown Location");
      }
    } catch (error) {
      console.error("Header initialization error:", error);
      setUserLocation("Error loading location");
    }
  }, []);

  // CRITICAL FIX: If user is undefined or still loading, don't crash the header!
  if (!user) {
     return (
       <header className="h-16 bg-white border-b border-custom-gray-2 flex items-center justify-between px-8 shadow-sm z-10 shrink-0 font-montserrat">
          <div className="text-gray-400 text-sm animate-pulse">Loading profile...</div>
       </header>
     );
  }

  return (
    <>
      <header className="h-16 bg-white border-b border-custom-gray-2 flex items-center justify-between px-8 shadow-sm z-10 shrink-0 font-montserrat">
        <div className="flex gap-8 text-[14px] text-custom-gray items-center">
           <p><span className="font-semibold text-custom-black">Date:</span> {currentDate}</p>

           <div className="flex items-center gap-2">
             <span className="font-semibold text-custom-black">Location:</span>
             <span className="text-custom-gray bg-gray-50 px-3 py-1 rounded border border-gray-200 font-medium">
                {userLocation}
             </span>
           </div>
        </div>
        
        {/* We now know 'user' exists before rendering the dropdown */}
        <ProfileDropdown
          user={user}
          onLogout={onLogout}
          onSwitchAccess={onSwitchAccess}
        />
        
      </header>
    </>
  );
};

export default Header;