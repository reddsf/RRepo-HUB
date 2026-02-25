import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mail } from 'lucide-react';

export default function VerifyEmail() {
  const location = useLocation();
  const email = location.state?.email || 'your email';

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="w-full max-w-md bg-[#181818] border border-[#333] p-8 text-center shadow-xl">
        <div className="flex justify-center mb-6">
          <div className="bg-[#1e1e1e] p-4 rounded-full border border-[#333]">
            <Mail size={48} className="text-[#64b5f6]" />
          </div>
        </div>
        
        <h2 className="text-xl font-bold text-[#e0e0e0] mb-4 uppercase tracking-wide">Verify your email</h2>
        
        <p className="text-[#aaa] mb-8 leading-relaxed">
          We have sent you a verification email to <br/>
          <span className="text-[#fff] font-bold">{email}</span>.
          <br/><br/>
          Please verify it and log in.
        </p>

        <div className="border-t border-[#333] pt-6">
          <Link to="/login" className="retro-button px-8 py-3 inline-block">
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
