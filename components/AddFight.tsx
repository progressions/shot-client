import { useState } from 'react'
import { Box, Paper, Stack, Typography, TextField, Button } from '@mui/material'
import Router from "next/router"
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';

export default function AddFight({ endpoint }: any) {
  const [adding, setAdding] = useState(false)
  const [fight, setFight] = useState({name: ''})
  const [saving, setSaving] = useState(false);

  const handleChange = (event: any) => {
    setFight({ name: event.target.value })
  }

  const handleSubmit = async (event: any) => {
    setSaving(true)
    event.preventDefault()
    const JSONdata = JSON.stringify({"fight": fight})
    // Form the request for sending data to the server.
    const options: RequestInit = {
      // The method is POST because we are sending data.
      method: 'POST',
      mode: 'cors',
      // Tell the server we're sending JSON.
      headers: {
        'Content-Type': 'application/json',
      },
      // Body of the request is the JSON data we created above.
      body: JSONdata,
    }
    const response = await fetch(endpoint, options)
    const result = await response.json()
    setSaving(false)
    cancelForm()
    Router.reload()
  }

  const cancelForm = () => {
    setFight({name: ''})
    setAdding(false)
  }

  if (adding) {
    return (
      <>
        <Box m={1} mb={4} component="form" onSubmit={handleSubmit}>
          <Stack spacing={1}>
            <Stack direction="row" mb={1}>
              <Button variant="outlined" endIcon={<KeyboardDoubleArrowUpIcon />} onClick={() => cancelForm()}>Add Fight</Button>
            </Stack>
            <Stack direction="row">
              <Typography variant="h4">Add Fight</Typography>
            </Stack>
            <Stack spacing={1}>
              <Stack>
                <TextField label="Fight" autoFocus required name="name" value={fight.name} onChange={handleChange} />
              </Stack>
              <Stack spacing={2} direction="row">
                <Button variant="outlined" disabled={saving} onClick={cancelForm}>Cancel</Button>
                <Button variant="contained" type="submit" disabled={saving}>Save Changes</Button>
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </>
    )
  } else {
    return (
      <>
        <Stack direction="row" mb={1}>
          <Button variant="outlined" endIcon={<KeyboardDoubleArrowDownIcon />} onClick={() => setAdding(true)}>Add Fight</Button>
        </Stack>
      </>
    )
  }
}
