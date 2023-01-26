import Layout from '../../../components/Layout'
import Head from 'next/head'

import { useReducer, useState } from "react"
import { Box, Paper, IconButton, Button, Stack, Link, Container, Typography, TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material"
import { useClient } from "../../../contexts/ClientContext"
import { useCampaign } from "../../../contexts/CampaignContext"
import { useSession } from 'next-auth/react'

import ButtonBar from "../../../components/ButtonBar"
import CreateCampaign from "../../../components/campaigns/CreateCampaign"
import Campaigns from "../../../components/campaigns/Campaigns"
import GamemasterOnly from "../../../components/GamemasterOnly"
import CreateSchtickButton from "../../../components/characters/schticks/CreateSchtickButton"
import FilterSchticks, { initialFilter, filterReducer } from "../../../components/characters/schticks/FilterSchticks"

import { authOptions } from '../../api/auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"
import Client from "../../../components/Client"
import Schticks from "../../../components/characters/edit/Schticks"

import type { Campaign } from "../../../types/types"
import { GetServerSideProps } from 'next'
import { InferGetServerSidePropsType } from 'next'

export async function getServerSideProps<GetServerSideProps>({ req, res }: any) {
  const session: any = await unstable_getServerSession(req as any, res as any, authOptions as any)
  const jwt = session?.authorization
  const client = new Client({ jwt: jwt })

  const response = await client.getSchticks()

  if (response.status === 200) {
    const { schticks, meta, paths } = await response.json()
    return {
      props: {
        schticks: schticks,
        meta: meta,
        paths: paths
      }
    }
  }
  if (response.status === 500) {
    return {
      redirect: {
        permanent: false,
        destination: "/"
      }
    }
  }
  if (response.status === 401) {
    return {
      redirect: {
        permanent: false,
        destination: "/auth/signin"
      },
      props: {
      }
    }
  }
  return {
    props: {
      fights: [],
    }
  }
}

export default function CampaignsIndex(initialState: any) {
  const [filter, dispatchFilter] = useReducer(filterReducer, initialFilter)
  const [state, setState] = useState(initialState)
  const { schticks } = state

  return (
    <>
      <Head>
        <title>Schticks - Chi War</title>
        <meta name="description" content="Feng Shui 2 Shot Counter" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Layout>
          <Container maxWidth="md">
            <Typography variant="h1" gutterBottom>Schticks</Typography>
            <ButtonBar>
              <FilterSchticks filter={filter} dispatchFilter={dispatchFilter} />
              <CreateSchtickButton setSchticks={setState} />
            </ButtonBar>
            <Schticks schticks={schticks} setSchticks={setState} noNewCard />
          </Container>
        </Layout>
      </main>
    </>
  )
}

