import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import { Container, List, ListItem, ListItemText, Typography } from '@mui/material'

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
        <Typography variant="h1" gutterBottom>Shot Counter</Typography>
        <List>
          {fights.map((fight: any) => {
            return (
              <ListItem key={fight.id}>
                <ListItemText>{fight.name}</ListItemText>
              </ListItem>
            )
          })}
        </List>
      </main>
    </>
  )
}
