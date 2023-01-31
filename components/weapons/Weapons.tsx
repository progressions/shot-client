import { Button, Box, Stack } from "@mui/material"
import { Subhead } from "../StyledFields"
import type { Weapon as WeaponType } from "../../types/types"
import Weapon from "./Weapon"
import { useCharacter } from "../../contexts/CharacterContext"
import { rowMap } from "../schticks/Schticks"

export default function Weapons({ filter, dispatchFilter }: any) {
  const { character } = useCharacter()
  const { weapons, meta } = filter

  const rowsOfData = rowMap(weapons, 2)

  const outputRows = (
    rowsOfData.map((row: any, index: number) => (
      <Stack spacing={1} direction="row" key={`row_${index}`}>
        { row.map((weapon: any) => (
          <Weapon key={`weapon_${weapon?.id}`} weapon={weapon} filter={filter} dispatchFilter={dispatchFilter} />
        )) }
      </Stack>
    ))
  )

  function loadPrevious() {
    dispatchFilter({ type: "previous" })
  }

  function loadNext() {
    dispatchFilter({ type: "next" })
  }

  if (!weapons) return (<></>)

  console.log(meta)

  return (
    <>
    <Subhead>Weapons</Subhead>
    <Stack spacing={1}>
      { meta?.prev_page && <Box width="100%"><Button sx={{width: "100%"}} onClick={loadPrevious} variant="contained" color="primary">Previous</Button></Box> }
      { outputRows }
      { meta?.next_page && <Box width="100%"><Button sx={{width: "100%"}} onClick={loadNext} variant="contained" color="primary">Next</Button></Box> }
    </Stack>
    </>
  )
}
