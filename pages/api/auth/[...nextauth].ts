import NextAuth, { NextAuthOptions, Session, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import Api from '@/utils/Api';
import type { AuthUser, AuthSession } from '@/types/types';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {},
      async authorize(credentials, req) {
        const api = new Api();
        const response = await fetch(api.signIn(), {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Headers': 'true',
          },
          body: JSON.stringify({ user: credentials }),
        });

        if (response.status === 200) {
          const authToken = response.headers.get('authorization');
          const result = await response.json();
          const user: AuthUser = result.data;
          user.authorization = authToken;
          return user;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.user = user; // Initial sign-in
        token.authorization = (user as AuthUser).authorization;
        token.id = (user as AuthUser).id;
      }
      if (trigger === 'update' && session?.user) {
        token.user = { ...session.user }; // Update token.user with new session.user
      }
      return token;
    },
    session({ session, token }) {
      if (token.user) {
        session.user = { ...token.user }; // Deep copy to avoid reference issues
      }
      if (token.authorization) {
        // @ts-ignore
        session.authorization = token.authorization;
      }
      if (token.id) {
        // @ts-ignore
        session.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
};

export default NextAuth(authOptions);
