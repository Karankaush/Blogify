"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password :""
  });

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600 text-xl">
        Loading...
      </div>
    );
  }

  if (status === "unauthenticated") {
    // window.location.href = '/login'
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Link
          href="/login"
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Please login first
        </Link>
      </div>
    );
  }

  const id = session.user.id;

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await axios.put(`/api/users/${id}/update`, form);
      if (res.data.success) {
        await update({
          ...session,
          user: res.data.user,
        });
        setForm(
          form.name = "",
          form.email = "",
          form.password = ""
        )
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDelete(e) {
    e.preventDefault();
    try {
      const res = await axios.delete(`/api/users/${id}/delete`);
      if (res.data.success) {
        window.location.href = "/login";
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-blue-100 py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-10">
     
        <div className="bg-white shadow-lg rounded-2xl p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            Welcome, {session.user.name} 🎉
          </h1>
          {/* <p className="text-gray-600 text-lg">Email: {session.user.name}</p> */}
          
          <button
            onClick={() => signOut()}
            className="mt-6 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg shadow-md transition"
          >
            Logout
          </button>
        </div>

      
        <div className="bg-white shadow-md rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">
            Update Your Details ✍️
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div>
              <label
                htmlFor="name"
                className="block text-gray-600 font-medium mb-2"
              >
                Name
              </label>
              <input
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                placeholder="New name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-gray-600 font-medium mb-2"
              >
                Email
              </label>
              <input
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                placeholder="New email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-gray-600 font-medium mb-2"
              >
                Password
              </label>
              <input
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                placeholder="New password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <div className="md:col-span-2 flex justify-center gap-4 ">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md transition"
              >
                Save Changes
              </button>
              <form onSubmit={handleDelete}>
                <button
                  type="submit"
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg shadow-md transition"
                >
                  Delete Account
                </button>
              </form>
              <Link href="/"
              className="bg-blue-500 hover:bg-blue-600 text-black px-6 py-2 rounded-lg shadow-md transition">
                 Home</Link>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
