import Layout from '@/components/Layout'
import Head from 'next/head'

import { Container } from "@mui/material"

import Weapons from "@/components/weapons/Weapons"

interface WeaponsIndexProps {
}

export default function WeaponsIndex({ }: WeaponsIndexProps) {
  return (
    <>
      <Head>
        <title>Weapons - Chi War</title>
        <meta name="description" content="Feng Shui 2 Shot Counter" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Layout>
          <Container maxWidth="md" sx={{paddingTop: 2}}>
            <Weapons />
          </Container>
        </Layout>
      </main>
    </>
  )
}
