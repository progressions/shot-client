import { Typography, Skeleton, Pagination, Box, Stack } from "@mui/material"
import { Subhead } from "@/components/StyledFields"
import { useClient, useToast, useCharacter } from "@/contexts"
import { useReducer, useEffect } from "react"
import { CharacterActions } from "@/reducers/characterState"
import { rowMap } from "@/utils/rowMap"
import Weapon from "@/components/weapons/Weapon"
import type { Weapon as WeaponType } from "@/types/types"

import { WeaponsActions, initialWeaponsState, weaponsReducer } from "@/reducers/weaponsState"
import type { WeaponsStateType, WeaponsActionType } from "@/reducers/weaponsState"

interface EditWeaponsProps {
}

export default function EditWeapons({}: EditWeaponsProps) {
  const { user, client } = useClient()
  const { toastSuccess, toastError } = useToast()

  const { state:characterState, dispatch:dispatchCharacter } = useCharacter()
  const { character, reload:characterReload } = characterState

  const [state, dispatch] = useReducer(weaponsReducer, initialWeaponsState)
  const { weapons, edited, meta, page, loading, juncture, category, name } = state

  console.log("EditWeapons", { characterReload, loading, weapons })

  async function reload() {
    try {
      console.log("Fetching Weapons page ", page)
      const data = await client.getCharacterWeapons(character, { page, juncture, category, name })
      dispatch({ type: WeaponsActions.WEAPONS, payload: data })
    } catch(error) {
      toastError()
    }
  }

  useEffect(() => {
    console.log("Reloading weapons first time")

    if (user?.id) {
      reload().catch(console.error)
    }
  }, [user])

  useEffect(() => {
    console.log("EditWeapons characterReload changed", characterReload)

    if (user?.id && characterReload) {
      console.log("Reloading weapons due to character reload")
      reload().catch(console.error)
    }
  }, [user, characterReload])

  useEffect(() => {
    console.log("EditWeapons edited changed", characterReload)

    if (user?.id && edited) {
      console.log("Reloading weapons due to weapons edited")
      reload().catch(console.error)
    }
  }, [user, edited])

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    dispatch({ type: WeaponsActions.PAGE, name: "page", value })
  }

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

  return (
    <>
      <Subhead>{weapons?.length} Weapons</Subhead>
      { weapons?.length === 0 && !loading && (
        <Typography variant="body1">
          No weapons.
        </Typography>
      )}

    { !loading && !!weapons?.length && <>
      <Stack spacing={1}>
        <Pagination count={meta.total_pages} page={page} onChange={handlePageChange} variant="outlined" color="primary" shape="rounded" size="large" />
        { outputRows }
        <Pagination count={meta.total_pages} page={page} onChange={handlePageChange} variant="outlined" color="primary" shape="rounded" size="large" />
      </Stack>
    </> }

      { loading && <>
        <Skeleton animation="wave" height={50} />
        <Skeleton animation="wave" height={50} />
        <Skeleton animation="wave" height={50} />
        <Skeleton animation="wave" height={50} />
        <Skeleton animation="wave" height={50} />
        <Skeleton animation="wave" height={50} />
      </>}
    </>
  )
}
