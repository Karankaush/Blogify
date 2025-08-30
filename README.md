# Next.js Blog System with Authentication and MongoDB Atlas

A full-stack blog system built with **Next.js**, **NextAuth.js**, and **MongoDB Atlas**.  
Users can register, login, create, update, delete, and view their own blogs. The project uses SWR for **frontend caching and automatic data revalidation**.

---

## Features

- **User Authentication**  
  - Registration and login with secure password handling.  
  - Session management via NextAuth.js.  

- **Blog Management (CRUD)**  
  - Create, read, update, and delete blogs.  
  - Each user sees only their own blogs.  

- **Frontend Features**  
  - Responsive UI built with **Tailwind CSS**.  
  - SWR used for efficient fetching and caching of blog data.  
  - Dynamic dashboard showing user-specific blogs.  

- **Backend Features**  
  - API routes in Next.js for all CRUD operations.  
  - MongoDB Atlas for cloud database storage.  
  - Authentication-protected routes.  

- **Additional Features**  
  - Likes, dislikes, and view count tracking for each blog.  
  - Automatic session updates on profile changes.  
  - Error handling and user-friendly messages.

---

## Tech Stack

- **Frontend:** Next.js 13 (App Router), React, Tailwind CSS, SWR  
- **Backend:** Next.js API Routes, NextAuth.js  
- **Database:** MongoDB Atlas (cloud-based)  
- **Authentication:** NextAuth.js with session handling  

---

    
    Folder structure
    
    src/
    ├── app/
    │   ├── dashboard/          # User dashboard page
    │   ├── edit/               # Blog edit page
    │   ├── feed/               # Feed page (all blogs)
    │   ├── login/              # Login page
    │   ├── read/               # Individual blog read page
    │   ├── register/           # User registration page
    │   ├── viewBlogs/          # User-specific blogs page
    │   ├── api/                # All API routes
    │   │   ├── auth/           # NextAuth routes
    │   │   ├── blogs/          # Blog CRUD & actions
    │   │   │   ├── [id]/       # Blog ID specific actions
    │   │   │   │   ├── delete/
    │   │   │   │   ├── dislike/
    │   │   │   │   ├── edit/
    │   │   │   │   ├── incre/   # for views increment
    │   │   │   │   └── like/
    │   │   │   └── route.js     # general blogs route
    │   │   ├── users/           # User-specific API routes
    │   │   ├── view/            # Get current user blogs
    │   │   └── viewfeed/        # Public feed route
    │   ├── favicon.ico
    │   ├── globals.css
    │   ├── layout.js
    │   ├── page.js
    │   └── provider.js
    ├── config/                  # Auth config, env configs
    ├── lib/                     # MongoDB connection, helpers
    ├── models/                  # Mongoose models: User.js, Blog.js
    └── .env.local






## Setup & Installation

1. **Clone the repository:**

```bash
git clone <repo-url>
cd <project-folder>


install dependencies
npm install


.env.local
MONGO_URI=<Your MongoDB Atlas URI>
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<A long random secret>
GITHUB_ID=<Optional GitHub OAuth ID>
GITHUB_SECRET=<Optional GitHub OAuth Secret>


Run the development server:
npm run dev
