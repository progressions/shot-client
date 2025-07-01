import Layout from "@/components/Layout"
import Head from "next/head"
import { Typography, Container } from "@mui/material"

import { useClient, useToast } from "@/contexts"
import { useRouter } from 'next/router'
import { useEffect, useReducer } from "react"
import type { SchticksStateType, SchticksActionType } from "@/reducers/schticksState"
import { initialSchticksState, schticksReducer, SchticksActions } from "@/reducers/schticksState"
import Schticks from "@/components/schticks/Schticks"
import { defaultSchtick } from "@/types/types"

interface SchticksIndexProps {
}

export default function SchticksIndex({}: SchticksIndexProps) {
  const { user, client } = useClient()
  const { toastError, toastSuccess } = useToast()
  const router = useRouter()
  const [state, dispatch] = useReducer(schticksReducer, initialSchticksState)
  const { loading, edited, category, path, name, schticks, meta, page } = state
  const { id } = router.query

  const fetchPayload = { id }

  useEffect(() => {
    async function reload() {
      try {
        console.log("Fetching Schticks page ", page)
        const data = await client.getSchticks(fetchPayload)
        dispatch({ type: SchticksActions.SCHTICKS, payload: data })
      } catch(error) {
        console.log("Error fetching schticks:", error)
        toastError()
      }
    }

    if (user?.id && edited && id) {
      reload().catch(toastError)
    }
  }, [user, edited, fetchPayload])

  const schtick = schticks?.[0] || defaultSchtick

  if (!schtick?.id && !loading) {
    return (<>
      <Head>
        <title>Schtick Not Found</title>
      </Head>
      <main>
        <Layout>
          <Container maxWidth="md" sx={{paddingTop: 2, minWidth: 1000}}>
            <Typography variant="h4" component="h1" gutterBottom>
              Schtick Not Found
            </Typography>
          </Container>
        </Layout>
      </main>
    </>)
  }
  return (<>
    <Head>
      <title>{schtick?.name} - Schticks</title>
    </Head>
    <main>
      <Layout>
        <Container maxWidth="md" sx={{paddingTop: 2, minWidth: 1000}}>
          <Schticks state={state} dispatch={dispatch} pagination={false} />
        </Container>
      </Layout>
    </main>
  </>)
}
