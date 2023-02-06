import { Session } from "next-auth"
import type { NextApiRequest, NextApiResponse } from "next"
import { authOptions } from '../pages/api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next"
import Client from './Client'
import type { AuthUser, AuthSession } from "../types/types"

export async function getServerClient(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req as NextApiRequest, res as NextApiResponse, authOptions) as AuthSession
  const jwt = session?.authorization as string as string
  const client = new Client({ jwt: jwt })
  const user = session?.user as AuthUser

  return { client, jwt, session, user }
}
