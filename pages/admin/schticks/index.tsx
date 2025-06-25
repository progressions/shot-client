import Layout from '@/components/Layout'
import Head from 'next/head'
import type { NextApiRequest, NextApiResponse } from "next"
import axios, { AxiosError } from 'axios'

import { useEffect, useReducer } from "react"
import { Skeleton, Box, Paper, IconButton, Button, Stack, Link, Container, Typography, TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material"

import { useClient, useToast } from "@/contexts"

import Schticks from "@/components/schticks/Schticks"

import { getServerClient } from "@/utils/getServerClient"
import type { SchticksResponse, AuthSession, ServerSideProps, Campaign } from "@/types/types"
import { SchticksActions } from "@/reducers/schticksState"
import { GetServerSideProps } from 'next'
import { InferGetServerSidePropsType } from 'next'

export async function getServerSideProps<GetServerSideProps>({ req, res }: ServerSideProps) {
  const { client } = await getServerClient(req, res)

  try {
    const currentCampaign = await client.getCurrentCampaign()

    if (!currentCampaign) {
      return {
        redirect: {
          permanent: false,
          destination: "/campaigns"
        },
        props: {}
      }
    }

    return {
      props: {}
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

interface SchticksIndexProps {
}

export default function SchticksIndex({}: SchticksIndexProps) {
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
            <Schticks />
          </Container>
        </Layout>
      </main>
    </>
  )
}

