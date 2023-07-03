import Head from 'next/head'
import { Switch, FormControlLabel, Stack, Paper, Container, Table, TableContainer, TableBody, TableHead, TableRow, TableCell, Typography } from '@mui/material'
import { getServerClient } from "../utils/getServerClient"

import { ButtonBar } from "../components/StyledFields"
import AddFight from '../components/fights/AddFight'
import FightDetail from '../components/fights/FightDetail'
import Layout from '../components/Layout'
import { useReducer, useEffect } from 'react'

import { useToast } from "../contexts/ToastContext"
import { useLocalStorage } from "../contexts/LocalStorageContext"
import { useClient } from "../contexts/ClientContext"
import GamemasterOnly from "../components/GamemasterOnly"
import { FightsActions, initialFightsState, fightsReducer } from "../reducers/fightsState"

import type { FightsResponse, Campaign, Fight, ServerSideProps } from "../types/types"
import axios, { AxiosError } from 'axios'

interface HomeProps extends FightsResponse {
  currentCampaign: Campaign | null
}

export async function getServerSideProps<GetServerSideProps>({ req, res }: ServerSideProps) {
  const { client } = await getServerClient(req, res)

  try {
    const currentCampaign = await client.getCurrentCampaign()
    const fightsResponse = await client.getFights()

    return {
      props: {
        ...fightsResponse,
        currentCampaign: currentCampaign
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
      }
    }
  }
}

export default function Home({ currentCampaign, fights:initialFights, meta }: HomeProps) {
  const [state, dispatch] = useReducer(fightsReducer, initialFightsState)
  const { client, user } = useClient()
  const { toastSuccess, toastError } = useToast()
  const { saveLocally, getLocally } = useLocalStorage()
  const { loading, edited, fights, showHidden } = state

  useEffect(() => {
    const reload = async () => {
      try {
        const fightsResponse = await client.getFights({ show_all: showHidden } )
        dispatch({ type: FightsActions.FIGHTS, payload: fightsResponse })
      } catch(error) {
        toastError()
      }
    }

    if (user && edited && currentCampaign) {
      reload()
    }

    if (!currentCampaign) {
      dispatch({ type: FightsActions.SUCCESS })
    }
  }, [edited, user, dispatch, client, showHidden, toastError, currentCampaign])

  useEffect(() => {
    const showHiddenFights = getLocally("showHiddenFights") || false
    dispatch({ type: FightsActions.UPDATE, name: "showHidden", value: !!showHiddenFights })
  }, [getLocally, dispatch])

  const show = (event: React.SyntheticEvent<Element, Event>, checked: boolean) => {
    saveLocally("showHiddenFights", checked)
    dispatch({ type: FightsActions.UPDATE, name: "showHidden", value: !!checked })
  }

  if (loading) {
    return <div>Loading...</div>
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
          <Container maxWidth="md">
            <Typography variant="h1" gutterBottom>Fights</Typography>
            <GamemasterOnly user={user}>
              <ButtonBar>
                <Stack direction="row" spacing={2}>
                  { currentCampaign?.id && <AddFight state={state} dispatch={dispatch} /> }
                  <FormControlLabel label="Show Hidden" control={<Switch checked={showHidden} />} onChange={show} />
                </Stack>
              </ButtonBar>
            </GamemasterOnly>
            { !!fights?.length &&
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{"& th": { color: "text.secondary" }}}>
                      <TableCell>Fight</TableCell>
                      <TableCell>Characters</TableCell>
                      <TableCell>Shot</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody sx={{"& tr": { "& td": { color: "text.primary" }}}}>
                    {
                      fights.map((fight: Fight) => (
                        <FightDetail
                          fight={fight}
                          key={fight.id}
                          state={state}
                          dispatch={dispatch}
                        />)
                      )
                    }
                  </TableBody>
                </Table>
              </TableContainer> }
            { !fights?.length && <Typography pt={5}>There are no available fights. Some fights might be hidden by the gamemaster.</Typography> }
          </Container>
        </Layout>
      </main>
    </>
  )
}
