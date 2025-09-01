import React from "react";
import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import Link from "next/link";
import Summarize from "./Summarize";

export default async function ReadBlog({ params, searchParams }) {
  const id = (await params).id;
  const categoryFromURL = (await searchParams).category || "";

  await connectDB();
  const blog = await Blog.findById(id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-blue-100 py-12 px-5">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Blog Section */}
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
            {blog.title}
          </h1>

          <p className="text-gray-700 whitespace-pre-line leading-relaxed mb-8">
            {blog.content}
          </p>

          <div className="flex justify-end">
            <Link
              href={`/feed?category=${categoryFromURL}`}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-2 rounded-lg shadow-md transition"
            >
              Back
            </Link>
          </div>
        </div>

        {/* Summary Section */}
        <Summarize content={blog.content} />

      </div>
    </div>
  );
}
