import Layout from '../../components/Layout'
import Head from 'next/head'

import { Skeleton, Box, Paper, IconButton, Button, Stack, Link, Container, Typography, TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material"
import { useClient } from '../../contexts/ClientContext'
import { useReducer, useEffect } from 'react'
import { useToast } from '../../contexts/ToastContext'
import { sitesReducer, initialSitesState, SitesActions } from '../../reducers/sitesState'
import Sites from '../../components/sites/Sites'

export default function Home() {
  const { user, client } = useClient()
  const [state, dispatch] = useReducer(sitesReducer, initialSitesState)
  const sites = state?.sites || []
  const { edited, loading, name } = state
  const { toastSuccess, toastError } = useToast()

  useEffect(() => {
    async function getSites() {
      try {
        const data = await client.getSites({ name })
        dispatch({ type: SitesActions.SITES, payload: data })
      } catch(error) {
        toastError()
      }
    }

    if (user?.id && edited) {
      getSites().catch(toastError)
    }
  }, [edited, dispatch, user?.id, toastError, client, name])

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <main>
        <Layout>
          <Container maxWidth="md">
            <Typography variant="h1" gutterBottom>Sites</Typography>
            <Sites sites={sites} />
          </Container>
        </Layout>
      </main>
    </>
  )
}
