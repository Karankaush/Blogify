'use client'
import useSWR from "swr";
import axios from "axios";
import Link from "next/link";
import { useSession } from "next-auth/react";

const fetcher = (url) => axios.get(url).then(res => res.data);

export default function MyBlogs() {
  const { data: session } = useSession();

  const { data, error } = useSWR(session?.user?.id ? "/api/view" : null, fetcher, { 
    revalidateOnFocus: true,
    dedupingInterval: 0 
  });

  const blogs = (data?.success) ? (data.blogs) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Blog Posts</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore all your published articles and track their performance
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">Failed to load blogs. Please try again later.</p>
              </div>
            </div>
          </div>
        )}
        
        {!data && !error && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {blogs.length === 0 && data?.success && (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No blogs yet</h3>
            <p className="mt-1 text-gray-500">Get started by creating your first blog post.</p>
            <div className="mt-6">
              <Link href="/create">
                <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Create Blog
                </button>
              </Link>
            </div>
          </div>
        )}

        {blogs.length > 0 && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogs.slice().reverse().map((blog) => (
              <div
                key={blog._id}
                className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
              >
                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900 line-clamp-2 leading-tight">
                      {blog.title}
                    </h3>
                    <span className="flex-shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 ml-2">
                      {blog.views ?? 0} views
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-base leading-relaxed mb-6 line-clamp-3">
                    {blog.content.length > 150
                      ? blog.content.slice(0, 150) + "..."
                      : blog.content}
                  </p>
                </div>
                
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <button className="flex items-center focus:outline-none hover:text-blue-600 transition-colors">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                          </svg>
                          <span>{blog.likes || 0}</span>
                        </button>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <button className="flex items-center focus:outline-none hover:text-red-600 transition-colors">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"></path>
                          </svg>
                          <span>{blog.dislikes || 0}</span>
                        </button>
                      </div>
                    </div>
                    
                    <Link href={`/read/${blog._id}`}>
                      <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                        Read More
                        <svg className="ml-1 -mr-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}