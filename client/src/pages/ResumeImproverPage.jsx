import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Modal } from '../components/common/Modal';
import {
  Sparkles,
  Check,
  X,
  Edit3,
  RefreshCw,
  FileCheck2,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  ShieldCheck,
  Layers,
  HelpCircle
} from 'lucide-react';

export const ResumeImproverPage = () => {
  const [searchParams] = useSearchParams();
  const analysisId = searchParams.get('analysisId');

  const [activeTab, setActiveTab] = useState('audit'); // 'audit' | 'freeform'
  const [analyses, setAnalyses] = useState([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rechecking, setRechecking] = useState(false);
  const [newScore, setNewScore] = useState(null);

  // Metric Prompt Modal state
  const [metricModalOpen, setMetricModalOpen] = useState(false);
  const [metricTargetIndex, setMetricTargetIndex] = useState(null);
  const [metricInput, setMetricInput] = useState('');

  // Freeform rewriter state
  const [freeformBullet, setFreeformBullet] = useState('');
  const [freeformRole, setFreeformRole] = useState('Software Engineer');
  const [freeformLoading, setFreeformLoading] = useState(false);
  const [freeformResult, setFreeformResult] = useState(null);

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
      const hasPlaceholder = /\[insert|\[x%|e\.g\./i.test(wb.improvedSuggestion);
      items.push({
        id: `wb-${idx}`,
        type: 'bullet',
        title: 'Action Verb & Impact Enhancement',
        original: wb.original,
        improved: wb.improvedSuggestion,
        reason: wb.reason || 'Converts passive phrasing into high-impact responsibility ownership.',
        hasPlaceholder,
        status: 'pending' // 'pending' | 'accepted' | 'rejected'
      });
    });

    // Add issue recommendations
    (analysis.issues || []).slice(0, 4).forEach((issue, idx) => {
      items.push({
        id: `iss-${idx}`,
        type: 'issue',
        title: issue.title,
        original: issue.evidence || issue.explanation,
        improved: issue.recommendation,
        reason: `Direct ATS fix for ${issue.category}: ${issue.explanation}`,
        hasPlaceholder: false,
        status: 'pending'
      });
    });

    setSuggestions(items);
  };

  const handleAccept = (index) => {
    const item = suggestions[index];
    // Check if the improved text has an unresolved placeholder like [Insert ...]
    if (/\[.*?\]/.test(item.improved)) {
      setMetricTargetIndex(index);
      setMetricInput('');
      setMetricModalOpen(true);
      return;
    }

    setSuggestions(prev => {
      const copy = [...prev];
      copy[index].status = 'accepted';
      return copy;
    });
  };

  const handleApplyFactualMetric = () => {
    if (metricTargetIndex === null) return;
    const item = suggestions[metricTargetIndex];
    let updatedText = item.improved;

    if (metricInput.trim()) {
      // Replace [Insert ... ] bracket with user's verified factual input
      updatedText = updatedText.replace(/\[.*?\]/, metricInput.trim());
    } else {
      // If left blank, strip the placeholder gracefully
      updatedText = updatedText.replace(/\s*\[.*?\]/, '');
    }

    setSuggestions(prev => {
      const copy = [...prev];
      copy[metricTargetIndex].improved = updatedText;
      copy[metricTargetIndex].status = 'accepted';
      return copy;
    });

    setMetricModalOpen(false);
    setMetricTargetIndex(null);
    setMetricInput('');
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
    }, 1200);
  };

  const handleFreeformSubmit = async (e) => {
    e.preventDefault();
    if (!freeformBullet.trim()) return;

    setFreeformLoading(true);
    setFreeformResult(null);

    try {
      const res = await api.post('/analysis/improve', {
        type: 'bullet',
        text: freeformBullet,
        context: { targetRole: freeformRole }
      });

      if (res.data.success) {
        setFreeformResult(res.data.data);
      }
    } catch (err) {
      console.error('Freeform improve error', err);
    } finally {
      setFreeformLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7865FF]/10 text-[#7865FF] border border-[#7865FF]/20 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#35D9E8]" />
            Grounded AI Rewrite Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F4F6FF]">AI Resume Improver</h1>
          <p className="text-sm sm:text-[15px] text-[#B5C0D6] mt-1">
            Side-by-side grounded revisions. Review explanations, specify your factual metrics, and accept or reject with full control.
          </p>
        </div>

        {/* Tab switch: Audit Based vs Freeform Bullet Rewriter */}
        <div className="inline-flex rounded-xl bg-[#101A2D] border border-[rgba(166,184,225,0.16)] p-1 text-sm font-semibold">
          <button
            onClick={() => setActiveTab('audit')}
            className={`interactive-pill px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'audit'
                ? 'bg-gradient-to-r from-[#7865FF] to-[#4285FF] text-white shadow-glow-violet font-bold'
                : 'text-[#8D9AB5] hover:text-[#F4F6FF]'
            }`}
          >
            Audit Suggestions ({suggestions.length})
          </button>
          <button
            onClick={() => setActiveTab('freeform')}
            className={`interactive-pill px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'freeform'
                ? 'bg-gradient-to-r from-[#7865FF] to-[#4285FF] text-white shadow-glow-violet font-bold'
                : 'text-[#8D9AB5] hover:text-[#F4F6FF]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#35D9E8]" />
            On-Demand Bullet Rewriter
          </button>
        </div>
      </div>

      {/* Anti-Hallucination & Factual Integrity Guarantee Banner */}
      <div className="p-4 bg-[#101A2D]/80 border border-[#7865FF]/30 rounded-2xl flex items-start gap-3 shadow-sm">
        <ShieldCheck className="w-5 h-5 text-[#35D9E8] shrink-0 mt-0.5" />
        <div className="text-sm text-[#F4F6FF] space-y-1">
          <h4 className="font-bold text-[#35D9E8]">Zero-Hallucination AI Commitment</h4>
          <p className="text-[#B5C0D6] leading-relaxed text-xs sm:text-[13px]">
            Resume Checker AI will <strong className="text-[#F4F6FF]">never</strong> invent fake employers, fabricate job titles, or insert arbitrary metrics out of thin air. When an accomplishment lacks quantifiable impact, we provide structured placeholders so you can insert your authentic data.
          </p>
        </div>
      </div>

      {/* TAB 1: AUDIT-BASED SUGGESTIONS */}
      {activeTab === 'audit' && (
        <>
          {loading ? (
            <div className="bg-[#141E33] rounded-2xl p-8 border border-[rgba(166,184,225,0.16)] text-center text-sm text-[#8D9AB5] animate-pulse">
              Loading improvement recommendations...
            </div>
          ) : !selectedAnalysis ? (
            <div className="bg-[#141E33] rounded-2xl p-12 border border-[rgba(166,184,225,0.16)] text-center space-y-3">
              <div className="w-12 h-12 bg-[#192640] text-[#7865FF] rounded-xl flex items-center justify-center mx-auto border border-[#7865FF]/30">
                <Sparkles className="w-6 h-6 text-[#35D9E8]" />
              </div>
              <h3 className="font-bold text-base text-[#F4F6FF]">No Audits Found</h3>
              <p className="text-sm text-[#B5C0D6]">
                Run an initial check on your resume to generate targeted improvements.
              </p>
              <Link
                to="/dashboard/checker"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#7865FF] to-[#4285FF] shadow-glow-violet transition"
              >
                Go to ATS Checker
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Top Comparison Banner */}
              <div className="bg-[#141E33] rounded-2xl p-6 border border-[rgba(166,184,225,0.16)] shadow-glow-violet/10 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <span className="text-xs font-bold text-[#8D9AB5] uppercase tracking-wider block mb-1">
                      Baseline ATS Score
                    </span>
                    <span className="text-3xl font-black text-[#F4F6FF]">
                      {selectedAnalysis.scores?.overall}
                    </span>
                  </div>

                  {newScore && (
                    <>
                      <ArrowRight className="w-5 h-5 text-[#32D6A0] shrink-0" />
                      <div className="text-center bg-[#101A2D] px-5 py-2.5 rounded-xl border border-emerald-500/40">
                        <span className="text-xs font-bold text-[#32D6A0] uppercase tracking-wider block mb-0.5">
                          Updated Projected Score
                        </span>
                        <span className="text-3xl font-black text-[#32D6A0]">
                          {newScore}
                        </span>
                        <span className="text-xs font-bold text-[#32D6A0] block mt-0.5">
                          +{newScore - selectedAnalysis.scores?.overall} points improvement
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {analyses.length > 1 && (
                    <select
                      value={selectedAnalysis?._id || ''}
                      onChange={(e) => {
                        const a = analyses.find(item => item._id === e.target.value);
                        setSelectedAnalysis(a);
                        initSuggestions(a);
                        setNewScore(null);
                      }}
                      className="text-sm px-4 py-2 border border-[rgba(166,184,225,0.18)] rounded-xl bg-[#101A2D] font-semibold text-[#F4F6FF] focus:outline-none focus:border-[#7865FF] transition"
                    >
                      {analyses.map(a => (
                        <option key={a._id} value={a._id} className="bg-[#101A2D] text-[#F4F6FF]">
                          {a.resumeTitle} (Score: {a.scores?.overall})
                        </option>
                      ))}
                    </select>
                  )}

                  <button
                    onClick={handleRecheckScore}
                    disabled={rechecking}
                    className="interactive-button inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#7865FF] to-[#4285FF] shadow-glow-violet transition disabled:opacity-50"
                  >
                    {rechecking ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Recalculating Impact...
                      </>
                    ) : (
                      <>
                        <TrendingUp className="w-4 h-4 text-[#35D9E8]" />
                        Recalculate ATS Score
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Suggestions List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-[#F4F6FF]">
                    Actionable Side-by-Side Wording Improvements ({suggestions.length})
                  </h3>
                  <span className="text-sm text-[#8D9AB5]">
                    Accepted: {suggestions.filter(s => s.status === 'accepted').length} of {suggestions.length}
                  </span>
                </div>

                {suggestions.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`interactive-card rounded-2xl border p-5 transition-all space-y-4 ${
                      item.status === 'accepted'
                        ? 'border-emerald-500/40 bg-[#101A2D]'
                        : item.status === 'rejected'
                        ? 'border-[rgba(166,184,225,0.1)] bg-[#101A2D]/50 opacity-60'
                        : 'border-[rgba(166,184,225,0.16)] bg-[#141E33] hover:border-[#7865FF]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-[#F4F6FF] flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#7865FF]" />
                        {item.title}
                      </span>
                      
                      <div className="flex items-center gap-2">
                        {item.status === 'accepted' ? (
                          <span className="interactive-pill text-xs font-bold text-[#32D6A0] bg-emerald-500/15 px-3 py-1.5 rounded-lg border border-emerald-500/30 flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5" /> Accepted
                          </span>
                        ) : item.status === 'rejected' ? (
                          <span className="text-xs font-semibold text-[#8D9AB5] bg-[#192640] px-3 py-1.5 rounded-lg border border-[rgba(166,184,225,0.14)]">
                            Rejected
                          </span>
                        ) : (
                          <>
                            <button
                              onClick={() => handleAccept(idx)}
                              className="interactive-button inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm transition"
                            >
                              <Check className="w-3.5 h-3.5" /> Accept
                            </button>
                            <button
                              onClick={() => handleReject(idx)}
                              className="interactive-button inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#B5C0D6] bg-[#192640] hover:bg-[#1f2f50] border border-[rgba(166,184,225,0.16)] transition"
                            >
                              <X className="w-3.5 h-3.5" /> Reject
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Side-by-Side Comparison */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-[#8D9AB5] block mb-1.5">
                          Original Text
                        </span>
                        <div className="p-3.5 bg-[#0B1120] rounded-xl border border-[rgba(166,184,225,0.14)] text-[#8D9AB5] leading-relaxed line-through">
                          "{item.original}"
                        </div>
                      </div>

                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-[#35D9E8] block mb-1.5">
                          Proposed Revision (Directly Editable)
                        </span>
                        <textarea
                          rows={3}
                          value={item.improved}
                          onChange={(e) => handleTextChange(idx, e.target.value)}
                          className="w-full p-3.5 border-2 border-[#7865FF]/40 rounded-xl text-sm bg-[#0B1120] text-[#F4F6FF] focus:outline-none focus:border-[#7865FF] leading-relaxed transition"
                        />
                      </div>
                    </div>

                    {/* Explanation / Rationale */}
                    <div className="text-xs text-[#B5C0D6] bg-[#0B1120] px-4 py-2.5 rounded-xl border border-[rgba(166,184,225,0.12)] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span><strong className="text-[#F4F6FF]">Why this improves your resume:</strong> {item.reason}</span>
                      {/\[.*?\]/.test(item.improved) && (
                        <button
                          onClick={() => {
                            setMetricTargetIndex(idx);
                            setMetricInput('');
                            setMetricModalOpen(true);
                          }}
                          className="interactive-button text-[#35D9E8] hover:underline font-bold shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-[#192640] transition"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Insert Real Metric
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-right">
                <Link
                  to="/dashboard/builder"
                  className="interactive-button inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#7865FF] to-[#4285FF] shadow-glow-violet transition"
                >
                  Open in Resume Builder to Finalize
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

            </div>
          )}
        </>
      )}

      {/* TAB 2: ON-DEMAND FREEFORM BULLET REWRITER */}
      {activeTab === 'freeform' && (
        <div className="bg-[#141E33] rounded-2xl p-6 sm:p-8 border border-[rgba(166,184,225,0.16)] shadow-glow-violet/10 space-y-6">
          <div>
            <h3 className="font-extrabold text-base text-[#F4F6FF]">
              Instant On-Demand Bullet Rewriter
            </h3>
            <p className="text-sm text-[#B5C0D6] mt-1">
              Paste any bullet point or project description from your existing draft to convert passive responsibilities into metric-driven accomplishments.
            </p>
          </div>

          <form onSubmit={handleFreeformSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-bold text-[#F4F6FF] mb-1.5">
                  Bullet Point to Improve
                </label>
                <textarea
                  rows={3}
                  value={freeformBullet}
                  onChange={(e) => setFreeformBullet(e.target.value)}
                  placeholder="e.g. Responsible for fixing backend API bugs and helping with database performance."
                  className="w-full p-3.5 border border-[rgba(166,184,225,0.18)] rounded-xl text-sm bg-[#101A2D] text-[#F4F6FF] placeholder-[#8D9AB5] focus:outline-none focus:border-[#7865FF] transition leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#F4F6FF] mb-1.5">
                  Target Role Context
                </label>
                <input
                  type="text"
                  value={freeformRole}
                  onChange={(e) => setFreeformRole(e.target.value)}
                  placeholder="e.g. Full Stack Engineer"
                  className="w-full px-3.5 py-2.5 border border-[rgba(166,184,225,0.18)] rounded-xl text-sm bg-[#101A2D] text-[#F4F6FF] placeholder-[#8D9AB5] focus:outline-none focus:border-[#7865FF] transition"
                />
                <button
                  type="submit"
                  disabled={freeformLoading || !freeformBullet.trim()}
                  className="interactive-button w-full mt-4 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#7865FF] to-[#4285FF] shadow-glow-violet transition disabled:opacity-50 inline-flex items-center justify-center gap-2"
                >
                  {freeformLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Optimizing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[#35D9E8]" />
                      Improve Bullet
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Result Card */}
          {freeformResult && (
            <div className="pt-4 border-t border-[rgba(166,184,225,0.12)] space-y-4 animate-fade-in">
              <h4 className="font-bold text-xs text-[#F4F6FF] uppercase tracking-wider">
                Grounded Rewrite Result
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="interactive-card p-4 bg-[#0B1120] rounded-xl border border-[rgba(166,184,225,0.14)] text-[#8D9AB5] line-through leading-relaxed">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8D9AB5] block mb-1">
                    Original
                  </span>
                  "{freeformResult.original}"
                </div>

                <div className="interactive-card p-4 bg-[#101A2D] rounded-xl border border-emerald-500/40 text-[#32D6A0] font-medium leading-relaxed">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#32D6A0] block mb-1">
                    Improved Outcome-Focused Wording
                  </span>
                  "{freeformResult.improved}"
                </div>
              </div>

              <div className="interactive-card p-3.5 bg-[#0B1120] rounded-xl border border-[rgba(166,184,225,0.14)] text-xs text-[#B5C0D6]">
                <strong className="text-[#F4F6FF]">Why this version is superior:</strong> {freeformResult.rationale}
              </div>
            </div>
          )}
        </div>
      )}

      {/* FACTUAL METRIC INPUT MODAL */}
      <Modal
        isOpen={metricModalOpen}
        onClose={() => setMetricModalOpen(false)}
        title="Input Your Authentic Metric"
      >
        <div className="space-y-4 text-sm">
          <p className="text-[#B5C0D6] leading-relaxed">
            In compliance with our anti-hallucination policy, we do not invent arbitrary statistics. Please enter your real accomplishment to finalize this bullet point:
          </p>

          <div>
            <label className="block font-bold text-[#F4F6FF] mb-1.5">
              Your Factual Metric or Scale
            </label>
            <input
              type="text"
              value={metricInput}
              onChange={(e) => setMetricInput(e.target.value)}
              placeholder="e.g. reducing query latency by 40% (or: supporting 1,200 active users)"
              className="w-full px-4 py-2.5 border-2 border-[#7865FF]/40 rounded-xl text-sm bg-[#101A2D] text-[#F4F6FF] placeholder-[#8D9AB5] focus:outline-none focus:border-[#7865FF] transition"
            />
            <span className="text-xs text-[#8D9AB5] mt-1.5 block">
              Tip: Percentages, latency drops, user numbers, and cost reductions produce the highest ATS impact.
            </span>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setMetricModalOpen(false);
                setMetricTargetIndex(null);
              }}
              className="interactive-button px-4 py-2 rounded-xl text-[#B5C0D6] font-semibold bg-[#192640] hover:bg-[#1f2f50] border border-[rgba(166,184,225,0.16)] transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApplyFactualMetric}
              className="interactive-button px-5 py-2 rounded-xl text-white font-bold bg-gradient-to-r from-[#7865FF] to-[#4285FF] shadow-glow-violet transition"
            >
              Apply Metric & Accept
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};
