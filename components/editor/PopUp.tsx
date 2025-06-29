import { Box, Typography, Stack } from "@mui/material";
import styles from "@/components/editor/Editor.module.scss";
import type { Character, User } from "@/types/types";
import { defaultCharacter } from "@/types/types";
import Client from "@/utils/Client";
import { useState, useEffect } from "react";
import CharacterAvatar from "@/components/characters/CharacterAvatar";
import CS from "@/services/CharacterService";

interface PopUpProps {
  mentionId: string;
  mentionClass: string;
  user: User | null; // Allow user to be nullable
  client: Client;
}

export default function PopUp({
  user,
  client,
  mentionId,
  mentionClass,
}: PopUpProps) {
  const [character, setCharacter] = useState<Character>(defaultCharacter);

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const fetchedCharacter = await client.getCharacter({ id: mentionId });
        console.log("Fetched character:", fetchedCharacter);
        if (fetchedCharacter) {
          setCharacter(fetchedCharacter);
        } else {
          console.error(`Character with ID ${mentionId} not found`);
        }
      } catch (error) {
        console.error("Error fetching character:", error);
      }
    };

    if (user?.id && mentionId) {
      fetchCharacter();
    }
  }, [user, mentionId, client]);

  if (!user?.id) {
    return null; // Use null instead of <></> for consistency
  }

  const subhead = [
    CS.type(character),
    CS.archetype(character),
    CS.factionName(character),
  ]
    .filter(Boolean)
    .join(" - ");

  console.log(CS.actionValues(character));

  return (
    <Box className={styles.mentionPopUp}>
      <Stack direction="row" alignItems="center" spacing={2} mb={1}>
        <CharacterAvatar character={character} />
        <Typography>{character.name}</Typography>
      </Stack>
      <Typography variant="caption" sx={{ textTransform: "uppercase" }}>
        {subhead}
      </Typography>
      <Box mt={1}>
        <Typography variant="body2">
          {CS.mainAttack(character) && CS.mainAttackValue(character) > 0 && (
            <>
              <strong>{CS.mainAttack(character)}</strong>{" "}
              {CS.mainAttackValue(character)}{" "}
            </>
          )}
          {CS.secondaryAttack(character) &&
            CS.secondaryAttackValue(character) > 0 && (
              <>
                <strong>{CS.secondaryAttack(character)}</strong>{" "}
                {CS.secondaryAttackValue(character)}{" "}
              </>
            )}
          {CS.defense(character) > 0 && (
            <>
              <strong>Defense</strong> {CS.defense(character)}{" "}
            </>
          )}
        </Typography>
        <Typography variant="body2">
          {CS.toughness(character) > 0 && (
            <>
              <strong>Toughness</strong> {CS.toughness(character)}{" "}
            </>
          )}
          {CS.speed(character) > 0 && (
            <>
              <strong>Speed</strong> {CS.speed(character)}{" "}
            </>
          )}
          {CS.damage(character) > 0 && (
            <>
              <strong>Damage</strong> {CS.damage(character)}{" "}
            </>
          )}
        </Typography>
      </Box>
    </Box>
  );
}
