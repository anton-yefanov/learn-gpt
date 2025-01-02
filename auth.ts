import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/User";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ user }) {
      const { email, name } = user;

      await connectToDatabase();

      const existingUser = await User.findOne({ email });

      if (!existingUser) {
        await User.create({
          email,
          name,
        });
      }

      return true;
    },
  },
});
