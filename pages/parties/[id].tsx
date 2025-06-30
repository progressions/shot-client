import Layout from "@/components/Layout"
import Head from "next/head"

import { Box, Container, Typography } from "@mui/material"
import { useClient, useToast } from "@/contexts"
import { useState, useReducer, useEffect } from "react"
import { partiesReducer, initialPartiesState, PartiesActions } from "@/reducers/partiesState"
import Parties from "@/components/parties/Parties"
import { ButtonBar } from "@/components/StyledFields"
import FilterParties from "@/components/parties/FilterParties"
import { useRouter } from 'next/router'
import { defaultParty } from "@/types/types"

export default function Home() {
  const { user, client } = useClient()
  const [state, dispatch] = useReducer(partiesReducer, initialPartiesState)
  const { parties, page, edited, loading } = state
  const { toastSuccess, toastError } = useToast()
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    async function getParties() {
      try {
        console.log("Fetching Parties page ", page)
        const data = await client.getParties({ id: id })
        dispatch({ type: PartiesActions.PARTIES, payload: data })
      } catch(error) {
        toastError()
      }
    }

    if (user?.id && edited && id) {
      getParties().catch(toastError)
    }
  }, [edited, dispatch, user?.id, toastError, client, id])

  const party = parties?.[0] || defaultParty

  if (!party?.id && !loading) {
    return (
      <>
        <Head>
          <title>Party Not Found</title>
        </Head>
        <main>
          <Layout>
            <Container maxWidth="md" sx={{paddingTop: 2, minWidth: 1000}}>
              <Typography variant="h4" component="h1" gutterBottom>
                Party Not Found
              </Typography>
            </Container>
          </Layout>
        </main>
      </>
    )
  }
  return (
    <>
      <Head>
        <title>{party?.name} - Parties</title>
      </Head>
      <main>
        <Layout>
          <Container maxWidth="md" sx={{paddingTop: 2, minWidth: 1000}}>
            <Parties state={state} dispatch={dispatch} pagination={false} />
          </Container>
        </Layout>
      </main>
    </>
  )
}
