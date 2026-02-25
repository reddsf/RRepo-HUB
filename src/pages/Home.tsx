import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';

export default function Home() {
  const [stats, setStats] = useState({
    mostDownloaded: null as any,
    newestFile: null as any,
    totalDownloads: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all files to calculate total downloads (not efficient for large scale but fine here)
        // And find max downloaded
        const q = query(collection(db, "files"));
        const snapshot = await getDocs(q);
        
        let total = 0;
        let maxDl = -1;
        let mostDlFile = null;
        let newest = null;
        let newestDate = 0;

        snapshot.forEach(doc => {
          const data = doc.data();
          total += (data.downloads || 0);
          
          if ((data.downloads || 0) > maxDl) {
            maxDl = data.downloads || 0;
            mostDlFile = { id: doc.id, ...data };
          }

          const d = new Date(data.date).getTime();
          if (d > newestDate) {
            newestDate = d;
            newest = { id: doc.id, ...data };
          }
        });

        setStats({
          mostDownloaded: mostDlFile,
          newestFile: newest,
          totalDownloads: total
        });

      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };
    fetchStats();
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
              Repository Highlights
            </div>
            <div className="p-4 text-xs space-y-3">
              <div className="border-b border-[#2a2a2a] pb-2">
                <div className="text-[#777] mb-1">Most Popular File:</div>
                {stats.mostDownloaded ? (
                  <Link to={`/details/${stats.mostDownloaded.id}`} className="text-[#64b5f6] font-bold hover:underline block truncate">
                    {stats.mostDownloaded.name} ({stats.mostDownloaded.downloads} DLs)
                  </Link>
                ) : <span className="text-[#444]">None</span>}
              </div>
              
              <div className="border-b border-[#2a2a2a] pb-2">
                <div className="text-[#777] mb-1">Newest Drop:</div>
                {stats.newestFile ? (
                  <Link to={`/details/${stats.newestFile.id}`} className="text-[#64b5f6] font-bold hover:underline block truncate">
                    {stats.newestFile.name}
                  </Link>
                ) : <span className="text-[#444]">None</span>}
              </div>

              <div className="pt-1">
                <div className="text-[#777] mb-1">Total Downloads Served:</div>
                <div className="text-[#ccc] font-mono text-lg">{stats.totalDownloads}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-[#1e1e1e] border border-[#333]">
            <div className="bg-[#181818] p-3 border-b border-[#333] font-bold text-[#e0e0e0] text-center uppercase tracking-wider text-xs">
              Find Users
            </div>
            <div className="p-4 text-center">
               <Link to="/users" className="retro-button w-full block text-xs">Search User Database</Link>
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
