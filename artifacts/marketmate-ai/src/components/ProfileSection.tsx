  import React, { useState, useEffect } from 'react';
  import { User, Mail, Building, FileText, Globe, Phone, Edit, Save, Check } from 'lucide-react';

  interface ProfileData {
    name: string;
    email: string;
    businessName: string;
    bio: string;
    website: string;
    phone: string;
  }

  export function ProfileSection() {
    const [isEditing, setIsEditing] = useState(false);
    const [saved, setSaved] = useState(false);
    const [profile, setProfile] = useState<ProfileData>({
      name: '',
      email: '',
      businessName: '',
      bio: '',
      website: '',
      phone: '',
    });

    useEffect(() => {
      const savedProfile = localStorage.getItem('marketmate_profile');
      if (savedProfile) {
        try {
          setProfile(JSON.parse(savedProfile));
        } catch (e) {
          console.error('Failed to parse profile data', e);
        }
      }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setProfile((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = (e: React.FormEvent) => {
      e.preventDefault();
      localStorage.setItem('marketmate_profile', JSON.stringify(profile));
      setIsEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    };

    const renderValue = (val: string) => {
      return val && val.trim() !== '' ? val : 'Not provided';
    };

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-6 rounded-xl border border-slate-800">
          <div>
            <h2 className="text-2xl font-bold text-white">Business Profile</h2>
            <p className="text-slate-400 text-sm mt-1">
              Manage your business information to customize AI content generation.
            </p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors font-medium text-sm"
          >
            {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </button>
        </div>

        {saved && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg flex items-center gap-2">
            <Check className="w-5 h-5" />
            <span>Profile details saved successfully!</span>
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Business Name</label>
                <input
                  type="text"
                  name="businessName"
                  value={profile.businessName}
                  onChange={handleChange}
                  placeholder="MarketMate Tech"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  placeholder="+1 234 567 890"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Website URL</label>
              <input
                type="text"
                name="website"
                value={profile.website}
                onChange={handleChange}
                placeholder="https://example.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Business Bio / Description</label>
              <textarea
                name="bio"
                rows={3}
                value={profile.bio}
                onChange={handleChange}
                placeholder="Describe your products, target audience, or services..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save Profile Details
            </button>
          </form>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800/80">
                <span className="text-xs text-slate-400 flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Name</span>
                <p className="text-white font-medium mt-1">{renderValue(profile.name)}</p>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800/80">
                <span className="text-xs text-slate-400 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email</span>
                <p className="text-white font-medium mt-1">{renderValue(profile.email)}</p>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800/80">
                <span className="text-xs text-slate-400 flex items-center gap-1.5"><Building className="w-3.5 h-3.5" /> Business Name</span>
                <p className="text-white font-medium mt-1">{renderValue(profile.businessName)}</p>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800/80">
                <span className="text-xs text-slate-400 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Phone</span>
                <p className="text-white font-medium mt-1">{renderValue(profile.phone)}</p>
              </div>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800/80">
              <span className="text-xs text-slate-400 flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> Website</span>
              <p className="text-white font-medium mt-1">{renderValue(profile.website)}</p>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800/80">
              <span className="text-xs text-slate-400 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Bio</span>
              <p className="text-white font-medium mt-1">{renderValue(profile.bio)}</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  export default ProfileSection;
