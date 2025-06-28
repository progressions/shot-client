import Layout from '@/components/Layout'
import Head from 'next/head'

import { Skeleton, Box, Paper, IconButton, Button, Stack, Link, Container, Typography, TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material"
import Sites from '@/components/sites/Sites'
import { useClient, useCharacter, useToast } from "@/contexts"
import { SitesActions, initialSitesState, sitesReducer } from "@/reducers/sitesState"
import { useEffect, useReducer } from "react"
import { useRouter } from 'next/router'

export default function Home() {
  return (
    <>
      <Head>
        <title>Sites</title>
      </Head>
      <main>
        <Layout>
          <Container maxWidth="md" sx={{my: 2}}>
            <Sites />
          </Container>
        </Layout>
      </main>
    </>
  )
}
