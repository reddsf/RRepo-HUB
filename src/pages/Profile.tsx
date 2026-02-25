import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Edit2, Save, X } from 'lucide-react';

export default function Profile() {
  const { user, refreshProfile } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  
  // Track which field is being edited
  const [editingField, setEditingField] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFirstName(data.firstName || '');
          setLastName(data.lastName || '');
          setUsername(data.username || '');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleSave = async (field: string, value: string) => {
    if (!user) return;
    setSaving(true);
    setMessage('');
    try {
      const docRef = doc(db, "users", user.uid);
      const updateData: any = {
        email: user.email,
        updatedAt: new Date().toISOString()
      };
      
      if (field === 'username') updateData.username = value.trim();
      if (field === 'firstName') updateData.firstName = value.trim();
      if (field === 'lastName') updateData.lastName = value.trim();

      await setDoc(docRef, updateData, { merge: true });
      
      setMessage(`${field} updated successfully.`);
      setEditingField(null);
      refreshProfile(); // Sync header
    } catch (err) {
      console.error(err);
      setMessage('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const EditableField = ({ label, value, fieldName, onChange }: any) => {
    const [tempValue, setTempValue] = useState(value);
    const isEditing = editingField === fieldName;

    return (
      <div className="flex items-center justify-between py-4 border-b border-[#333] last:border-0">
        <div className="flex-1">
          <div className="text-[#666] text-xs uppercase mb-1">{label}</div>
          {isEditing ? (
            <input 
              type="text" 
              className="retro-input w-full md:w-2/3" 
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              autoFocus
            />
          ) : (
            <div className="text-[#e0e0e0] font-medium">{value || <span className="text-[#444] italic">Not set</span>}</div>
          )}
        </div>
        <div className="ml-4">
          {isEditing ? (
            <div className="flex gap-2">
              <button 
                onClick={() => handleSave(fieldName, tempValue)}
                disabled={saving}
                className="text-green-500 hover:text-green-400"
                title="Save"
              >
                <Save size={18} />
              </button>
              <button 
                onClick={() => {
                  setEditingField(null);
                  setTempValue(value);
                }}
                className="text-red-500 hover:text-red-400"
                title="Cancel"
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => {
                setEditingField(fieldName);
                setTempValue(value);
              }}
              className="text-[#64b5f6] hover:text-[#90caf9]"
              title="Edit"
            >
              <Edit2 size={16} />
            </button>
          )}
        </div>
      </div>
    );
  };

  if (loading) return <div className="p-8 text-center text-[#666]">Loading profile...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-[#1e1e1e] p-4 border border-[#333] border-b-0 font-bold text-[#e0e0e0] uppercase tracking-wider text-sm">
        My Profile
      </div>
      
      <div className="bg-[#181818] border border-[#333] p-8">
        {message && <div className={`p-3 mb-6 text-center text-xs ${message.includes('success') ? 'bg-green-900/20 text-green-200 border-green-800/50' : 'bg-red-900/20 text-red-200 border-red-800/50'} border`}>{message}</div>}
        
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 bg-[#222] border border-[#333] flex items-center justify-center text-3xl font-bold text-[#666]">
            {username ? username.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#fff] mb-1">{username || 'No Username Set'}</h1>
            <div className="text-[#888] text-sm">{user?.email}</div>
          </div>
        </div>

        <div className="space-y-2">
          <EditableField 
            label="Username" 
            value={username} 
            fieldName="username" 
            onChange={setUsername} 
          />
          <EditableField 
            label="First Name" 
            value={firstName} 
            fieldName="firstName" 
            onChange={setFirstName} 
          />
          <EditableField 
            label="Last Name" 
            value={lastName} 
            fieldName="lastName" 
            onChange={setLastName} 
          />
        </div>
      </div>
    </div>
  );
}
