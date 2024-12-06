'use server'
import { auth, clerkClient } from "@clerk/nextjs/server"

export async function getGoogleToken() {
  const { userId } = await auth()

  if(!userId) {
    return null
  }  
  const client = await clerkClient()
  const token = await client.users.getUserOauthAccessToken(
    userId || '',
    'oauth_google'
  )

  return {
    token: token?.data[0]?.token ?? null
  }
}