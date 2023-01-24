import { colors, Avatar, Tooltip, IconButton, Card, CardHeader, CardContent, CardActions, Stack, Typography } from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import SchtickCardBase from "./SchtickCardBase"
import { useClient } from "../../../contexts/ClientContext"
import { useToast } from "../../../contexts/ToastContext"
import { useCharacter } from "../../../contexts/CharacterContext"

export default function SchtickCard({ schtick, setSchticks }: any) {
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
      console.log("SCHTICKS", data)
      setSchticks(data)
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

  const deleteFunction = (typeof character === "undefined") ? deleteSchtick : removeSchtick

  if (!schtick) return <></>
  // Include an icon for the schtick's category
  //
  // Maybe a specific color for each "path"
  const avatar = <Avatar sx={{bgcolor: schtick.color || 'secondary'}} variant="rounded">{schtick.category[0]}</Avatar>
  const deleteButton = (
    <Tooltip title="Delete">
      <IconButton onClick={deleteFunction}>
        <DeleteIcon sx={{color: "text.primary"}} />
      </IconButton>
    </Tooltip>
  )
  return (
    <SchtickCardBase
      title={schtick.title}
      subheader={schtick.path}
      avatar={avatar}
      action={deleteButton}
    >
      <Typography variant="body2">
        {schtick.description}
      </Typography>
    </SchtickCardBase>
  )
}
