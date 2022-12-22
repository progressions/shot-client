import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import { Paper, Container, Table, TableContainer, TableBody, TableHead, TableRow, TableCell, Typography } from '@mui/material'

const inter = Inter({ subsets: ['latin'] })

export async function getServerSideProps(context: any) {
  console.log(process.env.SERVER_URL)
  const res = await fetch(`${process.env.SERVER_URL}/api/v1/fights`)
  const fights = await res.json()
  return {
    props: {
      fights: fights
    }, // will be passed to the page component as props
  }
}

export default function Home({ fights }: any) {
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
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Fight</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fights.map((fight: any) => {
                  return (
                    <TableRow
                      key={fight.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {fight.name}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        X
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </main>
    </>
  )
}
