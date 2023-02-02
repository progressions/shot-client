import NextAuth, { NextAuthOptions, Awaitable, Session, User } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { getToken } from 'next-auth/jwt'
import Api from "../../../components/Api"

interface AuthUser extends User {
  authorization: string | null
}

interface AuthSession extends Session {
  authorization: {} | null
  id: {}
}

export const authOptions:NextAuthOptions = {
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {},
      async authorize(credentials, req) {
        const api = new Api()

        const response = await fetch(api.signIn(), {
          method: 'POST',
          mode: 'cors',
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Headers": "true"
          },
          body: JSON.stringify({"user": credentials})
        })

        // If no error and we have user data, return it
        if (response.status === 200) {
          // take the JWT from the response my backend server gives me
          const authToken = response.headers.get('authorization')
          const result = await response.json()
          const user: AuthUser = result.data

          // add the JWT to the user returned after signin
          user.authorization = authToken

          return user
        }
        // Return null if user data could not be retrieved
        return null
      }
    })
  ],
  callbacks: {
    jwt({ token, user:initialUser, account, isNewUser }) {
      const user = initialUser as AuthUser

      if (user) {
        token.user = user
      }
      // if we have an authentication JWT in the token, add it to the 'user'
      if (user?.authorization) {
        token.authorization = user.authorization
      }
      if (user?.id) {
        token.id = user.id
      }
      // console.log({ token, user, account, isNewUser })
      return token
    },
    session({ session:initialSession, user, token }) {
      const session = initialSession as AuthSession

      // Put the JWT in the session so I can extract it later from the session
      // and send it as the "Authorization" header when making requests to my
      // backend.
      if (token.authorization) {
        session.authorization = token.authorization
      }
      if (token?.id) {
        session.id = token.id
      }
      // put the full user object in the token. The default way it was working,
      // the user object in the existing token only had 'email' and I needed
      // more fields than that. (I'm still a noob, there may be a better way!)
      if (token?.user) {
        session.user = token.user
      }
      // console.log({ session, user, token })
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
  }
}
export default NextAuth(authOptions)
