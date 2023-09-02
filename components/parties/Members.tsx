import { Stack, Typography } from '@mui/material'
import Member from '@/components/parties/Member'

interface MembersProps {
  party: Party
  removeCharacter: (character: Character) => void
}

export default function Members({ party, removeCharacter }: MembersProps) {
  function generateKey(character: Character | Vehicle, index: number): string {
    return `${character.id}-${index}`
  }

  return (
    <>
      <Typography variant="h6" mt={2} gutterBottom>Members</Typography>
      { !!party?.characters?.length &&
      <Stack spacing={2} mb={2}>
        {
          party.characters.map((character, index) => {
            const key = generateKey(character, index)
            return (<Member key={key} character={character} removeCharacter={removeCharacter} />)
          })
        }
      </Stack>
      }
      { !!party?.vehicles?.length &&
      <Stack spacing={2}>
        {
          party.vehicles.map((character, index) => {
            const key = generateKey(character, index)
            return (<Member key={key} character={character} removeCharacter={removeCharacter} />)
          })
        }
      </Stack> }
    </>
  );
}
