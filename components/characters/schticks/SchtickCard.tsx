import { colors, Avatar, Tooltip, IconButton, Card, CardHeader, CardContent, CardActions, Stack, Typography } from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import SchtickCardBase from "./SchtickCardBase"

export default function SchtickCard({ schtick }: any) {
  if (!schtick) return <></>
  // Include an icon for the schtick's category
  //
  // Maybe a specific color for each "path"
  const avatar = <Avatar sx={{bgcolor: schtick.color || 'secondary'}} variant="rounded">{schtick.category[0]}</Avatar>
  const deleteButton = (
        <Tooltip title="Delete">
          <IconButton>
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
