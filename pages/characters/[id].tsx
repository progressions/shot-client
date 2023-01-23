import Layout from '../../components/Layout'
import Head from 'next/head'

import { authOptions } from '../api/auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"
import { Typography, Paper, Container } from "@mui/material"

import EditCharacter from "../../components/characters/edit/EditCharacter"
import Client from '../../components/Client'
import { GetServerSideProps } from 'next'

import { User, Character } from "../../types/types"

export async function getServerSideProps<GetServerSideProps>({ req, res, params }: any) {
  const session: any = await unstable_getServerSession(req as any, res as any, authOptions as any)
  const jwt = session?.authorization
  const client = new Client({ jwt: jwt })
  const { id } = params

  const response = await client.getCharacter({ id })

  if (response.status === 200) {
    const character = await response.json()
    return {
      props: {
        character: character
      }
    }
  }

  if (response.status === 401) {
    return {
      redirect: {
        permanent: false,
        destination: "/auth/signin"
      }
    }
  }

  return {
    props: {
      character: {}
    }
  }
}

export default function CharacterView({ character }: any) {
  return (
    <>
      <Head>
        <title>Characters - Chi War</title>
        <meta name="description" content="Feng Shui 2 Shot Counter" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Layout>
          <Container maxWidth="md" component={Paper} sx={{marginTop: 2, py: 2}}>
            <Typography variant="h2" gutterBottom>Edit Character</Typography>
            <EditCharacter character={character} />
          </Container>
        </Layout>
      </main>
    </>
  )
}