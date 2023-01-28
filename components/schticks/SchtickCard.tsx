import { colors, Avatar, Tooltip, IconButton, Card, CardHeader, CardContent, CardActions, Stack, Typography } from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from '@mui/icons-material/Edit'

import SchtickCardBase from "./SchtickCardBase"
import { useClient } from "../../contexts/ClientContext"
import { useToast } from "../../contexts/ToastContext"
import { useCharacter } from "../../contexts/CharacterContext"
import { useState, useMemo } from "react"
import SchtickModal from "./SchtickModal"

import { Schtick } from "../../types/types"

export default function SchtickCard({ schtick, filter, dispatchFilter }: any) {
  const [open, setOpen] = useState(false)
  const { toastSuccess, toastError } = useToast()
  const { user, client } = useClient()
  const { state, dispatch } = useCharacter()
  const { character } = state

  async function reloadCharacter(char: any) {
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
      dispatchFilter({ type: "schticks", payload: data })
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

  const deleteFunction = (typeof character === "undefined") ? deleteSchtick : removeSchtick

  const editButton = (typeof character === "undefined") ? (
    <Tooltip title="Edit" key="edit">
      <IconButton onClick={editSchtick}>
        <EditIcon sx={{color: "text.primary"}} />
      </IconButton>
    </Tooltip>
  ) : null

  const deleteButton = useMemo(() => {
    const prereqIds = character?.schticks?.map((s: Schtick) => s.prerequisite.id) || []
    const schtickHasPrereq = prereqIds.includes(schtick?.id)

    const tooltip = typeof character === "undefined" ? "Delete" : "Remove"

    return !schtickHasPrereq ? (
      <Tooltip title={tooltip} key="delete">
        <IconButton onClick={deleteFunction}>
          <DeleteIcon sx={{color: "text.primary"}} />
        </IconButton>
      </Tooltip>
    ) : ""
  }, [character, schtick, deleteFunction])

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
      <SchtickModal schtick={schtick} filter={filter} dispatchFilter={dispatchFilter} open={open} setOpen={setOpen} />
    </>
  )
}
