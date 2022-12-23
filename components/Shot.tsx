import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'

export default function Shot({ shot, characters }: any) {
  return (
    <>
      <ListItem key={shot}>
        <ListItemText primary={shot} key={shot} />
      </ListItem>
      {characters.map((character: any) => {
        return (
          <ListItem key={character.id}>
            <ListItemText key={character.id} primary={character.name} />
          </ListItem>
        )
      })}
    </>
  )
}
