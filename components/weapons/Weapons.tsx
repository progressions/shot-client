import { Typography, Skeleton, Pagination, Button, Box, Stack } from "@mui/material"
import { ButtonBar, Subhead } from "@/components/StyledFields"
import type { QueryType, Weapon as WeaponType } from "@/types/types"
import Weapon from "@/components/weapons/Weapon"
import { useClient, useToast, useCharacter } from "@/contexts"
import { rowMap } from "@/utils/rowMap"
import AddWeapon from "@/components/weapons/AddWeapon"
import { useRouter } from 'next/router'
import { useReducer, useEffect } from "react"

import FilterWeapons from "@/components/weapons/FilterWeapons"
import { WeaponsActions, initialWeaponsState, weaponsReducer } from "@/reducers/weaponsState"
import type { WeaponsStateType, WeaponsActionType } from "@/reducers/weaponsState"

interface WeaponsProps {
  state: WeaponsStateType
  dispatch: React.Dispatch<WeaponsActionType>
}

export default function Weapons({ state, dispatch }: WeaponsProps) {
  const router = useRouter()
  const { weapons, edited, meta, page, loading, juncture, category, name } = state

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    router.push(
      { pathname: router.pathname, query: { page: value } },
      undefined,
      { shallow: true }
    )
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
      <Subhead>Weapons</Subhead>
      { weapons?.length === 0 && !loading && (
        <Typography variant="body1">
          No weapons.
        </Typography>
      )}
    { !loading && !!weapons?.length && <>
      <ButtonBar sx={{height: 80}}>
        <FilterWeapons state={state} dispatch={dispatch} />
      </ButtonBar>
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
