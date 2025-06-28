import { Box, IconButton, Stack, Typography } from "@mui/material"
import { useClient } from "@/contexts/ClientContext"
import { useToast } from "@/contexts/ToastContext"
import { useCharacter } from "@/contexts/CharacterContext"
import ClearIcon from '@mui/icons-material/Clear'
import EditIcon from '@mui/icons-material/Edit'
import WeaponCardBase from "@/components/weapons/WeaponCardBase"
import { GiDeathSkull, GiShotgun, GiPistolGun } from "react-icons/gi"
import { Weapon as WeaponType } from "@/types/types"
import type { WeaponsStateType, WeaponsActionType } from "@/reducers/weaponsState"
import { WeaponsActions } from "@/reducers/weaponsState"
import WeaponModal from "@/components/weapons/WeaponModal"
import { useState } from "react"
import { CharacterActions } from "@/reducers/characterState"

interface WeaponProps {
  weapon: WeaponType
  state: WeaponsStateType
  dispatch?: React.Dispatch<WeaponsActionType>
}

export default function Weapon({ weapon, state, dispatch }: WeaponProps) {
  const { client } = useClient()
  const { toastError } = useToast()
  const { character, dispatch:dispatchCharacter } = useCharacter()
  const [open, setOpen] = useState<boolean>(false)
  const [deleted, setDeleted] = useState<boolean>(false)

  async function removeWeapon() {
    try {
      await client.removeWeapon(character, weapon)
      dispatchCharacter({ type: CharacterActions.RELOAD })
      // dispatchCharacter({ type: CharacterActions.EDIT })
      setDeleted(true)
    } catch(error) {
      console.error(error)
      toastError()
    }
  }

  async function deleteWeapon() {
    const doit = confirm("Delete this weapon? This cannot be undone.")
    if (!doit) return

    try {
      await client.deleteWeapon(weapon)
      if (dispatch) {
        dispatch({ type: WeaponsActions.EDIT })
      }
    } catch(error) {
      toastError()
    }
  }

  function editWeapon() {
    setOpen(true)
  }

  const stats = `(${weapon.damage || "-"}/${weapon.concealment || "-"}/${weapon.reload_value || "-"})`

  const deleteFunction = character?.id ? removeWeapon : deleteWeapon

  const deleteButton = (<IconButton key="delete" onClick={deleteFunction}>
    <ClearIcon />
  </IconButton>)

  const editButton = !character?.id ? (<IconButton key="edit" onClick={editWeapon}>
    <EditIcon />
  </IconButton>) : null

  if (deleted) {
    return (
      <WeaponCardBase
        title={`${weapon.name} ${stats}`}
        subheader={`${weapon.juncture} ${weapon.category}`}
        sx={{ opacity: 0.5, textDecoration: "line-through" }}
      >
        { weapon.image_url &&
        <Box
          component="img"
          sx={{
            maxHeight: { xs: 233, md: 167 },
            maxWidth: { xs: 350, md: 250 },
          }}
          alt={weapon.name}
          src={weapon.image_url}
        /> }
        <Typography sx={{marginBottom: 3}} variant="body2" gutterBottom>
          {weapon.description}
        </Typography>
        { weapon.mook_bonus > 0 &&
          <Typography variant="subtitle2">
            <GiDeathSkull />
            { weapon.mook_bonus > 1 && <GiDeathSkull /> }
            &nbsp;
            +{weapon.mook_bonus} Attack vs Mooks
          </Typography> }
        { weapon.kachunk &&
          <Typography variant="subtitle2">
            <GiShotgun />
            Damage Value is 14 if you spend a shot to go “KA-CHUNK!”
          </Typography> }
      </WeaponCardBase>
    )
  }

  return (
    <>
      <WeaponCardBase
        title={`${weapon.name} ${stats}`}
        subheader={`${weapon.juncture} ${weapon.category}`}
        action={[editButton, deleteButton]}
      >
        { weapon.image_url &&
        <Box
          component="img"
          sx={{
            maxHeight: { xs: 233, md: 167 },
            maxWidth: { xs: 350, md: 250 },
          }}
          alt={weapon.name}
          src={weapon.image_url}
        /> }
        <Typography sx={{marginBottom: 3}} variant="body2" gutterBottom>
          {weapon.description}
        </Typography>
        { weapon.mook_bonus > 0 &&
          <Typography variant="subtitle2">
            <GiDeathSkull />
            { weapon.mook_bonus > 1 && <GiDeathSkull /> }
            &nbsp;
            +{weapon.mook_bonus} Attack vs Mooks
          </Typography> }
        { weapon.kachunk &&
          <Typography variant="subtitle2">
            <GiShotgun />
            Damage Value is 14 if you spend a shot to go “KA-CHUNK!”
          </Typography> }
      </WeaponCardBase>
      <WeaponModal weapon={weapon} state={state} open={open} setOpen={setOpen} dispatch={dispatch} />
    </>
  )
}
