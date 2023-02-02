import { colors, Avatar, Tooltip, IconButton, Card, CardHeader, CardContent, CardActions, Stack, Typography } from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import ClearIcon from '@mui/icons-material/Clear'
import EditIcon from '@mui/icons-material/Edit'

import SchtickCardBase from "./SchtickCardBase"
import { useClient } from "../../contexts/ClientContext"
import { useToast } from "../../contexts/ToastContext"
import { useCharacter } from "../../contexts/CharacterContext"
import { useState, useMemo } from "react"
import SchtickModal from "./SchtickModal"

import type { Character, Schtick } from "../../types/types"
import type { SchticksStateType, SchticksActionType } from "./filterReducer"

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
  filter: SchticksStateType
  dispatchFilter?: React.Dispatch<SchticksActionType>
}

export default function SchtickCard({ schtick, filter, dispatchFilter }: SchtickCardProps) {
  const [open, setOpen] = useState(false)
  const { toastSuccess, toastError } = useToast()
  const { user, client } = useClient()
  const { state, dispatch } = useCharacter()
  const { character } = state

  async function reloadCharacter(char: Character) {
    const response = await client.getCharacter(char)
    if (response.status === 200) {
      const data = await response.json()
      dispatch({ type: "replace", character: data })
    } else {
      toastError()
    }
  }

  async function reloadSchticks() {
    const response = await client.getSchticks()
    if (response.status === 200) {
      const data = await response.json()
      if (dispatchFilter) {
        dispatchFilter({ type: "schticks", payload: data })
      }
    }
  }

  async function removeSchtick() {
    const response = await client.removeSchtick(character, schtick)
    if (response.status === 200) {
      await reloadCharacter(character)
      toastSuccess("Schtick removed.")
    } else {
      toastError()
    }
  }

  async function deleteSchtick() {
    const response = await client.deleteSchtick(schtick)
    if (response.status === 200) {
      await reloadSchticks()
      toastSuccess("Schtick deleted.")
    } else {
      toastError()
    }
  }

  function editSchtick() {
    setOpen(true)
  }

  const deletion = (typeof character === "undefined")

  const deleteFunction = deletion ? deleteSchtick : removeSchtick

  const editButton = deletion ? (
    <Tooltip title="Edit" key="edit">
      <IconButton onClick={editSchtick}>
        <EditIcon sx={{color: "text.primary"}} />
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
        title={schtick.title}
        subheader={schtick.path}
        avatar={avatar}
        action={[editButton, deleteButton]}
      >
        <Typography variant="body2" gutterBottom>
          {schtick.description}
        </Typography>
        { schtick.prerequisite.title &&
          <Typography variant="subtitle2">
            Requires: {schtick.prerequisite.title}
          </Typography> }
      </SchtickCardBase>
      <SchtickModal
        filter={filter}
        dispatchFilter={dispatchFilter}
        open={open}
        setOpen={setOpen}
      />
    </>
  )
}
