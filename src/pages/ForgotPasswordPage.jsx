import { useState } from "react";

const ForgotPage = () => {
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [otp, setOtp] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleResetPassword = (e) => {
    e.preventDefault();
    alert("Password reset simulation! Sending you back to login...");
    setPassword('');
    setOtp('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
        {isForgotPassword ? (
          <form onSubmit={handleResetPassword}>
            <div className="mb-4">
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">OTP</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
            <button type="submit" className="w-full bg-[#7D162E] text-white py-2 rounded">Reset Password</button>
          </form>
        ) : (
          <div>
            <p className="mb-4">Please enter your email to receive a password reset link.</p>
            <button onClick={() => setIsForgotPassword(true)} className="w-full bg-[#7D162E] text-white py-2 rounded">Send OTP</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPage;