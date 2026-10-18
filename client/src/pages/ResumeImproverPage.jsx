import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import { ScoreRing } from '../components/common/ScoreRing';
import {
  Sparkles,
  Check,
  X,
  Edit2,
  RefreshCw,
  FileCheck2,
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export const ResumeImproverPage = () => {
  const [searchParams] = useSearchParams();
  const analysisId = searchParams.get('analysisId');

  const [analyses, setAnalyses] = useState([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rechecking, setRechecking] = useState(false);
  const [newScore, setNewScore] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/analysis');
        if (res.data.success && res.data.data.length > 0) {
          setAnalyses(res.data.data);
          const active = analysisId
            ? res.data.data.find(a => a._id === analysisId) || res.data.data[0]
            : res.data.data[0];
          setSelectedAnalysis(active);
          initSuggestions(active);
        }
      } catch (err) {
        console.error('Failed to load analyses for improver', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [analysisId]);

  const initSuggestions = (analysis) => {
    if (!analysis) return;
    const items = [];

    // Add weak bullets
    (analysis.weakBullets || []).forEach((wb, idx) => {
      items.push({
        id: `wb-${idx}`,
        type: 'bullet',
        title: 'Bullet Point Active Phrasing',
        original: wb.original,
        improved: wb.improvedSuggestion,
        reason: wb.reason,
        status: 'pending' // 'pending' | 'accepted' | 'rejected'
      });
    });

    // Add issue recommendations
    (analysis.issues || []).slice(0, 3).forEach((issue, idx) => {
      items.push({
        id: `iss-${idx}`,
        type: 'issue',
        title: issue.title,
        original: issue.resumeText || issue.explanation,
        improved: issue.recommendation,
        reason: `${issue.category} optimization`,
        status: 'pending'
      });
    });

    setSuggestions(items);
  };

  const handleAccept = (index) => {
    setSuggestions(prev => {
      const copy = [...prev];
      copy[index].status = 'accepted';
      return copy;
    });
  };

  const handleReject = (index) => {
    setSuggestions(prev => {
      const copy = [...prev];
      copy[index].status = 'rejected';
      return copy;
    });
  };

  const handleTextChange = (index, value) => {
    setSuggestions(prev => {
      const copy = [...prev];
      copy[index].improved = value;
      return copy;
    });
  };

  const handleRecheckScore = () => {
    setRechecking(true);
    setTimeout(() => {
      const acceptedCount = suggestions.filter(s => s.status === 'accepted').length;
      const base = selectedAnalysis?.scores?.overall || 70;
      const boosted = Math.min(96, base + (acceptedCount * 5));
      setNewScore(boosted);
      setRechecking(false);
    }, 1500);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#111827]">AI Resume Improver</h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Review grounded AI revisions side-by-side. Accept, edit, or reject each suggestion before updating your document.
          </p>
        </div>

        {analyses.length > 0 && (
          <select
            value={selectedAnalysis?._id || ''}
            onChange={(e) => {
              const a = analyses.find(item => item._id === e.target.value);
              setSelectedAnalysis(a);
              initSuggestions(a);
              setNewScore(null);
            }}
            className="text-xs px-3 py-2 border border-slate-200 rounded-xl bg-white font-semibold text-slate-800"
          >
            {analyses.map(a => (
              <option key={a._id} value={a._id}>
                {a.resumeTitle} (Score: {a.scores?.overall}) — {new Date(a.createdAt).toLocaleDateString()}
              </option>
            ))}
          </select>
        )}
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center text-xs text-slate-500 animate-pulse">
          Loading improvement recommendations...
        </div>
      ) : !selectedAnalysis ? (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 bg-violet-50 text-[#6D5EF7] rounded-xl flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-[#111827]">No Audits Found</h3>
          <p className="text-xs text-[#64748B]">
            Run an initial check on your resume to generate targeted improvements.
          </p>
          <Link
            to="/dashboard/checker"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#6D5EF7]"
          >
            Go to ATS Checker
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Top Comparison Banner */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Baseline ATS Score
                </span>
                <span className="text-3xl font-black text-[#111827]">
                  {selectedAnalysis.scores?.overall}
                </span>
              </div>

              {newScore && (
                <>
                  <ArrowRight className="w-5 h-5 text-emerald-500 shrink-0" />
                  <div className="text-center bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200">
                    <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block mb-0.5">
                      Updated Projected Score
                    </span>
                    <span className="text-3xl font-black text-emerald-700">
                      {newScore}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 block">
                      +{newScore - selectedAnalysis.scores?.overall} points improvement
                    </span>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={handleRecheckScore}
              disabled={rechecking}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-[#6D5EF7] hover:bg-[#5A4BE0] shadow-md transition disabled:opacity-50"
            >
              {rechecking ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Recalculating Impact...
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4" />
                  Recalculate ATS Score
                </>
              )}
            </button>
          </div>

          {/* Suggestions List */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-sm text-[#111827]">
              Actionable Wording Improvements ({suggestions.length})
            </h3>

            {suggestions.map((item, idx) => (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border p-5 shadow-subtle transition-all space-y-3 ${
                  item.status === 'accepted'
                    ? 'border-emerald-300 bg-emerald-50/10'
                    : item.status === 'rejected'
                    ? 'border-slate-200 opacity-50'
                    : 'border-slate-200/80 hover:border-violet-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#6D5EF7]" />
                    {item.title}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    {item.status === 'accepted' ? (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Accepted
                      </span>
                    ) : item.status === 'rejected' ? (
                      <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                        Rejected
                      </span>
                    ) : (
                      <>
                        <button
                          onClick={() => handleAccept(idx)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition"
                        >
                          <Check className="w-3.5 h-3.5" /> Accept
                        </button>
                        <button
                          onClick={() => handleReject(idx)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
                        >
                          <X className="w-3.5 h-3.5" /> Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Original Text
                    </span>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 leading-relaxed line-through">
                      "{item.original}"
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#6D5EF7] block mb-1">
                      Proposed Revision (Editable)
                    </span>
                    <textarea
                      rows={3}
                      value={item.improved}
                      onChange={(e) => handleTextChange(idx, e.target.value)}
                      className="w-full p-3 border-2 border-violet-200 rounded-xl text-xs bg-white text-slate-900 focus:outline-none focus:border-[#6D5EF7] leading-relaxed"
                    />
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 flex items-center justify-between">
                  <span><strong>Reason:</strong> {item.reason}</span>
                  <span className="text-slate-400 italic font-mono">*Please verify specific metrics before applying</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 text-right">
            <Link
              to="/dashboard/builder"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-[#6D5EF7] hover:bg-[#5A4BE0] shadow-md transition"
            >
              Open in Resume Builder to Finalize
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      )}

    </div>
  );
};
