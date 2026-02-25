import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [stats, setStats] = useState({ userCount: 0, fileCount: 0 });

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Failed to fetch stats", err));
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* News Section */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-[#1e1e1e] border border-[#333]">
            <div className="bg-[#181818] p-3 border-b border-[#333] font-bold text-[#e0e0e0] flex justify-between items-center uppercase tracking-wider text-xs">
              <span>Recent News</span>
              <span className="text-[#666] font-normal cursor-pointer hover:text-[#aaa]">View Archive</span>
            </div>
            <div className="p-6 space-y-6">
              <div className="border-b border-[#2a2a2a] pb-6 last:border-0 last:pb-0">
                <div className="flex justify-between items-baseline mb-3">
                  <h3 className="font-bold text-[#fff] text-lg">Welcome to RRepoHUB!</h3>
                  <span className="text-xs text-[#666]">Feb 24, 2026 by <span className="text-[#d32f2f] font-bold">SysOp</span></span>
                </div>
                <p className="text-[#aaa] leading-relaxed">
                  We have rebranded to <strong>RRepoHUB</strong>. The platform is now faster, cleaner, and supports a wider range of file types.
                  <br /><br />
                  Please review our new <Link to="/terms" className="text-[#64b5f6] hover:underline">Terms and Conditions</Link> before uploading.
                  <br />
                  <strong>Disclaimer:</strong> We do not monitor uploaded content. Use at your own risk.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          <div className="bg-[#1e1e1e] border border-[#333]">
            <div className="bg-[#181818] p-3 border-b border-[#333] font-bold text-[#e0e0e0] text-center uppercase tracking-wider text-xs">
              Repository Stats
            </div>
            <div className="p-4 text-xs space-y-2">
              <div className="flex justify-between border-b border-[#2a2a2a] pb-1"><span className="text-[#777]">Registered Users:</span> <span className="text-[#ccc]">{stats.userCount}</span></div>
              <div className="flex justify-between border-b border-[#2a2a2a] pb-1"><span className="text-[#777]">Files Hosted:</span> <span className="text-[#ccc]">{stats.fileCount}</span></div>
              <div className="flex justify-between pt-1"><span className="text-[#777]">Newest Member:</span> <Link to="#" className="text-[#64b5f6]">Hidden</Link></div>
            </div>
          </div>
          
          <div className="bg-[#1e1e1e] border border-[#333]">
            <div className="bg-[#181818] p-3 border-b border-[#333] font-bold text-[#e0e0e0] text-center uppercase tracking-wider text-xs">
              Disclaimer
            </div>
            <div className="p-4 text-[11px] text-[#666] text-center leading-relaxed">
              RRepoHUB does not host any files on its servers. All content is provided by non-affiliated third parties.
              We accept no responsibility for the content you download.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
