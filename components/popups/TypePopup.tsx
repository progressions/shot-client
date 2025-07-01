import { Box, Typography, Stack } from "@mui/material"
import styles from "@/components/editor/Editor.module.scss"
import { RichTextRenderer } from "@/components/editor"
import ReactDOMServer from "react-dom/server"

interface TypePopupProps {
  mentionId: "PC" | "Mook" | "Featured Foe" | "Boss" | "Uber-Boss"
}

const descriptions: Record<TypePopupProps["mentionId"], JSX.Element> = {
  "PC": <p>A player character (PC).</p>,
  "Mook": <p>A mook, a character that can be easily defeated.</p>,
  "Featured Foe": <p>A featured foe, a significant character in the story.</p>,
  "Boss": <p>A boss, a powerful and challenging character.</p>,
  "Uber-Boss": <p>An uber-boss, an extremely powerful and challenging character.</p>
}

export default function TypePopup({ mentionId }: TypePopupProps) {
  const description = descriptions[mentionId] || <p>Unknown character type.</p>
  const html = ReactDOMServer.renderToStaticMarkup(description)

  return (
    <Box className={styles.mentionPopup}>
      <Stack direction="row" alignItems="center" spacing={2} mb={1}>
        <Typography>{mentionId}</Typography>
      </Stack>
      <Typography variant="caption" sx={{ textTransform: "uppercase" }}>
        Type
      </Typography>
      <Box mt={1}>
        <Typography variant="body2">
          <RichTextRenderer html={html} />
        </Typography>
      </Box>
    </Box>
  )
}
