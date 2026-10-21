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
  const [searchQuery, setSearchQuery] = useState('');
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

  const filteredResumes = resumes.filter((r) => {
    const q = searchQuery.toLowerCase();
    return (
      (r.title && r.title.toLowerCase().includes(q)) ||
      (r.jobTarget && r.jobTarget.toLowerCase().includes(q)) ||
      (r.templateId && r.templateId.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F4F6FF] tracking-tight">
            My Resumes
          </h1>
          <p className="text-[14px] text-[#B5C0D6] mt-1">
            Manage your tailored resume documents, audit ATS readiness, and export PDF copies.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="studio-btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-[14px] group"
        >
          <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 duration-200" />
          <span>Create New Resume</span>
        </button>
      </div>

      {/* Search Bar */}
      {resumes.length > 0 && (
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resumes by title, target role, or template..."
            className="studio-input w-full max-w-md px-4 py-2.5 rounded-xl text-[14px]"
          />
        </div>
      )}

      {/* Resumes Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="studio-card rounded-2xl h-64 p-6 space-y-4">
              <div className="h-5 bg-[#101A2D] rounded w-3/4 border border-[rgba(166,184,225,0.1)]"></div>
              <div className="h-3 bg-[#101A2D] rounded w-1/2 border border-[rgba(166,184,225,0.08)]"></div>
              <div className="h-32 bg-[#101A2D]/80 rounded border border-[rgba(166,184,225,0.08)]"></div>
            </div>
          ))}
        </div>
      ) : filteredResumes.length === 0 && resumes.length > 0 ? (
        <div className="studio-card rounded-2xl p-12 text-center space-y-3">
          <p className="text-[15px] text-[#B5C0D6]">No resumes match your search query "{searchQuery}".</p>
          <button
            onClick={() => setSearchQuery('')}
            className="studio-btn-secondary px-4 py-2 rounded-xl text-[13px]"
          >
            Clear Search Filter
          </button>
        </div>
      ) : resumes.length === 0 ? (
        <div className="studio-card rounded-2xl p-12 border-2 border-dashed border-[rgba(166,184,225,0.2)] text-center space-y-4">
          <div className="w-16 h-16 bg-[#7865FF]/15 text-[#7865FF] rounded-2xl flex items-center justify-center mx-auto border border-[#7865FF]/30">
            <FileText className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-[#F4F6FF]">No resumes created yet</h2>
          <p className="text-[14px] text-[#B5C0D6] max-w-md mx-auto">
            Start building your resume using one of our 10 verified ATS templates, tailored for your industry.
          </p>
          <button
            onClick={handleCreateNew}
            className="studio-btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-[14px]"
          >
            <Plus className="w-4 h-4" />
            Build My First Resume
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResumes.map((resume) => (
            <div
              key={resume._id}
              className="studio-card rounded-2xl flex flex-col justify-between overflow-hidden group hover:border-[#7865FF]/50"
            >
              <div className="p-6 border-b border-[rgba(166,184,225,0.12)] space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-[17px] text-[#F4F6FF] line-clamp-1 group-hover:text-[#9182FF] transition">
                    {resume.title}
                  </h3>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#101A2D] text-[#35D9E8] border border-[#35D9E8]/30 shrink-0">
                    {resume.templateId}
                  </span>
                </div>

                <p className="text-[14px] text-[#B5C0D6] line-clamp-1">
                  Target: <strong className="text-[#F4F6FF] font-semibold">{resume.jobTarget || 'General'}</strong>
                </p>

                <div className="flex items-center gap-2 text-[12px] text-[#8D9AB5] pt-1">
                  <Calendar className="w-3.5 h-3.5 text-[#35D9E8]" />
                  <span>Updated {new Date(resume.updatedAt).toLocaleDateString()}</span>
                  <span>• v{resume.version || 1}</span>
                </div>
              </div>

              {/* Action buttons footer */}
              <div className="p-3 bg-[#101A2D]/70 border-t border-[rgba(166,184,225,0.1)] flex items-center justify-between gap-1 text-[13px]">
                <div className="flex items-center gap-1.5">
                  <Link
                    to={`/dashboard/builder?id=${resume._id}`}
                    className="p-2 rounded-xl text-[#F4F6FF] hover:text-white hover:bg-[#7865FF] hover:scale-105 active:scale-95 transition-all duration-180"
                    title="Edit in Resume Builder"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Link>

                  <Link
                    to={`/dashboard/checker?resumeId=${resume._id}`}
                    className="p-2 rounded-xl text-[#35D9E8] hover:text-[#35D9E8] hover:bg-[#35D9E8]/20 hover:scale-105 active:scale-95 transition-all duration-180"
                    title="Audit with ATS Checker"
                  >
                    <FileCheck2 className="w-4 h-4" />
                  </Link>

                  <Link
                    to={`/dashboard/job-matcher?resumeId=${resume._id}`}
                    className="p-2 rounded-xl text-[#4285FF] hover:text-white hover:bg-[#4285FF] hover:scale-105 active:scale-95 transition-all duration-180"
                    title="Match to Job Description"
                  >
                    <Briefcase className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={() => handleDuplicate(resume._id)}
                    className="p-2 rounded-xl text-[#B5C0D6] hover:text-[#F4F6FF] hover:bg-[#192640] hover:scale-105 active:scale-95 transition-all duration-180"
                    title="Duplicate Resume"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => confirmDelete(resume)}
                  className="p-2 rounded-xl text-[#8D9AB5] hover:text-[#FF728A] hover:bg-[#FF728A]/15 hover:scale-105 active:scale-95 transition-all duration-180"
                  title="Delete Resume"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal in Dark Theme */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Resume"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 bg-[#FF728A]/10 p-4 rounded-xl border border-[#FF728A]/30 text-[#FF728A] text-[14px]">
            <AlertCircle className="w-5 h-5 text-[#FF728A] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Are you sure you want to delete this resume?</p>
              <p className="mt-1 leading-relaxed text-[#B5C0D6] text-[13px]">
                "{resumeToDelete?.title}" will be permanently removed along with its version history. This cannot be undone.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="studio-btn-secondary px-4 py-2 rounded-xl text-[14px]"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 rounded-xl text-[14px] font-semibold text-white bg-[#FF728A] hover:bg-[#FF728A]/90 shadow-[0_0_15px_rgba(255,114,138,0.4)] transition"
            >
              {deleting ? 'Deleting...' : 'Delete Permanently'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
