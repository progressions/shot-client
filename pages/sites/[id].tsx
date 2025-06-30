import Layout from "@/components/Layout"
import Head from "next/head"

import { Box, Container, Typography } from "@mui/material"
import { useClient, useToast } from "@/contexts"
import { useState, useReducer, useEffect } from "react"
import { sitesReducer, initialSitesState, SitesActions } from "@/reducers/sitesState"
import Sites from "@/components/sites/Sites"
import { ButtonBar } from "@/components/StyledFields"
import FilterSites from "@/components/sites/FilterSites"
import { useRouter } from 'next/router'
import { defaultSite } from "@/types/types"

export default function Home() {
  const { user, client } = useClient()
  const [state, dispatch] = useReducer(sitesReducer, initialSitesState)
  const { sites, page, edited, loading } = state
  const { toastSuccess, toastError } = useToast()
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    async function getSites() {
      try {
        console.log("Fetching Sites page ", page)
        const data = await client.getSites({ id: id })
        dispatch({ type: SitesActions.SITES, payload: data })
      } catch(error) {
        toastError()
      }
    }

    if (user?.id && edited && id) {
      getSites().catch(toastError)
    }
  }, [edited, dispatch, user?.id, toastError, client, id])

  const site = sites?.[0] || defaultSite

  if (!site?.id && !loading) {
    return (
      <>
        <Head>
          <title>Site Not Found</title>
        </Head>
        <main>
          <Layout>
            <Container maxWidth="md" sx={{paddingTop: 2, minWidth: 1000}}>
              <Typography variant="h4" component="h1" gutterBottom>
                Site Not Found
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
        <title>{site?.name} - Sites</title>
      </Head>
      <main>
        <Layout>
          <Container maxWidth="md" sx={{paddingTop: 2, minWidth: 1000}}>
            <Sites state={state} dispatch={dispatch} pagination={false} />
          </Container>
        </Layout>
      </main>
    </>
  )
}
