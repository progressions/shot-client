import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import { Button, Paper, Container, Table, TableContainer, TableBody, TableHead, TableRow, TableCell, Typography } from '@mui/material'
import AddFight from '../lib/AddFight'
import Fight from '../lib/Fight'
import Router from 'next/router'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export async function getServerSideProps(context: any) {
  console.log(process.env.SERVER_URL)
  const endpoint = `${process.env.SERVER_URL}/api/v1/fights`
  const res = await fetch(endpoint)
  const fights = await res.json()
  return {
    props: {
      fights: fights,
      endpoint: endpoint,
    }, // will be passed to the page component as props
  }
}

export default function Home({ fights, endpoint }: any) {
  return (
    <>
      <Head>
        <title>Shot Counter</title>
        <meta name="description" content="Feng Shui 2 Shot Counter" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Container maxWidth="sm">
          <Typography variant="h1" gutterBottom>Shot Counter</Typography>
          <AddFight endpoint={endpoint} />
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Fight</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fights.map((fight: any) => <Fight fight={fight} key={fight.id} endpoint={endpoint} />)}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </main>
    </>
  )
}
