import { useRouter } from 'next/router'
import { useState } from 'react'
import { Paper, Container, Typography } from '@mui/material'
import Layout from 'components/Layout'

export async function getServerSideProps(context: any) {
  const endpoint = `${process.env.SERVER_URL}/api/v1/fights`
  const { id } = context.params
  const res = await fetch(`${endpoint}/${id}`)
  const fight = await res.json()
  return {
    props: {
      fight: fight,
      endpoint: endpoint,
    }, // will be passed to the page component as props
  }
}

export default function Fight({ fight }: any) {
  const router = useRouter()
  const { id } = router.query
  return (
    <>
      <Layout>
        <Container maxWidth="sm">
          <Typography variant="h1">{fight.name}</Typography>
          <Typography variant="h6">Created {fight.created_at}</Typography>
        </Container>
      </Layout>
    </>
  )
}
