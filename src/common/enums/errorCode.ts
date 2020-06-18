export type ErrorCodeKeys = keyof typeof ERROR_CODES

export const ERROR_CODES = {
  // Common
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  BAD_USER_INPUT: 'BAD_USER_INPUT',

  ACTION_LIMIT_EXCEEDED: 'ACTION_LIMIT_EXCEEDED',
  ACTION_FAILED: 'ACTION_FAILED',

  UNABLE_TO_UPLOAD_FROM_URL: 'UNABLE_TO_UPLOAD_FROM_URL',

  // Auth
  UNAUTHENTICATED: 'UNAUTHENTICATED',
  FORBIDDEN: 'FORBIDDEN',
  TOKEN_INVALID: 'TOKEN_INVALID',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',

  // Entity
  ENTITY_NOT_FOUND: 'ENTITY_NOT_FOUND',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  ARTICLE_NOT_FOUND: 'ARTICLE_NOT_FOUND',
  COMMENT_NOT_FOUND: 'COMMENT_NOT_FOUND',
  DRAFT_NOT_FOUND: 'DRAFT_NOT_FOUND',
  // AUDIO_DRAFT_NOT_FOUND: 'AUDIO_DRAFT_NOT_FOUND',
  TAG_NOT_FOUND: 'TAG_NOT_FOUND',
  NOTICE_NOT_FOUND: 'NOTICE_NOT_FOUND',
  ASSET_NOT_FOUND: 'ASSET_NOT_FOUND',

  // Article
  NOT_ENOUGH_MAT: 'NOT_ENOUGH_MAT',

  // User
  USER_EMAIL_INVALID: 'USER_EMAIL_INVALID',
  USER_EMAIL_EXISTS: 'USER_EMAIL_EXISTS',
  USER_EMAIL_NOT_FOUND: 'USER_EMAIL_NOT_FOUND',
  USER_PASSWORD_INVALID: 'USER_PASSWORD_INVALID',
  USER_USERNAME_INVALID: 'USER_USERNAME_INVALID',
  USER_USERNAME_EXISTS: 'USER_USERNAME_EXISTS',
  USER_DISPLAYNAME_INVALID: 'USER_DISPLAYNAME_INVALID',

  // TAG
  DUPLICATE_TAG: 'DUPLICATE_TAG',

  // Verification Code
  CODE_INVALID: 'CODE_INVALID',
  CODE_EXPIRED: 'CODE_EXPIRED',

  // GQL
  QUERY_FIELD_NOT_FOUND: 'QUERY_FIELD_NOT_FOUND',

  // LikeCoin
  LIKER_NOT_FOUND: 'LIKER_NOT_FOUND',
  LIKER_EMAIL_EXISTS: 'LIKER_EMAIL_EXISTS',
  LIKER_USER_ID_EXISTS: 'LIKER_USER_ID_EXISTS',

  // OAuth
  OAUTH_TOKEN_INVALID: 'OAUTH_TOKEN_INVALID',

  // Migration
  MIGRATION_REACH_LIMIT: 'MIGRATION_REACH_LIMIT',

  // Payment
  PAYMENT_AMOUNT_TOO_SMALL: 'PAYMENT_AMOUNT_TOO_SMALL',
  PAYMENT_AMOUNT_INVALID: 'PAYMENT_AMOUNT_INVALID',
  PAYMENT_PASSWORD_NOT_SET: 'PAYMENT_PASSWORD_NOT_SET',
  PAYMENT_PAYOUT_TRANSACTION_EXISTS: 'PAYMENT_PAYOUT_TRANSACTION_EXISTS',
  PAYMENT_REACH_MAXIMUM_LIMIT: 'PAYMENT_REACH_MAXIMUM_LIMIT',
}
