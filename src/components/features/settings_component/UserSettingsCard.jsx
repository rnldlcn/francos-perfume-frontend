import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import EditUserDetailsModal from './EditUserDetailModal';
import EditAccountPasswordModal from './EditAccountPasswordModal';

const UserSettingsCard = ({ user }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.employee_id) return;
      
      try {
        // IMPORTANT: If your data is still saying "N/A" after a page reload, 
        // it means this specific C# URL is wrong. Check Swagger for your 
        // DisplayEmployeeById endpoint route.
        const response = await fetch(`http://localhost:5000/api/Employees/${user.employee_id}`, {
          headers: {
            'Authorization': `Bearer ${user.accessToken}`
          }
        });
        
        if (response.ok) {
          const result = await response.json();
          setProfileData(result.data || result); 
        } else {
          console.error("GET Profile returned a 404/Error. Check the fetch URL.");
        }
      } catch (error) {
        console.error("Failed to fetch profile details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  // FIXED: This function catches the saved data from the modal and instantly updates the UI
  const handleSaveProfile = (updatedFields) => {
    setProfileData(prevData => ({
      ...prevData,
      ...updatedFields
    }));
  };

  const profile = {
    firstName: profileData?.first_name || 'N/A',
    middleName: profileData?.middle_name || 'N/A',
    lastName: profileData?.last_name || 'N/A',
    address: profileData?.address || 'N/A',
    email: profileData?.email || user?.email || 'N/A',
    contactNo: profileData?.contact_number || 'N/A',
    branch: profileData?.branch_display_id || user?.branchId || 'N/A',
    role: profileData?.employee_role?.toUpperCase() || user?.trueRole?.toUpperCase() || 'N/A',
    profilePic: profileData?.employee_image_url || null
  };

  if (isLoading) {
    return <div className="p-8 font-montserrat text-gray-500">Loading profile data...</div>;
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 font-montserrat max-w-2xl">
        
        <div className="flex items-center gap-6 mb-10">
          <div className="h-24 w-24 rounded-full border-2 border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 shrink-0">
            {profile.profilePic ? (
              <img src={profile.profilePic} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <User size={48} className="text-gray-400 stroke-[1.5]" />
            )}
          </div>
          
          <div className="flex-grow">
            <h3 className="text-[22px] font-bold text-[#333] tracking-tight">Profile picture</h3>
            <p className="text-sm text-gray-400 mt-0.5">PNG, JPEG under 15 MB</p>
          </div>

          <div className="flex flex-col gap-3 shrink-0">
            <button className="bg-[#E5D5C1] hover:bg-[#d4c2ab] text-[#333] font-medium py-2 px-4 rounded-md text-sm transition-colors shadow-sm">
              Upload new picture
            </button>
            <button className="border border-[#D47B7B] text-[#D47B7B] hover:bg-red-50 font-medium py-2 px-4 rounded-md text-sm transition-colors bg-white">
              Remove picture
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-y-6 gap-x-4 mb-10">
          <div>
            <p className="text-sm text-gray-400 mb-1">First name:</p>
            <p className="font-bold text-[#333]">{profile.firstName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Middle name:</p>
            <p className="font-bold text-[#333]">{profile.middleName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Last name:</p>
            <p className="font-bold text-[#333]">{profile.lastName}</p>
          </div>

          <div className="col-span-3">
            <p className="text-sm text-gray-400 mb-1">Address:</p>
            <p className="font-bold text-[#333] uppercase">{profile.address}</p>
          </div>

          <div className="col-span-2">
            <p className="text-sm text-gray-400 mb-1">Email:</p>
            <p className="font-bold text-[#333] truncate pr-4">{profile.email}</p>
          </div>
          <div className="col-span-1">
            <p className="text-sm text-gray-400 mb-1">Contact no.:</p>
            <p className="font-bold text-[#333]">{profile.contactNo}</p>
          </div>

          <div className="col-span-2">
            <p className="text-sm text-gray-400 mb-1">Branch:</p>
            <p className="font-bold text-[#333]">{profile.branch}</p>
          </div>
          <div className="col-span-1">
            <p className="text-sm text-gray-400 mb-1">Role:</p>
            <p className="font-bold text-[#333] uppercase">{profile.role}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="bg-[#E5D5C1] hover:bg-[#d4c2ab] text-[#333] font-medium py-2.5 px-8 rounded-md text-sm transition-colors shadow-sm w-40"
          >
            Edit details
          </button>
          <button 
            onClick={() => setIsPasswordModalOpen(true)}
            className="border border-[#D47B7B] text-[#D47B7B] hover:bg-red-50 font-medium py-2.5 px-8 rounded-md text-sm transition-colors bg-white w-48"
          >
            Update Password
          </button>
        </div>
      </div>

      <EditUserDetailsModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        user={user} 
        profileData={profileData} 
        onSave={handleSaveProfile} 
      />
      // FIXED: Added the EditAccountPasswordModal component to allow users to update their password.
      <EditAccountPasswordModal 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
        user={user} 
      />
    </>
  );
};

export default UserSettingsCard;