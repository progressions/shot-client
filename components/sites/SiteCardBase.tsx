import { colors, Card, CardHeader, CardContent, CardActions, Typography } from "@mui/material"

interface SiteCardBaseProps {
  title: string
  subheader: string
  avatar?: React.ReactNode
  action: React.ReactNode
}

export default function SiteCardBase({ title, subheader, avatar, action, children }: React.PropsWithChildren<SiteCardBaseProps>) {
  return (
    <Card sx={{backgroundColor: colors.blueGrey["500"], minHeight: 200, width: "100%"}}>
      <CardHeader
        title={title}
        subheader={subheader}
        avatar={avatar}
        titleTypographyProps={{variant: "h3"}}
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
