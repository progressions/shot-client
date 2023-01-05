import Head from "next/head"
import Layout from "../components/Layout"

import { Avatar, Box, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Container, Typography } from "@mui/material"

import { authOptions } from "./api/auth/[...nextauth]"
import { unstable_getServerSession } from "next-auth/next"

import { useSession } from "next-auth/react"

import ActionValues from "../components/character/ActionValues"

export async function getServerSideProps({ req, res }: any) {
  const session: any = await unstable_getServerSession(req as any, res as any, authOptions as any)
  const jwt = session?.authorization
  const endpoint = `${process.env.SERVER_URL}/api/v1/all_characters`

  const response = await fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': jwt
    }
  })

  if (response.status === 200) {
    const characters = await response.json()
    return {
      props: {
        characters: characters,
        endpoint: endpoint,
      }, // will be passed to the page component as props
    }
  }
  if (response.status === 401) {
    return {
      redirect: {
        permanent: false,
        destination: "/auth/signin"
      },
      props: {
        endpoint: endpoint,
      }
    }
  }
  return {
    props: {
      characters: [],
      endpoint: endpoint,
    }
  }
}

export default function Characters({ endpoint, characters }: any) {
  const { status, data } = useSession({ required: true })
  if (status !== "authenticated") {
    return <div>Loading...</div>
  }

  return (
    <>
      <Head>
        <title>Characters</title>
        <meta name="description" content="Feng Shui 2 Shot Counter" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Layout>
          <Container maxWidth="md">
            <Typography variant="h1" gutterBottom>Characters</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    characters.map((character: any) => {
                      return (<TableRow key={character.id}>
                        <TableCell sx={{width: 50}}>
                          <Avatar sx={{bgcolor: character.color || 'secondary'}} variant="rounded">{character.name[0]}</Avatar>
                        </TableCell>
                        <TableCell sx={{fontWeight: 'bold'}}><Typography variant="h5">{character.name}</Typography></TableCell>
                        <TableCell>{character.action_values?.["Type"]}</TableCell>
                        <TableCell><ActionValues character={character} /></TableCell>
                      </TableRow>)
                    })
                  }
                </TableBody>
              </Table>
            </TableContainer>
          </Container>
        </Layout>
      </main>
    </>
  )
}
