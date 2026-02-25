import React, { useState } from 'react';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import { Search, User } from 'lucide-react';

export default function UserSearch() {
  const [username, setUsername] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    setLoading(true);
    setSearched(true);
    setResults([]); 
    
    try {
      // Fetch all users (or a reasonable limit) and filter client-side for better UX
      // Firestore doesn't support case-insensitive search natively
      const q = query(collection(db, "users"), limit(100));
      const querySnapshot = await getDocs(q);
      
      const searchStr = username.trim().toLowerCase();
      const users: any[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.username && data.username.toLowerCase().includes(searchStr)) {
          users.push({ id: doc.id, ...data });
        }
      });
      
      setResults(users);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-[#1e1e1e] p-4 border border-[#333] border-b-0 font-bold text-[#e0e0e0] uppercase tracking-wider text-sm">
        Find User
      </div>
      <div className="bg-[#181818] border border-[#333] p-8">
        <form onSubmit={handleSearch} className="flex gap-0 mb-8">
          <input 
            type="text" 
            placeholder="Enter username..." 
            className="retro-input flex-1 border-r-0"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button type="submit" className="retro-button flex items-center gap-2 border-l-0 px-6">
            <Search size={14} /> Search
          </button>
        </form>

        {loading && <div className="text-center text-[#666]">Searching...</div>}

        {!loading && searched && results.length === 0 && (
          <div className="text-center text-[#666]">No users found with that username.</div>
        )}

        <div className="space-y-2">
          {results.map(user => (
            <Link key={user.id} to={`/user/${user.id}`} className="block bg-[#1e1e1e] border border-[#333] p-4 hover:bg-[#252525] transition-colors flex items-center gap-4">
              <div className="bg-[#222] p-2 rounded-full border border-[#333]">
                <User size={20} className="text-[#64b5f6]" />
              </div>
              <div>
                <div className="font-bold text-[#e0e0e0]">{user.username}</div>
                <div className="text-xs text-[#666]">Joined {new Date(user.createdAt).toLocaleDateString()}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
