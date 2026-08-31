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

        {/* Doctor Post Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 active:bg-black text-white px-5 py-3 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition w-full sm:w-auto shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-teal-400 shrink-0" />
          <span>Doctor Portal: Post Topic</span>
        </button>
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

      {/* Reading Article Modal */}
      {selectedTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setSelectedTopic(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700">
                  {selectedTopic.category}
                </span>
                <span className="text-xs text-slate-400">Published {selectedTopic.createdAt}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                {selectedTopic.title}
              </h2>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 pb-3 border-b border-slate-100">
                <User className="w-4 h-4 text-teal-600" />
                <span>Article Author: {selectedTopic.authorName}</span>
              </div>
              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line pt-2">
                {selectedTopic.content}
              </div>
              <div className="pt-6 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setSelectedTopic(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-4 py-2 rounded-xl"
                >
                  Close Article
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Doctor Publish Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-teal-50 text-teal-600 rounded-xl">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Publish Doctor Insight</h3>
                <p className="text-xs text-slate-500">
                  Doctor-verified publication portal. Requires Doctor Secret PIN.
                </p>
              </div>
            </div>

            {postSuccess && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{postSuccess}</span>
              </div>
            )}

            {postError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-800">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{postError}</span>
              </div>
            )}

            <form onSubmit={handlePostSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Article Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Recognizing Early Markers of Vascular Inflammation"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Specialty Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none text-xs"
                  >
                    <option value="Cardiology">Cardiology</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Endocrinology">Endocrinology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="General Health">General Health</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Doctor Author Name
                  </label>
                  <select
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none text-xs"
                  >
                    <option value="Dr. Sarah Jenkins">Dr. Sarah Jenkins</option>
                    <option value="Dr. Marcus Vance">Dr. Marcus Vance</option>
                    <option value="Dr. Elena Rostova">Dr. Elena Rostova</option>
                    <option value="Dr. Alexander Patel">Dr. Alexander Patel</option>
                  </select>
                </div>
              </div>

              {/* Security PIN */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-teal-600" />
                  <span>Doctor Verification PIN (Default: doctor1234)</span>
                </label>
                <input
                  type="password"
                  required
                  value={authorPin}
                  onChange={(e) => setAuthorPin(e.target.value)}
                  placeholder="Enter Doctor Secret PIN"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Short Excerpt / Summary
                </label>
                <textarea
                  rows={2}
                  required
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Key takeaway in 1-2 sentences..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Article Body
                </label>
                <textarea
                  rows={5}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Provide complete medical explanation, actionable advice, and guidelines..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none text-xs font-sans"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 disabled:opacity-50 text-white font-bold transition shadow-xs"
                >
                  {submitting ? 'Publishing...' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
