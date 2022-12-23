import { useRouter } from 'next/router'
import { useState } from 'react'

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
      <h1>{fight.name}</h1>
      <p>Created {fight.created_at}</p>
    </>
  )
}
