import Layout from '../../components/Layout'
import Head from 'next/head'

import { Skeleton, Box, Paper, IconButton, Button, Stack, Link, Container, Typography, TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material"
import { useClient } from '../../contexts/ClientContext'
import { useReducer, useEffect } from 'react'
import { useToast } from '../../contexts/ToastContext'
import { partiesReducer, initialPartiesState, PartiesActions } from '../../reducers/partiesState'
import Parties from '../../components/parties/Parties'

export default function Home() {
  const { user, client } = useClient()
  const [state, dispatch] = useReducer(partiesReducer, initialPartiesState)
  const parties = state?.parties || []
  const { edited, loading, name } = state
  const { toastSuccess, toastError } = useToast()

  useEffect(() => {
    async function getParties() {
      try {
        const data = await client.getParties({ name })
        dispatch({ type: PartiesActions.PARTIES, payload: data })
      } catch(error) {
        toastError()
      }
    }

    if (user?.id && edited) {
      getParties().catch(toastError)
    }
  }, [edited, dispatch, user?.id, toastError, client, name])

  return (
    <>
      <Head>
        <title>Parties</title>
      </Head>
      <main>
        <Layout>
          <Container maxWidth="md">
            <Typography variant="h1" gutterBottom>Parties</Typography>
            <Parties state={state} dispatch={dispatch} />
          </Container>
        </Layout>
      </main>
    </>
  )
}
