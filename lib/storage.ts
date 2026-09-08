import { Profile, Post, Draft } from './types';





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
    console.error('Error loading profile:', err);
    return defaultProfile;
  }
};

export const saveProfile = (profile: Profile): void => {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error('Error saving profile:', err);
  }
};

export const getSafeStorage = <T>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

export const setSafeStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage error:', e);
  }
};
