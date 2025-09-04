"use client";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { useState, useEffect } from "react";
import useSWR, { mutate } from "swr";

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function ViewFeed() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || ""; 

  const { data, error } = useSWR("/api/viewfeed", fetcher, {
    revalidateOnFocus: true,
    dedupingInterval: 5000,
  });

  const [message, setMessage] = useState({})
  const showReset = category !== "";

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
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <p className="text-xl font-medium text-gray-800">Error loading blogs</p>
          <p className="text-gray-600 mt-2">Please try again later</p>
        </div>
      </div>
    );
    
  if (!data)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Loading blogs...</p>
        </div>
      </div>
    );

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
        
        // Clear message after 2 seconds
        setTimeout(() => {
          setMessage(prev => {
            const newMsg = {...prev};
            delete newMsg[id];
            return newMsg;
          });
        }, 2000);
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
        
        // Clear message after 2 seconds
        setTimeout(() => {
          setMessage(prev => {
            const newMsg = {...prev};
            delete newMsg[id];
            return newMsg;
          });
        }, 2000);
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

      if (categoryData) {
        mutateCategory((current) => ({
          ...current,
          blogs: current.blogs.map(blog =>
            blog._id === id ? { ...blog, views: (blog.views ?? 0) + 1 } : blog
          )
        }), false);
      }
    } catch (err) {
      console.error("Error updating views:", err);
    }
  }

  // ---------- Blog Card ----------
  const BlogCard = ({ blog, index }) => (
    <div
      key={blog._id}
      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full"
    >
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
          {blog.title}
        </h3>
        
        <p className="text-gray-600 mb-4 flex-1 line-clamp-3">
          {blog.content.length > 150 ? blog.content.slice(0, 150) + "..." : blog.content}
        </p>
        
        <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            {blog.views ?? 0}
          </span>
          
          {blog.category && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {blog.category}
            </span>
          )}
        </div>
        
        <div className="mt-auto">
          <div className="flex justify-between items-center mb-4">
            <Link href={`/read/${blog._id}/feedback?category=${category}`}>
              <button
                onClick={() => handleView(blog._id)}
                className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors group"
              >
                Read More
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </Link>
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <button 
              onClick={() => handleLike(blog._id)}
              className="flex items-center text-gray-600 hover:text-green-600 transition-colors group"
            >
              <svg className="w-5 h-5 mr-1 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
              <span className="font-medium">{blog.likes ?? 0}</span>
            </button>
            
            <button 
              onClick={() => handleDisLike(blog._id)}
              className="flex items-center text-gray-600 hover:text-red-600 transition-colors group"
            >
              <svg className="w-5 h-5 mr-1 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
              </svg>
              <span className="font-medium">{blog.dislikes ?? 0}</span>
            </button>
          </div>
          
          {message[blog._id] && (
            <div className={`mt-3 text-sm font-medium text-center py-1 rounded-lg ${
              message[blog._id] === "Liked" 
                ? "bg-green-100 text-green-700" 
                : "bg-red-100 text-red-700"
            }`}>
              {message[blog._id]}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  function handleReset() {
    router.push("/feed");
  }

  const displayedBlogs = category ? categoryBlogs : blogs;
  const reversedBlogs = displayedBlogs.slice().reverse();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Link
            href={"/"}
            className="inline-flex items-center bg-white text-gray-800 font-medium px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 hover:bg-gray-50 border border-gray-200"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Home
          </Link>
          
          <h1 className="text-4xl font-bold text-gray-800 mt-8 mb-4">
            {category ? `${category} Blogs` : 'All Blogs'}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover amazing content {category ? `in ${category}` : 'across all categories'}
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-10 bg-white rounded-xl shadow-md p-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <label htmlFor="category" className="text-gray-700 font-medium min-w-max">
              Filter by Category:
            </label>
            
            <div className="flex-1 flex gap-3">
              <select
                id="category"
                value={category}
                onChange={handleCategoryChange}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">All Categories</option>
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
                  className="px-4 py-3 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition-colors flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Blog Grid */}
        {reversedBlogs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <div className="text-6xl mb-4">😢</div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">No blogs found</h3>
            <p className="text-gray-600">
              {category 
                ? `There are no blogs in the ${category} category yet.` 
                : 'There are no blogs available at the moment.'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reversedBlogs.map((blog, index) => (
              <BlogCard blog={blog} index={index} key={blog._id} />
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}