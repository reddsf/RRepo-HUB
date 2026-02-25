import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Download, Link as LinkIcon } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Details() {
  const { id } = useParams();
  const [file, setFile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchFile = async () => {
      try {
        const docRef = doc(db, "files", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFile({ id: docSnap.id, ...docSnap.data() });
        } else {
          setFile(null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFile();
  }, [id]);

  if (loading) return <div className="p-8 text-center text-[#666]">Loading...</div>;
  if (!file) return <div className="p-8 text-center text-[#666]">File not found.</div>;

  const handleDownload = () => {
    window.open(file.downloadUrl, '_blank');
  };

  return (
    <div className="space-y-4">
      <div className="bg-[#2a2a2a] p-2 border border-[#444] font-bold text-[#ddd]">
        {file.name}
      </div>
      <div className="bg-[#222] border border-[#444] p-4 text-[#ccc] space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div>
              <img src={`https://picsum.photos/seed/${file.id}/400/300`} alt="Cover" className="border border-[#444]" referrerPolicy="no-referrer" />
           </div>
           <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-[#333] pb-1">
                 <span className="text-[#777] font-bold">Category:</span>
                 <span>{file.category}</span>
              </div>
              <div className="flex justify-between border-b border-[#333] pb-1">
                 <span className="text-[#777] font-bold">Type:</span>
                 <span>{file.type}</span>
              </div>
              <div className="flex justify-between border-b border-[#333] pb-1">
                 <span className="text-[#777] font-bold">Size:</span>
                 <span>{file.size}</span>
              </div>
              <div className="flex justify-between border-b border-[#333] pb-1">
                 <span className="text-[#777] font-bold">Date:</span>
                 <span>{new Date(file.date).toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b border-[#333] pb-1">
                 <span className="text-[#777] font-bold">Uploader:</span>
                 <span className="italic">{file.uploader}</span>
              </div>
              <div className="flex justify-between border-b border-[#333] pb-1">
                 <span className="text-[#777] font-bold">Downloads:</span>
                 <span>{file.downloads}</span>
              </div>
              
              <div className="pt-4">
                 <button onClick={handleDownload} className="retro-button w-full py-3 flex items-center justify-center gap-2 text-sm">
                    {file.isExternalLink ? <LinkIcon size={16} /> : <Download size={16} />} 
                    {file.isExternalLink ? 'Open Link' : 'Download File'}
                 </button>
              </div>
           </div>
        </div>
        
        <div className="border-t border-[#333] pt-4">
           <h3 className="font-bold text-[#a4c639] mb-2">Description</h3>
           <div className="bg-[#1a1a1a] p-3 border border-[#333] text-xs leading-relaxed whitespace-pre-wrap">
              {file.description || "No description provided."}
           </div>
        </div>
      </div>
      
      <div className="text-center">
         <Link to="/browse" className="text-[#a4c639] text-xs hover:underline">&laquo; Back to Browse</Link>
      </div>
    </div>
  );
}
