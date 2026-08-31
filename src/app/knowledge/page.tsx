'use client';

import { useState, useEffect } from 'react';
import { HealthTopic, initialTopics } from '@/lib/types';
import { BookOpen, PlusCircle, ShieldCheck, Tag, User, Calendar, CheckCircle2, AlertCircle, Lock, X } from 'lucide-react';

export default function HealthKnowledgePage() {
  const [topics, setTopics] = useState<HealthTopic[]>(initialTopics);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedTopic, setSelectedTopic] = useState<HealthTopic | null>(null);

  // Doctor Post Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('General Health');
  const [authorName, setAuthorName] = useState('Dr. Sarah Jenkins');
  const [authorPin, setAuthorPin] = useState('');
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
      // Refresh list
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
            <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
            <span>Physician Verified Knowledge Base</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Health Knowledge & Medical Insights
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm max-w-xl mt-1">
            Clinical articles, preventative care guidelines, and wellness recommendations published by Nan Da Wun Healthcare medical doctors.
          </p>
        </div>

        {/* Doctor / Owner Post Button */}
        {userRole === 'doctor' || userRole === 'owner' ? (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white px-5 py-3 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-sm shadow-teal-600/30 transition w-full sm:w-auto shrink-0"
            >
              <PlusCircle className="w-4 h-4 text-white shrink-0" />
              <span>{userRole === 'owner' ? 'Owner Portal: Post Topic' : 'Doctor Portal: Post Topic'}</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-500 hidden lg:inline">Doctor or Clinic Owner?</span>
            <a
              href="/login"
              className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-semibold transition w-full sm:w-auto shrink-0"
            >
              <Lock className="w-3.5 h-3.5 text-teal-600" />
              <span>Doctor/Owner Sign In to Post</span>
            </a>
          </div>
        )}
      </div>

      {/* Categories Filter */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">
          Filter By:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeCategory === cat
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredTopics.map((topic) => (
          <article
            key={topic.id}
            onClick={() => setSelectedTopic(topic)}
            className="cursor-pointer bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:border-teal-400 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                <span className="px-2.5 py-0.5 rounded-full font-semibold bg-teal-50 text-teal-700">
                  {topic.category}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{topic.createdAt}</span>
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-teal-600">
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
              <span className="text-teal-600 font-semibold hover:underline">
                Read Full Insight →
              </span>
            </div>
          </article>
        ))}
      </div>

      {/* Reading Article View - WordPress Clean Blog Post Layout */}
      {selectedTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 relative my-auto">
            {/* WordPress Post Header Toolbar */}
            <div className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="font-serif italic font-semibold text-slate-700">WordPress Reader</span>
                <span>•</span>
                <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono text-[11px]">
                  {selectedTopic.category}
                </span>
              </div>
              <button
                onClick={() => setSelectedTopic(null)}
                aria-label="Close Article"
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* WordPress Editorial Post Content */}
            <article className="p-6 sm:p-12 space-y-6">
              {/* Category & Date Meta */}
              <div className="space-y-3 pb-6 border-b border-slate-100">
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

                <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 leading-tight tracking-tight">
                  {selectedTopic.title}
                </h1>

                {/* Author Byline */}
                <div className="flex items-center gap-3 pt-2">
                  <div className="w-10 h-10 rounded-full bg-teal-100 border border-teal-200 text-teal-800 flex items-center justify-center font-bold text-sm font-serif">
                    {selectedTopic.authorName.charAt(3) || 'D'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{selectedTopic.authorName}</p>
                    <p className="text-xs text-slate-500">Clinical Contributor & Medical Specialist</p>
                  </div>
                </div>
              </div>

              {/* Excerpt / Pull-quote */}
              <div className="p-4 sm:p-5 bg-teal-50/50 border-l-4 border-teal-600 rounded-r-xl text-slate-700 text-sm sm:text-base italic font-serif leading-relaxed">
                &ldquo;{selectedTopic.excerpt}&rdquo;
              </div>

              {/* Article Main Body */}
              <div className="font-serif text-slate-800 text-base sm:text-lg leading-relaxed whitespace-pre-line space-y-4 pt-2">
                {selectedTopic.content}
              </div>

              {/* Post Footer Tags & Actions */}
              <div className="pt-8 mt-8 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-2 text-slate-500">
                  <span className="font-semibold">Tagged:</span>
                  <span className="bg-slate-100 px-2.5 py-1 rounded-full">#Healthcare</span>
                  <span className="bg-slate-100 px-2.5 py-1 rounded-full">#{selectedTopic.category}</span>
                  <span className="bg-slate-100 px-2.5 py-1 rounded-full">#Wellness</span>
                </div>

                <button
                  onClick={() => setSelectedTopic(null)}
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-sans font-semibold text-xs transition"
                >
                  Finished Reading
                </button>
              </div>
            </article>
          </div>
        </div>
      )}

      {/* Doctor / Owner Publish Modal - WordPress Block / Gutenberg Style Editor */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col my-auto">
            {/* WordPress Admin Top Bar */}
            <div className="bg-slate-900 text-white px-4 sm:px-6 py-3 flex items-center justify-between text-xs shrink-0">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-white text-slate-900 flex items-center justify-center font-serif font-black text-xs">
                  W
                </span>
                <span className="font-semibold hidden xs:inline">Nan Da Wun &gt; Add New Post</span>
                <span className="bg-slate-800 text-teal-300 px-2 py-0.5 rounded text-[11px] font-mono">
                  Gutenberg Editor Mode
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-white px-2.5 py-1 rounded"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  form="wp-post-form"
                  disabled={submitting}
                  className="bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-slate-950 font-bold px-4 py-1.5 rounded-lg text-xs transition disabled:opacity-50"
                >
                  {submitting ? 'Publishing...' : 'Publish Post'}
                </button>
              </div>
            </div>

            {/* Editor Body with Main Canvas & Document Settings Sidebar */}
            <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12">
              {/* Main Document Canvas */}
              <div className="lg:col-span-8 p-6 sm:p-10 border-b lg:border-b-0 lg:border-r border-slate-200 space-y-6">
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

                <form id="wp-post-form" onSubmit={handlePostSubmit} className="space-y-6">
                  {/* Gutenberg Style Big Title */}
                  <div>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Add post title..."
                      className="w-full text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-slate-900 border-0 border-b border-slate-200 pb-3 focus:outline-none focus:border-teal-600 placeholder:text-slate-300"
                    />
                  </div>

                  {/* Gutenberg Style Excerpt */}
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                      Post Excerpt / Lead Paragraph
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      placeholder="Write a brief excerpt to hook clinic readers..."
                      className="w-full p-3 font-serif text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none placeholder:text-slate-300"
                    />
                  </div>

                  {/* Gutenberg Main Content Area */}
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                      Document Content (Paragraphs, clinical bullet points)
                    </label>
                    <textarea
                      rows={9}
                      required
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Type / or start writing clinical medical advice..."
                      className="w-full p-4 font-serif text-base leading-relaxed border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none placeholder:text-slate-300"
                    />
                  </div>
                </form>
              </div>

              {/* WordPress Document Sidebar (Meta, Category, PIN) */}
              <div className="lg:col-span-4 bg-slate-50 p-6 space-y-6 text-xs text-slate-700">
                <div className="border-b border-slate-200 pb-4">
                  <h4 className="font-bold text-slate-900 text-sm">Post Settings</h4>
                  <p className="text-[11px] text-slate-500">Status: Ready to publish immediately</p>
                </div>

                {/* Author Selection */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
                    Author
                  </label>
                  <select
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    form="wp-post-form"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  >
                    <option value="Dr. Sarah Jenkins">Dr. Sarah Jenkins</option>
                    <option value="Dr. Marcus Vance">Dr. Marcus Vance</option>
                    <option value="Dr. Elena Rostova">Dr. Elena Rostova</option>
                    <option value="Dr. Alexander Patel">Dr. Alexander Patel</option>
                    <option value="Clinic Executive Owner">Clinic Executive Owner</option>
                  </select>
                </div>

                {/* Category Selection */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    form="wp-post-form"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  >
                    <option value="Cardiology">Cardiology</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Endocrinology">Endocrinology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="General Health">General Health</option>
                  </select>
                </div>

                {/* Security Verification Key */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px] flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-teal-600" />
                    <span>Doctor PIN / Owner Pass</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={authorPin}
                    onChange={(e) => setAuthorPin(e.target.value)}
                    form="wp-post-form"
                    placeholder="doctor1234 or owner2026!"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none font-mono"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Protected by server-side verification.
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200 text-center">
                  <span className="text-[11px] text-slate-400 italic">
                    WP Gutenberg Theme • Nan Da Wun CMS
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
