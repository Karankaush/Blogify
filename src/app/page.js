'use client'
import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import MyBlogs from "./viewBlogs/page";
import { useSession, signOut } from "next-auth/react";

export default function Home() {
  
  const { data: session, status } = useSession();

  const[error, setError] = useState('')
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    title: "",
    content: "",
  });

 const id = session?.user?.id;
 console.log(id)


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
    } catch (err) {
       if (err.response) {
      // Server ne custom error bheja hai
      setError(err.response.data.message);
    } else {
      setError("Something went wrong ❌");
    }
    }
  }



  return (
    <>

      

      <div className="max-w-5xl mx-auto px-5 mt-10">
        <h2 className="text-4xl font-bold text-gray-800 text-center mb-6">
          👋 Welcome to Our Blog App
        </h2>

       
        <form
          onSubmit={handleCreateBlog}
          className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8 max-w-2xl mx-auto"
        >
          <h3 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
            Create a New Blog ✍️
          </h3>


          <div className="mb-5">
            <label
              className="block text-lg font-medium text-gray-600 mb-2"
              htmlFor="title"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={form.title}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Enter your blog title"
            />
          </div>


          <div className="mb-5">
            <label
              className="block text-lg font-medium text-gray-600 mb-2"
              htmlFor="content"
            >
              Content
            </label>
            <textarea
              id="content"
              rows={5}
              value={form.content}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Write your blog content..."
            />
          </div>




          <div className="mb-5">
            <label
              className="block text-lg font-medium text-gray-600 mb-2"
              htmlFor="category"
            >
              Category
            </label>
            <select
              id="category"

              value={form.category}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="Please select category"
            >
              <option value="">Select Category</option>
              <option value="Science">Science</option>
              <option value="Technology">Technology</option>
              <option value="Sport">Sport</option>
              <option value="Health">Helth</option>
              <option value="Travel">Travel</option>
              <option value="Food">Food</option>
              <option value="Education">Education</option>
              <option value="Business">Business</option>
              <option value="Psychology">Psychology</option>
              <option value="Politics">Politics</option>
              <option value="Others">Others</option>

            </select>



          </div>




          <div className=" flex justify-evenly ">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg shadow-md transition"
            >
               Create Blog
            </button>


            {error && (
              <p className=" bg-red-200 mt-2 p-2 rounded-md text-center text-sm font-medium text-red-600">
              {error}</p>
            )}


           

            {message && (
          <p className=" bg-gray-200 p-2 rounded-md mt-2 text-center text-sm font-medium text-green-600">
            {message}
          </p>
        )}
           
            
            
          </div>
          
        </form>

        {/* Auth Links */}
        <div className="flex justify-center gap-6 mt-10 mb-3">
          {id ?(
         <button
      onClick={() => signOut()}
      className="cursor-pointer bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg shadow-md transition"
    >
      Logout
    </button>)
          :( <div className="flex gap-4">
          <Link
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg shadow-md transition"
            href={"/register"}
          >
           Register
          </Link>
          <Link
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg shadow-md transition"
            href={"/login"}
          >
            Login
          </Link>
          </div>)}

          <Link
            className="bg-blue-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg shadow-md transition"
            href={"/feed"}
          >
            View feed
          </Link>

          <Link
            className="bg-yellow-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg shadow-md transition"
            href={"/dashboard"}
          >
            Dashboard
          </Link>

        
        </div>
      </div>
      <MyBlogs />
    </>
  );
}

