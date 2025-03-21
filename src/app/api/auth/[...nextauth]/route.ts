/* eslint-disable @typescript-eslint/no-explicit-any */
import User from "@/_lib/models/User";
import dbConnect from "@/_lib/mongodb";
import NextAuth, { NextAuthOptions } from "next-auth"; // Import NextAuthOptions
import CredentialsProvider from "next-auth/providers/credentials";
import jwt from "jsonwebtoken";

const logError = (message: string, error: any) => {
  console.error(`[Auth Error] ${message}:`, error);
};

// Explicitly type authOptions with NextAuthOptions
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          logError("Missing credentials", { username: credentials?.username });
          throw new Error("Username and password are required");
        }

        try {
          await dbConnect();
          const user = await User.findOne({ username: credentials.username });
          if (!user) {
            logError("User not found", { username: credentials.username });
            return null;
          }

          // Replace with bcrypt.compare in production
          if (credentials.password !== user.password) {
            logError("Invalid password", { username: credentials.username });
            return null;
          }

          // Generate a real JWT token
          const accessToken = jwt.sign(
            { id: user._id.toString(), username: user.username, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: "1h" } // Token expires in 1 hour
          );

          return {
            id: user._id.toString(),
            name: user.username,
            role: user.role,
            accessToken, // Include the real token
          };
        } catch (error) {
          logError("Authorization failed", error);
          throw new Error("An error occurred during authentication");
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken; // Pass accessToken to JWT
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.accessToken = token.accessToken; // Pass accessToken to session
      }
      return session;
    },
  },
  session: {
    strategy: "jwt" as const, // Explicitly type as "jwt" literal
  },
  secret: process.env.NEXTAUTH_SECRET, // Required for NextAuth
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };