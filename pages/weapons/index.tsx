import Layout from "@/components/Layout"
import Head from "next/head"

import { Box, Container } from "@mui/material"
import { useClient, useToast } from "@/contexts"
import { useState, useReducer, useEffect } from "react"
import { weaponsReducer, initialWeaponsState, WeaponsActions } from "@/reducers/weaponsState"
import Weapons from "@/components/weapons/Weapons"
import { ButtonBar } from "@/components/StyledFields"
import FilterWeapons from "@/components/weapons/FilterWeapons"
import { useRouter } from 'next/router'
import { QueryType, ServerSideProps } from "@/types/types"

export async function getServerSideProps<GetServerSideProps>({ req, res, query }: ServerSideProps) {
  const { page } = query as QueryType

  return {
    props: {
      page: page ? parseInt(page as string, 10) : null,
    }
  }
}

interface HomeProps {
  page: number | null
}

export default function Home({ page:initialPage }: HomeProps) {
  const { user, client } = useClient()
  const { toastSuccess, toastError } = useToast()
  const [state, dispatch] = useReducer(weaponsReducer, initialWeaponsState)
  const { weapons, edited, meta, page, loading, juncture, category, name } = state
  const router = useRouter()
  const { query } = router

  // The queryNum is first priority, then the initialPage prop.
  // When the page loads first, the initialPageProp will be set and queryNum
  // will not be. This avoids a false positive on the first load,
  // where it thinks we should load page 1 even though we're looking for page 3.
  const queryNum = query.page ? parseInt(query.page as string, 10) : null
  const initialPageNum = queryNum || initialPage

  const fetchPayload = { page, juncture, category, name }

  console.log({ page, queryNum, initialPageNum })

  useEffect(() => {
    console.log("checking page and initialPageNum", { page, initialPageNum })
    if (page !== initialPageNum) {
      dispatch({ type: WeaponsActions.PAGE, payload: initialPageNum || 1 })
    }
  }, [edited, page, initialPageNum])

  useEffect(() => {
    async function reload() {
      try {
        console.log("Fetching Weapons page ", { page, initialPageNum })
        const data = await client.getWeapons(fetchPayload)
        dispatch({ type: WeaponsActions.WEAPONS, payload: data })
      } catch(error) {
        console.log("Error fetching schticks:", error)
        toastError()
      }
    }

    if (user?.id && edited && page === initialPageNum) {
      reload().catch(toastError)
      return
    }
  }, [user, edited, page, initialPage, fetchPayload])

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

  return (
    <>
      <Head>
        <title>Weapons</title>
      </Head>
      <main>
        <Layout>
          <Container maxWidth="md" sx={{paddingTop: 2, minWidth: 1000}}>
            <ButtonBar>
              <FilterWeapons state={state} dispatch={dispatch} />
            </ButtonBar>
            <Weapons state={state} dispatch={dispatch} pagination={true} />
          </Container>
        </Layout>
      </main>
    </>
  )
}


