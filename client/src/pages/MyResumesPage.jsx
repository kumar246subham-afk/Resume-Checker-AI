import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Modal } from '../components/common/Modal';
import {
  FileText,
  Plus,
  Edit3,
  Copy,
  Trash2,
  FileCheck2,
  Briefcase,
  Download,
  Calendar,
  AlertCircle
} from 'lucide-react';

export const MyResumesPage = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  const fetchResumes = async () => {
    try {
      const res = await api.get('/resumes');
      if (res.data.success) {
        setResumes(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load resumes', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleDuplicate = async (id) => {
    try {
      const res = await api.post(`/resumes/${id}/duplicate`);
      if (res.data.success) {
        fetchResumes();
      }
    } catch (err) {
      console.error('Failed to duplicate resume', err);
    }
  };

  const confirmDelete = (resume) => {
    setResumeToDelete(resume);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!resumeToDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/resumes/${resumeToDelete._id}`);
      setDeleteModalOpen(false);
      setResumeToDelete(null);
      fetchResumes();
    } catch (err) {
      console.error('Failed to delete resume', err);
    } finally {
      setDeleting(false);
    }
  };

  const handleCreateNew = async () => {
    try {
      const res = await api.post('/resumes', {
        title: 'Untitled Professional Resume',
        jobTarget: 'Software Engineer',
        templateId: 'ats-classic'
      });
      if (res.data.success) {
        navigate(`/dashboard/builder?id=${res.data.data._id}`);
      }
    } catch (err) {
      console.error('Failed to create new resume', err);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#111827]">My Resumes</h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Manage your tailored versions, run audits, and export PDFs.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-[#6D5EF7] hover:bg-[#5A4BE0] shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          Create New Resume
        </button>
      </div>

      {/* Resumes Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-2xl h-64 border border-slate-200 p-6 space-y-4">
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-3 bg-slate-100 rounded w-1/2"></div>
              <div className="h-32 bg-slate-50 rounded"></div>
            </div>
          ))}
        </div>
      ) : resumes.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border-2 border-dashed border-slate-200 text-center space-y-4">
          <div className="w-16 h-16 bg-violet-50 text-[#6D5EF7] rounded-2xl flex items-center justify-center mx-auto">
            <FileText className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-[#111827]">No resumes created yet</h2>
          <p className="text-xs text-[#64748B] max-w-md mx-auto">
            Start building your resume using one of our 5 verified ATS templates, tailored for your industry.
          </p>
          <button
            onClick={handleCreateNew}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-[#6D5EF7] hover:bg-[#5A4BE0] shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            Build My First Resume
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => (
            <div
              key={resume._id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle hover:shadow-card-hover transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-5 border-b border-slate-100 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-sm text-[#111827] line-clamp-1 group-hover:text-[#6D5EF7] transition">
                    {resume.title}
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-100 shrink-0">
                    {resume.templateId}
                  </span>
                </div>

                <p className="text-xs text-slate-500 line-clamp-1">
                  Target: <strong className="text-slate-700 font-semibold">{resume.jobTarget || 'General'}</strong>
                </p>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Updated {new Date(resume.updatedAt).toLocaleDateString()}</span>
                  <span>• v{resume.version || 1}</span>
                </div>
              </div>

              {/* Action buttons footer */}
              <div className="p-3 bg-slate-50/60 flex items-center justify-between gap-1 text-xs">
                <div className="flex items-center gap-1">
                  <Link
                    to={`/dashboard/builder?id=${resume._id}`}
                    className="p-2 rounded-lg text-slate-700 hover:text-[#6D5EF7] hover:bg-violet-50 transition"
                    title="Edit Resume"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Link>

                  <Link
                    to={`/dashboard/checker?resumeId=${resume._id}`}
                    className="p-2 rounded-lg text-slate-700 hover:text-teal-600 hover:bg-teal-50 transition"
                    title="Audit with ATS Checker"
                  >
                    <FileCheck2 className="w-4 h-4" />
                  </Link>

                  <Link
                    to={`/dashboard/job-matcher?resumeId=${resume._id}`}
                    className="p-2 rounded-lg text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 transition"
                    title="Match to Job Description"
                  >
                    <Briefcase className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={() => handleDuplicate(resume._id)}
                    className="p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-200 transition"
                    title="Duplicate Resume"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => confirmDelete(resume)}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                  title="Delete Resume"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Resume"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 bg-rose-50 p-3 rounded-xl border border-rose-200 text-rose-800 text-xs">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Are you sure you want to delete this resume?</p>
              <p className="mt-1">
                "{resumeToDelete?.title}" will be permanently removed along with its version history. This cannot be undone.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition"
            >
              {deleting ? 'Deleting...' : 'Delete Permanently'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
