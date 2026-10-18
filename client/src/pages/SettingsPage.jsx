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
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-[#111827]">Account & Privacy Settings</h1>
        <p className="text-xs text-[#64748B] mt-0.5">
          Manage your personal details, career preferences, security credentials, and data retention options.
        </p>
      </div>

      {/* Profile & Career Preferences */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-subtle space-y-4">
        <h2 className="text-sm font-extrabold text-[#111827] flex items-center gap-2">
          <User className="w-4 h-4 text-[#6D5EF7]" />
          Profile & Career Goals
        </h2>

        {profileMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{profileMsg}</span>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-[#6D5EF7]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Career Status</label>
              <select
                value={currentStatus}
                onChange={(e) => setCurrentStatus(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-[#6D5EF7]"
              >
                <option value="Student">Student</option>
                <option value="Fresher">Fresher / Graduate</option>
                <option value="Experienced">Experienced Professional</option>
                <option value="Career Switcher">Career Switcher</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Job Role</label>
              <input
                type="text"
                value={targetJobRole}
                onChange={(e) => setTargetJobRole(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-[#6D5EF7]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Experience Level</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-[#6D5EF7]"
              >
                <option value="Entry Level (0-2 yrs)">Entry Level (0-2 yrs)</option>
                <option value="Mid Level (3-5 yrs)">Mid Level (3-5 yrs)</option>
                <option value="Senior (5-8 yrs)">Senior (5-8 yrs)</option>
                <option value="Lead/Executive (8+ yrs)">Lead/Executive (8+ yrs)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={profileSaving}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#6D5EF7] hover:bg-[#5A4BE0] transition"
            >
              <Save className="w-3.5 h-3.5" />
              {profileSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Security: Password Update */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-subtle space-y-4">
        <h2 className="text-sm font-extrabold text-[#111827] flex items-center gap-2">
          <Lock className="w-4 h-4 text-slate-700" />
          Change Password
        </h2>

        {passwordMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{passwordMsg}</span>
          </div>
        )}

        {passwordError && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>{passwordError}</span>
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-[#6D5EF7]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-[#6D5EF7]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>

      {/* Data Ownership & Account Purge */}
      <div className="bg-white rounded-2xl border border-rose-200 p-6 shadow-subtle space-y-4">
        <h2 className="text-sm font-extrabold text-rose-700 flex items-center gap-2">
          <HardDrive className="w-4 h-4" />
          Data Ownership & Permanent Account Deletion
        </h2>

        <p className="text-xs text-slate-600 leading-relaxed">
          In compliance with our data privacy standards, you maintain total ownership of all uploaded resumes, generated documents, and audit histories. You can permanently erase your entire account and all associated documents at any time.
        </p>

        <button
          onClick={() => setDeleteModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition"
        >
          <Trash2 className="w-3.5 h-3.5" />
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
          <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl text-rose-800 text-xs">
            <p className="font-bold">This action cannot be undone.</p>
            <p className="mt-1">
              All your saved resumes, tailored versions, ATS analysis reports, and account information will be permanently deleted from our servers immediately.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition"
            >
              {deleting ? 'Deleting...' : 'Yes, Delete Everything'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
