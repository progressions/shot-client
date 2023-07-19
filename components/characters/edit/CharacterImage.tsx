import type { Character } from "../../../types/types"
import { Stack, colors, Paper, Typography, Box, Card, CardMedia, CardContent } from "@mui/material"
import { StyledTextField } from "../../StyledFields"

interface CharacterImageProps {
  character: Character | Vehicle
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export default function CharacterImage({ character, onChange }: CharacterImageProps) {
  return (
    <>
      <StyledTextField name="image_url" label="Image" value={character.image_url} onChange={onChange} sx={{width: 400}} />
      { character.image_url &&
        <Box sx={{backgroundColor: colors.indigo[900]}}>
          <Card>
            <CardMedia
              component="img"
              image={character.image_url || ""}
              alt={character.name}
            />
          </Card>
        </Box>
      }
    </>
  );
}
