import { useState } from 'react'
import { Box, Paper, Container, Typography } from '@mui/material'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CharacterModal from './CharacterModal'

import type { Character, Fight, ID } from "../../types/types"

interface CreateCharacterParams {
  fight: Fight,
  setFight: (fight: Fight) => void
}

export default function CreateCharacter({ fight, setFight }: CreateCharacterParams) {
  const characterTemplate:Character = {name: '', defense: '', current_shot: 0, impairments: 0, color: '', new: false, action_values: {
    Guns: "",
    "Martial Arts": "",
    Sorcery: "",
    Scroungetech: "",
    Genome: "",
    Defense: "",
    Toughness: "",
    Speed: "",
    Fortune: "",
    "Max Fortune": "",
    FortuneType: "",
    MainAttack: "",
    SecondaryAttack: "",
    Wounds: "0",
    Type: ""
  }}
  const [newCharacter, setNewCharacter] = useState<Character>(characterTemplate)

  const openModal = (): void => {
    setNewCharacter({...characterTemplate, new: true})
  }

  return (
    <>
      <Stack direction="row" mb={1}>
        <Button variant="outlined" onClick={openModal}>
          New Character
        </Button>
      </Stack>
      <CharacterModal open={!!newCharacter?.new} setOpen={setNewCharacter} fight={fight} character={newCharacter} setFight={setFight} />
    </>
  )
}
