import { clerkClient } from "@clerk/nextjs/server"

export async function getUserIdFromUsername(username: string) {
  const client = await clerkClient()
  const res = await client.users.getUserList({
    username: [username],
  })

  const user = res.data[0]
  if (!user) {
    return null
  }

  return user.id
}
