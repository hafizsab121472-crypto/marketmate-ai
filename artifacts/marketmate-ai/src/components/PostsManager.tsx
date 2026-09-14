import React, { useEffect, useMemo, useState } from 'react';
import {
  Sparkles,
  Save,
  Send,
  Pencil,
  Trash2,
  RotateCcw,
  FileText,
  CheckCircle2,
  Clock3,
  Wand2,
} from 'lucide-react';

import type { Post, Draft } from '../types';
import {
  loadPosts,
  savePosts,
  loadActiveDraft,
  saveActiveDraft,
} from '../lib/storage';

const DRAFTS_STORAGE_KEY = 'marketmate-drafts';

type PostStatus = 'draft' | 'published';

type EditorData = {
  title: string;
  content: string;
  category: string;
};

const DEFAULT_EDITOR: EditorData = {
  title: '',
  content: '',
  category: 'General',
};

const PRESET_TAGS = [
  'Marketing',
  'Sales',
  'Growth',
  'Product',
  'Announcement',
  'Engagement',
];

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function safeReadDrafts(): Draft[] {
  try {
    const raw = localStorage.getItem(DRAFTS_STORAGE_KEY);

    if (!raw) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item): item is Draft => {
      if (!item || typeof item !== 'object') {
        return false;
      }

      const value = item as Record<string, unknown>;

      return (
        typeof value.title === 'string' &&
        typeof value.content === 'string' &&
        typeof value.category === 'string' &&
        value.status === 'draft'
      );
    });
  } catch {
    return [];
  }
}

function safeSaveDrafts(drafts: Draft[]): void {
  try {
    localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(drafts));
  } catch {
    // Keep the UI working if browser storage is unavailable.
  }
}

function formatDate(value: string | undefined): string {
  if (!value) {
    return 'Recently';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Recently';
  }

  return date.toLocaleString();
}

