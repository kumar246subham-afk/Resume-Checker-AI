import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import {
  Bot,
  Send,
  User,
  Sparkles,
  FileText,
  Copy,
  Check,
  Briefcase,
  HelpCircle,
  RefreshCw
} from 'lucide-react';

export const CareerAssistantPage = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello! I am your AI Career Assistant. I can help you transform responsibilities into quantifiable achievements, tailor your resume for specific engineering roles, suggest relevant skills to learn, or prepare for upcoming interviews.\n\nHow can I help you today?`
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const res = await api.get('/resumes');
        if (res.data.success && res.data.data.length > 0) {
          setResumes(res.data.data);
          setSelectedResumeId(res.data.data[0]._id);
        }
      } catch (err) {
        console.error('Failed to load resumes', err);
      }
    };

    fetchResumes();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend) => {
    const prompt = textToSend || inputPrompt;
    if (!prompt.trim() || loading) return;

    const newMessages = [...messages, { role: 'user', content: prompt }];
    setMessages(newMessages);
    setInputPrompt('');
    setLoading(true);

    try {
      const res = await api.post('/career-assistant/chat', {
        message: prompt,
        resumeId: selectedResumeId || null,
        history: newMessages.slice(-6)
      });

      if (res.data.success) {
        setMessages([...newMessages, { role: 'assistant', content: res.data.data.reply }]);
      }
    } catch (err) {
      setMessages([
        ...newMessages,
        { role: 'assistant', content: 'Apologies, I encountered a connection issue. Please try again.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const suggestedPills = [
    'How should I describe my full-stack projects?',
    'What action verbs make the strongest impression?',
    'How can I optimize for Senior Software Engineer roles?',
    'What questions should I prepare for a behavioral interview?'
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto flex flex-col h-[calc(100vh-140px)]">
      {/* Header & Resume Context Selector */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-subtle flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-[#111827] flex items-center gap-2">
            <Bot className="w-5 h-5 text-[#6D5EF7]" />
            AI Career Assistant
          </h1>
          <p className="text-[11px] text-[#64748B]">
            Interactive career coaching, interview readiness, and resume phrasing advice.
          </p>
        </div>

        {resumes.length > 0 && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Context Resume:</span>
            <select
              value={selectedResumeId}
              onChange={(e) => setSelectedResumeId(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50 font-semibold text-slate-800 text-xs focus:outline-none focus:border-[#6D5EF7]"
            >
              <option value="">No Context (General Advice)</option>
              {resumes.map(r => (
                <option key={r._id} value={r._id}>
                  {r.title} ({r.jobTarget})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200/80 shadow-subtle p-4 sm:p-6 overflow-y-auto space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
              msg.role === 'user' 
                ? 'bg-[#111827] text-white' 
                : 'bg-violet-100 text-[#6D5EF7]'
            }`}>
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed relative group ${
              msg.role === 'user'
                ? 'bg-[#6D5EF7] text-white rounded-tr-none'
                : 'bg-slate-50 text-slate-800 border border-slate-200/80 rounded-tl-none'
            }`}>
              <div className="whitespace-pre-wrap">{msg.content}</div>

              {msg.role === 'assistant' && (
                <button
                  onClick={() => copyToClipboard(msg.content, idx)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-slate-700 rounded transition"
                  title="Copy message"
                >
                  {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 p-3 rounded-2xl w-fit">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#6D5EF7]" />
            <span>AI Assistant is writing a grounded response...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Pills */}
      <div className="flex flex-wrap gap-2">
        {suggestedPills.map((pill, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(pill)}
            className="text-[11px] font-medium text-slate-600 bg-white hover:bg-violet-50 hover:text-[#6D5EF7] border border-slate-200 px-3 py-1.5 rounded-full transition shadow-2xs"
          >
            {pill}
          </button>
        ))}
      </div>

      {/* Input Field Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-subtle"
      >
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder="Ask anything about resume bullets, interviews, or engineering skills..."
          className="flex-1 px-4 py-2.5 text-xs text-slate-900 bg-transparent focus:outline-none"
        />
        <button
          type="submit"
          disabled={!inputPrompt.trim() || loading}
          className="p-2.5 bg-[#6D5EF7] hover:bg-[#5A4BE0] text-white rounded-xl shadow-sm transition disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
