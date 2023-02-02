import { Button, Box, Stack } from "@mui/material"
import { Subhead } from "../StyledFields"
import type { Weapon as WeaponType } from "../../types/types"
import Weapon from "./Weapon"
import { useCharacter } from "../../contexts/CharacterContext"
import { rowMap } from "../../utils/rowMap"
import AddWeapon from "./AddWeapon"

import { WeaponsActions } from "./weaponsState"
import type { WeaponsStateType, WeaponsActionType } from "./weaponsState"

interface WeaponsProps {
  state: WeaponsStateType
  dispatch?: React.Dispatch<WeaponsActionType>
}

export default function Weapons({ state, dispatch }: WeaponsProps) {
  const { character } = useCharacter()
  const { weapons, meta } = state

  const rowsOfData = rowMap<WeaponType>(weapons, 2)

  const outputRows = (
    rowsOfData.map((row: WeaponType[], index: number) => (
      <Stack spacing={1} direction="row" key={`row_${index}`}>
        { row.map((weapon: WeaponType, index: number) => (
          <Weapon
            key={`weapon_${weapon?.id}_${index}`}
            weapon={weapon}
            state={state}
            dispatch={dispatch}
          />
        )) }
      </Stack>
    ))
  )

  function loadPrevious() {
    if (!dispatch) return

    dispatch({ type: WeaponsActions.PREVIOUS })
  }

  function loadNext() {
    if (!dispatch) return

    dispatch({ type: WeaponsActions.NEXT })
  }

  if (!weapons) return (<></>)

  return (
    <>
    <Subhead>Weapons</Subhead>
    <Stack spacing={1}>
      { meta?.prev_page && <Box width="100%"><Button sx={{width: "100%"}} onClick={loadPrevious} variant="contained" color="primary">Previous</Button></Box> }
      { outputRows }
      { meta?.next_page && <Box width="100%"><Button sx={{width: "100%"}} onClick={loadNext} variant="contained" color="primary">Next</Button></Box> }
    </Stack>
    { character?.id && <AddWeapon /> }
    </>
  )
}
