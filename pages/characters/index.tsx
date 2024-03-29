import Head from "next/head"
import Layout from "@/components/Layout"
import { getServerClient } from "@/utils/getServerClient"
import axios from "axios"

import { Link, Paper, Switch, FormControlLabel, Stack, Avatar, Box, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Container, Typography } from "@mui/material"

import type { PaginationMeta, AuthSession, Person, Vehicle, Character, CharacterFilter, ServerSideProps, Toast, CharactersResponse } from "@/types/types"
import Characters from "@/components/admin/characters/Characters"
import { AxiosError } from "axios"

interface CharactersProps {
  characters: Character[]
  meta: PaginationMeta
}

export async function getServerSideProps({ req, res, query }: ServerSideProps) {
  const { client } = await getServerClient(req, res)

  const page = query?.page

  try {
    const currentCampaign = await client.getCurrentCampaign()

    if (!currentCampaign) {
      return {
        redirect: {
          permanent: false,
          destination: "/"
        },
        props: {}
      }
    }

    const charactersResponse = await client.getCharactersAndVehicles({ page })

    if (charactersResponse) {
      return {
        props: charactersResponse
      }
    }
  } catch(error: unknown | AxiosError) {
    if (axios.isAxiosError(error)) {
      if (error?.response?.status === 401) {
      return {
        redirect: {
          destination: "/auth/signin",
          permanent: false
        }
      }
    }
  }

    return {
      props: {}
    }
  }
}

export default function CharactersIndex({ characters, meta, factions, archetypes }:CharactersResponse) {
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
          <Container maxWidth="lg">
            <Characters characters={characters} meta={meta} factions={factions} archetypes={archetypes} />
          </Container>
        </Layout>
      </main>
    </>
  )
}
