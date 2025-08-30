"use client";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import useSWR, { mutate } from "swr";


const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function ViewFeed() {
  const { data, error } = useSWR("/api/viewfeed", fetcher, {
    revalidateOnFocus: true, // jab user tab pe wapas aata h
    dedupingInterval: 5000, // 5 sec tak ek hi fetch reuse karega
  });

  const [message, setMessage] = useState({});

  if (error) return <p className="text-center text-red-500">Error loading blogs ❌</p>;
  if (!data) return <p className="text-center animate-pulse">Loading blogs...</p>;

  const blogs = data?.allBlogs || [];


  async function handleLike(id) {
    try {
      const res = await axios.post(`/api/blogs/${id}/like`);
      if (res.data.success) {
        setMessage((prev) => ({ ...prev, [id]: "Liked" }));

        // Optimistic update for instant UI
        mutate(
          "/api/viewfeed",
          {
            ...data,
            allBlogs: blogs.map((blog) =>
              blog._id === id
                ? {
                    ...blog,
                    likes: res.data.blog.likes,
                    dislikes: res.data.blog.dislikes,
                  }
                : blog
            ),
          },
          false
        );
      }
    } catch (err) {
      console.error("Error updating likes:", err);
    }
  }

  // ✅ Dislike
  async function handleDisLike(id) {
    try {
      const res = await axios.post(`/api/blogs/${id}/dislike`);
      if (res.data.success) {
        setMessage((prev) => ({ ...prev, [id]: "Disliked" }));

        mutate(
          "/api/viewfeed",
          {
            ...data,
            allBlogs: blogs.map((blog) =>
              blog._id === id
                ? {
                    ...blog,
                    likes: res.data.blog.likes,
                    dislikes: res.data.blog.dislikes,
                  }
                : blog
            ),
          },
          false
        );
      }
    } catch (err) {
      console.error("Error updating dislikes:", err);
    }
  }

  // ✅ Views
  async function handleView(id) {
    try {
      await axios.post(`/api/blogs/${id}/incre`);

      mutate(
        "/api/viewfeed",
        {
          ...data,
          allBlogs: blogs.map((blog) =>
            blog._id === id ? { ...blog, views: (blog.views ?? 0) + 1 } : blog
          ),
        },
        false
      );
    } catch (err) {
      console.error("Error updating views:", err);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 py-12 px-6">
      {/* Back to Home */}
      <div className="text-center mb-12">
        <Link
          href={"/"}
          className="inline-block bg-white/70 backdrop-blur-lg border border-gray-300 text-gray-800 font-medium px-6 py-3 rounded-xl shadow-lg hover:bg-white hover:shadow-xl transition duration-300"
        >
          ⬅ Back to Home
        </Link>
      </div>

      {/* Blogs Grid */}
      <div className="max-w-6xl mx-auto">
        {blogs.length === 0 ? (
          <p className="text-center text-xl font-medium text-gray-500 animate-pulse">
            No blogs found 😢
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog, index) => (
              <div
                key={blog._id}
                className="relative bg-white/70 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-md p-6 hover:shadow-2xl hover:-translate-y-2 transition transform duration-500"
                style={{ animation: `fadeIn 0.6s ease ${index * 0.2}s forwards` }}
              >
                {/* Blog Title */}
                <h3 className="text-2xl font-bold text-gray-800 mb-3 hover:text-blue-600 transition">
                  {blog.title}
                </h3>

                {/* Blog Content */}
                <p className="text-gray-600 text-sm leading-relaxed mb-5">
                  {blog.content.length > 150
                    ? blog.content.slice(0, 150) + "..."
                    : blog.content}
                </p>

                {/* Read More + Views */}
                <div className="flex justify-between items-center mb-4">
                  <Link href={`/read/${blog._id}/feedback`}>
                    <button
                      onClick={() => handleView(blog._id)}
                      className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition cursor-pointer"
                    >
                      Read More →
                    </button>
                  </Link>
                  <span className="text-xs text-gray-500">
                    👁 {blog.views ?? 0}
                  </span>
                </div>

                {/* Like / Dislike */}
                <div className="flex justify-start gap-6">
                  <button
                    onClick={() => handleLike(blog._id)}
                    className="cursor-pointer flex items-center gap-2 text-gray-700 hover:text-green-600 transition transform hover:scale-110"
                  >
                    👍 <span>{blog.likes ?? 0}</span>
                  </button>

                  <button
                    onClick={() => handleDisLike(blog._id)}
                    className="cursor-pointer flex items-center gap-2 text-gray-700 hover:text-red-600 transition transform hover:scale-110"
                  >
                    👎 <span>{blog.dislikes ?? 0}</span>
                  </button>
                </div>

                {/* ✅ Like/Dislike Message */}
                <div className="flex gap-8">
                  {message[blog._id] && (
                    <p
                      className={`text-sm mt-2 ${
                        message[blog._id].includes("Liked")
                          ? "text-green-600"
                          : "mx-14 text-red-500"
                      }`}
                    >
                      {message[blog._id]}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
