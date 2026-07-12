import React from 'react';
import UserSettingsCard from '../../components/features/settings_component/UserSettingsCard';
import { UseAuth } from '../../services/UseAuth'; 

const UserSettingsPage = () => {
  const { user } = UseAuth();

  return (
    <div className="p-8 bg-[#F4F7FB] min-h-full font-montserrat flex flex-col items-center animate-fade-in">
      
      {/* HEADER TITLE */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-[#333] tracking-tight">User Settings</h1>
        <p className="text-sm text-gray-500 mt-2">Change device settings, personal information, and more</p>
      </div>
      
      {/* CONTENT AREA */}
      <div className="w-full max-w-4xl">
        <UserSettingsCard user={user} />
      </div>

    </div>
  );
};

export default UserSettingsPage;