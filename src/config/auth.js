import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();
        const user = await User.findOne({ email: credentials.email });
        if (!user)  throw new Error("Invalid credentials");

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isPasswordCorrect) throw new Error("Invalid credentials");

        return { id: user._id.toString(), name: user.name, email: user.email };
      },
    }),
    
  ],

  callbacks: {
    async jwt({  token, user, trigger, session  }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
       if (trigger === "update" && session) {
      token.name = session.name;
      token.email = session.email;
    }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// 👇 handler ko NextAuth(authOptions) ke sath banao
const handler = NextAuth(authOptions);

// 👇 isse GET/POST aur authOptions dono export ho jayenge
export { handler as GET, handler as POST };
