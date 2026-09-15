// FIXED: Changed 'useAuth' to 'UseAuth' to prevent the case-sensitivity crash
import { useAuth } from '@/auth/UseAuth';
import { ArrowRightLeft, LogOut, Settings, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutModal from './LogoutModal';

const ProfileDropdown = () => {
  const { user, handleSwitchAccess } = useAuth();
  const canSwitchAccess = user.trueRole === 'manager';

  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const displayUsername = user.email ? user.email.split('@')[0] : 'Employee Name';
    
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative z-50 pt-2" ref={dropdownRef}>

      {/* The Clickable Trigger */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        // FIXED: Replaced text-custom-gray and hover:text-custom-white with semantic foregrounds
        className={`flex items-center gap-2 cursor-pointer transition-colors text-muted-foreground hover:text-foreground`}
      >
        <User size={20} />
        <span className="font-medium text-[15px]">{displayUsername}</span>
        <span className="text-xs">▼</span>
      </div>
      
      {/* The Floating Menu */}
      {isOpen && (
        // FIXED: Replaced bg-custom-black, text-custom-white, and border-white/10 with standard card variables
        <div className="absolute right-0 top-full mt-3 w-48 bg-card text-card-foreground rounded shadow-2xl overflow-hidden flex flex-col border border-border">
          
          {/* FIXED: Replaced hover:bg-white/10 with hover:bg-muted */}
          <div className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted transition-colors">
            {/* FIXED: Replaced text-custom-gray-2 with text-muted-foreground */}
            <Settings size={18} className="text-muted-foreground" />
            <span className="text-sm font-medium">Settings</span>
          </div>

          {canSwitchAccess && (
            <div
              onClick={() => {
                setIsOpen(false);
                handleSwitchAccess();
              }}
              // FIXED: Replaced hover:bg-white/10 with hover:bg-muted
              className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted transition-colors"
            >
              <ArrowRightLeft size={18} className="text-muted-foreground" />
              <span className="text-sm font-medium">Switch Access</span>
            </div>
          )}

          <div
            onClick={() => {
              setIsOpen(false);
              setShowLogoutModal(true);
            }}
            // FIXED: Replaced bg-custom-red with standard destructive variables
            className="flex items-center gap-3 px-4 py-3 cursor-pointer bg-destructive hover:bg-destructive/90 transition-colors"
          >
            {/* FIXED: Replaced text-custom-white with text-destructive-foreground */}
            <LogOut size={18} className="text-destructive-foreground" />
            <span className="text-sm font-medium text-destructive-foreground">Logout</span>
          </div>
        </div>
      )}

      {showLogoutModal && (
        <LogoutModal
          setShowLogoutModal={setShowLogoutModal}
          />
      )}
    </div>
  );
};

export default ProfileDropdown;