"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
export default function DeleteButton({ id }) {
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleDelete = async () => {
    try {
     const res =  await axios.delete(`/api/blogs/${id}/delete`);
     setMessage(res.data.message);

      router.push("/"); // delete ke baad homepage pe bhej de
    } catch (err) {
      console.error(err);
      alert("Error deleting blog");
    }
  };

  return (
    <>
    <button
      onClick={handleDelete}
      className="cursor-pointer bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-2 rounded-lg shadow-md transition"
    >
      🗑️ Delete
    </button>
    
    <div>

     {message && (
          <p className="mt-4 text-center text-sm font-medium text-green-600">
            {message}
          </p>
        )}
    </div>
    
    </>
  );
}
