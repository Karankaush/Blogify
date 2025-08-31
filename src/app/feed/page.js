"use client";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { useState, useEffect } from "react";
import useSWR, { mutate } from "swr";

const fetcher = (url) => axios.get(url).then((res) => res.data);

export const dynamic = "force-dynamic";
export default function ViewFeed() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || ""; 

  const { data, error } = useSWR("/api/viewfeed", fetcher, {
    revalidateOnFocus: true,
    dedupingInterval: 5000,
  });

 
 const [message, setMessage] = useState({})

const showReset = category !== "";// show categoryBlogs if category is selected


  const { data: categoryData, mutate: mutateCategory } = useSWR(
  category ? `/api/category?category=${category}` : null,
  fetcher,
  {
    revalidateOnFocus: true,
    dedupingInterval: 5000,
  }
);

 const categoryBlogs = categoryData?.blogs || [];






  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (value) {
      router.push(`/feed?category=${value}`);
    } else {
      router.push("/feed"); 
    }
  };

  if (error)
    return <p className="text-center text-red-500">Error loading blogs ❌</p>;
  if (!data)
    return <p className="text-center animate-pulse">Loading blogs...</p>;

  const blogs = data?.allBlogs || [];







  // ---------- LIKE ----------
  async function handleLike(id) {
  try {
    const res = await axios.post(`/api/blogs/${id}/like`);
    if (res.data.success) {
      setMessage((prev) => ({ ...prev, [id]: "Liked" }));

      mutate("/api/viewfeed", (current) => ({
        ...current,
        allBlogs: current.allBlogs.map(blog =>
          blog._id === id
            ? { ...blog, likes: res.data.blog.likes, dislikes: res.data.blog.dislikes }
            : blog
        )
      }), false);

      // category-specific feed
      if (category) {
        mutateCategory((current) => ({
          ...current,
          blogs: current.blogs.map(blog =>
            blog._id === id
              ? { ...blog, likes: res.data.blog.likes, dislikes: res.data.blog.dislikes }
              : blog
          )
        }), false);
      }
    }
  } catch (err) {
    console.error(err);
  }
}





  // ---------- DISLIKE ----------
  async function handleDisLike(id) {
    try {
      const res = await axios.post(`/api/blogs/${id}/dislike`);
      if (res.data.success) {
        setMessage((prev) => ({ ...prev, [id]: "Disliked" }));

       mutate("/api/viewfeed", (current) => ({
        ...current,
        allBlogs: current.allBlogs.map(blog =>
          blog._id === id
            ? { ...blog, likes: res.data.blog.likes, dislikes: res.data.blog.dislikes }
            : blog
        )
      }), false);

       if (category) {
        mutateCategory((current) => ({
          ...current,
          blogs: current.blogs.map(blog =>
            blog._id === id
              ? { ...blog, likes: res.data.blog.likes, dislikes: res.data.blog.dislikes }
              : blog
          )
        }), false);
      }
      }
    } catch (err) {
      console.error("Error updating dislikes:", err);
    }
  }





  // ---------- VIEW ----------
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

      setCategoryBlogs((prev) =>
        prev.map((blog) =>
          blog._id === id ? { ...blog, views: (blog.views ?? 0) + 1 } : blog
        )
      );
    } catch (err) {
      console.error("Error updating views:", err);
    }
  }






  // ---------- Blog Card ----------
  const BlogCard = ({ blog, index }) => (
    <div
      key={blog._id}
      className="relative bg-white/70 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-md p-6 hover:shadow-2xl hover:-translate-y-2 transition transform duration-500"
      style={{ animation: `fadeIn 0.6s ease ${index * 0.1}s forwards` }}
    >
      <h3 className="text-2xl font-bold text-gray-800 mb-3 hover:text-blue-600 transition">
        {blog.title}
      </h3>
      <p className="text-gray-600 text-sm leading-relaxed mb-5">
        {blog.content.length > 150 ? blog.content.slice(0, 150) + "..." : blog.content}
      </p>
      <div className="flex justify-between items-center mb-4">
        <Link href={`/read/${blog._id}/feedback?category=${category}`}>
          <button
            onClick={() => handleView(blog._id)}
            className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition cursor-pointer"
          >
            Read More →
          </button>
        </Link>
        <span className="text-xs text-gray-500">👁 {blog.views ?? 0}</span>
      </div>
      <div className="flex justify-start gap-6 ">
        <button className="cursor-pointer" onClick={() => handleLike(blog._id)}>
          👍 {blog.likes ?? 0}
        </button>
        <button className="cursor-pointer" onClick={() => handleDisLike(blog._id)}>
          👎 {blog.dislikes ?? 0}
        </button>
      </div>

      <div className="flex-gap-8">
        {message[blog._id] && (
          <p className={`text-sm mt-2 ${message[blog._id].includes("Liked")
            ? "text-green-600" : "mx-14 text-red-500"}`}
          >
            {message[blog._id]}
          </p>
        )}
      </div>
      

    </div>
  );


function handleReset() {
    router.push("/feed");
  }








  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 py-12 px-6">
     
      <div className="text-center mb-12">
        <Link
          href={"/"}
          className="inline-block bg-white/70 backdrop-blur-lg border border-gray-300 text-gray-800 font-medium px-6 py-3 rounded-xl shadow-lg hover:bg-white hover:shadow-xl transition duration-300"
        >
          ⬅ Back to Home
        </Link>
      </div>


      <div className="mb-5 flex items-center gap-3">
        <div className="flex items-center flex-1 border border-gray-300 rounded-lg overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition">
          <select
            id="category"
            value={category}
            onChange={handleCategoryChange}
            className="flex-1 px-4 py-3 text-gray-800 focus:outline-none"
          >
            <option value="">Select Category</option>
            <option value="Science">Science</option>
            <option value="Technology">Technology</option>
            <option value="Sport">Sport</option>
            <option value="Health">Health</option>
            <option value="Travel">Travel</option>
            <option value="Food">Food</option>
            <option value="Education">Education</option>
            <option value="Business">Business</option>
            <option value="Psychology">Psychology</option>
            <option value="Politics">Politics</option>
            <option value="Others">Others</option>
          </select>

          {showReset && (
          <button
          
            onClick={handleReset}
            className="cursor-pointer px-4 py-3 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
          >
            Reset
          </button>
        )}
          
        </div>
      </div>






      <div className="max-w-6xl mx-auto">
        {category
          ? categoryBlogs.length === 0
            ? (
              <p className="text-center text-xl font-medium text-gray-500 animate-pulse">
                No blogs found 😢
              </p>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {categoryBlogs.map((blog, index) => (
                  <BlogCard blog={blog} index={index} key={blog._id} />
                ))}
              </div>
            )
          : blogs.length === 0
            ? (
              <p className="text-center text-xl font-medium text-gray-500 animate-pulse">
                No blogs found 😢
              </p>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {blogs.map((blog, index) => (
                  <BlogCard blog={blog} index={index} key={blog._id} />
                ))}
              </div>
            )}
      </div>
    </div>
  );
}
