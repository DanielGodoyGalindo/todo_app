import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";

// This is NextAuth configuration (provider)

// Login with GitHub
// https://next-auth.js.org/configuration/initialization#advanced-initialization
// https://next-auth.js.org/providers/github
const handler = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
});

export { handler as GET, handler as POST };