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
      <div className="bg-[#141E33] rounded-2xl p-4 border border-[rgba(166,184,225,0.16)] shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-[#F4F6FF] flex items-center gap-2">
            <Bot className="w-5 h-5 text-[#35D9E8]" />
            AI Career Assistant
          </h1>
          <p className="text-xs sm:text-[13px] text-[#B5C0D6] mt-0.5">
            Interactive career coaching, interview readiness, and resume phrasing advice.
          </p>
        </div>

        {resumes.length > 0 && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#8D9AB5] font-medium">Context Resume:</span>
            <select
              value={selectedResumeId}
              onChange={(e) => setSelectedResumeId(e.target.value)}
              className="px-3 py-1.5 border border-[rgba(166,184,225,0.18)] rounded-xl bg-[#101A2D] font-semibold text-[#F4F6FF] text-xs focus:outline-none focus:border-[#7865FF] transition"
            >
              <option value="" className="bg-[#101A2D] text-[#F4F6FF]">No Context (General Advice)</option>
              {resumes.map(r => (
                <option key={r._id} value={r._id} className="bg-[#101A2D] text-[#F4F6FF]">
                  {r.title} ({r.jobTarget})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 bg-[#141E33] rounded-2xl border border-[rgba(166,184,225,0.16)] shadow-sm p-4 sm:p-6 overflow-y-auto space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
              msg.role === 'user' 
                ? 'bg-gradient-to-r from-[#7865FF] to-[#4285FF] text-white shadow-glow-violet' 
                : 'bg-[#192640] text-[#35D9E8] border border-[#35D9E8]/30'
            }`}>
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed relative group shadow-sm ${
              msg.role === 'user'
                ? 'bg-gradient-to-r from-[#7865FF] to-[#4285FF] text-white rounded-tr-none shadow-glow-violet'
                : 'bg-[#192640] text-[#F4F6FF] border border-[rgba(166,184,225,0.16)] rounded-tl-none'
            }`}>
              <div className="whitespace-pre-wrap">{msg.content}</div>

              {msg.role === 'assistant' && (
                <button
                  onClick={() => copyToClipboard(msg.content, idx)}
                  className="interactive-button absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 p-1.5 text-[#8D9AB5] hover:text-[#F4F6FF] bg-[#101A2D] border border-[rgba(166,184,225,0.16)] rounded-lg transition"
                  title="Copy message"
                >
                  {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-[#32D6A0]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs sm:text-sm text-[#8D9AB5] bg-[#101A2D] border border-[rgba(166,184,225,0.14)] p-3 rounded-2xl w-fit">
            <RefreshCw className="w-4 h-4 animate-spin text-[#7865FF]" />
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
            className="interactive-pill text-xs font-semibold text-[#B5C0D6] bg-[#141E33] hover:bg-[#192640] hover:text-[#F4F6FF] border border-[rgba(166,184,225,0.16)] hover:border-[#7865FF]/40 px-3.5 py-1.5 rounded-full transition shadow-sm"
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
        className="flex items-center gap-2 bg-[#141E33] p-2 rounded-2xl border border-[rgba(166,184,225,0.18)] shadow-glow-violet/10 focus-within:border-[#7865FF] transition"
      >
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder="Ask anything about resume bullets, interviews, or engineering skills..."
          className="flex-1 px-4 py-2.5 text-sm text-[#F4F6FF] placeholder-[#8D9AB5] bg-transparent focus:outline-none"
        />
        <button
          type="submit"
          disabled={!inputPrompt.trim() || loading}
          className="interactive-button p-3 bg-gradient-to-r from-[#7865FF] to-[#4285FF] text-white rounded-xl shadow-glow-violet hover:brightness-110 active:scale-95 transition disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
