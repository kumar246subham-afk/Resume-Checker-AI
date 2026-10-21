import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Modal } from '../components/common/Modal';
import {
  Settings,
  User,
  Lock,
  ShieldCheck,
  Trash2,
  Save,
  AlertCircle,
  CheckCircle2,
  HardDrive
} from 'lucide-react';

export const SettingsPage = () => {
  const { user, refreshUser, logout } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [currentStatus, setCurrentStatus] = useState(user?.preferences?.currentStatus || 'Experienced');
  const [targetJobRole, setTargetJobRole] = useState(user?.preferences?.targetJobRole || 'Software Engineer');
  const [experienceLevel, setExperienceLevel] = useState(user?.preferences?.experienceLevel || 'Mid Level (3-5 yrs)');

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Save profile states
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');

  // Delete account modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      if (user.preferences) {
        setCurrentStatus(user.preferences.currentStatus || 'Experienced');
        setTargetJobRole(user.preferences.targetJobRole || 'Software Engineer');
        setExperienceLevel(user.preferences.experienceLevel || 'Mid Level (3-5 yrs)');
      }
    }
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg('');

    try {
      const res = await api.put('/settings', {
        name,
        preferences: {
          currentStatus,
          targetJobRole,
          experienceLevel
        }
      });

      if (res.data.success) {
        setProfileMsg('Profile and career preferences updated successfully');
        await refreshUser();
      }
    } catch (err) {
      console.error('Failed to update settings', err);
    } finally {
      setProfileSaving(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg('');
    setPasswordError('');

    if (!currentPassword || !newPassword) {
      setPasswordError('Please provide both current and new password');
      return;
    }

    try {
      const res = await api.put('/auth/update-password', {
        currentPassword,
        newPassword
      });

      if (res.data.success) {
        setPasswordMsg('Password changed successfully');
        setCurrentPassword('');
        setNewPassword('');
      }
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to update password');
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await api.delete('/settings/account');
      logout();
    } catch (err) {
      console.error('Failed to delete account', err);
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7865FF]/10 text-[#7865FF] border border-[#7865FF]/20 text-xs font-semibold mb-2">
          <Settings className="w-3.5 h-3.5 text-[#35D9E8]" />
          Account & Privacy
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F4F6FF]">Account & Privacy Settings</h1>
        <p className="text-sm sm:text-[15px] text-[#B5C0D6] mt-1">
          Manage your personal details, career preferences, security credentials, and data retention options.
        </p>
      </div>

      {/* Profile & Career Preferences */}
      <div className="interactive-card bg-[#141E33] rounded-2xl border border-[rgba(166,184,225,0.16)] p-6 shadow-sm space-y-5">
        <h2 className="text-base font-extrabold text-[#F4F6FF] flex items-center gap-2">
          <User className="w-5 h-5 text-[#7865FF]" />
          Profile & Career Goals
        </h2>

        {profileMsg && (
          <div className="bg-emerald-500/15 border border-emerald-500/30 text-[#32D6A0] text-sm p-3.5 rounded-xl flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-[#32D6A0] shrink-0" />
            <span>{profileMsg}</span>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-4 text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#8D9AB5] uppercase tracking-wider mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 border border-[rgba(166,184,225,0.18)] rounded-xl bg-[#101A2D] text-[#F4F6FF] focus:outline-none focus:border-[#7865FF] transition text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#8D9AB5] uppercase tracking-wider mb-1.5">Email Address</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-4 py-2.5 border border-[rgba(166,184,225,0.12)] rounded-xl bg-[#0B1120] text-[#8D9AB5] cursor-not-allowed text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-[#8D9AB5] uppercase tracking-wider mb-1.5">Career Status</label>
              <select
                value={currentStatus}
                onChange={(e) => setCurrentStatus(e.target.value)}
                className="w-full px-4 py-2.5 border border-[rgba(166,184,225,0.18)] rounded-xl bg-[#101A2D] text-[#F4F6FF] focus:outline-none focus:border-[#7865FF] transition text-sm"
              >
                <option value="Student" className="bg-[#101A2D] text-[#F4F6FF]">Student</option>
                <option value="Fresher" className="bg-[#101A2D] text-[#F4F6FF]">Fresher / Graduate</option>
                <option value="Experienced" className="bg-[#101A2D] text-[#F4F6FF]">Experienced Professional</option>
                <option value="Career Switcher" className="bg-[#101A2D] text-[#F4F6FF]">Career Switcher</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#8D9AB5] uppercase tracking-wider mb-1.5">Target Job Role</label>
              <input
                type="text"
                value={targetJobRole}
                onChange={(e) => setTargetJobRole(e.target.value)}
                className="w-full px-4 py-2.5 border border-[rgba(166,184,225,0.18)] rounded-xl bg-[#101A2D] text-[#F4F6FF] focus:outline-none focus:border-[#7865FF] transition text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#8D9AB5] uppercase tracking-wider mb-1.5">Experience Level</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full px-4 py-2.5 border border-[rgba(166,184,225,0.18)] rounded-xl bg-[#101A2D] text-[#F4F6FF] focus:outline-none focus:border-[#7865FF] transition text-sm"
              >
                <option value="Entry Level (0-2 yrs)" className="bg-[#101A2D] text-[#F4F6FF]">Entry Level (0-2 yrs)</option>
                <option value="Mid Level (3-5 yrs)" className="bg-[#101A2D] text-[#F4F6FF]">Mid Level (3-5 yrs)</option>
                <option value="Senior (5-8 yrs)" className="bg-[#101A2D] text-[#F4F6FF]">Senior (5-8 yrs)</option>
                <option value="Lead/Executive (8+ yrs)" className="bg-[#101A2D] text-[#F4F6FF]">Lead/Executive (8+ yrs)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              disabled={profileSaving}
              className="interactive-button inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#7865FF] to-[#4285FF] shadow-glow-violet hover:brightness-110 active:scale-95 transition"
            >
              <Save className="w-4 h-4" />
              {profileSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Security: Password Update */}
      <div className="interactive-card bg-[#141E33] rounded-2xl border border-[rgba(166,184,225,0.16)] p-6 shadow-sm space-y-5">
        <h2 className="text-base font-extrabold text-[#F4F6FF] flex items-center gap-2">
          <Lock className="w-5 h-5 text-[#35D9E8]" />
          Change Password
        </h2>

        {passwordMsg && (
          <div className="bg-emerald-500/15 border border-emerald-500/30 text-[#32D6A0] text-sm p-3.5 rounded-xl flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-[#32D6A0] shrink-0" />
            <span>{passwordMsg}</span>
          </div>
        )}

        {passwordError && (
          <div className="bg-rose-500/15 border border-rose-500/30 text-[#FF728A] text-sm p-3.5 rounded-xl flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-[#FF728A] shrink-0" />
            <span>{passwordError}</span>
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-4 text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#8D9AB5] uppercase tracking-wider mb-1.5">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 border border-[rgba(166,184,225,0.18)] rounded-xl bg-[#101A2D] text-[#F4F6FF] placeholder-[#8D9AB5] focus:outline-none focus:border-[#7865FF] transition text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#8D9AB5] uppercase tracking-wider mb-1.5">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-4 py-2.5 border border-[rgba(166,184,225,0.18)] rounded-xl bg-[#101A2D] text-[#F4F6FF] placeholder-[#8D9AB5] focus:outline-none focus:border-[#7865FF] transition text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="interactive-button inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-[#F4F6FF] bg-[#192640] hover:bg-[#233558] border border-[rgba(166,184,225,0.2)] transition"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>

      {/* Data Ownership & Account Purge */}
      <div className="interactive-card bg-[#141E33] rounded-2xl border border-rose-500/30 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-extrabold text-[#FF728A] flex items-center gap-2">
          <HardDrive className="w-5 h-5 text-[#FF728A]" />
          Data Ownership & Permanent Account Deletion
        </h2>

        <p className="text-sm text-[#B5C0D6] leading-relaxed">
          In compliance with our data privacy standards, you maintain total ownership of all uploaded resumes, generated documents, and audit histories. You can permanently erase your entire account and all associated documents at any time.
        </p>

        <button
          onClick={() => setDeleteModalOpen(true)}
          className="interactive-button inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-[#FF728A] bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition"
        >
          <Trash2 className="w-4 h-4" />
          Purge All Data & Delete Account
        </button>
      </div>

      {/* Delete Account Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Permanent Account Deletion"
      >
        <div className="space-y-4">
          <div className="bg-rose-500/15 border border-rose-500/30 p-4 rounded-xl text-[#FF728A] text-sm">
            <p className="font-bold">This action cannot be undone.</p>
            <p className="mt-1 leading-relaxed text-[#B5C0D6]">
              All your saved resumes, tailored versions, ATS analysis reports, and account information will be permanently deleted from our servers immediately.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="interactive-button px-4 py-2.5 rounded-xl text-sm font-semibold text-[#B5C0D6] bg-[#192640] hover:bg-[#233558] border border-[rgba(166,184,225,0.16)] transition"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="interactive-button px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-rose-600 hover:bg-rose-500 transition shadow-sm"
            >
              {deleting ? 'Deleting...' : 'Yes, Delete Everything'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
