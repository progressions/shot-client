import Head from 'next/head'
import { IconButton, Typography, Container, Table, TableContainer, TableBody, TableHead, TableRow, TableCell } from '@mui/material'
import { useState } from 'react'
import Layout from '../../components/Layout'
import Client from "../../components/Client"
import PopupToast from "../../components/PopupToast"
import UserModal from '../../components/UserModal'
import Router from 'next/router'

import { authOptions } from '../api/auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"

import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import CheckIcon from '@mui/icons-material/Check'
import { NextApiRequest, NextApiResponse } from 'next'

import type { User, Toast } from "../../types/types"

interface ServerSideProps {
  req: NextApiRequest,
  res: NextApiResponse,
  params?: any
}

interface loadUsersParams {
  jwt: string,
  setUsers: (users: User[]) => void
}

export async function loadUsers({ jwt, setUsers }: loadUsersParams) {
  const client = new Client({ jwt })
  const response = await client.getUsers()
  if (response.status === 200) {
    const data = await response.json()
    setUsers([])
    setUsers(data)
  }
}

export async function getServerSideProps({ req, res }: ServerSideProps) {
  const session: any = await unstable_getServerSession(req as any, res as any, authOptions as any)
  const jwt = session?.authorization
  const client = new Client({ jwt })
  const id = session?.id

  if (!session?.user?.admin) {
    return {
      redirect: {
        permanent: false,
        destination: "/"
      },
      props: {}
    }
  }

  const response = await client.getUsers()

  if (response.status === 200) {
    const users = await response.json()
    return {
      props: {
        jwt: jwt,
        currentUser: session?.user,
        users: users
      }, // will be passed to the page component as props
    }
  }

  return {
    props: {
      jwt: jwt,
      user: session?.user,
    }, // will be passed to the page component as props
  }
}

export default function UsersAdmin({ jwt, users:initialUsers, currentUser }: any) {
  const client = new Client({ jwt })
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [value, setValue] = useState('1')
  const [user, setUser] = useState<User | null>(null)
  const [toast, setToast] = useState<Toast>({ open: false, message: "", severity: "success" })

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  const closeToast = (): void => {
    setToast((prevToast: Toast) => { return { ...prevToast, open: false }})
  }

  async function deleteUser(user: any) {
    if (user.email === currentUser.email) {
      setToast({ open: true, message: "You can't delete yourself!", severity: "error" })
      return
    }
    if (users.length === 1) {
      setToast({ open: true, message: "You can't delete the last user!", severity: "error" })
      return
    }
    const response = await client.deleteUser(user)
    if (response.status === 200) {
      setToast({ open: true, message: `User ${user.email} deleted.`, severity: "error" })
      loadUsers({ jwt, setUsers })
    }
  }

  return (
    <>
      <Head>
        <title>Admin | Users</title>
        <meta name="description" content="Feng Shui 2 Shot Counter" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Layout>
          <Container maxWidth="md">
            <Typography variant="h1">Users</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>First Name</TableCell>
                    <TableCell>Last Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Admin</TableCell>
                    <TableCell>GM</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    users && users.map((user: User) => {
                      return (
                        <TableRow key={`Row_${user.id}`}>
                          <TableCell sx={{width: 120}}>{user.first_name}</TableCell>
                          <TableCell sx={{width: 120}}>{user.last_name}</TableCell>
                          <TableCell>{ user.email }</TableCell>
                          <TableCell>{ user.admin && <CheckIcon />}</TableCell>
                          <TableCell>{ user.gamemaster && <CheckIcon />}</TableCell>
                          <TableCell>
                            <IconButton onClick={() => setUser(user)}>
                              <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => deleteUser(user)}>
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  }
                </TableBody>
                <UserModal setUser={setUser} user={user} />
              </Table>
            </TableContainer>
            <PopupToast toast={toast} closeToast={closeToast} />
          </Container>
        </Layout>
      </main>
    </>
  )
}
