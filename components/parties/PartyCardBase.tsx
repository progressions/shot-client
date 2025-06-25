import { colors, Card, CardHeader, CardContent, CardActions, Typography } from "@mui/material"
import type { Party } from "@/types/types"
import CharacterAvatars from "@/components/fights/CharacterAvatars"

interface PartyCardBaseProps {
  party: Party
  title: string
  subheader: string
  avatar?: React.ReactNode
  action: React.ReactNode
}

export default function PartyCardBase({ party, title, subheader, avatar, action, children }: React.PropsWithChildren<PartyCardBaseProps>) {
  return (
    <Card sx={{backgroundColor: colors.blueGrey["500"], minHeight: 200}}>
      <CardHeader
        title={title}
        subheader={subheader}
        avatar={avatar}
        titleTypographyProps={{variant: "h3"}}
        subheaderTypographyProps={{variant: "subtitle1"}}
        action={action}
      />
      <CardContent sx={{paddingBottom: 2}}>
        { children }
      </CardContent>
      <CardActions>
        <CharacterAvatars characters={party.characters} />
      </CardActions>
    </Card>
  )
}
