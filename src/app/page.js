'use client'
import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import MyBlogs from "./viewBlogs/page";
import { useSession, signOut } from "next-auth/react";
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"

export default function Home() {
  
  const { data: session, status } = useSession();
  const router = useRouter();

  const[error, setError] = useState('')
  const [loading, setLoading] = useState(false);
  const [geminiError, setGeminiError] = useState("");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    title: "",
    content: "",
    generatedByAI: false    
  });

 const id = session?.user?.id;
 console.log(id)

async function handleAiSuggest() {
  if (loading) return;
  if (!form.title.trim()) {
     toast.error("Please Enter a Title") ;
    return;
  }

  setLoading(true)
  try {
    const res = await axios.post("/api/ai/suggest", { title: form.title });
    if (res.data.success) {
      setLoading(false)
      const aiText = res.data.suggestedContent || "";
      setForm(prev => ({
        ...prev,
        content: aiText,       
        generatedByAI: true    
      }));
    }
  } catch (err) {
    setLoading(false)
    toast.error(" API limit reached.") ;
  }
}

  async function handleCreateBlog(e) {
    e.preventDefault();
    try {
      const res = await axios.post("/api/blogs", form);
      if (res.data.success) {
        setMessage(res.data.message);
          
        setForm({
          title: "",
          content: "",
          category : ""
        });
      }
      window.location.reload();

    } catch (err) {
       if (err.response) {
      setError(err.response.data.message);
    } else {
      setError("Something went wrong ❌");
    }
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header Section */}
          <div className="text-center mb-14">
            <h1 className="text-5xl font-bold  mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome to Blogify
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Create, share, and discover amazing content with our intuitive blogging platform
            </p>
          </div>

          {/* Blog Creation Form */}
          <div className="flex flex-col lg:flex-row gap-10 mb-16">
            <div className="w-full lg:w-2/3">
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="flex flex-col sm:flex-row justify-between items-start mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">
                    Create a New Blog Post
                  </h3>
                  
                  <Popover>
                    <PopoverTrigger className="px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Important Note
                    </PopoverTrigger>
                    <PopoverContent className="p-4 bg-white rounded-lg shadow-xl border border-gray-200 text-sm w-64">
                      API requests are currently limited. Use AI suggestions wisely.
                    </PopoverContent>
                  </Popover>
                </div>

                <form onSubmit={handleCreateBlog}>
                  <div className="mb-6">
                    <label className="block text-lg font-semibold text-gray-800 mb-2" htmlFor="title">
                      Blog Title
                    </label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        id="title"
                        value={form.title}
                        className="flex-grow border border-gray-300 rounded-xl px-5 py-3 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        placeholder="Enter a captivating title for your blog"
                      />
                      <button
                        type="button"
                        onClick={handleAiSuggest}
                        disabled={loading}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-3 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center min-w-[140px]"
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating...
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                            </svg>
                            AI Suggest
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-lg font-semibold text-gray-800 mb-2" htmlFor="content">
                      Blog Content
                    </label>
                    <textarea
                      id="content"
                      rows={8}
                      value={form.content}
                      className="w-full border border-gray-300 rounded-xl px-5 py-4 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      onChange={(e) => setForm({ ...form, content: e.target.value })}
                      placeholder="Write your engaging blog content here..."
                    />
                  </div>

                  <div className="mb-8">
                    <label className="block text-lg font-semibold text-gray-800 mb-2" htmlFor="category">
                      Category
                    </label>
                    <select
                      id="category"
                      value={form.category}
                      className="w-full border border-gray-300 rounded-xl px-5 py-3 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                    >
                      <option value="">Select a category</option>
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
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <button
                      type="submit"
                      className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold px-8 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                      </svg>
                      Publish Blog
                    </button>
                    
                    <div className="flex-1">
                      {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-lg">
                          <p className="text-red-700 font-medium">{error}</p>
                        </div>
                      )}
                      
                      {message && (
                        <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded-lg">
                          <p className="text-green-700 font-medium">{message}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-1/3">
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Tips</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700">Keep your title short and engaging</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700">Use AI suggestions for content ideas</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700">Select relevant categories for better reach</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-3">Your Blog Stats</h3>
                <p className="mb-4">Track performance and engagement metrics for your published blogs.</p>
                <Link href="/dashboard" className="inline-flex items-center font-semibold hover:underline">
                  View Dashboard
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {id ? (
              <button
                onClick={() => signOut()}
                className="flex items-center px-5 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                </svg>
                Logout
              </button>
            ) : (
              <>
                <Link
                  className="flex items-center px-5 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                  href={"/register"}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                  </svg>
                  Register
                </Link>
                <Link
                  className="flex items-center px-5 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                  href={"/login"}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Login
                </Link>
              </>
            )}

            <Link
              className="flex items-center px-5 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              href={"/feed"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              View Feed
            </Link>

            <Link
              className="flex items-center px-5 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              href={"/dashboard"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 4a1 1 0 011-1h2a1 1 0 011 1v1a1 1 0 01-1 1H3a1 1 0 01-1-1V4zM3 10a1 1 0 01-1-1V7a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H3zM3 16a1 1 0 01-1-1v-2a1 1 0 011-1h8a1 1 0 011 1v2a1 1 0 01-1 1H3z" />
              </svg>
              Dashboard
            </Link>
          </div>

          {/* My Blogs Section */}
          
        </div>
      </div>
    </>
  );
}