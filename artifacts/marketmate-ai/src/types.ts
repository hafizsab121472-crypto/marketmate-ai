export interface Profile {
  id: string;
  name: string;
  email: string;
  companyName: string;
  bio: string;
  website: string;
  phone: string;
  avatarUrl?: string;
  updatedAt: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  price?: number;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

export type Draft = Omit<Post, 'id' | 'createdAt' | 'updatedAt'> & {
  id?: string;
};
