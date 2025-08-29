'use client'
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MyBlogs() {
  const [blogs, setBlogs] = useState([]);


  //   async function handleView(id){
  //   try {
  //     const res = await axios.post(`/api/blogs/${id}/incre`);
     
      
  //   } catch (err) {
  //     console.error("Error updating views:", err);
  //   }
  // };


  useEffect(() => {
    const fetchBlogs = async () => {
      const res = await axios.get("/api/view");
      if (res.data.success) {
        setBlogs(res.data.blogs);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-blue-100 py-10 px-5">
      <div className="max-w-5xl mx-auto">
        
        <h2 className="text-4xl font-extrabold text-gray-800 text-center mb-8 drop-shadow-sm">
          ✍️ My Blogs
        </h2>

        
        {blogs.length === 0 ? (
          <p className="text-center text-lg text-gray-500">No blogs found.</p>
        ) : (
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
                    <button  className=" cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800 transition">
                      Read More →
                    </button>
                  </Link>
                  <span className="text-xs text-gray-400">
                    Views: {blog.views ?? 0}
                  </span>
                  
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
