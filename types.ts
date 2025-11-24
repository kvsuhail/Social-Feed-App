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
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  text: string;
  timestamp: Date;
}

export interface Post {
  id: string;
  userId: string;
  user: User;
  imageUrl: string;
  caption: string;
  likes: number;
  comments: Comment[];
  timestamp: Date;
  isLikedByCurrentUser: boolean;
}

export interface Story {
  id: string;
  userId: string;
  user: User;
  imageUrl: string;
  isViewed: boolean;
}
