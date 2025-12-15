import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { loginUser, exchangeOAuthToken } from "@/app/lib/auth.api";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
        otp: {},
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const res = await loginUser({
          email: credentials.email,
          password: credentials.password,
          otp: credentials.otp,
        });

        if (res.data.statusCode !== 0) return null;

        return {
          id: res.data.data.id,
          email: res.data.data.email,
          username: res.data.data.username,
        };
      },
    }),
    // ✅ Add Google OAuth provider when env vars are set
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = token.user as any;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
