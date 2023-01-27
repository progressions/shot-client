import { Typography } from "@mui/material"

export default function Subhead(props) {
  return (
    <Typography variant="h6" gutterBottom {...props}>
      { props.children }
    </Typography>
  )
}