export const PostsManager: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [drafts, setDrafts] = useState<Draft[]>([]);

  const [editor, setEditor] = useState<EditorData>(DEFAULT_EDITOR);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingStatus, setEditingStatus] =
    useState<PostStatus | null>(null);

  const [selectedPreset, setSelectedPreset] =
    useState<string>('Marketing');

  const [isGenerating, setIsGenerating] = useState(false);

  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    try {
      const savedPosts = loadPosts();

      if (Array.isArray(savedPosts)) {
        setPosts(savedPosts);
      }
    } catch {
      setPosts([]);
    }

    const savedDraftList = safeReadDrafts();
    setDrafts(savedDraftList);

    const activeDraft = loadActiveDraft();

    if (activeDraft) {
      setEditor({
        title: activeDraft.title ?? '',
        content: activeDraft.content ?? '',
        category: activeDraft.category || 'General',
      });
    }
  }, []);

  const clearMessage = () => {
    window.setTimeout(() => {
      setMessage('');
    }, 2500);
  };

  const updateEditor = (
    field: keyof EditorData,
    value: string
  ) => {
    const updated = {
      ...editor,
      [field]: value,
    };

    setEditor(updated);

    try {
      saveActiveDraft({
        ...updated,
        status: 'draft',
      });
    } catch {
      // Ignore localStorage failures.
    }
  };

  const handlePreset = (preset: string) => {
    setSelectedPreset(preset);

    setEditor((previous) => ({
      ...previous,
      category: preset,
    }));
  };

  const generateContent = () => {
    setIsGenerating(true);
    setMessage('');

    window.setTimeout(() => {
      const businessTopic =
        editor.title.trim() ||
        `${selectedPreset} strategy for your business`;

      const generatedTitle =
        editor.title.trim() ||
        `${selectedPreset}: ${businessTopic}`;

      const generatedContent =
        `🚀 ${businessTopic}\n\n` +
        `Looking to grow your business with a smarter ${selectedPreset.toLowerCase()} strategy?\n\n` +
        `Start by focusing on one clear goal, create valuable content for your audience, and give people a simple reason to take action.\n\n` +
        `The key is consistency: educate your audience, build trust, and turn attention into meaningful results.\n\n` +
        `What is your biggest ${selectedPreset.toLowerCase()} challenge right now?`;

      setEditor({
        title: generatedTitle,
        content: generatedContent,
        category: selectedPreset,
      });

      try {
        saveActiveDraft({
          title: generatedTitle,
          content: generatedContent,
          category: selectedPreset,
          status: 'draft',
        });
      } catch {
        // Ignore localStorage failures.
      }

      setIsGenerating(false);
      setMessage('Content generated successfully.');
      clearMessage();
    }, 450);
  };

  const resetEditor = () => {
    setEditor(DEFAULT_EDITOR);
    setEditingId(null);
    setEditingStatus(null);
    setMessage('');

    try {
      saveActiveDraft(null);
    } catch {
      // Ignore storage failures.
    }
  };

  const saveDraft = () => {
    if (!editor.title.trim() && !editor.content.trim()) {
      setMessage('Please add a title or content first.');
      clearMessage();
      return;
    }

    const now = new Date().toISOString();

    const existingDrafts = [...drafts];

    if (editingStatus === 'draft' && editingId) {
      const updatedDrafts = existingDrafts.map((item) =>
        item.id === editingId
          ? {
              ...item,
              title: editor.title.trim(),
              content: editor.content.trim(),
              category: editor.category || 'General',
              status: 'draft' as const,
            }
          : item
      );

      setDrafts(updatedDrafts);
      safeSaveDrafts(updatedDrafts);
    } else {
      const newDraft: Draft = {
        id: createId(),
        title: editor.title.trim(),
        content: editor.content.trim(),
        category: editor.category || 'General',
        status: 'draft',
      };

      const updatedDrafts = [newDraft, ...existingDrafts];

      setDrafts(updatedDrafts);
      safeSaveDrafts(updatedDrafts);
    }

    try {
      saveActiveDraft(null);
    } catch {
      // Ignore storage failures.
    }

    setMessage('Draft saved successfully.');
    clearMessage();

    resetEditor();
  };

  const publishPost = () => {
    if (!editor.title.trim() || !editor.content.trim()) {
      setMessage('Please add both title and content before publishing.');
      clearMessage();
      return;
    }

    const now = new Date().toISOString();

    if (editingStatus === 'published' && editingId) {
      const updatedPosts = posts.map((post) =>
        post.id === editingId
          ? {
              ...post,
              title: editor.title.trim(),
              content: editor.content.trim(),
              category: editor.category || 'General',
              status: 'published' as const,
              updatedAt: now,
            }
          : post
      );

      setPosts(updatedPosts);
      savePosts(updatedPosts);

      setMessage('Published post updated successfully.');
      clearMessage();

      resetEditor();
      return;
    }

    const newPost: Post = {
      id: createId(),
      title: editor.title.trim(),
      content: editor.content.trim(),
      category: editor.category || 'General',
      status: 'published',
      createdAt: now,
      updatedAt: now,
    };

    const updatedPosts = [newPost, ...posts];

    setPosts(updatedPosts);
    savePosts(updatedPosts);

    /*
     * If this post came from an existing draft,
     * remove that draft after publishing.
     */
    if (editingStatus === 'draft' && editingId) {
      const updatedDrafts = drafts.filter(
        (draft) => draft.id !== editingId
      );

      setDrafts(updatedDrafts);
      safeSaveDrafts(updatedDrafts);
    }

    try {
      saveActiveDraft(null);
    } catch {
      // Ignore storage failures.
    }

    setMessage('Post published successfully.');
    clearMessage();

    resetEditor();
  };

  const editPublishedPost = (post: Post) => {
    setEditor({
      title: post.title || '',
      content: post.content || '',
      category: post.category || 'General',
    });

    setEditingId(post.id);
    setEditingStatus('published');

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const editDraft = (draft: Draft) => {
    setEditor({
      title: draft.title || '',
      content: draft.content || '',
      category: draft.category || 'General',
    });

    setEditingId(draft.id ?? null);
    setEditingStatus('draft');

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const deletePublishedPost = (id: string) => {
    const updatedPosts = posts.filter((post) => post.id !== id);

    setPosts(updatedPosts);
    savePosts(updatedPosts);

    if (editingId === id && editingStatus === 'published') {
      resetEditor();
    }

    setMessage('Published post deleted.');
    clearMessage();
  };

  const deleteDraft = (id: string) => {
    const updatedDrafts = drafts.filter(
      (draft) => draft.id !== id
    );

    setDrafts(updatedDrafts);
    safeSaveDrafts(updatedDrafts);

    if (editingId === id && editingStatus === 'draft') {
      resetEditor();
    }

    setMessage('Draft deleted.');
    clearMessage();
  };

  const totalContent = useMemo(
    () => posts.length + drafts.length,
    [posts.length, drafts.length]
  );

  const isEditing = editingId !== null;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">

      {/* HEADER */}

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 md:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600/20 border border-indigo-500/30">
                <Sparkles className="h-6 w-6 text-indigo-400" />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">
                  Content Studio
                </h2>

                <p className="text-sm text-slate-400 mt-1">
                  Create, save, edit and publish your content.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <div className="rounded-lg bg-slate-800 px-3 py-2 text-slate-300">
              <span className="font-semibold text-white">
                {totalContent}
              </span>{' '}
              total
            </div>

            <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-emerald-400">
              <span className="font-semibold">
                {posts.length}
              </span>{' '}
              published
            </div>

            <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-2 text-amber-400">
              <span className="font-semibold">
                {drafts.length}
              </span>{' '}
              drafts
            </div>
          </div>
        </div>
      </div>

      {/* EDITOR */}

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 md:p-6 shadow-xl">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">

          <div>
            <h3 className="text-xl font-bold text-white">
              {isEditing
                ? editingStatus === 'published'
                  ? 'Edit Published Post'
                  : 'Edit Draft'
                : 'Create New Post'}
            </h3>

            <p className="text-sm text-slate-400 mt-1">
              Write your content or use a preset to generate a starting point.
            </p>
          </div>

          {isEditing && (
            <button
              type="button"
              onClick={resetEditor}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Cancel Edit
            </button>
          )}
        </div>

        {/* PRESETS */}

        <div className="mb-6">

          <div className="flex items-center gap-2 mb-3">
            <Wand2 className="w-4 h-4 text-indigo-400" />

            <p className="text-sm font-semibold text-slate-200">
              Content Preset
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {PRESET_TAGS.map((preset) => {
              const active = selectedPreset === preset;

              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handlePreset(preset)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    active
                      ? 'bg-indigo-600 border-indigo-500 text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {preset}
                </button>
              );
            })}
          </div>
        </div>

        {/* TITLE */}

        <div className="space-y-2 mb-5">
          <label
            htmlFor="post-title"
            className="block text-sm font-semibold text-slate-200"
          >
            Post Title
          </label>

          <input
            id="post-title"
            type="text"
            value={editor.title}
            onChange={(event) =>
              updateEditor('title', event.target.value)
            }
            placeholder="Enter your post title..."
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        {/* CONTENT */}

        <div className="space-y-2 mb-5">
          <label
            htmlFor="post-content"
            className="block text-sm font-semibold text-slate-200"
          >
            Post Content
          </label>

          <textarea
            id="post-content"
            value={editor.content}
            onChange={(event) =>
              updateEditor('content', event.target.value)
            }
            placeholder="Write your post content here..."
            rows={9}
            className="w-full resize-y rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />

          <div className="flex justify-between text-xs text-slate-500">
            <span>
              {editor.content.length} characters
            </span>

            <span>
              Saved locally on this device
            </span>
          </div>
        </div>

        {/* CATEGORY */}

        <div className="space-y-2 mb-6">
          <label
            htmlFor="post-category"
            className="block text-sm font-semibold text-slate-200"
          >
            Category
          </label>

          <input
            id="post-category"
            type="text"
            value={editor.category}
            onChange={(event) =>
              updateEditor('category', event.target.value)
            }
            placeholder="Marketing"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        {/* ACTIONS */}

        <div className="flex flex-col sm:flex-row gap-3">

          <button
            type="button"
            onClick={generateContent}
            disabled={isGenerating}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 transition-colors"
          >
            <Sparkles className="w-5 h-5" />

            {isGenerating
              ? 'Generating...'
              : 'AI Generate'}
          </button>

          <button
            type="button"
            onClick={saveDraft}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <Save className="w-5 h-5" />

            {editingStatus === 'draft'
              ? 'Update Draft'
              : 'Save Draft'}
          </button>

          <button
            type="button"
            onClick={publishPost}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-500 transition-colors"
          >
            {editingStatus === 'published' ? (
              <Pencil className="w-5 h-5" />
            ) : (
              <Send className="w-5 h-5" />
            )}

            {editingStatus === 'published'
              ? 'Update Published'
              : 'Publish Post'}
          </button>

          <button
            type="button"
            onClick={resetEditor}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-transparent px-5 py-3 font-semibold text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            Clear
          </button>
        </div>

        {message && (
          <div className="mt-5 rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-4 py-3 text-sm text-indigo-300">
            {message}
          </div>
        )}
      </section>

      {/* DRAFTS */}

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 md:p-6 shadow-xl">

        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20">
            <Clock3 className="w-5 h-5 text-amber-400" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white">
              Draft Posts
            </h3>

            <p className="text-sm text-slate-400">
              Your unfinished content is saved on this device.
            </p>
          </div>
        </div>

        {drafts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/50 p-8 text-center">
            <FileText className="w-10 h-10 text-slate-600 mx-auto mb-3" />

            <p className="text-slate-400">
              No saved drafts yet.
            </p>

            <p className="text-xs text-slate-600 mt-1">
              Create content above and choose Save Draft.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {drafts.map((draft) => (
              <div
                key={draft.id}
                className="rounded-xl border border-slate-800 bg-slate-950 p-4"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="rounded-md bg-amber-500/10 border border-amber-500/20 px-2 py-1 text-xs font-medium text-amber-400">
                        Draft
                      </span>

                      <span className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-400">
                        {draft.category || 'General'}
                      </span>
                    </div>

                    <h4 className="text-lg font-semibold text-white break-words">
                      {draft.title || 'Untitled Draft'}
                    </h4>

                    <p className="mt-2 whitespace-pre-wrap text-sm text-slate-400 line-clamp-4">
                      {draft.content || 'No content yet.'}
                    </p>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => editDraft(draft)}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        draft.id &&
                        deleteDraft(draft.id)
                      }
                      className="inline-flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* PUBLISHED POSTS */}

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 md:p-6 shadow-xl">

        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white">
              Published Posts
            </h3>

            <p className="text-sm text-slate-400">
              Manage your published content.
            </p>
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/50 p-8 text-center">
            <Send className="w-10 h-10 text-slate-600 mx-auto mb-3" />

            <p className="text-slate-400">
              No published posts yet.
            </p>

            <p className="text-xs text-slate-600 mt-1">
              Published posts will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <article
                key={post.id}
                className="rounded-xl border border-slate-800 bg-slate-950 p-4"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                  <div className="min-w-0 flex-1">

                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 text-xs font-medium text-emerald-400">
                        Published
                      </span>

                      <span className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-400">
                        {post.category || 'General'}
                      </span>
                    </div>

                    <h4 className="text-lg font-semibold text-white break-words">
                      {post.title || 'Untitled Post'}
                    </h4>

                    <p className="mt-2 whitespace-pre-wrap text-sm text-slate-400">
                      {post.content || 'No content.'}
                    </p>

                    <p className="mt-3 text-xs text-slate-600">
                      Updated: {formatDate(post.updatedAt)}
                    </p>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        editPublishedPost(post)
                      }
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        deletePublishedPost(post.id)
                      }
                      className="inline-flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* STORAGE NOTE */}

      <div className="pb-6 text-center">
        <p className="text-xs text-slate-600">
          MarketMate stores your posts and drafts locally on this device.
          No external API is required for this editor.
        </p>
      </div>
    </div>
  );
};

export default PostsManager;