import Layout from "@/components/Layout"
import Head from "next/head"

import { Box, Container, Typography } from "@mui/material"
import { useClient, useToast } from "@/contexts"
import { useState, useReducer, useEffect } from "react"
import { juncturesReducer, initialJuncturesState, JuncturesActions } from "@/reducers/juncturesState"
import Junctures from "@/components/junctures/Junctures"
import { ButtonBar } from "@/components/StyledFields"
import FilterJunctures from "@/components/junctures/FilterJunctures"
import { useRouter } from 'next/router'
import { defaultJuncture } from "@/types/types"

export default function Home() {
  const { user, client } = useClient()
  const [state, dispatch] = useReducer(juncturesReducer, initialJuncturesState)
  const { junctures, page, edited, loading } = state
  const { toastSuccess, toastError } = useToast()
  const router = useRouter()
  const { id } = router.query

  const fetchPayload = { id }

  useEffect(() => {
    async function getJunctures() {
      try {
        console.log("Fetching Junctures page ", page)
        const data = await client.getJunctures(fetchPayload)
        dispatch({ type: JuncturesActions.JUNCTURES, payload: data })
      } catch(error) {
        toastError()
      }
    }

    if (user?.id && edited && id) {
      getJunctures().catch(toastError)
    }
  }, [edited, user?.id, fetchPayload])

  const juncture = junctures?.[0] || defaultJuncture

  if (!juncture?.id && !loading) {
    return (<>
      <Head>
        <title>Juncture Not Found</title>
      </Head>
      <main>
        <Layout>
          <Container maxWidth="md" sx={{paddingTop: 2, minWidth: 1000}}>
            <Typography variant="h4" component="h1" gutterBottom>
              Juncture Not Found
            </Typography>
          </Container>
        </Layout>
      </main>
    </>)
  }
  return (<>
    <Head>
      <title>{juncture?.name} - Junctures</title>
    </Head>
    <main>
      <Layout>
        <Container maxWidth="md" sx={{paddingTop: 2, minWidth: 1000}}>
          <Junctures state={state} dispatch={dispatch} pagination={false} />
        </Container>
      </Layout>
    </main>
  </>)
}
