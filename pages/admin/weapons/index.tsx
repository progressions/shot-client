import Layout from '../../../components/Layout'
import Head from 'next/head'

import { useEffect, useReducer } from "react"
import { Skeleton, Box, Paper, IconButton, Button, Stack, Link, Container, Typography, TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material"
import { useClient } from "../../../contexts/ClientContext"
import { useCampaign } from "../../../contexts/CampaignContext"
import { useSession } from 'next-auth/react'

import { ButtonBar } from "../../../components/StyledFields"
import CreateCampaign from "../../../components/campaigns/CreateCampaign"
import Campaigns from "../../../components/campaigns/Campaigns"
import GamemasterOnly from "../../../components/GamemasterOnly"
import CreateWeaponButton from "../../../components/weapons/CreateWeaponButton"
import FilterWeapons from "../../../components/weapons/FilterWeapons"
import { initialFilter, filterReducer } from "../../../components/weapons/filterReducer"

import { authOptions } from '../../api/auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"
import Client from "../../../components/Client"
import Weapons from "../../../components/weapons/Weapons"

import type { Campaign } from "../../../types/types"
import { GetServerSideProps } from 'next'
import { InferGetServerSidePropsType } from 'next'

export async function getServerSideProps<GetServerSideProps>({ req, res }: any) {
  const session: any = await unstable_getServerSession(req as any, res as any, authOptions as any)
  const jwt = session?.authorization
  const client = new Client({ jwt: jwt })

  const response = await client.getWeapons()

  if (response.status === 200) {
    const { weapons, meta, junctures } = await response.json()
    return {
      props: {
        weapons: weapons,
        meta: meta,
        junctures: junctures
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

export default function WeaponsIndex(data: any) {
  const [filter, dispatchFilter] = useReducer(filterReducer, initialFilter)
  const weapons = filter?.weapons || []
  const { loading } = filter

  useEffect(() => {
    dispatchFilter({ type: "weapons", payload: data })
  }, [data])

  return (
    <>
      <Head>
        <title>Weapons - Chi War</title>
        <meta name="description" content="Feng Shui 2 Shot Counter" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Layout>
          <Container maxWidth="md">
            <Typography variant="h1" gutterBottom>Weapons</Typography>
            { !loading && <>
              <ButtonBar sx={{height: 80}}>
                <FilterWeapons filter={filter} dispatchFilter={dispatchFilter} />
              </ButtonBar>
              <Weapons filter={filter} dispatchFilter={dispatchFilter} />
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

// <CreateWeaponButton filter={filter} dispatchFilter={dispatchFilter} />
