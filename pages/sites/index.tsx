import Layout from "@/components/Layout"
import Head from "next/head"

import { Skeleton, Box, Paper, IconButton, Button, Stack, Link, Container, Typography, TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material"
import { useClient, useToast } from "@/contexts"
import { useState, useReducer, useEffect } from "react"
import { sitesReducer, initialSitesState, SitesActions } from "@/reducers/sitesState"
import Sites from "@/components/sites/Sites"
import { ButtonBar } from "@/components/StyledFields"
import FilterSites from "@/components/sites/FilterSites"
import { useRouter } from 'next/router'

export default function Home() {
  const { user, client } = useClient()
  const [state, dispatch] = useReducer(sitesReducer, initialSitesState)
  const { site, sites, page, secret, edited, faction, loading, search } = state
  const { toastSuccess, toastError } = useToast()
  const router = useRouter()

  useEffect(() => {
    async function getSites() {
      try {
        console.log("Fetching sites", page)
        const data = await client.getSites({ search: search || site.name, faction_id: faction.id, secret, page })
        dispatch({ type: SitesActions.SITES, payload: data })
      } catch(error) {
        toastError()
      }
    }

    if (user?.id && edited) {
      getSites().catch(toastError)
    }
  }, [edited, dispatch, user?.id, toastError, client, search, faction?.id, secret, page, site])

  useEffect(() => {
    router.push(
      { pathname: router.pathname, query: { page: page } },
      undefined,
      { shallow: true }
    )
  }, [edited])

  return (
    <>
      <Head>
        <title>Sites</title>
      </Head>
      <main>
        <Layout>
          <Container maxWidth="md" sx={{paddingTop: 2, minWidth: 1000}}>
            <ButtonBar>
              <FilterSites state={state} dispatch={dispatch} />
            </ButtonBar>
            <Sites state={state} dispatch={dispatch} pagination={true} />
          </Container>
        </Layout>
      </main>
    </>
  )
}

