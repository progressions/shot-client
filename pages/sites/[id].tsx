import Layout from '@/components/Layout'
import Head from 'next/head'

import { Container } from "@mui/material"
import Sites from '@/components/sites/Sites'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()
  const { id } = router.query

  return (
    <>
      <Head>
        <title>Sites</title>
      </Head>
      <main>
        <Layout>
          <Container maxWidth="md" sx={{my: 2}}>
            <Sites id={id} />
          </Container>
        </Layout>
      </main>
    </>
  )
}
