import Head from "next/head"
import Layout from "@/components/Layout"
import { getServerClient } from "@/utils/getServerClient"
import axios from "axios"
import { useRouter } from "next/router"

import { Link, Paper, Switch, FormControlLabel, Stack, Avatar, Box, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Container, Typography } from "@mui/material"

import type { QueryType, PaginationMeta, AuthSession, Person, Vehicle, Character, CharacterFilter, ServerSideProps, Toast, CharactersResponse } from "@/types/types"
import Characters from "@/components/admin/characters/Characters"
import { AxiosError } from "axios"

interface CharactersProps {
  characters: Character[]
  meta: PaginationMeta
}

export async function getServerSideProps({ req, res, query }: ServerSideProps) {
  const { client } = await getServerClient(req, res)
  const { page } = query as QueryType

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

    return {
      props: {
        page: page ? parseInt(page as string, 10) : 1,
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
      props: {
        page: null
      }
    }
  }
}

interface CharactersIndexProps {
}

export default function CharactersIndex({}: CharactersIndexProps) {
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
          <Container maxWidth="lg" sx={{minWidth: 1000}}>
            <Characters />
          </Container>
        </Layout>
      </main>
    </>
  )
}
