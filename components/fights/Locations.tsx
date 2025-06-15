import { useFight } from "@/contexts/FightContext";
import { CancelButton, StyledTextField, StyledDialog } from "@/components/StyledFields";
import { Button, DialogContent, Stack, Typography, List, ListItem, ListItemText } from "@mui/material";
import { useMemo, useState } from "react";
import type { Vehicle, Character, Fight, ShotType } from "@/types/types";

export default function Locations() {
  const { fight, dispatch } = useFight();
  const [processing, setProcessing] = useState(false);
  const [open, setOpen] = useState(false);

  function handleClick() {
    setProcessing(true);
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    setProcessing(false);
  }

  const useExtractLocations = (): Record<string, string[]> => {
    return useMemo(() => {
      return fight.shot_order.reduce((acc: Record<string, string[]>, shot: ShotType) => {
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

  const locations = useExtractLocations();

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        disabled={processing}
        onClick={handleClick}
      >
        Locations
      </Button>
      <StyledDialog open={open} onClose={handleClose} title="Locations">
        <DialogContent>
          {Object.keys(locations).length === 0 ? (
            <Typography variant="body1">No locations found.</Typography>
          ) : (
            <Stack spacing={2}>
              {Object.entries(locations).map(([location, names], index) => (
                <Stack key={`${location},${index}`} spacing={1}>
                  <Typography variant="h5">{location}</Typography>
                  <List dense>
                    {names.map((name, idx) => (
                      <ListItem key={`${name},${idx}`}>
                        <ListItemText primary={name} />
                      </ListItem>
                    ))}
                  </List>
                </Stack>
              ))}
            </Stack>
          )}
          <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
            <CancelButton onClick={handleClose}>Close</CancelButton>
          </Stack>
        </DialogContent>
      </StyledDialog>
    </>
  );
}
