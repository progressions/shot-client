import { colors, Card, CardHeader, CardContent, CardActions, Typography } from "@mui/material"
import type { Juncture } from "@/types/types"
import CharacterAvatars from "@/components/fights/CharacterAvatars"

interface JunctureCardBaseProps {
  juncture: Juncture
  title: string
  subheader: string
  avatar?: React.ReactNode
  action: React.ReactNode
}

export default function JunctureCardBase({ juncture, title, subheader, avatar, action, children }: React.PropsWithChildren<JunctureCardBaseProps>) {
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
        <CharacterAvatars characters={juncture.characters} />
      </CardActions>
    </Card>
  )
}
