import { Box, Button, ButtonGroup, Stack, Tooltip, Typography } from "@mui/material"
import EditIcon from '@mui/icons-material/Edit'
import { useState } from "react"

import type { Fight } from "../../types/types"

import { StyledTextField, SaveCancelButtons } from "../StyledFields"
import { useFight } from "../../contexts/FightContext"
import { useClient } from "../../contexts/ClientContext"
import { useToast } from "../../contexts/ToastContext"
import { FightActions } from "../../reducers/fightState"

interface FightNameProps {
  fight: Fight
}

export default function FightName() {
  const { fight, dispatch } = useFight()
  const { client, user } = useClient()
  const { toastSuccess } = useToast()

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [tempFight, setTempFight] = useState({ name: fight.name, description: fight.description })

  const showButtons = () => {
    if (user?.gamemaster) {
      setOpen(true)
      return
    }
  }

  const hideButtons = () => {
    setOpen(false)
  }

  const editFightName = () => {
    setEditing(true)
  }

  const cancelForm = () => {
    setTempFight({ name: fight.name, description: fight.description })
    setEditing(false)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTempFight({ ...tempFight, [event.target.name]: event.target.value })
  }

  const handleSubmit = async () => {
    const updatedFight = { id: fight.id, name: tempFight.name, description: tempFight.description } as Fight
    try {
      await client.updateFight(updatedFight)
      dispatch({ type: FightActions.EDIT })
      toastSuccess(`Fight updated.`)
      setEditing(false)
    } catch(error) {
      dispatch({ type: FightActions.ERROR, payload: error as Error })
      console.error(error)
    }
  }

  if (editing) {
    return (
      <Stack spacing={2} alignItems="baseline" sx={{marginTop: 2, marginBottom: 2}}>
        <StyledTextField name="name" autoFocus value={tempFight.name} fullWidth onChange={handleChange} />
        <StyledTextField multiline label="Description" fullWidth autoFocus required name="description" value={tempFight.description || ""} onChange={handleChange} />
        <SaveCancelButtons onCancel={cancelForm} onSave={handleSubmit} />
      </Stack>
    )
  }

  return (
    <>
      <Box onMouseEnter={showButtons} onMouseLeave={hideButtons}>
        <Stack mb={1}>
          <Stack direction="row" spacing={2} alignItems="baseline" sx={{marginTop: 2}}>
            <Typography variant="h2" gutterBottom sx={{width: "100%"}}>
              {fight.name}
            </Typography>
            <Box visibility={open ? "visible" : "hidden"}>
              <ButtonGroup size="small">
                <Tooltip title="Edit Name" arrow>
                  <Button variant="contained" color="primary" onClick={editFightName}>
                    <EditIcon />
                  </Button>
                </Tooltip>
              </ButtonGroup>
            </Box>
          </Stack>
          { fight.description &&
            <Typography>
              {fight.description}
            </Typography>
          }
        </Stack>
      </Box>
    </>
  )
}
