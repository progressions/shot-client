import { NextRequest, NextResponse } from 'next/server'

import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req: NextRequest) {
    const response = NextResponse.next()

    return response
  },
  {
    callbacks: {
      authorized({ token }) {
        // console.log({ token })
        return true
      }
    }
  }
)

export const config = {
  matcher: [
    '/',
    '/protected'
  ]
}
