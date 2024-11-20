import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container mx-auto flex min-h-[50vh] flex-col items-center justify-center py-10">
      <div className="text-center">
        <h2 className="mb-2 text-2xl font-bold">User not found</h2>
        <p className="mb-6 text-gray-600">
          The user you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Link
          href="/"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}
