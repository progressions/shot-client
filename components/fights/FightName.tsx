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
  const [name, setName] = useState(fight.name)

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
    console.log("edit fight name")
    setEditing(true)
  }

  const cancelForm = () => {
    setName(fight.name)
    setEditing(false)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  const handleSubmit = async () => {
    const updatedFight = { id: fight.id, name: name } as Fight
    try {
      await client.updateFight(updatedFight)
      dispatch({ type: FightActions.EDIT })
      toastSuccess(`Name saved.`)
      setEditing(false)
    } catch(error) {
      dispatch({ type: FightActions.ERROR, payload: error as Error })
      console.error(error)
    }
  }

  if (editing) {
    return (
      <Stack direction="row" spacing={2} alignItems="baseline" sx={{marginTop: 2, marginBottom: 2}}>
        <StyledTextField name="name" autoFocus value={name} sx={{width: "100%"}} onChange={handleChange} />
        <SaveCancelButtons onCancel={cancelForm} onSave={handleSubmit} />
      </Stack>
    )
  }

  return (
    <>
      <Box onMouseEnter={showButtons} onMouseLeave={hideButtons}>
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
      </Box>
    </>
  )
}
