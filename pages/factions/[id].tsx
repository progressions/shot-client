import Layout from "@/components/Layout"
import Head from "next/head"

import { Box, Container, Typography } from "@mui/material"
import { useClient, useToast } from "@/contexts"
import { useState, useReducer, useEffect } from "react"
import { factionsReducer, initialFactionsState, FactionsActions } from "@/reducers/factionsState"
import Factions from "@/components/factions/Factions"
import { ButtonBar } from "@/components/StyledFields"
import FilterFactions from "@/components/factions/FilterFactions"
import { useRouter } from 'next/router'
import { defaultFaction } from "@/types/types"

export default function Home() {
  const { user, client } = useClient()
  const [state, dispatch] = useReducer(factionsReducer, initialFactionsState)
  const { factions, page, edited, loading } = state
  const { toastSuccess, toastError } = useToast()
  const router = useRouter()
  const { id } = router.query

  const fetchPayload = { id }

  useEffect(() => {
    async function getFactions() {
      try {
        console.log("Fetching Factions page ", page)
        const data = await client.getFactions(fetchPayload)
        dispatch({ type: FactionsActions.FACTIONS, payload: data })
      } catch(error) {
        toastError()
      }
    }

    if (user?.id && edited && id) {
      getFactions().catch(toastError)
    }
  }, [edited, user?.id, fetchPayload])

  const faction = factions?.[0] || defaultFaction

  if (!faction?.id && !loading) {
    return (<>
      <Head>
        <title>Faction Not Found</title>
      </Head>
      <main>
        <Layout>
          <Container maxWidth="md" sx={{paddingTop: 2, minWidth: 1000}}>
            <Typography variant="h4" component="h1" gutterBottom>
              Faction Not Found
            </Typography>
          </Container>
        </Layout>
      </main>
    </>)
  }
  return (<>
    <Head>
      <title>{faction?.name} - Factions</title>
    </Head>
    <main>
      <Layout>
        <Container maxWidth="md" sx={{paddingTop: 2, minWidth: 1000}}>
          <Factions state={state} dispatch={dispatch} pagination={false} />
        </Container>
      </Layout>
    </main>
  </>)
}
