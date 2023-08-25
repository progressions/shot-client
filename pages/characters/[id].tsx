import Layout from '@/components/Layout'
import Head from 'next/head'

import { colors, Typography, Paper, Container } from "@mui/material"

import { CharacterProvider } from "@/contexts/CharacterContext"
import EditCharacter from "@/components/characters/edit/EditCharacter"
import { GetServerSideProps } from 'next'

import { getServerClient } from "@/utils/getServerClient"

import { ParamsType, AuthSession, ServerSideProps, User, Character } from "@/types/types"
import { AxiosError } from 'axios'

export async function getServerSideProps<GetServerSideProps>({ req, res, params }: ServerSideProps) {
  const { client } = await getServerClient(req, res)
  const { id } = params as ParamsType

  try {
    const character = await client.getCharacter({ id })

    return {
      props: {
        character: character
      }
    }
  } catch(error: unknown | AxiosError) {
    return {
      redirect: {
        permanent: false,
        destination: "/"
      }
    }
  }
}

interface CharacterViewProps {
  character: Character
}

export default function CharacterView({ character }: CharacterViewProps) {
  return (
    <>
      <Head>
        <title>{`${character?.name || "Characters"} - Chi War`}</title>
        <meta name="description" content="Feng Shui 2 Shot Counter" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Layout>
          <Container maxWidth="md" component={Paper} sx={{backgroundColor: colors.blueGrey[300], color: "black", marginTop: 2, py: 2}}>
            <Typography variant="h2" gutterBottom>Edit Character</Typography>
            <CharacterProvider character={character}>
              <EditCharacter character={character} />
            </CharacterProvider>
          </Container>
        </Layout>
      </main>
    </>
  )
}
