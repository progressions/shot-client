import type { NextApiRequest, NextApiResponse } from "next"
import { Stack, Box, Skeleton, Container, Typography } from "@mui/material"
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Router from "next/router"

import Layout from '@/components/Layout'
import ShotCounter from "@/components/fights/ShotCounter"
import Client from '@/utils/Client'

import { getServerClient } from "@/utils/getServerClient"
import { useFight } from "@/contexts/FightContext"
import { useToast } from "@/contexts/ToastContext"

import type { Viewer, ParamsType, AuthSession, ShotType, Vehicle, Person, Character, Fight, ID } from "@/types/types"
import { ServerSideProps } from "@/types/types"
import { FightActions, initialFightState, fightReducer } from "@/reducers/fightState"
import { useClient } from "@/contexts/ClientContext"
import Loading from "@/components/fights/Loading"

interface FightParams {
  fight: Fight | null
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

export default function Fight({ fight:initialFight }: FightParams) {
  const { client, user } = useClient()
  const { fight, state, dispatch } = useFight()
  const { toastError, toastSuccess } = useToast()
  const { notFound, loading, edited } = state
  const [viewingUsers, setViewingUsers] = useState<Viewer[]>([])

  const consumer = client.consumer()

  useEffect(() => {
    if (!fight?.id) {
      console.log("Skipping subscription: fight.id is null")
      return
    }
    console.log("Subscribing to FightChannel for fight:", fight.id, "type:", typeof fight.id)
    const consumer = client.consumer() // Use singleton consumer from Client
    const subscription = consumer.subscriptions.create(
      { channel: "FightChannel", fight_id: fight.id },
      {
        connected: () => console.log("Connected to FightChannel"),
        disconnected: () => console.log("Disconnected from FightChannel"),
        received: (data: FightChannelMessage) => {
          console.log("Received data:", data)
          if (data.fight === "updated") {
            dispatch({ type: FightActions.EDIT })
          } else if (data.users) {
            console.log("Setting viewing users:", data.users)
            setViewingUsers(data.users)
          }
        },
      }
    )

    return () => {
      console.log("Unsubscribing from FightChannel for fight_id:", fight.id)
      subscription.unsubscribe()
      // Avoid closing consumer.connection to allow reuse
    }
  }, [fight?.id, dispatch, client]) // Add client as dependency

  useEffect(() => {
    dispatch({ type: FightActions.FIGHT, payload: initialFight })
  }, [initialFight, dispatch])

  useEffect(() => {
    async function reloadFight(fight: Fight): Promise<void> {
      try {
        const data = await client.getFight(fight)
        dispatch({ type: FightActions.FIGHT, payload: data })
        dispatch({ type: FightActions.SUCCESS })
      } catch(error: any) {
        if (error.message === "Not Found") {
          dispatch({ type: FightActions.UPDATE, name: "notFound", value: true })
          dispatch({ type: FightActions.UPDATE, name: "loading", value: false })
        }
      }
    }

    if (!notFound && user && edited && fight?.id) {
      reloadFight(fight)
    }
  }, [notFound, fight, edited, user, client, dispatch])

  useEffect(() => {
    return
    if (!user || !fight?.id || notFound) return

    const interval = setInterval(async () => {
      try {
        const data = await client.getFight(fight)
        if (data.updated_at && fight.updated_at && data.updated_at > fight.updated_at) {
          dispatch({ type: FightActions.FIGHT, payload: data })
          dispatch({ type: FightActions.SUCCESS })
        }
      } catch (error) {
        console.error("Error polling fight:", error)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [user, fight, notFound, client, dispatch])

  if (!fight && !notFound) {
    return <>Loading...</>
  }

  const title = !notFound ? `${fight.name || "Loading"} - Chi War` : "Fight not found - Chi War"

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Feng Shui 2 Shot Counter" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Container sx={{minWidth: 1000}}>
          { notFound && <>
            <Typography sx={{mt: 5}} variant="h3">Fight not found.</Typography>
          </> }
          { !notFound && !loading && <ShotCounter viewingUsers={viewingUsers} /> }
          { !notFound && loading && <Loading /> }
        </Container>
      </Layout>
    </>
  )
}
