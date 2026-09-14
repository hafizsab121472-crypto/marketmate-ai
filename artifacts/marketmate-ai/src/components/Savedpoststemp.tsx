import React, { useEffect, useState } from 'react';
import {
  Bookmark,
  Trash2,
  FileText,
  Eye,
  Plus,
  X,
} from 'lucide-react';

interface SavedPost {
  id: string;
  platform?: string;
  title?: string;
  content?: string;
  caption?: string;
  cta?: string;
  hashtags?: string[];
  createdAt?: string;
}

const STORAGE_KEY = 'marketmate-saved-posts';

const SavedPosts: React.FC = () => {
  const [posts, setPosts] = useState<SavedPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<SavedPost | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setPosts(parsed);
        }
      }
    } catch (error) {
      console.error('Failed to load saved posts:', error);
      setPosts([]);
    }
  }, []);

  const deletePost = (id: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this saved post?'
    );

    if (!confirmed) return;

    const updatedPosts = posts.filter((post) => post.id !== id);

    setPosts(updatedPosts);

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedPosts)
      );
    } catch (error) {
      console.error('Failed to update saved posts:', error);
    }

    if (selectedPost?.id === id) {
      setSelectedPost(null);
    }
  };

  const createNewPost = () => {
    window.location.href = '/';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <Bookmark className="w-6 h-6 text-indigo-400" />
            </div>

            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Saved Posts
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                View and manage your saved social media content.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={createNewPost}
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition"
          >
            <Plus className="w-4 h-4" />
            Create New Post
          </button>
        </div>
      </div>

      {posts.length === 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center">
            <FileText className="w-7 h-7 text-slate-500" />
          </div>

          <h2 className="text-lg font-semibold text-white mt-5">
            No saved posts yet
          </h2>

          <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto">
            Create content in the Content Studio and save your
            favorite posts here.
          </p>

          <button
            type="button"
            onClick={createNewPost}
            className="mt-5 inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold"
          >
            <Plus className="w-4 h-4" />
            Create New Post
          </button>
        </div>
      )}

      {posts.length > 0 && (
        <div className="space-y-4">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {post.platform && (
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-xs font-medium text-indigo-300">
                        {post.platform}
                      </span>
                    )}

                    {post.createdAt && (
                      <span className="text-xs text-slate-500">
                        {post.createdAt}
                      </span>
                    )}
                  </div>

                  {post.title && (
                    <h2 className="text-lg font-semibold text-white mb-2">
                      {post.title}
                    </h2>
                  )}

                  <p className="text-sm text-slate-300 leading-6 line-clamp-3 whitespace-pre-wrap">
                    {post.content ||
                      post.caption ||
                      'No content available.'}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedPost(post)}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm text-white transition"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>

                <button
                  type="button"
                  onClick={() => deletePost(post.id)}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-sm text-red-400 transition"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between gap-4 p-5 border-b border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {selectedPost.title || 'Saved Post'}
                </h2>

                {selectedPost.platform && (
                  <p className="text-xs text-indigo-400 mt-1">
                    {selectedPost.platform}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelectedPost(null)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-white mb-2">
                  Content
                </h3>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-300 whitespace-pre-wrap leading-6">
                  {selectedPost.content ||
                    selectedPost.caption ||
                    'No content available.'}
                </div>
              </div>

              {selectedPost.cta && (
                <div>
                  <h3 className="text-sm font-semibold text-white mb-2">
                    Call to Action
                  </h3>
                  <p className="text-sm text-slate-300">
                    {selectedPost.cta}
                  </p>
                </div>
              )}

              {selectedPost.hashtags &&
                selectedPost.hashtags.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-2">
                      Hashtags
                    </h3>

                    <div className="flex flex-wrap gap-2">
                      {selectedPost.hashtags.map((tag, index) => (
                        <span
                          key={`${tag}-${index}`}
                          className="text-xs text-indigo-300 bg-indigo-500/10 px-2 py-1 rounded-lg"
                        >
                          {tag.startsWith('#') ? tag : `#${tag}`}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            <div className="p-5 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedPost(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedPosts;