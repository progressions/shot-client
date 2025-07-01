// components/FightDetail.tsx
import { colors, Card, CardHeader, CardContent, CardActions, Box, Tooltip, Stack, Typography, Link, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import VisibilityIcon from '@mui/icons-material/Visibility'
import HourglassTopIcon from '@mui/icons-material/HourglassTop'

import GamemasterOnly from '@/components/GamemasterOnly'
import CharacterAvatars from '@/components/fights/CharacterAvatars'
import RichTextRenderer from '@/components/editor/RichTextRenderer'

import { useToast, useClient } from '@/contexts'
import type { Fight, Toast } from '@/types/types'
import type { FightsStateType, FightsActionType } from '@/reducers/fightsState'
import { FightsActions } from '@/reducers/fightsState'
import { useEffect, useState } from 'react'
import ReactDOMServer from "react-dom/server"
import CS from "@/services/CharacterService"

interface FightParams {
  fight: Fight
  dispatch: React.Dispatch<FightsActionType>
}

export default function FightDetail({ fight, dispatch }: FightParams) {
  const { user, client } = useClient()
  const { toastSuccess, toastError } = useToast()
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    return () => {
      setLoading(false)
    }
  }, [fight])

  async function deleteFight(fight: Fight) {
    const doit = confirm(`Permanently delete ${fight.name}?`)
    if (!doit) return
    try {
      await client.deleteFight(fight)
      toastSuccess(`Fight ${fight.name} deleted`)
      dispatch({ type: FightsActions.EDIT })
    } catch (error) {
      console.error(error)
      toastError()
    }
  }

  async function toggleVisibility(fight: Fight) {
    try {
      setLoading(true)
      await client.updateFight({ id: fight.id, active: !fight.active } as Fight)
      toastSuccess(`Fight ${fight.name} updated`)
      dispatch({ type: FightsActions.EDIT })
    } catch (error) {
      console.error(error)
      toastError()
    } finally {
      setLoading(false) // Ensure loading state is reset
    }
  }

  const updatedAt = new Date(fight.updated_at as string).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const cardActions = loading ? (
    <Tooltip title="Loading...">
      <IconButton color="primary">
        <HourglassTopIcon color="primary" />
      </IconButton>
    </Tooltip>
  ) : (
    <GamemasterOnly user={user}>
      <Tooltip title={fight.active ? 'Hide' : 'Show'}>
        <IconButton color="primary" onClick={() => toggleVisibility(fight)}>
          {fight.active ? <VisibilityIcon /> : <VisibilityOffIcon />}
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton color="primary" onClick={() => deleteFight(fight)}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </GamemasterOnly>
  )

  const actors = user?.id ? (<>
    { fight.actors?.map((actor, index) => (
      <Link key={actor.id} href={CS.isVehicle(actor) ? `/vehicles/${actor.id}` : `/characters/${actor.id}`} className="mention" target="_blank" data-mention-id={actor.id} data-mention-class-name={ CS.isVehicle(actor) ? 'Vehicle' : 'Character' }>
        {actor.name}
      </Link>
    )) }
  </>) : null

  const actorsHtml = actors ? ReactDOMServer.renderToStaticMarkup(actors) : null

  return (
    <Card
      sx={{
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 2,
        background: 'linear-gradient(to bottom, ' + colors.blueGrey['800'] + ', ' + colors.blueGrey['600'] + ')',
        borderRadius: 1,
      }}
    >
      <CardHeader
        title={
          <Link color="text.primary" href={`/fights/${fight.id}`}>
            {fight.name}
          </Link>
        }
        subheader={`Last played ${updatedAt} - Sequence ${fight.sequence}`}
        titleTypographyProps={{ variant: 'h3' }}
        subheaderTypographyProps={{ variant: 'subtitle1' }}
        sx={{ mb: -2 }}
        action={cardActions}
      />
      <CardContent>
        {fight.description && (
          <RichTextRenderer key={fight.description} html={fight.description} />
        )}
        {fight.actors && !!fight.actors.length && (
          <Box sx={{ mt: 2, p: 2, backgroundColor: colors.blueGrey['800'], borderRadius: 1 }}>
            <Typography variant="body1" color="text.primary">
              <RichTextRenderer key={actorsHtml} html={actorsHtml} />
            </Typography>
          </Box>
        )}
      </CardContent>
      <CardActions>
        <CharacterAvatars characters={fight.actors} />
      </CardActions>
    </Card>
  )
}
