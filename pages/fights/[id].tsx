import type { NextApiRequest, NextApiResponse } from "next"
import { Stack, Box, Skeleton, Container, Typography } from "@mui/material"
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Router from "next/router"

import Layout from '../../components/Layout'
import ShotCounter from "../../components/fights/ShotCounter"
import Client from '../../components/Client'

import { getServerClient } from "../../utils/getServerClient"
import { useFight } from "../../contexts/FightContext"

import type { ParamsType, AuthSession, ShotType, Vehicle, Person, Character, Fight, ID } from "../../types/types"
import { ServerSideProps } from "../../types/types"
import { FightActions, initialFightState, fightReducer } from "../../reducers/fightState"
import { useClient } from "../../contexts/ClientContext"
import Loading from "../../components/fights/Loading"

interface FightParams {
  fight: Fight | null,
  notFound?: boolean
}

export async function getServerSideProps({ req, res, params }: ServerSideProps) {
  const { client, user } = await getServerClient(req, res)
  const { id } = params as ParamsType

  if (!user) {
    return {
      redirect: {
        permanent: false,
        destination: "/auth/signin"
      },
      props: {
        fight: { id } as Fight
      }
    }
  }
  return {
    props: {
      fight: { id } as Fight
    }
  }
}

export default function Fight({ fight:initialFight, notFound }: FightParams) {
  const { client, user } = useClient()
  const { fight, state, dispatch } = useFight()
  const { loading, edited } = state

  useEffect(() => {
    dispatch({ type: FightActions.FIGHT, payload: initialFight })
  }, [initialFight, dispatch])

  useEffect(() => {
    async function reloadFight(fight: Fight): Promise<void> {
      const response = await client.getFight(fight)
      if (response.status === 200) {
        const data = await response.json()
        dispatch({ type: FightActions.FIGHT, payload: data })
        dispatch({ type: FightActions.SUCCESS })
      }
    }

    if (user && edited && fight?.id) {
      reloadFight(fight).catch(console.error)
    }
  }, [fight, edited, user, client, dispatch])

  if (!fight && !notFound) {
    return <>Loading...</>
  }

  const title = fight ? `${fight.name} - Chi War` : "Fight not found - Chi War"

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Feng Shui 2 Shot Counter" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Container>
          { !fight && <>
            <Typography sx={{mt: 5}} variant="h3">Fight not found.</Typography>
          </> }
          { !loading && <ShotCounter /> }
          { loading && <Loading /> }
        </Container>
      </Layout>
    </>
  )
}
