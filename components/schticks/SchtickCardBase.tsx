import { colors, Card, CardHeader, CardContent, CardActions, Typography } from "@mui/material"

export default function SchtickCardBase({ title, subheader, avatar, action, children }: any) {
  return (
    <Card sx={{backgroundColor: colors.blueGrey["A700"], width: 425, minHeight: 200}}>
      <CardHeader
        title={title}
        subheader={subheader}
        avatar={avatar}
        titleTypographyProps={{variant: "h6"}}
        subheaderTypographyProps={{variant: "subtitle1"}}
        action={action}
      />
      <CardContent>
        { children }
      </CardContent>
      <CardActions>
      </CardActions>
    </Card>
  )
}
