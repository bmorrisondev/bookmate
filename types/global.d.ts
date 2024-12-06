export {}

// Create a type for the roles
export type Roles = 'admin' | 'moderator'

declare global {
  interface UserPublicMetadata {
    additionalScopes?: string[]
  }

  interface CustomJwtSessionClaims {
    metadata: {
      additionalScopes?: string[]
    }
  }
}