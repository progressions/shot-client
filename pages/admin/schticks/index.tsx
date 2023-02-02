import Layout from '../../../components/Layout'
import Head from 'next/head'
import type { NextApiRequest, NextApiResponse } from "next"

import { useEffect, useReducer } from "react"
import { Skeleton, Box, Paper, IconButton, Button, Stack, Link, Container, Typography, TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material"
import { useClient } from "../../../contexts/ClientContext"
import { useCampaign } from "../../../contexts/CampaignContext"
import { useSession } from 'next-auth/react'

import { ButtonBar } from "../../../components/StyledFields"
import CreateCampaign from "../../../components/campaigns/CreateCampaign"
import Campaigns from "../../../components/campaigns/Campaigns"
import GamemasterOnly from "../../../components/GamemasterOnly"
import CreateSchtickButton from "../../../components/schticks/CreateSchtickButton"
import FilterSchticks from "../../../components/schticks/FilterSchticks"
import { initialSchticksState, schticksReducer } from "../../../components/schticks/schticksState"

import { authOptions } from '../../api/auth/[...nextauth]'
import Client from "../../../components/Client"
import Schticks from "../../../components/schticks/Schticks"

import { getServerClient } from "../../../utils/getServerClient"
import type { AuthSession, ServerSideProps, Campaign } from "../../../types/types"
import type { SchticksResponse } from "../../../components/schticks/schticksState"
import { GetServerSideProps } from 'next'
import { InferGetServerSidePropsType } from 'next'

export async function getServerSideProps<GetServerSideProps>({ req, res }: ServerSideProps) {
  const { client } = await getServerClient(req, res)

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

export default function SchticksIndex(data: SchticksResponse) {
  const [filter, dispatchFilter] = useReducer(schticksReducer, initialSchticksState)
  const schticks = filter?.schticks || []
  const { loading } = filter

  useEffect(() => {
    dispatchFilter({ type: "schticks", payload: data })
  }, [data])

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
            { !loading && <>
              <ButtonBar sx={{height: 80}}>
                <FilterSchticks filter={filter} dispatchFilter={dispatchFilter} />
                <CreateSchtickButton filter={filter} dispatchFilter={dispatchFilter} />
              </ButtonBar>
              <Schticks filter={filter} dispatchFilter={dispatchFilter} />
            </> }
            { loading && <>
              <Skeleton animation="wave" height={50} />
              <Skeleton animation="wave" height={50} />
              <Skeleton animation="wave" height={50} />
              <Skeleton animation="wave" height={50} />
              <Skeleton animation="wave" height={50} />
              <Skeleton animation="wave" height={50} />
            </>}
          </Container>
        </Layout>
      </main>
    </>
  )
}

