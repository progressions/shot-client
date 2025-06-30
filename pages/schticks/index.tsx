import Layout from "@/components/Layout"
import Head from "next/head"
import { Container } from "@mui/material"

import { useClient, useToast } from "@/contexts"
import { useRouter } from 'next/router'
import { useEffect, useReducer } from "react"
import type { SchticksStateType, SchticksActionType } from "@/reducers/schticksState"
import { initialSchticksState, schticksReducer, SchticksActions } from "@/reducers/schticksState"
import Schticks from "@/components/schticks/Schticks"
import { QueryType } from "@/types/types"

interface SchticksIndexProps {
}

export default function SchticksIndex({}: SchticksIndexProps) {
  const { user, client } = useClient()
  const { toastError, toastSuccess } = useToast()
  const router = useRouter()
  const [state, dispatch] = useReducer(schticksReducer, initialSchticksState)
  const { loading, edited, category, path, name, schticks, meta, page } = state
  const { query } = router
  const { page:initialPage } = query as QueryType
  const initialPageNum = initialPage ? parseInt(initialPage as string, 10) : 1

  const fetchPayload = { page, category, path, name }

  useEffect(() => {
    if (page !== initialPageNum) {
      dispatch({ type: SchticksActions.PAGE, payload: initialPageNum })
    }
  }, [page, initialPageNum])

  useEffect(() => {
    if (edited) return
    if (!page) return

    if (page > meta.total_pages) {
      router.push(
        { pathname: router.pathname, query: { page: 1 } },
        undefined,
        { shallow: true }
      )
    }
  }, [edited, page, meta])

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

    if (user?.id && edited && page === initialPageNum) {
      reload().catch(toastError)
    }
  }, [user, edited, initialPage, fetchPayload])
  return (
    <>
      <Head>
        <title>Schticks - Chi War</title>
        <meta name="description" content="Feng Shui 2 Shot Counter" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Layout>
          <Container maxWidth="md" sx={{paddingTop: 2, minWidth: 1000}}>
            <Schticks state={state} dispatch={dispatch} pagination={true} />
          </Container>
        </Layout>
      </main>
    </>
  )
}

