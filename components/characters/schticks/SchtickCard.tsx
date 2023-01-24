import { colors, Tooltip, IconButton, Card, CardHeader, CardContent, CardActions, CardActionArea, Stack, Typography } from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"

export default function SchtickCard({ schtick }: any) {
  // Include an icon for the schtick's category
  //
  // Maybe a specific color for each "path"
  return (
    <Card sx={{backgroundColor: colors.blueGrey["A700"], width: 275}}>
      <CardContent>
        <Typography gutterBottom variant="h5">{ schtick.title }</Typography>
        { schtick.path && <Typography gutterBottom variant="subtitle1">{schtick.path}</Typography> }
        <Typography gutterBottom variant="body2">{schtick.description}</Typography>
      </CardContent>
      <CardActions>
        <Tooltip title="Delete">
        <IconButton>
          <DeleteIcon sx={{color: "text.primary"}} />
        </IconButton>
      </Tooltip>
      </CardActions>
    </Card>
  )
}
