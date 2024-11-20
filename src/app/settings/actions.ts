'use server'
import { auth, clerkClient } from "@clerk/nextjs/server"

export async function getGoogleToken() {
  const { userId } = await auth()

  const client = await clerkClient()
  const token = await client.users.getUserOauthAccessToken(
    userId || '',
    'oauth_google'
  )

  console.log(token.data[0])
  return {
    token: token.data[0].token
  }
}