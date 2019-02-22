/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ArticleState } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: ArticleDetail
// ====================================================

export interface ArticleDetail_article_author_info {
  __typename: "UserInfo";
  /**
   * User desciption
   */
  description: string | null;
}

export interface ArticleDetail_article_author {
  __typename: "User";
  id: string;
  userName: string;
  /**
   * Display name on profile
   */
  displayName: string;
  info: ArticleDetail_article_author_info;
  /**
   * URL for avatar
   */
  avatar: any | null;
  /**
   * This user is following viewer
   */
  isFollower: boolean;
  /**
   * Viewer is following this user
   */
  isFollowee: boolean;
}

export interface ArticleDetail_article_tags {
  __typename: "Tag";
  id: string;
  content: string;
}

export interface ArticleDetail_article_appreciators_edges_node {
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

export interface ArticleDetail_article_appreciators_edges {
  __typename: "UserEdge";
  cursor: string;
  node: ArticleDetail_article_appreciators_edges_node;
}

export interface ArticleDetail_article_appreciators {
  __typename: "UserConnection";
  totalCount: number;
  edges: ArticleDetail_article_appreciators_edges[] | null;
}

export interface ArticleDetail_article_comments {
  __typename: "CommentConnection";
  totalCount: number;
}

export interface ArticleDetail_article {
  __typename: "Article";
  id: string;
  title: string;
  state: ArticleState;
  public: boolean;
  live: boolean;
  createdAt: any;
  author: ArticleDetail_article_author;
  /**
   * Viewer has subscribed
   */
  subscribed: boolean;
  content: string;
  tags: ArticleDetail_article_tags[] | null;
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
  appreciators: ArticleDetail_article_appreciators;
  comments: ArticleDetail_article_comments;
}

export interface ArticleDetail {
  article: ArticleDetail_article | null;
}

export interface ArticleDetailVariables {
  mediaHash: string;
}
