import Head from 'next/head'
import { colors, Pagination, Box, Switch, FormControlLabel, Stack, Paper, Container, Table, TableContainer, TableBody, TableHead, TableRow, TableCell, Typography } from '@mui/material'
import { getServerClient } from "@/utils/getServerClient"

import { ButtonBar } from "@/components/StyledFields"
import AddFight from '@/components/fights/AddFight'
import FightDetail from '@/components/fights/FightDetail'
import Layout from '@/components/Layout'
import { useState, useReducer, useEffect } from 'react'

import { useToast } from "@/contexts/ToastContext"
import { useLocalStorage } from "@/contexts/LocalStorageContext"
import { useClient } from "@/contexts/ClientContext"
import GamemasterOnly from "@/components/GamemasterOnly"
import { FightsActions, initialFightsState, fightsReducer } from "@/reducers/fightsState"
import { useRouter } from "next/router"

import type { QueryType, FightsResponse, Campaign, Fight, ServerSideProps } from "@/types/types"
import axios, { AxiosError } from 'axios'

interface HomeProps extends FightsResponse {
  currentCampaign: Campaign | null
  page: number
}

export async function getServerSideProps<GetServerSideProps>({ req, res, query }: ServerSideProps) {
  const { client } = await getServerClient(req, res)
  const { page } = query as QueryType

  try {
    const currentCampaign = await client.getCurrentCampaign()
    if (!currentCampaign?.name) {
      return {
        redirect: {
          destination: "/campaigns",
          permanent: false
        }
      }
    }

    return {
      props: {
        currentCampaign: currentCampaign,
        page: page ? parseInt(page as string, 10) : null,
      }
    }
  } catch(error: unknown | AxiosError) {
    if (axios.isAxiosError(error)) {
      if (error?.response?.status === 401) {
        return {
          redirect: {
            destination: "/auth/signin",
            permanent: false
          }
        }
      }
    }

    return {
      props: {
        fights: [],
        meta: {},
        currentCampaign: null,
        page: null,
      }
    }
  }
}

export default function Home({ currentCampaign, page:initialPage }: HomeProps) {
  const [state, dispatch] = useReducer(fightsReducer, initialFightsState)
  const { client, user } = useClient()
  const { toastSuccess, toastError } = useToast()
  const { saveLocally, getLocally } = useLocalStorage()
  const { loading, edited, fights, showHidden, meta } = state
  const [page, setPage] = useState(initialPage || 1)
  const router = useRouter()

  useEffect(() => {
    const loadSuggestions = async () => {
      const data = await client.getSuggestions()
      console.log("data", data)
    }

    if (user && currentCampaign) {
      loadSuggestions().catch((error) => {
        console.error("Error loading suggestions:", error)
        toastError()
      })
    }
  }, [])

  useEffect(() => {
    const reload = async () => {
      try {
        const fightsResponse = await client.getFights({ show_all: showHidden, page: page } )
        dispatch({ type: FightsActions.FIGHTS, payload: fightsResponse })
      } catch(error) {
        console.error("Error fetching fights:", error)
        toastError()
      }
    }

    if (user && edited && currentCampaign) {
      reload()
    }

    if (!currentCampaign) {
      dispatch({ type: FightsActions.SUCCESS })
    }
  }, [edited, user, showHidden, currentCampaign, page])

  useEffect(() => {
    const showHiddenFights = getLocally("showHiddenFights") || false
    dispatch({ type: FightsActions.UPDATE, name: "showHidden", value: !!showHiddenFights })
  }, [])

  const show = (event: React.SyntheticEvent<Element, Event>, checked: boolean) => {
    saveLocally("showHiddenFights", checked)
    setPage(1)
    dispatch({ type: FightsActions.UPDATE, name: "showHidden", value: !!checked })
  }

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
    dispatch({ type: FightsActions.UPDATE, name: "page", value: value})
    router.push(
      { pathname: router.pathname, query: { page: value } },
      undefined,
      { shallow: true }
    )
  }

  return (
    <>
      <Head>
        <title>Chi War - Feng Shui 2 Shot Counter and Character Manager</title>
        <meta name="description" content="Feng Shui 2 Shot Counter" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Layout>
          <Container maxWidth="md" sx={{mt: 2, py: 2, minWidth: 1000}}>
            <Typography variant="h3" gutterBottom>Fights</Typography>
            <GamemasterOnly user={user}>
              <ButtonBar>
                <Stack direction="row" spacing={2}>
                  { <AddFight state={state} dispatch={dispatch} /> }
                  <FormControlLabel label="Show Hidden" control={<Switch checked={showHidden} />} onChange={show} />
                </Stack>
              </ButtonBar>
            </GamemasterOnly>
            { loading && <Typography gutterBottom pt={5}>Loading fights...</Typography> }
            { !loading && !!fights?.length &&
              <Box>
                <Pagination sx={{mb: 1}} count={meta.total_pages} page={page} onChange={handlePageChange} variant="outlined" color="primary" shape="rounded" size="large" />
                {
                  fights.map((fight: Fight) => (
                    <FightDetail
                      fight={fight}
                      key={fight.id}
                      dispatch={dispatch}
                    />)
                  )
                }
                <Pagination sx={{mt: 1}} count={meta.total_pages} page={page} onChange={handlePageChange} variant="outlined" color="primary" shape="rounded" size="large" />
              </Box>
            }
            { !loading && !fights?.length && <Typography pt={5}>There are no available fights. Some fights might be hidden by the gamemaster.</Typography> }
          </Container>
        </Layout>
      </main>
    </>
  )
}
