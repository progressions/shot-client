import Layout from "@/components/Layout"
import Head from "next/head"

import { Skeleton, Box, Paper, IconButton, Button, Stack, Link, Container, Typography, TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material"
import { useClient, useToast } from "@/contexts"
import { useState, useReducer, useEffect } from "react"
import { partiesReducer, initialPartiesState, PartiesActions } from "@/reducers/partiesState"
import Parties from "@/components/parties/Parties"
import { ButtonBar } from "@/components/StyledFields"
import FilterParties from "@/components/parties/FilterParties"
import { useRouter } from 'next/router'

export default function Home() {
  const { user, client } = useClient()
  const [state, dispatch] = useReducer(partiesReducer, initialPartiesState)
  const { party, parties, page, secret, edited, faction, loading, search } = state
  const { toastSuccess, toastError } = useToast()
  const router = useRouter()

  useEffect(() => {
    async function getParties() {
      try {
        const data = await client.getParties({ search: search || party.name, faction_id: faction.id, secret, page })
        dispatch({ type: PartiesActions.PARTIES, payload: data })
      } catch(error) {
        toastError()
      }
    }

    if (user?.id && edited) {
      getParties().catch(toastError)
    }
  }, [edited, dispatch, user?.id, toastError, client, search, faction?.id, secret, page, party])

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
        <title>Parties</title>
      </Head>
      <main>
        <Layout>
          <Container maxWidth="md" sx={{paddingTop: 2, minWidth: 1000}}>
            <ButtonBar>
              <FilterParties state={state} dispatch={dispatch} />
            </ButtonBar>
            <Parties state={state} dispatch={dispatch} pagination={true} />
          </Container>
        </Layout>
      </main>
    </>
  )
}
