import Layout from '../../components/Layout'
import Head from 'next/head'

import { Skeleton, Box, Paper, IconButton, Button, Stack, Link, Container, Typography, TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material"
import { useClient } from '../../contexts/ClientContext'
import { useReducer, useEffect } from 'react'
import { useToast } from '../../contexts/ToastContext'
import { partiesReducer, initialPartiesState, PartiesActions } from '../../reducers/partiesState'
import Parties from '../../components/parties/Parties'
import { ButtonBar } from "../../components/StyledFields"
import FilterParties from "../../components/parties/FilterParties"

export default function Home() {
  const { user, client } = useClient()
  const [state, dispatch] = useReducer(partiesReducer, initialPartiesState)
  const parties = state?.parties || []
  const { secret, edited, faction, loading, search } = state
  const { toastSuccess, toastError } = useToast()

  useEffect(() => {
    async function getParties() {
      try {
        const data = await client.getParties({ search, faction_id: faction.id, secret })
        dispatch({ type: PartiesActions.PARTIES, payload: data })
      } catch(error) {
        toastError()
      }
    }

    if (user?.id && edited) {
      getParties().catch(toastError)
    }
  }, [edited, dispatch, user?.id, toastError, client, search, faction?.id, secret])

  return (
    <>
      <Head>
        <title>Parties</title>
      </Head>
      <main>
        <Layout>
          <Container maxWidth="md" sx={{paddingTop: 2}}>
            <ButtonBar sx={{height: 80}}>
              <FilterParties state={state} dispatch={dispatch} />
            </ButtonBar>
            <Parties state={state} dispatch={dispatch} />
          </Container>
        </Layout>
      </main>
    </>
  )
}
