import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { FileCheck2, Mail, ArrowLeft, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [devToken, setDevToken] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setDevToken('');

    if (!email) {
      setErrorMsg('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setSuccessMsg(res.data.message || 'Password reset instructions have been generated.');
      if (res.data.resetToken) {
        setDevToken(res.data.resetToken);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to process password reset request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 group mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6D5EF7] to-[#14B8A6] flex items-center justify-center text-white shadow-md shadow-violet-500/20">
            <FileCheck2 className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-[#111827]">
            Resume Checker <span className="text-[#6D5EF7]">AI</span>
          </span>
        </Link>
        <h2 className="text-2xl font-extrabold text-[#111827]">
          Reset Your Password
        </h2>
        <p className="mt-1 text-xs text-[#64748B]">
          Enter the email associated with your account to receive a secure reset link.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-premium sm:rounded-2xl border border-slate-200/80 sm:px-10">
          
          {errorMsg && (
            <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl p-3 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl p-3 space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
              {devToken && (
                <div className="p-2 bg-emerald-100/70 rounded border border-emerald-300 font-mono text-[11px] break-all">
                  <p className="font-sans font-bold text-emerald-900 mb-1">Dev Reset Link:</p>
                  <Link to={`/reset-password?token=${devToken}`} className="underline text-emerald-950 font-semibold">
                    Click here to reset password directly
                  </Link>
                </div>
              )}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="block w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-[#6D5EF7]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#6D5EF7] hover:bg-[#5A4BE0] shadow-md transition disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Send Reset Link'}
              {!loading && <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6D5EF7] hover:underline">
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
