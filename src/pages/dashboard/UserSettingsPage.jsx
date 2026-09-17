import React from 'react';
import UserSettingsCard from '../../components/features/settings_component/UserSettingsCard';
import { useAuth } from '@/auth/UseAuth'; // FIXED: Correct path and casing

const UserSettingsPage = () => {
  const { user } = useAuth(); // FIXED: useAuth instead of UseAuth

  return (
    <div className="bg-background h-full font-montserrat flex flex-col items-center animate-fade-in overflow-y-auto">
      
      {/* HEADER TITLE */}
      <div className="w-full max-w-4xl mb-6">
        <h1 className="text-3xl font-bold text-foreground tracking-tight mb-1">User Settings</h1>
        <p className="text-sm text-muted-foreground">Change device settings, personal information, and more</p>
      </div>
      
      {/* CONTENT AREA */}
      <div className="w-full max-w-4xl">
        <UserSettingsCard user={user} />
      </div>

    </div>
  );
};

export default UserSettingsPage;