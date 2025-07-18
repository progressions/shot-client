import { Container, Typography } from "@mui/material"
import Head from "next/head"
import { useEffect } from "react"
import Router from "next/router"

import Layout from "@/components/Layout"
import ShotCounter from "@/components/fights/ShotCounter"

import { getServerClient } from "@/utils/getServerClient"
import { useLocalStorage, useFight, useWebSocket, useToast, useClient } from "@/contexts"

import type { Viewer, ParamsType, AuthSession, ShotType, Vehicle, Person, Character, Fight, ID } from "@/types/types"
import { ServerSideProps } from "@/types/types"
import { FightActions } from "@/reducers/fightState"
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
        destination: "/auth/signin",
      },
      props: {
        fight: { id } as Fight,
      },
    }
  }
  return {
    props: {
      fight: { id } as Fight,
    },
  }
}

export default function Fight({ fight: initialFight }: FightParams) {
  const { client, user } = useClient()
  const { fight, state, dispatch } = useFight()
  const { toastError, toastSuccess } = useToast()
  const { notFound, loading, edited } = state
  const { viewingUsers } = useWebSocket()
  const { saveLocally, getLocally } = useLocalStorage()

  useEffect(() => {
    dispatch({ type: FightActions.FIGHT, payload: initialFight })
  }, [initialFight, dispatch])

  useEffect(() => {
    async function reloadFight(fight: Fight): Promise<void> {
      try {
        const data = await client.getFight(fight)
        dispatch({ type: FightActions.FIGHT, payload: data })
        dispatch({ type: FightActions.SUCCESS })

        console.log("clearing local storage for fight events")
        saveLocally(`fight-events-${fight.id}`, null)
      } catch (error: any) {
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
        <Container sx={{ width: "100%" }}>
          {notFound && (
            <Typography sx={{ mt: 5 }} variant="h3">
              Fight not found.
            </Typography>
          )}
          {!notFound && !loading && <ShotCounter />}
          {!notFound && loading && <Loading />}
        </Container>
      </Layout>
    </>
  )
}
