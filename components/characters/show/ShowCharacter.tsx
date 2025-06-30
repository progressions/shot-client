import { colors, Grid, Box, Paper, Typography, Stack } from "@mui/material"
import type { Character } from "@/types/types"
import { DescriptionKeys as D } from "@/types/types"
import RichTextRenderer from "@/components/editor/RichTextRenderer"
import CS from "@/services/CharacterService"
import { Subhead } from "@/components/StyledFields"

interface ShowCharacterProps {
  character: Character
}

export default function ShowCharacter({ character }: ShowCharacterProps) {
  console.log("character", character)

  const archetypeAndFaction = [
    CS.type(character),
    CS.archetype(character),
    CS.faction(character)?.name
  ].filter(Boolean).join(" - ")

  return (
    <Box>
      <Stack spacing={2}>
        <Typography variant="h2">{CS.name(character)}</Typography>
        <Typography>{ archetypeAndFaction }</Typography>
        <Subhead>Description</Subhead>
        <RichTextRenderer key={CS.description(character)} html={CS.description(character)} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Paper sx={{backgroundColor: colors.blueGrey[100], p: 2}}>
              <Typography variant="h4">Action Values</Typography>
              { Object.entries(CS.actionValues(character)).map(([key, value]) => (
                <Typography key={key}>{key}: {value}</Typography>
              )) }
            </Paper>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  )
}
