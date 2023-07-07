import Layout from '../../components/Layout'
import Head from 'next/head'

import { Skeleton, Box, Paper, IconButton, Button, Stack, Link, Container, Typography, TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material"
import { useClient } from '../../contexts/ClientContext'
import { useReducer, useEffect } from 'react'
import { useToast } from '../../contexts/ToastContext'
import { sitesReducer, initialSitesState, SitesActions } from '../../reducers/sitesState'
import Sites from '../../components/sites/Sites'
import { ButtonBar } from "../../components/StyledFields"
import FilterSites from "../../components/sites/FilterSites"

export default function Home() {
  const { user, client } = useClient()
  const [state, dispatch] = useReducer(sitesReducer, initialSitesState)
  const { secret, edited, faction, loading, search } = state
  const { toastSuccess, toastError } = useToast()

  useEffect(() => {
    async function getSites() {
      try {
        const data = await client.getSites({ search, faction_id: faction.id, secret: secret })
        dispatch({ type: SitesActions.SITES, payload: data })
      } catch(error) {
        toastError()
      }
    }

    if (user?.id && edited) {
      getSites().catch(toastError)
    }
  }, [edited, dispatch, user?.id, toastError, client, search, faction?.id])

  return (
    <>
      <Head>
        <title>Sites</title>
      </Head>
      <main>
        <Layout>
          <Container maxWidth="md" sx={{paddingTop: 2}}>
            <ButtonBar sx={{height: 80}}>
              <FilterSites state={state} dispatch={dispatch} />
            </ButtonBar>
            <Sites state={state} dispatch={dispatch} />
          </Container>
        </Layout>
      </main>
    </>
  )
}
