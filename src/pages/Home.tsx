import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { FileText, Download, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function Home() {
  const [stats, setStats] = useState({
    mostDownloaded: null as any,
    newestFile: null as any,
    totalDownloads: 0,
    totalFiles: 0
  });
  const [recentUploads, setRecentUploads] = useState<any[]>([]);

  // Static list of site updates
  const siteUpdates = [
    { date: '2026-02-25', title: 'GitHub Login Added', desc: 'You can now sign in using your GitHub account.' },
    { date: '2026-02-24', title: 'Profile Search Fixed', desc: 'Fixed issues with finding users by partial username.' },
    { date: '2026-02-22', title: 'File Upload Improvements', desc: 'Increased max file size limit and added progress bar.' },
    { date: '2026-02-20', title: 'New Profile Layout', desc: 'Redesigned user profiles to show all uploaded files.' },
    { date: '2026-02-15', title: 'RRepoHUB Rebrand', desc: 'Welcome to the new RRepoHUB! Faster and more secure.' }
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all files for stats (optimize later)
        const q = query(collection(db, "files"));
        const snapshot = await getDocs(q);
        
        let totalDl = 0;
        let maxDl = -1;
        let mostDlFile = null;
        let newest = null;
        let newestDate = 0;
        const allFiles: any[] = [];

        snapshot.forEach(doc => {
          const data = doc.data();
          allFiles.push({ id: doc.id, ...data });
          totalDl += (data.downloads || 0);
          
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

        // Sort for recent uploads (client-side for now since we fetched all)
        const sortedRecent = [...allFiles].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
        setRecentUploads(sortedRecent);

        setStats({
          mostDownloaded: mostDlFile,
          newestFile: newest,
          totalDownloads: totalDl,
          totalFiles: snapshot.size
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
        {/* Main Content Area */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Recent Site Updates */}
          <div className="bg-[#1e1e1e] border border-[#333]">
            <div className="bg-[#181818] p-3 border-b border-[#333] font-bold text-[#e0e0e0] flex justify-between items-center uppercase tracking-wider text-xs">
              <span>Latest Site Updates</span>
              <span className="text-[#666] font-normal">Changelog</span>
            </div>
            <div className="divide-y divide-[#2a2a2a]">
              {siteUpdates.map((update, i) => (
                <div key={i} className="p-4 hover:bg-[#222] transition-colors">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-[#64b5f6] text-sm">{update.title}</h3>
                    <span className="text-[10px] text-[#666] font-mono">{update.date}</span>
                  </div>
                  <p className="text-[#aaa] text-xs leading-relaxed">
                    {update.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Uploads */}
          <div className="bg-[#1e1e1e] border border-[#333]">
            <div className="bg-[#181818] p-3 border-b border-[#333] font-bold text-[#e0e0e0] flex justify-between items-center uppercase tracking-wider text-xs">
              <span>Recently Uploaded Files</span>
              <Link to="/browse" className="text-[#64b5f6] hover:underline">View All</Link>
            </div>
            <div className="divide-y divide-[#2a2a2a]">
              {recentUploads.length === 0 ? (
                <div className="p-6 text-center text-[#666] text-xs">No files uploaded yet.</div>
              ) : (
                recentUploads.map((file) => (
                  <div key={file.id} className="p-3 flex items-center justify-between hover:bg-[#222] transition-colors">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="bg-[#2a2a2a] p-2 rounded text-[#888]">
                        <FileText size={16} />
                      </div>
                      <div className="min-w-0">
                        <Link to={`/details/${file.id}`} className="text-[#e0e0e0] font-medium text-sm hover:text-[#64b5f6] truncate block">
                          {file.name}
                        </Link>
                        <div className="text-[10px] text-[#666] flex items-center gap-2">
                          <span>by {file.uploader || 'Unknown'}</span>
                          <span>•</span>
                          <span>{file.size}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-[10px] text-[#666] whitespace-nowrap flex flex-col items-end">
                      <span className="flex items-center gap-1"><Clock size={10} /> {formatDistanceToNow(new Date(file.date), { addSuffix: true })}</span>
                      <span className="flex items-center gap-1 mt-1"><Download size={10} /> {file.downloads}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          <div className="bg-[#1e1e1e] border border-[#333]">
            <div className="bg-[#181818] p-3 border-b border-[#333] font-bold text-[#e0e0e0] text-center uppercase tracking-wider text-xs">
              Repository Stats
            </div>
            <div className="p-4 text-xs space-y-4">
              <div className="border-b border-[#2a2a2a] pb-3">
                <div className="text-[#777] mb-1 uppercase text-[10px] tracking-widest">Total Files Served</div>
                <div className="text-[#fff] font-mono text-2xl font-bold">{stats.totalFiles}</div>
              </div>

              <div className="border-b border-[#2a2a2a] pb-3">
                <div className="text-[#777] mb-1 uppercase text-[10px] tracking-widest">Total Downloads</div>
                <div className="text-[#64b5f6] font-mono text-2xl font-bold">{stats.totalDownloads}</div>
              </div>

              <div className="pt-1">
                <div className="text-[#777] mb-2 uppercase text-[10px] tracking-widest">Top Download</div>
                {stats.mostDownloaded ? (
                  <Link to={`/details/${stats.mostDownloaded.id}`} className="block bg-[#222] p-3 border border-[#333] hover:border-[#555] transition-colors group">
                    <div className="text-[#e0e0e0] font-bold truncate group-hover:text-[#64b5f6]">{stats.mostDownloaded.name}</div>
                    <div className="text-[#666] mt-1 flex justify-between">
                      <span>{stats.mostDownloaded.size}</span>
                      <span className="text-[#fff]">{stats.mostDownloaded.downloads} DLs</span>
                    </div>
                  </Link>
                ) : <span className="text-[#444]">None</span>}
              </div>
            </div>
          </div>
          
          <div className="bg-[#1e1e1e] border border-[#333]">
            <div className="bg-[#181818] p-3 border-b border-[#333] font-bold text-[#e0e0e0] text-center uppercase tracking-wider text-xs">
              Quick Actions
            </div>
            <div className="p-4 space-y-3">
               <Link to="/upload" className="retro-button w-full block text-center text-xs py-3">Upload New File</Link>
               <Link to="/users" className="block w-full text-center text-xs py-3 bg-[#222] text-[#aaa] border border-[#333] hover:bg-[#2a2a2a] hover:text-white transition-colors">Find Users</Link>
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
