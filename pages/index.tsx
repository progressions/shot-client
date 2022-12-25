import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import { Link, Button, Paper, Container, Table, TableContainer, TableBody, TableHead, TableRow, TableCell, Typography } from '@mui/material'
import AddFight from '../components/AddFight'
import Fight from '../components/Fight'
import Layout from '../components/Layout'
import Router from 'next/router'

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
        <Layout>
          <Container maxWidth="md">
            <Typography variant="h1" gutterBottom>Shot Counter</Typography>
            <AddFight endpoint={endpoint} />
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Fight</TableCell>
                    <TableCell>Characters</TableCell>
                    <TableCell>Shot</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fights.map((fight: any) => <Fight fight={fight} key={fight.id} endpoint={endpoint} />)}
                </TableBody>
              </Table>
            </TableContainer>
          </Container>
        </Layout>
      </main>
    </>
  )
}
