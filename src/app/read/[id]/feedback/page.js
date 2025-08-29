import React from "react";
import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import Link from "next/link";



export default async function ReadBlog({ params }) {
  const id = ((await params).id);

  await connectDB();
  const blog = await Blog.findById(id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-blue-100 py-10 px-5">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6">
          {blog.title}
        </h1>

        <p className="text-gray-700 whitespace-pre-line leading-relaxed mb-8">
          {blog.content}
        </p>

        <div className="flex justify-end gap-4">
          <Link
            href={`/edit/${id}`}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg shadow-md transition"
          >
            Edit
          </Link>

          
         

          <Link
            href="/feed"
            className="bg-blue-500 hover:bg-blue-600 text-black px-6 py-2 rounded-lg shadow-md transition"
          >
            Back
          </Link>
        </div>

        

      </div>

     
    </div>
  );
}
