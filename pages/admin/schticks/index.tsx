import Layout from '@/components/Layout'
import Head from 'next/head'
import type { NextApiRequest, NextApiResponse } from "next"

import { useEffect, useReducer } from "react"
import { Skeleton, Box, Paper, IconButton, Button, Stack, Link, Container, Typography, TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material"

import { ButtonBar } from "@/components/StyledFields"
import CreateCampaign from "@/components/campaigns/CreateCampaign"
import Campaigns from "@/components/campaigns/Campaigns"
import GamemasterOnly from "@/components/GamemasterOnly"
import CreateSchtickButton from "@/components/schticks/CreateSchtickButton"
import FilterSchticks from "@/components/schticks/FilterSchticks"
import { initialSchticksState, schticksReducer } from "@/reducers/schticksState"

import { authOptions } from '@/pages/api/auth/[...nextauth]'
import Schticks from "@/components/schticks/Schticks"

import { getServerClient } from "@/utils/getServerClient"
import type { SchticksResponse, AuthSession, ServerSideProps, Campaign } from "@/types/types"
import { SchticksActions } from "@/reducers/schticksState"
import { GetServerSideProps } from 'next'
import { InferGetServerSidePropsType } from 'next'

export async function getServerSideProps<GetServerSideProps>({ req, res }: ServerSideProps) {
  const { client } = await getServerClient(req, res)

  try {
    const { schticks, meta, paths } = await client.getSchticks()

    return {
      props: {
        schticks: schticks,
        meta: meta,
        paths: paths
      }
    }
  } catch(error) {
    return {
      props: {
        schticks: [],
        meta: {},
        paths: []
      }
    }
  }
}

export default function SchticksIndex(data: SchticksResponse) {
  const [state, dispatch] = useReducer(schticksReducer, initialSchticksState)
  const { loading, schticks } = state

  useEffect(() => {
    dispatch({ type: SchticksActions.SCHTICKS, payload: data })
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
          <Container maxWidth="md" sx={{paddingTop: 2, minWidth: 1000}}>
            { !loading && <>
              <ButtonBar sx={{height: 80}}>
                <FilterSchticks state={state} dispatch={dispatch} />
                <CreateSchtickButton state={state} dispatch={dispatch} />
              </ButtonBar>
              <Schticks state={state} dispatch={dispatch} />
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

