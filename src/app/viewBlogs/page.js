'use client'
import useSWR from "swr";
import axios from "axios";
import Link from "next/link";
import { useSession } from "next-auth/react";

const fetcher = (url) => axios.get(url).then(res => res.data);

export default function MyBlogs() {
  const { data: session } = useSession();

  
  const { data, error } = useSWR(session?.user?.id ? "/api/view" : null,fetcher,{ 
      revalidateOnFocus: true,
      dedupingInterval: 0 
    }
  );

  const blogs = (data?.success) ? (data.blogs) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-blue-100 py-10 px-5">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-extrabold text-gray-800 text-center mb-8 drop-shadow-sm">
          ✍️ My Blogs
        </h2>

        {error && <p className="text-center text-red-500">Failed to load blogs.</p>}
        {!data && !error && <p className="text-center text-gray-500">Loading...</p>}

        {blogs.length === 0 && data?.success && (
          <p className="text-center text-lg text-gray-500">No blogs found.</p>
        )}

        {blogs.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="group border border-gray-200 rounded-xl bg-white p-6 shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <h3 className="text-2xl font-semibold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  {blog.title}
                </h3>

                <p className="text-gray-600 text-sm leading-relaxed">
                  {blog.content.length > 150
                    ? blog.content.slice(0, 150) + "..."
                    : blog.content}
                </p>

                <div className="mt-4 flex justify-between items-center">
                  <Link href={`/read/${blog._id}`}>
                    <button className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800 transition">
                      Read More →
                    </button>
                  </Link>
                  <span className="text-xs text-gray-400">
                    Views: {blog.views ?? 0}
                  </span>
                </div>

                <div className="mt-4 flex gap-6">
                  <form>
                    <button type="submit" className="cursor-pointer">
                      👍 {blog.likes}
                    </button>
                  </form>
                  <form>
                    <button type="submit" className="cursor-pointer">
                      👎 {blog.disLikes}
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
