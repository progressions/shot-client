import { useState } from 'react'
import { Paper, Stack, Typography, TextField, Button } from '@mui/material'
import Router from "next/router"

export default function AddFight({ endpoint }: any) {
  const [fight, setFight] = useState({name: ''})
  const [saving, setSaving] = useState(false);

  const handleChange = (event: any) => {
    setFight({ name: event.target.value })
  }

  const handleSubmit = async (event: any) => {
    setSaving(true)
    event.preventDefault()
    const JSONdata = JSON.stringify({"fight": fight})
    console.log(JSONdata)
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
    console.log(result)
    setSaving(false)
    cancelForm()
    Router.reload()
  }

  const cancelForm = () => {
    setFight({name: ''})
  }

  return (
    <>
      <Typography variant="h4">Add fight</Typography>
      <Paper sx={{"padding": "1em"}}>
        <Stack spacing={1}>
          <form onSubmit={handleSubmit}>
            <TextField label="Fight" required name="name" value={fight.name} onChange={handleChange} />
            <Stack alignItems="flex-end" spacing={2} direction="row">
              <Button variant="outlined" disabled={saving} onClick={cancelForm}>Cancel</Button>
              <Button variant="contained" type="submit" disabled={saving}>Save Changes</Button>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </>
  )
}
