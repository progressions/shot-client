import { colors, Card, CardHeader, CardContent, CardActions, Typography } from "@mui/material"

interface WeaponCardBaseProps {
  title: string
  subheader: string
  avatar?: React.ReactNode
  action: React.ReactNode
}

export default function WeaponCardBase({ title, subheader, avatar, action, children }: React.PropsWithChildren<WeaponCardBaseProps>) {
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
