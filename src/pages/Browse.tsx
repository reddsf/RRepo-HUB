import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, HardDrive, Film, Music, FileText, Package, Search, Image as ImageIcon, FileArchive, Link as LinkIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

interface FileItem {
  id: string;
  name: string;
  category: string;
  size: string;
  uploader: string;
  date: string;
  downloads: number;
  type: string;
  downloadUrl: string;
  isExternalLink?: boolean;
}

const CATEGORIES = [
  { name: 'All', icon: null },
  { name: 'Movies', icon: Film },
  { name: 'Music', icon: Music },
  { name: 'Games', icon: HardDrive },
  { name: 'Apps', icon: Package },
  { name: 'Docs', icon: FileText },
  { name: 'Images', icon: ImageIcon },
  { name: 'Archives', icon: FileArchive },
];

export default function Browse() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "files"), orderBy("date", "desc"));
      const querySnapshot = await getDocs(q);
      const fetchedFiles: FileItem[] = [];
      querySnapshot.forEach((doc) => {
        fetchedFiles.push({ id: doc.id, ...doc.data() } as FileItem);
      });
      
      let filtered = fetchedFiles;
      
      if (search) {
        const qStr = search.toLowerCase();
        filtered = filtered.filter(f => f.name.toLowerCase().includes(qStr));
      }
      
      if (category && category !== "All") {
        filtered = filtered.filter(f => f.category === category);
      }
      
      setFiles(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [category, search]); // Re-fetch/filter when category or search changes (client-side filtering for now)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFiles();
  };

  const handleDownload = (e: React.MouseEvent, file: FileItem) => {
    // For external links, we just let the Link component handle it or open new tab
    if (file.isExternalLink) {
      window.open(file.downloadUrl, '_blank');
    } else {
      // For internal files, open the download URL
      window.open(file.downloadUrl, '_blank');
    }
  };

  const getCategoryIcon = (cat: string) => {
    const found = CATEGORIES.find(c => c.name === cat);
    const Icon = found?.icon || Package;
    return <Icon size={16} className="text-[#777]" />;
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="bg-[#1e1e1e] border border-[#333] p-4 flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="flex gap-2 items-center overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat.name}
              onClick={() => setCategory(cat.name)}
              className={`px-4 py-2 text-xs font-medium border transition-colors ${category === cat.name ? 'bg-[#333] border-[#555] text-white' : 'bg-[#181818] border-[#333] text-[#888] hover:border-[#444] hover:text-[#ccc]'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
        <form onSubmit={handleSearch} className="flex gap-0 w-full md:w-auto">
          <input 
            type="text" 
            placeholder="Search files..." 
            className="retro-input flex-1 md:w-64 border-r-0"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="retro-button flex items-center gap-2 border-l-0">
            <Search size={14} /> Search
          </button>
        </form>
      </div>

      {/* Files Table */}
      <div className="border border-[#333] bg-[#1e1e1e] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="retro-table-header w-14 text-center">Type</th>
              <th className="retro-table-header">Name</th>
              <th className="retro-table-header w-16 text-center"><Download size={14} /></th>
              <th className="retro-table-header w-32">Date</th>
              <th className="retro-table-header w-24">Size</th>
              <th className="retro-table-header w-32">Uploader</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="p-12 text-center text-[#666]">Loading repository...</td></tr>
            ) : files.length === 0 ? (
              <tr><td colSpan={6} className="p-12 text-center text-[#666]">No files found in the repository.</td></tr>
            ) : (
              files.map((file, i) => (
                <tr key={file.id} className={i % 2 === 0 ? 'bg-[#181818]' : 'bg-[#1e1e1e] hover:bg-[#252525] transition-colors'}>
                  <td className="retro-table-cell text-center">
                    <div className="flex justify-center">{getCategoryIcon(file.category)}</div>
                  </td>
                  <td className="retro-table-cell font-medium">
                    <div 
                      onClick={(e) => handleDownload(e, file)}
                      className="text-[#e0e0e0] hover:text-[#64b5f6] cursor-pointer block text-sm mb-1 flex items-center gap-2"
                    >
                      {file.name}
                      {file.isExternalLink && <LinkIcon size={12} className="text-[#666]" />}
                    </div>
                    <div className="flex gap-2 text-[10px] text-[#666] uppercase tracking-wider">
                       <span className="bg-[#222] px-1 border border-[#333] rounded-sm">{file.type}</span>
                       <Link to={`/details/${file.id}`} className="hover:text-[#888]">View Details</Link>
                    </div>
                  </td>
                  <td className="retro-table-cell text-center text-[#666] font-mono">{file.downloads}</td>
                  <td className="retro-table-cell text-xs text-[#888]">
                    {formatDistanceToNow(new Date(file.date), { addSuffix: true })}
                  </td>
                  <td className="retro-table-cell text-[#aaa] font-mono text-xs">{file.size}</td>
                  <td className="retro-table-cell text-[#888] text-xs">{file.uploader}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Mock */}
      <div className="flex justify-center gap-2 mt-6">
         <button className="retro-button px-4">1</button>
         <button className="retro-button px-4 opacity-50 cursor-not-allowed">2</button>
         <button className="retro-button px-4 opacity-50 cursor-not-allowed">3</button>
         <span className="text-[#666] px-2 py-2">...</span>
         <button className="retro-button px-4 opacity-50 cursor-not-allowed">Next &raquo;</button>
      </div>
    </div>
  );
}
