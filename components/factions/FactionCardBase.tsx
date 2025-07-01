import { colors, Card, CardHeader, CardContent, CardActions, Typography } from "@mui/material"
import type { Faction } from "@/types/types"
import CharacterAvatars from "@/components/fights/CharacterAvatars"

interface FactionCardBaseProps {
  faction: Faction
  title: string
  subheader: string
  avatar?: React.ReactNode
  action: React.ReactNode
}

export default function FactionCardBase({ faction, title, subheader, avatar, action, children }: React.PropsWithChildren<FactionCardBaseProps>) {
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
        <CharacterAvatars characters={faction.characters} />
      </CardActions>
    </Card>
  )
}
