import Layout from '@/components/Layout'
import Head from 'next/head'

import { useEffect, useReducer } from "react"
import { Skeleton, Box, Paper, IconButton, Button, Stack, Link, Container, Typography, TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material"
import { useClient } from "@/contexts/ClientContext"
import { useCharacter } from "@/contexts/CharacterContext"
import { useCampaign } from "@/contexts/CampaignContext"
import { useToast } from "@/contexts/ToastContext"

import { ButtonBar } from "@/components/StyledFields"
import CreateCampaign from "@/components/campaigns/CreateCampaign"
import Campaigns from "@/components/campaigns/Campaigns"
import GamemasterOnly from "@/components/GamemasterOnly"
import FilterWeapons from "@/components/weapons/FilterWeapons"
import { WeaponsActions, initialWeaponsState, weaponsReducer } from "@/reducers/weaponsState"

import Weapons from "@/components/weapons/Weapons"
import type { Campaign } from "@/types/types"

export default function WeaponsIndex() {
  const { character } = useCharacter()
  const { user, client } = useClient()
  const [state, dispatch] = useReducer(weaponsReducer, initialWeaponsState)
  const weapons = state?.weapons || []
  const { edited, page, loading, juncture, category, name } = state
  const { toastSuccess, toastError } = useToast()

  useEffect(() => {
    async function getWeapons() {
      try {
        const data = await client.getWeapons({ page, juncture, category, name, character_id: character?.id as string })
        dispatch({ type: WeaponsActions.WEAPONS, payload: data })
      } catch(error) {
        toastError()
      }
    }

    if (user?.id && edited) {
      getWeapons().catch(toastError)
    }
  }, [edited, character?.id, dispatch, user?.id, juncture, category, toastError, client, page, name])

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
          <Container maxWidth="md" sx={{paddingTop: 2}}>
            { !loading && <>
              <ButtonBar sx={{height: 80}}>
                <FilterWeapons state={state} dispatch={dispatch} />
              </ButtonBar>
              <Weapons state={state} dispatch={dispatch} />
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
