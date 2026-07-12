import React, { useState } from 'react';
import { X, ChevronLeft } from 'lucide-react';

const EditAccountPasswordModal = ({ isOpen, onClose, user }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // --- ROBUST ID EXTRACTION ---
  // Checks all common property names where the ID might be stored in your JWT/Auth context
  const targetId = user?.employee_id || user?.id || user?.employeeId || user?.nameid;

  // --- REAL-TIME VALIDATION ENGINE ---
  const checkNameCondition = () => {
    if (password.length === 0) return false;
    const passLower = password.toLowerCase();
    const first = user?.first_name?.toLowerCase();
    const last = user?.last_name?.toLowerCase();
    
    // Fails if the password includes the user's first or last name (if they exist)
    if (first && passLower.includes(first)) return false;
    if (last && passLower.includes(last)) return false;
    return true;
  };

  const conditions = {
    hasNoName: checkNameCondition(),
    hasMinLength: password.length >= 12,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[#.\-?!@$%^&*]/.test(password),
  };

  const passwordsMatch = password === confirmPassword && password.length > 0;
  
  // All conditions must be true AND the passwords must match to submit
  const canSubmit = Object.values(conditions).every(Boolean) && passwordsMatch;

  const handleClose = () => {
    // Reset state when closing
    setPassword('');
    setConfirmPassword('');
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    // Safety check to prevent 404 errors before they happen
    if (!targetId) {
        alert("Error: Could not find your User ID in the authentication state. Please log out and log back in.");
        return;
    }
    
    setIsSubmitting(true);

    try {
      const response = await fetch(`http://localhost:5000/api/Employees/updatePassword/${targetId}`, { 
        method: 'PUT',
        headers: { 
            'Authorization': `Bearer ${user?.accessToken}`,
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ 
            new_password: password // Matches the UpdatePasswordDTO in C# exactly
        })
      });

      if (!response.ok) throw new Error(await response.text());
      
      alert("Password updated successfully.");
      handleClose();
    } catch (error) {
      alert(`Update failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper for text colors based on validation
  const getConditionClass = (isMet) => {
    return isMet ? "text-[#5A9B5C] font-medium transition-colors" : "text-[#9D3A43] transition-colors";
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 font-montserrat animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-[500px] p-8 relative">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-2xl font-bold text-[#333] tracking-tight">Edit Account Password</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Password:</label>
            <input 
              type="password" 
              placeholder="Enter your password here..." 
              required
              className="w-full border border-gray-400 rounded-md p-2.5 text-sm focus:outline-none focus:border-gray-800 text-gray-800"
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Confirm password:</label>
            <input 
              type="password" 
              placeholder="Confirm your password" 
              required
              className={`w-full border rounded-md p-2.5 text-sm focus:outline-none focus:border-gray-800 text-gray-800 transition-colors ${
                confirmPassword.length > 0 && !passwordsMatch ? 'border-[#9D3A43] bg-red-50' : 'border-gray-400'
              }`}
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {confirmPassword.length > 0 && !passwordsMatch && (
              <p className="text-xs text-[#9D3A43] mt-1">Passwords do not match.</p>
            )}
          </div>

          {/* VALIDATION CHECKLIST */}
          <div className="pt-2">
            <p className="text-[15px] font-bold text-[#333] mb-2">Password conditions (MUST HAVE):</p>
            <ul className="text-sm space-y-1.5 ml-4">
              <li className={getConditionClass(conditions.hasNoName)}>Must not include your name</li>
              <li className={getConditionClass(conditions.hasMinLength)}>12 characters minimum</li>
              <li className={getConditionClass(conditions.hasUpper)}>Include uppercase letter</li>
              <li className={getConditionClass(conditions.hasLower)}>Include lowercase letter</li>
              <li className={getConditionClass(conditions.hasNumber)}>Include number</li>
              <li className={getConditionClass(conditions.hasSpecial)}>Include a special character: (#.-?!@$%^&*)</li>
            </ul>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex justify-center gap-6 pt-6">
            <button 
              type="button" 
              onClick={handleClose} 
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-[#E5D5C1] hover:bg-[#d4c2ab] px-6 py-2 rounded-md font-medium text-sm transition-colors text-gray-800 disabled:opacity-50"
            >
              <span className="text-lg font-bold">✕</span> Discard Changes
            </button>
            <button 
              type="submit" 
              disabled={!canSubmit || isSubmitting}
              className="flex items-center gap-2 bg-[#E5D5C1] hover:bg-[#d4c2ab] px-6 py-2 rounded-md font-medium text-sm transition-colors text-gray-800 disabled:opacity-50 cursor-pointer"
            >
              <span className="text-lg font-bold">✓</span> {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAccountPasswordModal;