import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import { connectToDB } from "@/utils/database";
import User from "@/models/user";

console.log({
  clientId: process.env.GITHUB_ID,
  clientSecret: process.env.GITHUB_SECRET,
});

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_ID,
    //   clientSecret: process.env.GOOGLE_SECRET,
    // }),
    // ...add more providers here
  ],

  callbacks: {
    async session({ session }) {  // In the session callback, it retrieves the user's document from the database
      console.log("Run session function");
      console.log(session);
      try {
        const sessionUser = await User.findOne({
          username: session.user.name,
        });
  
        if (sessionUser) {
          session.user.id = sessionUser._id.toString();
          session.user.todolist = sessionUser.todolist; // Set the todolist from the user document
        } else {
          console.log("User not found in database");
        }
      } catch (error) {
        console.log("Error retrieving user from database:", error);
      }
      console.log(session);
      return session;
    },
    async signIn({ profile }) {
      // Custom logic for signIn callback
      console.log("Run signIn function");
      console.log("profile:", profile);
      try {
        await connectToDB();

        const userExists = await User.findOne({
          username: profile.login,
        });

        if (!userExists) {
          await User.create({
            email: profile.email,
            username: profile.login,
            todolist: [],
          });
        }

        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
    // Add more callback functions if needed
  },
  // Add any other global configurations here
};

export default NextAuth(authOptions);
