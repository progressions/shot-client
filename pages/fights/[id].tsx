import { useRouter } from 'next/router'
import { useState } from 'react'
import { Table, TableContainer, TableBody, TableRow, TableHead, TableCell, Paper, Container, Typography } from '@mui/material'
import Layout from '../../components/Layout'
import Shot from '../../components/Shot'
import AddCharacter from '../../components/AddCharacter'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Router from "next/router"

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

export default function Fight({ fight, endpoint }: any) {
  const router = useRouter()
  const { id } = router.query
  return (
    <>
      <Layout>
        <Container maxWidth="sm">
          <Typography variant="h1">{fight.name}</Typography>
          <Typography variant="h6">Created {fight.created_at}</Typography>
          <AddCharacter fight={fight} endpoint={endpoint} />
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableBody>
                {fight.shot_order.map(([shot, chars]: any) => <Shot key={shot} shot={shot} characters={chars} />)}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Layout>
    </>
  )
}
