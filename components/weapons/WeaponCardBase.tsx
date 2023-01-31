import { colors, Card, CardHeader, CardContent, CardActions, Typography } from "@mui/material"

export default function WeaponCardBase({ title, subheader, avatar, action, children }: any) {
  return (
    <Card sx={{backgroundColor: colors.blueGrey["500"], width: 425, minHeight: 200}}>
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
