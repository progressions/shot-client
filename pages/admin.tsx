import Head from 'next/head'
import { Avatar, Box, Tabs, Tab, Button, Stack, Container, Typography, TextField } from '@mui/material'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import Layout from '../components/Layout'
import { useSession } from 'next-auth/react'
import { authOptions } from './api/auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"
import { useState } from 'react'
import { useRouter } from "next/router"
import PeopleIcon from '@mui/icons-material/People';

const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL

export async function getServerSideProps({ req, res, params }: any) {
  const session: any = await unstable_getServerSession(req as any, res as any, authOptions as any)
  const jwt = session?.authorization
  const id = session?.id

  if (!session?.user?.admin) {
    return {
      redirect: {
        permanent: false,
        destination: "/"
      },
      props: {}
    }
  }

  return {
    props: {
      jwt: jwt,
      user: session?.user,
    }, // will be passed to the page component as props
  }
}

export default function Admin({ jwt }: any) {
  const [value, setValue] = useState('1')
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  return (
    <>
      <Head>
        <title>Admin</title>
        <meta name="description" content="Feng Shui 2 Shot Counter" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Layout>
          <Container maxWidth="md">
            <Typography variant="h1">Admin</Typography>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChange}>
                  <Tab label='Users' icon={<PeopleIcon />} iconPosition='start' value='1' />
                  <Tab label='Something else' value='2' disabled />
                </TabList>
              </Box>
              <TabPanel value='1'>
              </TabPanel>
              <TabPanel value='2'>Panel two</TabPanel>
            </TabContext>
          </Container>
        </Layout>
      </main>
    </>
  )
}
