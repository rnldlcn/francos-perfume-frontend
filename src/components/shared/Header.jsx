import { useAuth } from '@/auth/UseAuth';
import { formatDateForTable } from '@/utils/formattingUtils';
import { useEffect, useState } from 'react';
import ProfileDropdown from './ProfileDropdown';

const Header = () => {
  const { user } = useAuth();

  const [currentDate, setCurrentDate] = useState("");
  const [userLocation, setUserLocation] = useState("Loading...");
  
  useEffect(() => {
    try {
      setCurrentDate(formatDateForTable(new Date()));

      setUserLocation(user.branchLocation);
    } catch (error) {
      console.error("Header initialization error:", error);
      setUserLocation("Error loading location");
    }
  }, [user.branchLocation]);

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
        <div className="flex gap-8 text-sm text-custom-gray items-center">
           <p><span className="font-semibold text-custom-black">Date:</span> {currentDate}</p>

           <div className="flex items-center gap-2">
             <span className="font-semibold text-custom-black">Location:</span>
             <span className="text-custom-gray bg-gray-50 px-3 py-1 rounded border border-gray-200 font-medium">
                {userLocation}
             </span>
           </div>
        </div>
        
        <ProfileDropdown/>
        
      </header>
    </>
  );
};

export default Header;