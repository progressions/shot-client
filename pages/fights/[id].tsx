import { useRouter } from 'next/router'
import { useState } from 'react'
import { Paper, Container, Typography } from '@mui/material'

export async function getServerSideProps(context: any) {
  const endpoint = `${process.env.SERVER_URL}/api/v1/fights`
  const { id } = context.params
  console.log(id)
  const res = await fetch(`${endpoint}/${id}`)
  const fight = await res.json()
  console.log(fight)
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
      <Container maxWidth="sm">
        <Typography variant="h1">{fight.name}</Typography>
        <Typography variant="h6">Created {fight.created_at}</Typography>
      </Container>
    </>
  )
}
