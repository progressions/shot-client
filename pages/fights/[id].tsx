import type { NextApiRequest, NextApiResponse } from "next"
import { Container, Typography } from "@mui/material"
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
import { FightsActions, initialFightsState, fightsReducer } from "../../components/fights/fightsState"
import { useClient } from "../../contexts/ClientContext"

interface FightParams {
  fight: Fight | null,
  notFound?: boolean
}

export async function getServerSideProps({ req, res, params }: ServerSideProps) {
  const { client } = await getServerClient(req, res)
  const { id } = params as ParamsType

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
  if (response.status === 500) {
    return {
      redirect: {
        permanent: false,
        destination: "/"
      }
    }
  }
  return {
    props: {
    }
  }
}

export default function Fight({ fight:initialFight, notFound }: FightParams) {
  const { client, user } = useClient()
  const { fight, state, dispatch } = useFight()
  const { edited } = state

  useEffect(() => {
    dispatch({ type: FightsActions.FIGHT, payload: initialFight })
  }, [initialFight, dispatch])

  useEffect(() => {
    async function reloadFight(fight: Fight): Promise<void> {
      const response = await client.getFight(fight)
      if (response.status === 200) {
        const data = await response.json()
        dispatch({ type: FightsActions.FIGHT, payload: data })
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
          { fight && <ShotCounter /> }
        </Container>
      </Layout>
    </>
  )
}
