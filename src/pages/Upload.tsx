import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';

export default function Upload() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Movies');
  const [type, setType] = useState('zip');
  const [description, setDescription] = useState('');
  const [uploadType, setUploadType] = useState<'file' | 'link'>('file');
  const [externalLink, setExternalLink] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let downloadUrl = '';
      let fileSize = 'Unknown';

      if (uploadType === 'file') {
        if (!file) {
          throw new Error('Please select a file');
        }
        
        // Calculate size string
        const bytes = file.size;
        if (bytes < 1024) fileSize = bytes + ' B';
        else if (bytes < 1048576) fileSize = (bytes / 1024).toFixed(1) + ' KB';
        else if (bytes < 1073741824) fileSize = (bytes / 1048576).toFixed(1) + ' MB';
        else fileSize = (bytes / 1073741824).toFixed(1) + ' GB';

        // Upload to Firebase Storage
        const storageRef = ref(storage, `uploads/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        downloadUrl = await getDownloadURL(snapshot.ref);
      } else {
        if (!externalLink) {
          throw new Error('Please enter a valid URL');
        }
        downloadUrl = externalLink;
        fileSize = 'External';
      }

      // Save metadata to Firestore
      await addDoc(collection(db, 'files'), {
        name,
        category,
        type,
        size: fileSize,
        description,
        uploader: user?.email?.split('@')[0] || 'Anonymous',
        downloadUrl,
        isExternalLink: uploadType === 'link',
        date: new Date().toISOString(),
        downloads: 0
      });

      navigate('/browse');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
       <div className="bg-[#1e1e1e] p-4 border border-[#333] border-b-0 font-bold text-[#e0e0e0] uppercase tracking-wider text-sm">
          Upload Content
       </div>
       <div className="bg-[#181818] border border-[#333] p-8">
          <div className="bg-blue-900/20 border border-blue-800/30 p-4 mb-8 text-blue-200 text-xs leading-relaxed">
             <strong>Terms:</strong> By uploading, you certify that you have the right to distribute this content. 
             Piracy is strictly prohibited. RRepoHUB is not responsible for user-uploaded content.
          </div>

          {error && <div className="bg-red-900/20 border border-red-800/50 text-red-200 p-3 mb-6 text-center text-xs">{error}</div>}

          <form onSubmit={handleUpload} className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <label className="text-left md:text-right text-[#999] font-medium text-xs uppercase">Upload Type</label>
                <div className="md:col-span-3 flex gap-4">
                   <label className="flex items-center gap-2 cursor-pointer text-[#ccc] text-xs">
                      <input 
                        type="radio" 
                        name="uploadType" 
                        checked={uploadType === 'file'} 
                        onChange={() => setUploadType('file')}
                      /> File Upload
                   </label>
                   <label className="flex items-center gap-2 cursor-pointer text-[#ccc] text-xs">
                      <input 
                        type="radio" 
                        name="uploadType" 
                        checked={uploadType === 'link'} 
                        onChange={() => setUploadType('link')}
                      /> External Link
                   </label>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <label className="text-left md:text-right text-[#999] font-medium text-xs uppercase">Name</label>
                <div className="md:col-span-3">
                   <input 
                      type="text" 
                      className="retro-input w-full" 
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                      placeholder="e.g. Project Backup 2026"
                   />
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <label className="text-left md:text-right text-[#999] font-medium text-xs uppercase">Category</label>
                <div className="md:col-span-3">
                   <select 
                      className="retro-input w-full md:w-1/2"
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                   >
                      <option>Movies</option>
                      <option>Music</option>
                      <option>Games</option>
                      <option>Apps</option>
                      <option>Docs</option>
                      <option>Images</option>
                      <option>Archives</option>
                   </select>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <label className="text-left md:text-right text-[#999] font-medium text-xs uppercase">Format</label>
                <div className="md:col-span-3">
                   <select 
                      className="retro-input w-full md:w-1/3"
                      value={type}
                      onChange={e => setType(e.target.value)}
                   >
                      <option value="zip">ZIP Archive</option>
                      <option value="7z">7-Zip Archive</option>
                      <option value="rar">RAR Archive</option>
                      <option value="mp4">MP4 Video</option>
                      <option value="mp3">MP3 Audio</option>
                      <option value="png">PNG Image</option>
                      <option value="jpg">JPG Image</option>
                      <option value="txt">Text File</option>
                      <option value="pdf">PDF Document</option>
                   </select>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                <label className="text-left md:text-right text-[#999] font-medium text-xs uppercase mt-2">Description</label>
                <div className="md:col-span-3">
                   <textarea 
                      className="retro-input w-full h-32" 
                      placeholder="Enter file description here..."
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                   ></textarea>
                </div>
             </div>

             {uploadType === 'file' ? (
               <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <label className="text-left md:text-right text-[#999] font-medium text-xs uppercase">Select File</label>
                  <div className="md:col-span-3">
                     <input 
                        type="file" 
                        className="text-[#ccc] text-xs" 
                        onChange={e => setFile(e.target.files ? e.target.files[0] : null)}
                        required
                     />
                  </div>
               </div>
             ) : (
               <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <label className="text-left md:text-right text-[#999] font-medium text-xs uppercase">External Link</label>
                  <div className="md:col-span-3">
                     <input 
                        type="url" 
                        className="retro-input w-full"
                        placeholder="https://example.com/download/file.zip"
                        value={externalLink}
                        onChange={e => setExternalLink(e.target.value)}
                        required
                     />
                  </div>
               </div>
             )}

             <div className="border-t border-[#333] pt-6 flex justify-end">
                <button type="submit" disabled={loading} className="retro-button px-8 py-2 text-sm">
                   {loading ? 'Processing...' : (uploadType === 'file' ? 'Upload File' : 'Save Link')}
                </button>
             </div>
          </form>
       </div>
    </div>
  );
}
