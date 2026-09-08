import React, { useState, useEffect } from 'react';
import { Post, Draft } from '../types';
import { loadPosts, savePosts, loadActiveDraft, saveActiveDraft } from '../lib/storage';

export const PostsManager: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [draft, setDraft] = useState<Draft>({ title: '', content: '', category: 'General', status: 'draft' });

  useEffect(() => {
    setPosts(loadPosts());
    const savedDraft = loadActiveDraft();
    if (savedDraft) setDraft(savedDraft);
  }, []);

  const handleDraftChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const updated = { ...draft, [e.target.name]: e.target.value };
    setDraft(updated);
    saveActiveDraft(updated);
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.title.trim() || !draft.content.trim()) return;

    const newPost: Post = {
      id: Date.now().toString(),
      title: draft.title,
      content: draft.content,
      category: draft.category || 'General',
      status: 'published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    savePosts(updatedPosts);

    const emptyDraft: Draft = { title: '', content: '', category: 'General', status: 'draft' };
    setDraft(emptyDraft);
    saveActiveDraft(null);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md">
        <h3 className="text-lg font-bold mb-3 text-slate-900 dark:text-white">Create New Post</h3>
        <form onSubmit={handlePublish} className="space-y-3">
          <input
            type="text"
            name="title"
            placeholder="Post Title"
            value={draft.title}
            onChange={handleDraftChange}
            className="w-full p-2 border rounded text-slate-900"
            required
          />
          <textarea
            name="content"
            placeholder="Write your post content..."
            value={draft.content}
            onChange={handleDraftChange}
            className="w-full p-2 border rounded text-slate-900"
            rows={3}
            required
          />
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg">
            Publish Post
          </button>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Your Posts</h3>
        {posts.length === 0 ? (
          <p className="text-slate-500">No posts published yet.</p>
        ) : (
          posts.map((p) => (
            <div key={p.id} className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow border border-slate-200 dark:border-slate-700">
              <h4 className="font-bold text-lg text-slate-900 dark:text-white">{p.title}</h4>
              <p className="text-slate-700 dark:text-slate-300 mt-1">{p.content}</p>
              <span className="inline-block text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-1 rounded mt-2">
                {p.category}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
