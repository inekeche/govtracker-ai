'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [profile, setProfile] = useState({ name: '', email: '', bio: '', profilePhoto: '', notificationsEnabled: true });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      router.push('/auth');
      return;
    }
    // Pre-fill email from session
    setProfile(prev => ({ ...prev, email }));
  }, [router]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, profilePhoto: reader.result }); // Save as base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      if (res.ok) {
        setSuccess('Profile updated successfully!');
      } else {
        alert('Failed to update profile.');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to server.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    router.push('/auth');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-xl mx-auto space-y-6">
        
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Profile & Settings</h1>
          <p className="text-slate-400 text-sm">Manage your account credentials, avatar, and notification preferences.</p>
        </div>

        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-xl">
          
          {/* Avatar Upload Section */}
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-amber-500/30 overflow-hidden flex items-center justify-center text-2xl font-bold text-amber-400">
              {profile.profilePhoto ? (
                <img src={profile.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                profile.email ? profile.email.charAt(0).toUpperCase() : 'U'
              )}
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-300">Profile Photo</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={handlePhotoUpload}
                className="text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-500/10 file:text-amber-400 hover:file:bg-amber-500/20 cursor-pointer"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
              <input 
                type="text" 
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="e.g. Felix Ineke"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email Address (Read-only)</label>
              <input 
                type="email" 
                disabled
                value={profile.email}
                className="w-full bg-slate-950/50 border border-slate-800/60 rounded-xl px-4 py-2.5 text-slate-500 text-sm cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Bio / Role Description</label>
              <textarea 
                rows="3"
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                placeholder="Brief summary about your civic oversight goals..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Notification Setting Toggle */}
            <div className="flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div>
                <div className="text-sm font-medium text-white">Email Notifications</div>
                <div className="text-xs text-slate-400">Receive alerts regarding your submitted community reports.</div>
              </div>
              <input 
                type="checkbox"
                checked={profile.notificationsEnabled}
                onChange={(e) => setProfile({ ...profile, notificationsEnabled: e.target.checked })}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-slate-800">
            <button 
              type="submit" 
              disabled={saving}
              className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-xl transition shadow-lg shadow-amber-500/10 disabled:opacity-50 text-sm"
            >
              {saving ? 'Saving Changes...' : 'Save Settings'}
            </button>
            <button 
              type="button" 
              onClick={handleLogout}
              className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 px-6 py-3 rounded-xl font-bold transition text-sm"
            >
              Logout
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}