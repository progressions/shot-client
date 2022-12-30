import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { getToken } from 'next-auth/jwt'

const endpoint = `${process.env.SERVER_URL}/users/sign_in`

export const authOptions = {
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
        const options = {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Headers': true
          },
          body: JSON.stringify({"user": credentials})
        }

        const response = await fetch(endpoint, options)

        // If no error and we have user data, return it
        if (response.status === 200) {
          const authToken = response.headers.get('authorization')
          const result = await response.json()
          const user = result.data

          user.authorization = authToken

          return user
        }
        // Return null if user data could not be retrieved
        return null
      }
    })
  ],
  callbacks: {
    jwt({ token, user, account, isNewUser }) {
      // console.log({ token, user, account, isNewUser })
      if (user) {
        token.user = user
      }
      if (user?.authorization) {
        token.authorization = user.authorization
      }
      if (user?.id) {
        token.id = user.id
      }
      return token
    },
    session({ session, user, token }) {
      // console.log({ session, user, token })
      if (token.authorization) {
        session.authorization = token.authorization
      }
      if (token?.id) {
        session.id = token.id
      }
      if (token?.user) {
        session.user = token.user
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout'
  }
}
export default NextAuth(authOptions)
