import { clerkClient } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

interface Props {
  params: {
    username: string;
  };
}

async function getUser(username: string) {
  try {
    const client = await clerkClient()
    const res = await client.users.getUserList({
      username: [username],
    });

    return res?.data[0] || null;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export default async function UserProfilePage({ params }: Props) {
  const user = await getUser((await params).username);

  if (!user) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10">
      <div className="rounded-lg border p-6">
        <div className="flex items-center gap-4">
          <img
            src={user.imageUrl}
            alt={`${user.username}'s profile picture`}
            className="h-16 w-16 rounded-full"
          />
          <div>
            <h1 className="text-2xl font-bold">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-gray-600">@{user.username}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
