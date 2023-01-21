import { Alert, Tooltip, IconButton, Popover, AlertTitle, Box, Typography } from "@mui/material"
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import DeleteIcon from '@mui/icons-material/Delete'
import { useToast } from "../../contexts/ToastContext"
import { useClient } from "../../contexts/ClientContext"
import { useFight } from "../../contexts/FightContext"

import { useState } from "react"

export default function Effects({ effects, severity }: any) {
  const [open, setOpen] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<any>(null)

  const { fight, setFight, reloadFight } = useFight()
  const { jwt, client } = useClient()
  const { setToast } = useToast()

  const closePopover = () => {
    setAnchorEl(null)
    setOpen(false)
  }

  const showEffect = (event: any) => {
    setAnchorEl(event.target)
    setOpen(true)
  }

  const deleteEffect = async (effect: any) => {
    const response = await client.deleteCharacterEffect(effect, fight)
    if (response.status === 200) {
      await reloadFight(fight)
      setToast({ open: true, message: `Effect ${effect.title} deleted.`, severity: "success" })
    }
  }

  const toolbarColor = `${severity}.dark`

  return (
    <>
      <Tooltip title={`${effects.length} effects`}>
        <IconButton onMouseEnter={showEffect} color={severity}>
          <InfoOutlinedIcon />
        </IconButton>
      </Tooltip>
      <Popover anchorEl={anchorEl} open={open} onClose={closePopover} anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}>
        <Alert severity={severity as any} sx={{paddingRight: 5}}>
          {
            effects.map((effect: any) => (<Box key={effect.id}>
              <AlertTitle>
                {effect.title}
              </AlertTitle>
              <Box mt={-1} pb={1}>
                <Typography variant="caption">{effect.description}</Typography>
                <IconButton onClick={async () => await deleteEffect(effect)}><DeleteIcon sx={{color: toolbarColor}} /></IconButton>
              </Box>
            </Box>))
          }
        </Alert>
      </Popover>
    </>
  )
}
