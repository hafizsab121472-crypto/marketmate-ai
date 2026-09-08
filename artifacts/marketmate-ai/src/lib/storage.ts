import type { Draft, Post, Profile } from '../types';

const STORAGE_KEYS = {
  posts: 'marketmate-posts',
  activeDraft: 'marketmate-active-draft',
  profile: 'marketmate-profile',
} as const;

function read<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // The app remains usable when browser storage is unavailable.
  }
}

export function loadPosts(): Post[] {
  return read<Post[]>(STORAGE_KEYS.posts, []);
}

export function savePosts(posts: Post[]): Post[] {
  write(STORAGE_KEYS.posts, posts);
  return posts;
}

export function loadActiveDraft(): Draft | null {
  return read<Draft | null>(STORAGE_KEYS.activeDraft, null);
}

export function saveActiveDraft(draft: Draft | null): Draft | null {
  if (draft === null) {
    try {
      localStorage.removeItem(STORAGE_KEYS.activeDraft);
    } catch {
      // Ignore storage failures; the in-memory editor still works.
    }
  } else {
    write(STORAGE_KEYS.activeDraft, draft);
  }
  return draft;
}

export function saveProfile(profile: Profile): Profile {
  write(STORAGE_KEYS.profile, profile);
  return profile;
}