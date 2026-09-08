import React, { useState } from 'react';
import { Profile } from '../types';
import { saveProfile } from '../lib/storage';

interface Props {
  profile: Profile;
  onProfileUpdate: (updated: Profile) => void;
}

export const ProfileSection: React.FC<Props> = ({ profile, onProfileUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Profile>(profile);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const saved = saveProfile(formData);
    onProfileUpdate(saved);
    setIsEditing(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">User Profile</h2>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            Edit Profile
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="space-y-4">
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded text-slate-900" placeholder="Name" required />
          <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded text-slate-900" placeholder="Email" required />
          <textarea name="bio" value={formData.bio} onChange={handleChange} className="w-full p-2 border rounded text-slate-900" placeholder="Bio" />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-400 text-white rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded">Save</button>
          </div>
        </form>
      ) : (
        <div className="space-y-2 text-slate-800 dark:text-slate-100">
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Bio:</strong> {profile.bio}</p>
        </div>
      )}
    </div>
  );
};
