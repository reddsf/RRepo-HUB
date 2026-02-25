import React from 'react';
import { ShieldAlert } from 'lucide-react';

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-[#1e1e1e] border border-[#333] p-8">
        <h1 className="text-2xl font-bold text-[#e0e0e0] mb-6 flex items-center gap-3">
          <ShieldAlert className="text-[#64b5f6]" />
          Terms and Conditions
        </h1>
        
        <div className="space-y-6 text-[#aaa] leading-relaxed">
          <section>
            <h2 className="text-[#e0e0e0] font-bold text-lg mb-2">1. General Disclaimer</h2>
            <p>
              RRepoHUB is a file sharing platform designed for educational and archival purposes only. 
              We do not host any files on our servers. All files found on this site are uploaded by users 
              and hosted on third-party services or peer-to-peer networks.
            </p>
          </section>

          <section>
            <h2 className="text-[#e0e0e0] font-bold text-lg mb-2">2. Content Policy</h2>
            <p className="text-yellow-400 border-l-4 border-yellow-900/50 pl-4 py-1">
              <strong>User Discretion:</strong> Users are free to upload and share any type of content, including 
              copyrighted or "pirated" material. However, RRepoHUB takes <strong>NO RESPONSIBILITY</strong> for 
              the files uploaded by its users. We act merely as a conduit for data transfer.
            </p>
          </section>

          <section>
            <h2 className="text-[#e0e0e0] font-bold text-lg mb-2">3. Liability Waiver</h2>
            <p>
              By using this site, you acknowledge that RRepoHUB, its owners, and its staff are not liable for 
              any legal actions taken against you for uploading or downloading content. You assume full 
              responsibility for your actions and the content you interact with.
            </p>
          </section>

          <section>
            <h2 className="text-[#e0e0e0] font-bold text-lg mb-2">4. Content Removal</h2>
            <p>
              If you are a copyright holder and believe your content has been uploaded without permission, 
              please contact us immediately, and we will remove the link.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
