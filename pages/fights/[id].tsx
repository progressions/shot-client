import { Container, Typography } from "@mui/material"
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Router from "next/router"
import { authOptions } from '../api/auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"

import Layout from '../../components/Layout'
import ShotCounter from "../../components/fights/ShotCounter"
import Client from '../../components/Client'

import { useFight } from "../../contexts/FightContext"

import type { ShotType, Vehicle, Person, Character, Fight, ID } from "../../types/types"
import { ServerSideProps } from "../../types/types"

interface FightParams {
  fight: Fight | null,
  notFound?: boolean
}

export async function getServerSideProps({ req, res, params }: ServerSideProps) {
  const session: any = await unstable_getServerSession(req as any, res as any, authOptions as any)
  const jwt = session?.authorization
  const client = new Client({ jwt: jwt })
  const { id } = params

  const response = await client.getFight({id: id, shot_order: []})
  if (response.status === 200) {
    const fight = await response.json()

    return {
      props: {
        fight: fight,
      }, // will be passed to the page component as props
    }
  }
  if (response.status === 404) {
    return {
      props: {
        fight: null,
        notFound: true
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
      }
    }
  }
  return {
    props: {
    }
  }
}

export default function Fight({ fight:initialFight, notFound }: FightParams) {
  const [fight, setFight] = useFight()

  useEffect(() => {
    setFight(initialFight)
  }, [setFight, initialFight])

  if (!fight && !notFound) {
    return <>Loading...</>
  }

  return (
    <>
      <Head>
        <title>{fight ? fight.name : "Fight not found"}</title>
        <meta name="description" content="Feng Shui 2 Shot Counter" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Container>
          { !fight && <>
            <Typography sx={{mt: 5}} variant="h3">Fight not found.</Typography>
          </> }
            { fight && <ShotCounter /> }
        </Container>
      </Layout>
    </>
  )
}
