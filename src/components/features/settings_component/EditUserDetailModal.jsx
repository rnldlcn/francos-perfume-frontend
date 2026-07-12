import React, { useState, useEffect } from 'react';
import { X, ChevronLeft } from 'lucide-react';

const EditUserDetailsModal = ({ isOpen, onClose, user, profileData, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    contactNo: '',
    address: '',
    email: '',
    branch: '',
    role: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // FIXED: Pre-fill the form using the fetched profileData, not the stripped-down user session
  useEffect(() => {
    if (isOpen) {
      setFormData({
        firstName: profileData?.first_name || '',
        lastName: profileData?.last_name || '',
        middleName: profileData?.middle_name || '',
        contactNo: profileData?.contact_number || '',
        address: profileData?.address || '',
        email: profileData?.email || user?.email || '',
        branch: profileData?.branch_display_id || user?.branchId || '',
        role: profileData?.employee_role?.toUpperCase() || user?.trueRole?.toUpperCase() || ''
      });
    }
  }, [isOpen, profileData, user]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // CALL 1: Update Profile Details
      const profilePayload = {
        branch_id: profileData?.branch_id || user?.branchId || 1, 
        first_name: formData.firstName,
        last_name: formData.lastName,
        middle_name: formData.middleName,
        contact_number: formData.contactNo,
        address: formData.address,
        employee_shift: profileData?.employee_shift || "Morning", 
        employee_image_url: profileData?.employee_image_url || "" 
      };

      const profileResponse = await fetch(`http://localhost:5000/api/Employees/updateProfile/${user.employee_id}`, { 
        method: 'PUT',
        headers: { 
            'Authorization': `Bearer ${user?.accessToken}`,
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(profilePayload)
      });

      if (!profileResponse.ok) throw new Error("Failed to update profile details.");

      // CALL 2: Update Auth Details (Email)
      if (formData.email !== (profileData?.email || user.email)) {
        const authPayload = {
          email: formData.email,
          employee_role: user.trueRole || "STAFF", 
          password_status: user.password_status || "active" 
        };

        const authResponse = await fetch(`http://localhost:5000/api/Employees/updateAuth/${user.employee_id}`, { 
          method: 'PUT',
          headers: { 
              'Authorization': `Bearer ${user?.accessToken}`,
              'Content-Type': 'application/json' 
          },
          body: JSON.stringify(authPayload)
        });

        if (!authResponse.ok) throw new Error("Profile updated, but email update failed.");
      }
      
      alert("Account details updated successfully!");
      
      // FIXED: Pass the exact database column names back to the card so it can update instantly
      if (onSave) {
        onSave({
          first_name: formData.firstName,
          last_name: formData.lastName,
          middle_name: formData.middleName,
          contact_number: formData.contactNo,
          address: formData.address,
          email: formData.email
        });
      }
      onClose();
    } catch (error) {
      alert(`Update failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 font-montserrat animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-[550px] p-8 relative">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-2xl font-bold text-[#333] tracking-tight">Edit Account Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input 
              type="text" 
              placeholder="First Name" 
              required
              className="border border-gray-400 rounded-md p-2.5 text-sm focus:outline-none focus:border-gray-800 text-gray-800"
              value={formData.firstName} 
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            />
            <input 
              type="text" 
              placeholder="Last Name" 
              required
              className="border border-gray-400 rounded-md p-2.5 text-sm focus:outline-none focus:border-gray-800 text-gray-800"
              value={formData.lastName} 
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input 
              type="text" 
              placeholder="Middle Name"
              className="border border-gray-400 rounded-md p-2.5 text-sm focus:outline-none focus:border-gray-800 text-gray-800"
              value={formData.middleName} 
              onChange={(e) => setFormData({...formData, middleName: e.target.value})}
            />
            <input 
              type="text" 
              placeholder="Contact No."
              className="border border-gray-400 rounded-md p-2.5 text-sm focus:outline-none focus:border-gray-800 text-gray-800"
              value={formData.contactNo} 
              onChange={(e) => setFormData({...formData, contactNo: e.target.value})}
            />
          </div>

          <input 
            type="text" 
            placeholder="Address"
            className="w-full border border-gray-400 rounded-md p-2.5 text-sm focus:outline-none focus:border-gray-800 text-gray-800"
            value={formData.address} 
            onChange={(e) => setFormData({...formData, address: e.target.value})}
          />

          <input 
            type="email" 
            placeholder="Email" 
            required
            className="w-full border border-gray-400 rounded-md p-2.5 text-sm focus:outline-none focus:border-gray-800 text-gray-800"
            value={formData.email} 
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />

          <div className="grid grid-cols-2 gap-4">
            <select 
              disabled
              className="border border-gray-400 rounded-md p-2.5 text-sm bg-gray-200 text-gray-500 cursor-not-allowed appearance-none"
              value={formData.branch}
            >
              <option value={formData.branch}>{formData.branch || 'Select Branch'}</option>
            </select>
            
            <select 
              disabled
              className="border border-gray-400 rounded-md p-2.5 text-sm bg-gray-200 text-gray-500 cursor-not-allowed appearance-none"
              value={formData.role}
            >
              <option value={formData.role}>{formData.role || 'Select Role'}</option>
            </select>
          </div>

          <div className="flex justify-center gap-6 pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-[#E5D5C1] hover:bg-[#d4c2ab] px-6 py-2 rounded-md font-medium text-sm transition-colors text-gray-800 disabled:opacity-50"
            >
              <span className="text-lg font-bold">✕</span> Discard Changes
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-[#E5D5C1] hover:bg-[#d4c2ab] px-6 py-2 rounded-md font-medium text-sm transition-colors text-gray-800 disabled:opacity-50"
            >
              <span className="text-lg font-bold">✓</span> {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserDetailsModal;