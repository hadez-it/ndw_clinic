'use client';

import { useState, useEffect } from 'react';
import { HealthTopic, initialTopics } from '@/lib/types';
import {
  BookOpen,
  PlusCircle,
  ShieldCheck,
  Tag,
  User,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Lock,
  X,
  Filter,
  ArrowRight,
  Stethoscope,
} from 'lucide-react';

export default function HealthKnowledgePage() {
  const [topics, setTopics] = useState<HealthTopic[]>(initialTopics);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedTopic, setSelectedTopic] = useState<HealthTopic | null>(null);

  // Doctor Post Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('အထွေထွေကျန်းမာရေး (General Health)');
  const [authorName, setAuthorName] = useState('Dr. Sarah Jenkins');
  const [authorPin, setAuthorPin] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [postSuccess, setPostSuccess] = useState<string | null>(null);
  const [postError, setPostError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Fetch topics from API
  const fetchTopics = async () => {
    try {
      const res = await fetch('/api/topics');
      if (res.ok) {
        const data = await res.json();
        if (data.topics && data.topics.length > 0) {
          setTopics(data.topics);
        }
      }
    } catch (e) {
      console.error('Failed to load topics:', e);
    }
  };

  useEffect(() => {
    fetchTopics();
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem('clinic_user_role');
      setUserRole(role);
      const savedUser = localStorage.getItem('clinic_user_data');
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          if (parsed.name) {
            setAuthorName(parsed.name);
          }
        } catch {
          // ignore
        }
      }
    }
  }, []);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setPostError(null);
    setPostSuccess(null);

    try {
      const res = await fetch('/api/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          authorName,
          authorPin,
          imageUrl: imageUrl || undefined,
          excerpt,
          content,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.details ? data.details.join(', ') : data.error || 'Failed to publish');
      }

      setPostSuccess('Health topic successfully published to the Knowledge Base!');
      setTitle('');
      setExcerpt('');
      setContent('');
      setAuthorPin('');
      fetchTopics();
      setTimeout(() => {
        setIsModalOpen(false);
        setPostSuccess(null);
      }, 1500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setPostError(err.message);
      } else {
        setPostError('Error publishing topic.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const categories = ['All', ...Array.from(new Set(topics.map((t) => t.category)))];

  const filteredTopics =
    activeCategory === 'All'
      ? topics
      : topics.filter((t) => t.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span>Physician Verified Knowledge Base</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Health Knowledge and Medical Insights
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm max-w-xl mt-1 leading-relaxed">
            Clinical articles, preventative care guidelines, and wellness recommendations written directly by Nan Da Wun Healthcare physicians.
          </p>
        </div>

        {/* Doctor / Owner Post Button */}
        {(userRole === 'doctor' || userRole === 'owner') && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition w-full sm:w-auto shrink-0 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-white shrink-0" />
              <span>{userRole === 'owner' ? 'Owner: Post Article' : 'Doctor: Post Article'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Categories Filter Bar */}
      <div className="space-y-3">
        {/* Mobile Dropdown View */}
        <div className="sm:hidden">
          <div className="relative flex items-center">
            <div className="absolute left-3.5 pointer-events-none text-teal-600">
              <Filter className="w-4 h-4" />
            </div>
            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-semibold shadow-xs focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 focus:outline-none appearance-none"
            >
              {categories.map((cat) => {
                const count = cat === 'All' ? topics.length : topics.filter((t) => t.category === cat).length;
                return (
                  <option key={cat} value={cat}>
                    {cat === 'All' ? 'All Topics / အားလုံး' : cat} ({count})
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Desktop & Tablet Scrollable Tabs */}
        <div className="hidden sm:flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0">
            <Filter className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span>Categories:</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              const count = cat === 'All' ? topics.length : topics.filter((t) => t.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{cat === 'All' ? 'All Topics' : cat}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                      isActive ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results counter indicator */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <p>
            Showing <span className="font-bold text-slate-900">{filteredTopics.length}</span> published medical articles
          </p>
          {activeCategory !== 'All' && (
            <button
              onClick={() => setActiveCategory('All')}
              className="text-xs font-semibold text-teal-600 hover:text-teal-800 underline cursor-pointer"
            >
              Reset to All Topics
            </button>
          )}
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTopics.map((topic) => (
          <article
            key={topic.id}
            onClick={() => setSelectedTopic(topic)}
            className="cursor-pointer bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover-lift hover:border-teal-400 transition-all flex flex-col justify-between group"
          >
            {topic.imageUrl && (
              <div className="overflow-hidden h-48 sm:h-52 bg-slate-100 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={topic.imageUrl}
                  alt={topic.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-md font-semibold bg-white/95 text-teal-900 text-xs shadow-xs">
                    {topic.category}
                  </span>
                </div>
              </div>
            )}

            <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  {!topic.imageUrl && (
                    <span className="px-2 py-0.5 rounded-md font-semibold bg-teal-50 text-teal-700">
                      {topic.category}
                    </span>
                  )}
                  <span className="flex items-center gap-1 ml-auto">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{topic.createdAt}</span>
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug group-hover:text-teal-600 transition-colors line-clamp-2">
                  {topic.title}
                </h2>
                <p className="text-xs text-slate-600 mt-2.5 line-clamp-3 leading-relaxed">
                  {topic.excerpt}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <User className="w-3.5 h-3.5 text-teal-600" />
                  <span>{topic.authorName}</span>
                </div>
                <span className="text-teal-600 font-semibold inline-flex items-center gap-1">
                  <span>Read Article</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Reading Article Modal */}
      {selectedTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 relative my-auto">
            {/* Modal Header Bar */}
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-slate-200 px-5 sm:px-6 py-3.5 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900">Clinical Article Reader</span>
                <span>&bull;</span>
                <span className="bg-teal-50 text-teal-800 px-2 py-0.5 rounded font-medium text-[11px]">
                  {selectedTopic.category}
                </span>
              </div>
              <button
                onClick={() => setSelectedTopic(null)}
                aria-label="Close Article"
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Featured Image in Reader */}
            {selectedTopic.imageUrl && (
              <div className="w-full h-60 sm:h-72 overflow-hidden bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedTopic.imageUrl}
                  alt={selectedTopic.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Article Content */}
            <article className="p-5 sm:p-8 space-y-5">
              <div className="space-y-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="text-teal-700 font-bold uppercase tracking-wider">
                    {selectedTopic.category}
                  </span>
                  <span>/</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Published on {selectedTopic.createdAt}</span>
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 leading-tight tracking-tight">
                  {selectedTopic.title}
                </h1>

                {/* Author Info */}
                <div className="flex items-center gap-3 pt-1">
                  <div className="w-9 h-9 rounded-full bg-teal-100 border border-teal-200 text-teal-800 flex items-center justify-center font-bold text-xs">
                    <Stethoscope className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-slate-900">{selectedTopic.authorName}</p>
                    <p className="text-[11px] text-slate-500">Nan Da Wun Healthcare Medical Specialist</p>
                  </div>
                </div>
              </div>

              {/* Excerpt / Lead */}
              <div className="p-4 bg-teal-50/60 border-l-3 border-teal-600 rounded-r-xl text-slate-700 text-xs sm:text-sm leading-relaxed font-medium">
                {selectedTopic.excerpt}
              </div>

              {/* Main Body */}
              <div className="text-slate-800 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-3 pt-1">
                {selectedTopic.content}
              </div>

              {/* Footer Actions */}
              <div className="pt-6 mt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <span className="font-semibold">Category:</span>
                  <span className="bg-slate-100 px-2.5 py-1 rounded-md text-[11px]">{selectedTopic.category}</span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedTopic(null)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition cursor-pointer"
                >
                  Close Article
                </button>
              </div>
            </article>
          </div>
        </div>
      )}

      {/* Doctor / Owner Publish Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col my-auto">
            {/* Modal Top Bar */}
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between text-xs shrink-0">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-teal-400" />
                <span className="font-semibold">Publish Medical Article to Knowledge Base</span>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-5">
              {postSuccess && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{postSuccess}</span>
                </div>
              )}

              {postError && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-800">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{postError}</span>
                </div>
              )}

              <form id="post-article-form" onSubmit={handlePostSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                    Article Title
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter informative clinical article title..."
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                      Author Name
                    </label>
                    <select
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 focus:outline-none"
                    >
                      <option value="Dr. Sarah Jenkins">Dr. Sarah Jenkins (Cardiology)</option>
                      <option value="Dr. Aung Myat Min">Dr. Aung Myat Min (Pediatrics)</option>
                      <option value="Dr. Elena Rostova">Dr. Elena Rostova (Internal Med)</option>
                      <option value="Dr. Marcus Vance">Dr. Marcus Vance (Orthopedics)</option>
                      <option value="Clinic Executive Owner">Clinic Executive Owner</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 focus:outline-none"
                    >
                      <option value="နှလုံးနှင့်သွေးကြော (Cardiology)">နှလုံးနှင့်သွေးကြော (Cardiology)</option>
                      <option value="ကလေးကျန်းမာရေး (Pediatrics)">ကလေးကျန်းမာရေး (Pediatrics)</option>
                      <option value="ဆီးချိုနှင့်ဟော်မုန်း (Endocrinology)">ဆီးချိုနှင့်ဟော်မုန်း (Endocrinology)</option>
                      <option value="အရိုးနှင့်အကြော (Orthopedics)">အရိုးနှင့်အကြော (Orthopedics)</option>
                      <option value="အထွေထွေကျန်းမာရေး (General Health)">အထွေထွေကျန်းမာရေး (General Health)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                    Header Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                    Summary / Excerpt
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Brief 1-2 sentence overview for patient preview..."
                    className="w-full p-3 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                    Full Article Content
                  </label>
                  <textarea
                    rows={7}
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write detailed medical advice, guidelines, symptoms, and recommendations..."
                    className="w-full p-3 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-teal-600" />
                    <span>Doctor PIN / Security Key</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={authorPin}
                    onChange={(e) => setAuthorPin(e.target.value)}
                    placeholder="Enter doctor PIN or owner password..."
                    className="w-full sm:w-64 px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 focus:outline-none font-mono"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-xs text-slate-600 hover:text-slate-800 rounded-xl border border-slate-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold px-5 py-2 rounded-xl text-xs transition disabled:opacity-50 cursor-pointer"
                  >
                    {submitting ? 'Publishing...' : 'Publish Article'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
