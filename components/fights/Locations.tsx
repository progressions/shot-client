import { useFight } from "@/contexts/FightContext";
import { CancelButton, StyledDialog } from "@/components/StyledFields";
import { colors, Box, Button, DialogContent, Stack, Typography, List, ListItem, ListItemText, ListItemIcon } from "@mui/material";
import { useMemo, useState } from "react";
import type { Vehicle, Character, Fight, ShotType } from "@/types/types";
import AddLocationIcon from '@mui/icons-material/AddLocation'

export default function Locations() {
  const { fight } = useFight();
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
    }, []);
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
        <AddLocationIcon />
      </Button>
      <StyledDialog open={open} onClose={handleClose} title="Locations">
        <DialogContent>
          {Object.keys(locations).length === 0 ? (
            <Typography variant="body1">No locations found.</Typography>
          ) : (
            <List
              dense
              sx={{
                bgcolor: colors.blueGrey["800"],
                color: 'white',
                borderRadius: 1,
                maxHeight: '600px',
                overflow: 'auto',
              }}
            >
              {Object.entries(locations)
                .sort(([locationA], [locationB]) => locationA.localeCompare(locationB, undefined, { sensitivity: 'base' }))
                .map(([location, names], index) => (
                  <Box key={index}>
                    <ListItem>
                      <ListItemIcon sx={{ color: 'white', minWidth: '36px' }}>
                        <AddLocationIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={location}
                        primaryTypographyProps={{ fontSize: '1.5rem', fontWeight: 'bold' }}
                      />
                    </ListItem>
                    {names.map((name, idx) => (
                      <ListItem key={`${name},${idx}`}>
                        <ListItemText
                          primary={name}
                          sx={{ pl: '36px' }}
                          primaryTypographyProps={{ color: colors.blueGrey["200"], fontSize: '1.1rem' }}
                        />
                      </ListItem>
                    ))}
                  </Box>
                ))}
            </List>
          )}
          <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
            <CancelButton onClick={handleClose}>Close</CancelButton>
          </Stack>
        </DialogContent>
      </StyledDialog>
    </>
  );
}
