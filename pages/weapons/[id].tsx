import Layout from "@/components/Layout"
import Head from "next/head"

import { Box, Container, Typography } from "@mui/material"
import { useClient, useToast } from "@/contexts"
import { useState, useReducer, useEffect } from "react"
import { weaponsReducer, initialWeaponsState, WeaponsActions } from "@/reducers/weaponsState"
import Weapons from "@/components/weapons/Weapons"
import { ButtonBar } from "@/components/StyledFields"
import FilterWeapons from "@/components/weapons/FilterWeapons"
import { useRouter } from 'next/router'
import { defaultWeapon } from "@/types/types"

export default function Home() {
  const { user, client } = useClient()
  const [state, dispatch] = useReducer(weaponsReducer, initialWeaponsState)
  const { weapons, page, edited, loading } = state
  const { toastSuccess, toastError } = useToast()
  const router = useRouter()
  const { id } = router.query

  const fetchPayload = { id }

  useEffect(() => {
    async function getWeapons() {
      try {
        console.log("Fetching Weapons page ", page)
        const data = await client.getWeapons(fetchPayload)
        dispatch({ type: WeaponsActions.WEAPONS, payload: data })
      } catch(error) {
        toastError()
      }
    }

    if (user?.id && edited && id) {
      getWeapons().catch(toastError)
    }
  }, [edited, user?.id, fetchPayload])

  const weapon = weapons?.[0] || defaultWeapon

  if (!weapon?.id && !loading) {
    return (<>
      <Head>
        <title>Weapon Not Found</title>
      </Head>
      <main>
        <Layout>
          <Container maxWidth="md" sx={{paddingTop: 2, minWidth: 1000}}>
            <Typography variant="h4" component="h1" gutterBottom>
              Weapon Not Found
            </Typography>
          </Container>
        </Layout>
      </main>
    </>)
  }
  return (<>
    <Head>
      <title>{weapon?.name} - Weapons</title>
    </Head>
    <main>
      <Layout>
        <Container maxWidth="md" sx={{paddingTop: 2, minWidth: 1000}}>
          <Weapons state={state} dispatch={dispatch} pagination={false} />
        </Container>
      </Layout>
    </main>
  </>)
}
