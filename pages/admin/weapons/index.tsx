import Layout from '../../../components/Layout'
import Head from 'next/head'

import { useEffect, useReducer } from "react"
import { Skeleton, Box, Paper, IconButton, Button, Stack, Link, Container, Typography, TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material"
import { useClient } from "../../../contexts/ClientContext"
import { useCharacter } from "../../../contexts/CharacterContext"
import { useCampaign } from "../../../contexts/CampaignContext"
import { useToast } from "../../../contexts/ToastContext"
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
import Weapons from "../../../components/weapons/Weapons"

import type { Campaign } from "../../../types/types"
import { GetServerSideProps } from 'next'
import { InferGetServerSidePropsType } from 'next'

export default function WeaponsIndex(data: any) {
  const { character } = useCharacter()
  const { user, client } = useClient()
  const [filter, dispatchFilter] = useReducer(filterReducer, initialFilter)
  const weapons = filter?.weapons || []
  const { edited, page, loading, juncture, name } = filter
  const { toastSuccess, toastError } = useToast()

  useEffect(() => {
    async function getWeapons() {
      console.log("getWeapons", juncture)
      const response = await client.getWeapons({ page, juncture, name, character_id: character?.id as string })
      if (response.status === 200) {
        const data = await response.json()
        dispatchFilter({ type: "weapons", payload: data })
      }
    }

    if (user?.id && edited) {
      getWeapons().catch(toastError)
    }
  }, [edited, character?.id, dispatchFilter, user?.id, juncture, toastError, client, page, name])

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
