import { useRouter } from 'next/router'
import { useState } from 'react'
import { Paper, Container, Typography } from '@mui/material'
import Layout from '../../components/Layout'
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import ListItemAvatar from '@mui/material/ListItemAvatar';

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

function Shot({ shot, characters }: any) {
  return (
    <>
      <ListItem key={shot}>
        <ListItemText primary={shot} key={shot} />
      </ListItem>
      {characters.map(character => {
        return (
          <ListItem key={character.id}>
            <ListItemText key={character.id} primary={character.name} />
          </ListItem>
        )
      })}
    </>
  )
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
          <List>
            {fight.shot_order.map(([shot, chars]) => <Shot key={shot} shot={shot} characters={chars} />)}
          </List>
        </Container>
      </Layout>
    </>
  )
}
