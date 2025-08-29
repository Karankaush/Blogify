'use client'
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";


export default function ViewFeed(){

    const [blogs, setBlogs] = useState([]);

     async function handleLike(id){
        try {
          const res = await axios.post(`/api/blogs/${id}/like`);
         
          
        } catch (err) {
          console.error("Error updating views:", err);
        }
      };


     async function handleDisLike(id){
        try {
          const res = await axios.post(`/api/blogs/${id}/dislike`);
         
          
        } catch (err) {
          console.error("Error updating views:", err);
        }
      };





    async function handleView(id){
        try {
         const res = await axios.post(`/api/blogs/${id}/incre`);
         
          
        } catch (err) {
          console.error("Error updating views:", err);
        }
      };

    useEffect(() =>{
        const getBlogs = async() =>{
            const res = await axios.get(`/api/viewfeed`)
            if(res.data.success){
                console.log(res.data.message);
                setBlogs(res.data.allBlogs);
            }
        }
        getBlogs();
    }, [])


    return(
        <>
        <div className="mt-5 mb-5 mx-4">
          <Link href={'/'} className="bg-blue-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg shadow-md transition" >Back to Home</Link>
        </div>
        <div className="mt-3 mx-4">
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
                  <Link href={`/read/${blog._id}/feedback`}>
                    <button  className=" cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800 transition" onClick={() => handleView(blog._id)}>
                      Read More →
                    </button>
                  </Link>
                  <span className="text-xs text-gray-400">
                    Views: {blog.views ?? 0}
                  </span>
                  
                </div>
                

                 <div className=" mt-5 flex w-32 justify-between">


                <form onSubmit={handleLike}>
                    <button type="submit" className="cursor-pointer" onClick={() => handleLike(blog._id)}>
                    
                        Like {blog.likes}
                    

                    </button>
                </form>

                    <form onSubmit={handleDisLike}>
                    
                        <button type="submit" className="cursor-pointer" onClick={() => handleDisLike(blog._id)}>
                             Dislike {blog.disLikes}    
                        </button>
                  
                    </form>


      </div>




              </div>
            ))}
          </div>
        )}
        </div>
        </>
    )
}