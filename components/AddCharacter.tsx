import { useState } from 'react'
import { Paper, Container, Typography } from '@mui/material'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Router from "next/router"
import TextField from '@mui/material/TextField'

export default function AddCharacter({ fight, endpoint }: any) {
  const [character, setCharacter] = useState({fight_id: fight.id, name: '', defense: null, current_shot: 0, impairments: null})
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: any) => {
    setSaving(true)
    event.preventDefault()
    const JSONdata = JSON.stringify({"character": character})
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

    const url = `${endpoint}/${fight.id}/characters`
    const response = await fetch(url, options)
    const result = await response.json()
    console.log(result)
    setSaving(false)
    cancelForm()
    Router.reload()
  }

  const handleChange = (event: any) => {
    setCharacter(prevState => ({ ...prevState, [event.target.name]: event.target.value }))
  }

  const cancelForm = () => {
    setCharacter({fight_id: fight.id, name: '', defense: null, current_shot: 0, impairments: null})
  }

  return (
    <>
      <Paper sx={{"padding": "1em"}}>
        <Stack spacing={1}>
          <form onSubmit={handleSubmit}>
            <TextField label="Name" required name="name" value={character.name} onChange={handleChange} />
            <TextField label="Shot" required name="current_shot" value={character.current_shot || ''} onChange={handleChange} />
            <TextField label="Defense" required name="defense" value={character.defense || ''} onChange={handleChange} />
            <TextField label="Impairments" required name="impairments" value={character.impairments || ''} onChange={handleChange} />
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

