import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Download, FileText, Film, Music, HardDrive, Package, Image as ImageIcon, FileArchive, Link as LinkIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface FileItem {
  id: string;
  name: string;
  category: string;
  size: string;
  date: string;
  downloads: number;
  type: string;
  downloadUrl: string;
  isExternalLink?: boolean;
}

const CATEGORIES = [
  { name: 'Movies', icon: Film },
  { name: 'Music', icon: Music },
  { name: 'Games', icon: HardDrive },
  { name: 'Apps', icon: Package },
  { name: 'Docs', icon: FileText },
  { name: 'Images', icon: ImageIcon },
  { name: 'Archives', icon: FileArchive },
];

export default function UserProfile() {
  const { uid } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;

    const fetchData = async () => {
      try {
        // Fetch User Profile
        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
          setProfile(userDoc.data());
        }

        // Fetch User Files by uploaderUid
        const q = query(collection(db, "files"), where("uploaderUid", "==", uid));
        const querySnapshot = await getDocs(q);
        const fetchedFiles: FileItem[] = [];
        querySnapshot.forEach((doc) => {
          fetchedFiles.push({ id: doc.id, ...doc.data() } as FileItem);
        });
        setFiles(fetchedFiles);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [uid]);

  const getCategoryIcon = (cat: string) => {
    const found = CATEGORIES.find(c => c.name === cat);
    const Icon = found?.icon || Package;
    return <Icon size={16} className="text-[#777]" />;
  };

  if (loading) return <div className="p-8 text-center text-[#666]">Loading...</div>;
  if (!profile) return <div className="p-8 text-center text-[#666]">User not found.</div>;

  return (
    <div className="space-y-6">
      <div className="bg-[#1e1e1e] border border-[#333]">
        <div className="bg-[#181818] p-3 border-b border-[#333] font-bold text-[#e0e0e0] uppercase tracking-wider text-sm">
          User Profile
        </div>
        <div className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#222] border border-[#333] flex items-center justify-center text-2xl font-bold text-[#666]">
              {profile.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#fff]">{profile.username}</h1>
              <div className="text-[#888] text-xs mt-1">
                {profile.firstName} {profile.lastName}
              </div>
              <div className="text-[#666] text-xs mt-1">
                Member since {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Unknown'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1e1e1e] border border-[#333]">
        <div className="bg-[#181818] p-3 border-b border-[#333] font-bold text-[#e0e0e0] uppercase tracking-wider text-sm">
          Uploaded Files ({files.length})
        </div>
        <div className="overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="retro-table-header w-14 text-center">Type</th>
                <th className="retro-table-header">Name</th>
                <th className="retro-table-header w-32">Date</th>
                <th className="retro-table-header w-24">Size</th>
                <th className="retro-table-header w-24 text-center">Downloads</th>
              </tr>
            </thead>
            <tbody>
              {files.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-[#666]">No files uploaded.</td></tr>
              ) : (
                files.map((file, i) => (
                  <tr key={file.id} className={i % 2 === 0 ? 'bg-[#181818]' : 'bg-[#1e1e1e] hover:bg-[#252525] transition-colors'}>
                    <td className="retro-table-cell text-center">
                      <div className="flex justify-center">{getCategoryIcon(file.category)}</div>
                    </td>
                    <td className="retro-table-cell font-medium">
                      <Link to={`/details/${file.id}`} className="text-[#e0e0e0] hover:text-[#64b5f6] block text-sm">
                        {file.name}
                        {file.isExternalLink && <LinkIcon size={12} className="inline ml-2 text-[#666]" />}
                      </Link>
                    </td>
                    <td className="retro-table-cell text-xs text-[#888]">
                      {formatDistanceToNow(new Date(file.date), { addSuffix: true })}
                    </td>
                    <td className="retro-table-cell text-[#aaa] font-mono text-xs">{file.size}</td>
                    <td className="retro-table-cell text-center text-[#666] font-mono">{file.downloads}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
