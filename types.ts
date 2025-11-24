export enum UserLabel {
  DEVELOPER = 'Developer',
  MUSICIAN = 'Musician',
  ACTOR = 'Actor',
  ARTIST = 'Artist',
  ENTREPRENEUR = 'Entrepreneur',
  EVERYONE = 'Everyone'
}

export interface User {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  label: UserLabel;
  followers: number;
  following: number;
  bio?: string;
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  avatarUrl: string;
  text: string;
  timestamp: Date;
}

export type MediaType = 'image' | 'video';

export interface Post {
  id: string;
  userId: string;
  user: User;
  imageUrl: string; // Used for both image source and video source URL
  mediaType: MediaType;
  caption: string;
  likes: number;
  comments: Comment[];
  timestamp: Date;
  isLikedByCurrentUser: boolean;
  isSaved: boolean;
}

export interface Story {
  id: string;
  userId: string;
  user: User;
  imageUrl: string;
  isViewed: boolean;
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow';
  user: User;
  postId?: string;
  previewImage?: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
}
