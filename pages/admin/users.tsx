import Head from 'next/head'
import { IconButton, Typography, Container, Table, TableContainer, TableBody, TableHead, TableRow, TableCell } from '@mui/material'
import { useState } from 'react'
import Layout from '../../components/Layout'
import UserModal from '../../components/UserModal'
import Router from 'next/router'

import { authOptions } from '../api/auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"

import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import CheckIcon from '@mui/icons-material/Check'

export async function getServerSideProps({ req, res, params }: any) {
  const session: any = await unstable_getServerSession(req as any, res as any, authOptions as any)
  const jwt = session?.authorization
  const id = session?.id
  const endpoint = `${process.env.SERVER_URL}/api/v1/users`

  if (!session?.user?.admin) {
    return {
      redirect: {
        permanent: false,
        destination: "/"
      },
      props: {}
    }
  }

  const response = await fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': jwt
    }
  })

  if (response.status === 200) {
    const users = await response.json()
    return {
      props: {
        jwt: jwt,
        currentUser: session?.user,
        endpoint: endpoint,
        users: users
      }, // will be passed to the page component as props
    }
  }

  return {
    props: {
      jwt: jwt,
      user: session?.user,
      endpoint: endpoint,
    }, // will be passed to the page component as props
  }
}

export default function UsersAdmin({ jwt, endpoint, users, currentUser }: any) {
  const [value, setValue] = useState('1')
  const [user, setUser] = useState(null)
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  async function deleteUser(user: any) {
    const response = await fetch(`${endpoint}/${user.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': jwt
      }
    })
    if (response.status === 200) {
      Router.reload()
    }
  }

  console.log(users)

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
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    users && users.map((user: any) => {
                      return (
                        <TableRow key={`Row_${user.id}`}>
                          <TableCell sx={{width: 120}}>{user.first_name}</TableCell>
                          <TableCell sx={{width: 120}}>{user.last_name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{ user.admin && <CheckIcon />}</TableCell>
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
                <UserModal setUser={setUser} endpoint={endpoint} user={user} />
              </Table>
            </TableContainer>
          </Container>
        </Layout>
      </main>
    </>
  )
}
