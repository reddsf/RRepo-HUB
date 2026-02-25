import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Captcha State
  const [captchaNum1, setCaptchaNum1] = useState(0);
  const [captchaNum2, setCaptchaNum2] = useState(0);
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const generateCaptcha = () => {
    setCaptchaNum1(Math.floor(Math.random() * 10));
    setCaptchaNum2(Math.floor(Math.random() * 10));
    setCaptchaAnswer('');
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Captcha Check
    if (parseInt(captchaAnswer) !== captchaNum1 + captchaNum2) {
      setError('Incorrect captcha answer. Are you a bot?');
      generateCaptcha();
      return;
    }

    try {
      await register(email, password);
      navigate('/verify-email', { state: { email } });
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('User already exists. Please sign in');
      } else {
        setError('Registration failed: ' + err.message);
      }
      generateCaptcha();
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="w-full max-w-lg bg-[#181818] border border-[#333] p-0 shadow-xl">
        <div className="bg-[#1e1e1e] p-3 border-b border-[#333] font-bold text-[#e0e0e0] text-center uppercase tracking-wider text-sm">
          Create Account
        </div>
        <div className="p-8">
          {error && <div className="bg-red-900/20 border border-red-800/50 text-red-200 p-3 mb-6 text-center text-xs">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[#999] mb-1 text-xs uppercase font-medium">First Name</label>
                <input 
                  type="text" 
                  className="retro-input w-full"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-[#999] mb-1 text-xs uppercase font-medium">Last Name</label>
                <input 
                  type="text" 
                  className="retro-input w-full"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[#999] mb-1 text-xs uppercase font-medium">Username</label>
              <input 
                type="text" 
                className="retro-input w-full"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={4}
                placeholder="Min 4 characters"
              />
            </div>

            <div>
              <label className="block text-[#999] mb-1 text-xs uppercase font-medium">Email</label>
              <input 
                type="email" 
                className="retro-input w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="valid@email.com"
              />
            </div>

            <div>
              <label className="block text-[#999] mb-1 text-xs uppercase font-medium">Password</label>
              <input 
                type="password" 
                className="retro-input w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="6+ chars, letters, numbers, special chars"
              />
              <div className="text-[10px] text-[#555] mt-1">
                Must contain at least 1 letter, 1 number, and 1 special character.
              </div>
            </div>

            {/* Captcha */}
            <div className="bg-[#1e1e1e] p-4 border border-[#333] flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <span className="text-[#e0e0e0] font-mono text-lg select-none">
                    {captchaNum1} + {captchaNum2} = ?
                  </span>
                  <button type="button" onClick={generateCaptcha} className="text-[#666] hover:text-[#aaa]" title="Refresh Captcha">
                    <RefreshCw size={14} />
                  </button>
               </div>
               <input 
                  type="number" 
                  className="retro-input w-20 text-center font-mono"
                  value={captchaAnswer}
                  onChange={(e) => setCaptchaAnswer(e.target.value)}
                  required
                  placeholder="?"
               />
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-[#333]">
                <Link to="/login" className="text-xs text-[#666] hover:text-[#999]">Already have an account?</Link>
                <button type="submit" className="retro-button px-8 py-2">Register</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
