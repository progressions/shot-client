import { colors, Avatar, Tooltip, IconButton, Card, CardHeader, CardContent, CardActions, Stack, Typography } from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import ClearIcon from '@mui/icons-material/Clear'
import EditIcon from '@mui/icons-material/Edit'

import SchtickCardBase from "@/components/schticks/SchtickCardBase"
import { useClient } from "@/contexts/ClientContext"
import { useToast } from "@/contexts/ToastContext"
import { useCharacter } from "@/contexts/CharacterContext"
import { useState, useMemo } from "react"
import SchtickModal from "@/components/schticks/SchtickModal"

import { SchticksActions } from "@/reducers/schticksState"
import type { Character, Schtick } from "@/types/types"
import type { SchticksStateType, SchticksActionType } from "@/reducers/schticksState"
import { CharacterActions } from "@/reducers/characterState"

/*

Guns: GiPistolGun
Martial Arts: FaFistRaised
Creature: GiFangs
Transformed Animal: GiFlatPawPrint
Mutant: FaDna
Scroungetech: GiGears

*/

interface SchtickCardProps {
  schtick: Schtick
  state: SchticksStateType
  dispatch: React.Dispatch<SchticksActionType>
}

export default function SchtickCard({ schtick, state, dispatch }: SchtickCardProps) {
  const [open, setOpen] = useState(false)
  const { toastSuccess, toastError } = useToast()
  const { user, client } = useClient()
  const { state:characterState, dispatch:dispatchCharacter } = useCharacter()
  const { character } = characterState

  async function reloadCharacter(char: Character) {
    try {
      const data = await client.getCharacter(char)
      dispatchCharacter({ type: CharacterActions.CHARACTER, payload: data })
    } catch(error) {
      toastError()
    }
  }

  async function reloadSchticks() {
    try {
      const data = await client.getSchticks()
      if (dispatch) {
        dispatch({ type: SchticksActions.SCHTICKS, payload: data })
      }
    } catch(error) {
      console.error(error)
    }
  }

  async function removeSchtick() {
    try {
      await client.removeSchtick(character, schtick)
      await reloadCharacter(character)
      toastSuccess("Schtick removed.")
    } catch(error) {
      toastError()
    }
  }

  async function deleteSchtick() {
    try {
      await client.deleteSchtick(schtick)
      await reloadSchticks()
      toastSuccess("Schtick deleted.")
    } catch(error) {
      toastError()
    }
  }

  function editSchtick() {
    setOpen(true)
  }

  const deletion = !character?.id

  const deleteFunction = deletion ? deleteSchtick : removeSchtick

  const editButton = deletion ? (
    <Tooltip title="Edit" key="edit">
      <IconButton onClick={editSchtick}>
        <EditIcon />
      </IconButton>
    </Tooltip>
  ) : null

  const deleteButton = useMemo(() => {
    const prereqIds = character?.schticks?.map((s: Schtick) => s.prerequisite.id) || []
    const schtickHasPrereq = prereqIds.includes(schtick?.id)

    const tooltip = deletion ? "Delete" : "Remove"
    const icon = deletion ? <DeleteIcon /> : <ClearIcon />

    return !schtickHasPrereq ? (
      <Tooltip title={tooltip} key="delete">
        <IconButton onClick={deleteFunction}>
          { icon }
        </IconButton>
      </Tooltip>
    ) : ""
  }, [character, schtick, deleteFunction, deletion])

  if (!schtick) return <></>
  // Include an icon for the schtick's category
  //
  // Maybe a specific color for each "path"
  const avatar = <Avatar sx={{bgcolor: schtick.color || 'secondary', color: "white"}} variant="rounded">{schtick.category[0]}</Avatar>

  return (
    <>
      <SchtickCardBase
        title={schtick.name}
        subheader={schtick.path}
        avatar={avatar}
        action={[editButton, deleteButton]}
      >
        <Typography variant="body2" gutterBottom>
          {schtick.description}
        </Typography>
        { schtick.prerequisite.name &&
          <Typography variant="subtitle2">
            Requires: {schtick.prerequisite.name}
          </Typography> }
      </SchtickCardBase>
      <SchtickModal
        state={state}
        dispatch={dispatch}
        open={open}
        setOpen={setOpen}
        schtick={schtick}
      />
    </>
  )
}
