import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Upload, Search, Home, User as UserIcon, Settings, MessageSquare, ShieldAlert } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, userProfile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col max-w-7xl mx-auto border-x border-[#333] shadow-2xl bg-[#121212]">
      {/* Top Bar - User Stats */}
      {user && (
        <div className="bg-[#1e1e1e] text-[#aaa] px-6 py-2 text-xs flex justify-between items-center border-b border-[#333]">
          <div className="flex gap-4">
            <span>Welcome, <span className="font-bold text-[#64b5f6]">{userProfile?.username || user.displayName || user.email?.split('@')[0] || 'User'}</span></span>
            <span className="text-[#666]">|</span>
            <span>Role: <span className="text-[#e0e0e0]">User</span></span>
          </div>
          <div className="flex gap-4">
             <Link to="/profile" className="hover:text-white transition-colors">Profile</Link>
             <button onClick={handleLogout} className="hover:text-white transition-colors">Logout</button>
          </div>
        </div>
      )}

      {/* Header / Logo Area */}
      <header className="bg-[#181818] p-8 border-b border-[#333] flex items-center justify-between">
        <div className="flex flex-col gap-1">
           {/* Logo */}
           <div className="text-3xl font-black tracking-tighter text-white flex items-center gap-2">
              <span className="text-[#64b5f6]">RRepo</span>HUB
           </div>
           <div className="text-[#666] text-xs uppercase tracking-widest">
              Secure File Repository
           </div>
        </div>
        
        {/* Search Box (Header version) */}
        <div className="hidden md:flex items-center gap-0">
            <input type="text" placeholder="Search files..." className="retro-input w-64 border-r-0" />
            <button className="retro-button border-l-0">Search</button>
        </div>
      </header>

      {/* Navigation Bar */}
      <nav className="bg-[#1e1e1e] border-b border-[#333]">
        <ul className="flex text-xs font-semibold uppercase tracking-wider text-[#aaa]">
          <li><Link to="/" className="block px-6 py-3 hover:bg-[#252525] hover:text-white transition-colors">Home</Link></li>
          <li><Link to="/browse" className="block px-6 py-3 hover:bg-[#252525] hover:text-white transition-colors">Browse</Link></li>
          <li><Link to="/upload" className="block px-6 py-3 hover:bg-[#252525] hover:text-white transition-colors">Upload</Link></li>
          <li><Link to="/terms" className="block px-6 py-3 hover:bg-[#252525] hover:text-white transition-colors">Terms & Rules</Link></li>
        </ul>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-[#121212]">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#181818] border-t border-[#333] p-8 text-center text-[#555] text-xs">
        <p className="mb-2">&copy; 2026 RRepoHUB. All rights reserved.</p>
        <p className="max-w-2xl mx-auto leading-relaxed">
          RRepoHUB is a file sharing platform. We are not responsible for the content uploaded by our users. 
          We do not host any files on our servers; we only provide a platform for users to share links and data.
          By using this site, you agree to our <Link to="/terms" className="text-[#666] underline hover:text-[#888]">Terms of Service</Link>.
        </p>
      </footer>
    </div>
  );
}
