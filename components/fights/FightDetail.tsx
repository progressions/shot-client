import { colors, Card, CardHeader, CardContent, CardActions, Box, Tooltip, Stack, Typography, Link, IconButton, TableRow, TableCell } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import VisibilityIcon from '@mui/icons-material/Visibility'

import GamemasterOnly from "@/components/GamemasterOnly"

import { useToast, useClient } from "@/contexts"
import type { Fight, Toast } from "@/types/types"
import type { FightsStateType, FightsActionType } from "@/reducers/fightsState"
import { FightsActions } from "@/reducers/fightsState"

interface FightParams {
  fight: Fight
  dispatch: React.Dispatch<FightsActionType>
}

export default function FightDetail({ fight, dispatch }: FightParams) {
  const { user, client } = useClient()
  const { toastSuccess, toastError } = useToast()

  async function deleteFight(fight: Fight) {
    const doit = confirm(`Permanently delete ${fight.name}?`)
    if (!doit) return
    try {
      await client.deleteFight(fight)
      toastSuccess(`Fight ${fight.name} deleted`)
      dispatch({ type: FightsActions.EDIT })
    } catch(error) {
      console.error(error)
      toastError()
    }
  }

  async function toggleVisibility(fight: Fight) {
    try {
      await client.updateFight({ id: fight.id, "active": !fight.active } as Fight)
      toastSuccess(`Fight ${fight.name} updated`)
      dispatch({ type: FightsActions.EDIT })
    } catch(error) {
      // dispatch({ type: FightsActions.ERROR, payload: error })
      console.error(error)
      toastError()
    }
  }

  const updatedAt = new Date(fight.updated_at as string).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (<>
  <Card sx={{
    alignItems: 'center',
    justifyContent: 'space-between',
    mb: 2,
    background: 'linear-gradient(to bottom, ' + colors.blueGrey["800"] + ', ' + colors.blueGrey["600"] + ')',
    borderRadius: 1,
  }}>
    <CardHeader
      title={
        <Link color="text.primary" href={`/fights/${fight.id}`}>
         {fight.name}
        </Link>
      }
      subheader={`Last played ${updatedAt} - Sequence ${fight.sequence}`}
      titleTypographyProps={{variant: "h3"}}
      subheaderTypographyProps={{variant: "subtitle1"}}
      sx={{mb: -2}}
      action={
        <GamemasterOnly user={user}>
          <Tooltip title={fight.active? "Hide" : "Show"}>
            <IconButton color="primary" onClick={() => toggleVisibility(fight)}>
              { !fight.active ? <VisibilityOffIcon /> : <VisibilityIcon /> }
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton color="primary" onClick={() => deleteFight(fight)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </GamemasterOnly>
      }
    />
      <CardContent>
        { fight.description &&
          <Typography variant="h6" color="text.secondary" gutterBottom>
            { fight.description }
          </Typography>
        }
        { fight.actors && !!fight.actors.length &&
          <Box sx={{mt: 2, p: 2, backgroundColor: colors.blueGrey["800"], borderRadius: 1}}>
            <Typography variant="body1" color="text.primary">
              { fight.actors.join(', ') }
            </Typography>
          </Box>
        }
      </CardContent>
    </Card>
  </>)
}
