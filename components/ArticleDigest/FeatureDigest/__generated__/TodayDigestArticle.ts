/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: TodayDigestArticle
// ====================================================

export interface TodayDigestArticle_author {
  __typename: "User";
  id: string;
  userName: string;
  /**
   * Display name on profile
   */
  displayName: string;
  /**
   * URL for avatar
   */
  avatar: any | null;
}

export interface TodayDigestArticle_comments {
  __typename: "CommentConnection";
  totalCount: number;
}

export interface TodayDigestArticle {
  __typename: "Article";
  id: string;
  title: string;
  slug: string;
  cover: any | null;
  summary: string;
  mediaHash: string | null;
  author: TodayDigestArticle_author;
  createdAt: any;
  /**
   * MAT recieved for this article
   */
  MAT: number;
  /**
   * Viewer has appreciate
   */
  hasAppreciate: boolean;
  /**
   * limit the nuhmber of appreciate per user
   */
  appreciateLimit: number;
  appreciateLeft: number;
  comments: TodayDigestArticle_comments;
  /**
   * Viewer has subscribed
   */
  subscribed: boolean;
}
