import { Profile, Post, Draft } from '../types';

const PROFILE_KEY = 'marketmate-profile';
const POSTS_KEY = 'marketmate-posts';
const ACTIVE_DRAFT_KEY = 'marketmate-active-draft';

const defaultProfile: Profile = {
  id: 'user-default',
  name: 'MarketMate User',
  email: 'user@marketmate.ai',
  companyName: 'My Business',
  bio: 'Welcome to my business profile on MarketMate!',
  website: '',
  phone: '',
  updatedAt: new Date().toISOString(),
};

export const loadProfile = (): Profile => {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : defaultProfile;
  } catch (err) {
    console.error('Error reading profile from localStorage:', err);
    return defaultProfile;
  }
};

export const saveProfile = (nextProfile: Profile): Profile => {
  try {
    const updated = { ...nextProfile, updatedAt: new Date().toISOString() };
    localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save profile:', err);
    return nextProfile;
  }
};

export const loadPosts = (): Post[] => {
  try {
    const raw = localStorage.getItem(POSTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Error reading posts:', err);
    return [];
  }
};

export const savePosts = (posts: Post[]): void => {
  try {
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  } catch (err) {
    console.error('Failed to save posts:', err);
  }
};

export const loadActiveDraft = (): Draft | null => {
  try {
    const raw = localStorage.getItem(ACTIVE_DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const saveActiveDraft = (draft: Draft | null): void => {
  try {
    if (draft) {
      localStorage.setItem(ACTIVE_DRAFT_KEY, JSON.stringify(draft));
    } else {
      localStorage.removeItem(ACTIVE_DRAFT_KEY);
    }
  } catch (err) {
    console.error('Failed to update draft state:', err);
  }
};
