import Head from 'next/head'
import { Box, Paper, IconButton, Typography, Container, Table, TableContainer, TableBody, TableHead, TableRow, TableCell } from '@mui/material'
import { useState } from 'react'
import Layout from '@/components/Layout'
import Client from "@/utils/Client"
import UserModal from '@/components/UserModal'
import Router from 'next/router'
import type { NextApiRequest, NextApiResponse } from "next"

import { getServerClient } from "@/utils/getServerClient"

import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import CheckIcon from '@mui/icons-material/Check'

import { useToast } from "@/contexts/ToastContext"
import type { AuthSession, User, Toast, ServerSideProps } from "@/types/types"

import { defaultUser } from "@/types/types"

interface UsersAdminProps {
  jwt: string
  users: User[]
  currentUser: User
}

interface loadUsersParams {
  jwt: string,
  setUsers: React.Dispatch<React.SetStateAction<User[]>>
}

export async function loadUsers({ jwt, setUsers }: loadUsersParams) {
  const client = new Client({ jwt })
  try {
    const data = await client.getUsers()
    setUsers([])
    setUsers(data)
  } catch(error) {
    console.error(error)
  }
}

export async function getServerSideProps({ req, res }: ServerSideProps) {
  const { client, user, jwt } = await getServerClient(req, res)

  if (!user?.admin) {
    return {
      redirect: {
        permanent: false,
        destination: "/"
      },
      props: {}
    }
  }

  try {
    const users = await client.getUsers()

    return {
      props: {
        jwt: jwt,
        currentUser: user,
        users: users
      }, // will be passed to the page component as props
    }
  } catch(error) {

    return {
      props: {
        jwt: jwt,
        user: user,
      }, // will be passed to the page component as props
    }
  }
}

export default function UsersAdmin({ jwt, users:initialUsers, currentUser }: UsersAdminProps) {
  const client = new Client({ jwt })
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [value, setValue] = useState<string>('1')
  const [user, setUser] = useState<User>(defaultUser)
  const { toastSuccess, toastError } = useToast()

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  async function deleteUser(user: User): Promise<void> {
    if (user.email === currentUser.email) {
      toastError("You can't delete yourself.")
      return
    }
    if (users.length === 1) {
      toastError("You can't delete the last user.")
      return
    }
    try {
      await client.deleteUser(user)
      toastSuccess(`User ${user.email} deleted.`)
      loadUsers({ jwt, setUsers })
    } catch(error) {
      toastError()
    }
  }

  return (
    <>
      <Head>
        <title>Users - Chi War</title>
        <meta name="description" content="Feng Shui 2 Shot Counter" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Layout>
          <Container maxWidth="md">
            <Typography variant="h1">Users</Typography>
            <TableContainer component={Paper}>
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
                            <IconButton color="primary" onClick={() => setUser(user)}>
                              <EditIcon />
                            </IconButton>
                            <IconButton color="primary" onClick={() => deleteUser(user)}>
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  }
                </TableBody>
                <UserModal setUser={setUser} user={user} setUsers={setUsers} />
              </Table>
            </TableContainer>
          </Container>
        </Layout>
      </main>
    </>
  )
}
