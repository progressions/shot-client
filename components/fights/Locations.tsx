import { useFight } from "@/contexts/FightContext"
import { CancelButton, StyledTextField, StyledDialog } from "@/components/StyledFields"
import { Button, DialogContent, Stack, Typography } from "@mui/material"
import { useMemo, useState } from "react"
import type { Vehicle, Character, Fight } from "@/types/types"

export default function Locations() {
  const { fight, dispatch } = useFight()

  const [processing, setProcessing] = useState(false)
  const [open, setOpen] = useState(false)

  function handleClick() {
    setProcessing(true)
    setOpen(true)
  }

  function handleClose() {
    setOpen(false)
    setProcessing(false)
  }

  const useExtractLocations = () => {
    return useMemo(() => {
      return fight.shot_order.reduce((acc, shot) => {
        shot[1].forEach((character: Character | Vehicle) => {
          const location = character.location;
          if (location) {
            acc[location] = acc[location] || [];
            acc[location].push(character.name);
          }
        });
        return acc;
      }, {});
    }, [fight.shot_order]);
  };
  const locations = useExtractLocations()

  return (<>
    <Button variant="contained" color="secondary" disabled={processing} onClick={handleClick}>Locations</Button>
    <StyledDialog
      open={open}
      onClose={handleClose}
      title="Locations"
    >
      <DialogContent>
        <Stack spacing={2}>
          {
            Object.entries(locations).map(([location, names], index) => (
              <Stack key={`${location}.${name}`} spacing={1}>
                <Typography variant="h3">{location}</Typography>
                {names.map((name, idx) => (
                  <Typography key={name} variant="h6">{name}</Typography>
                ))}
              </Stack>))
          }
        </Stack>
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <CancelButton onClick={handleClose}>
            Close
          </CancelButton>
        </Stack>
      </DialogContent>
    </StyledDialog>
  </>)
}
