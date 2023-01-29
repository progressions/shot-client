import { StyledTextField } from "../StyledFields"
import { useState, useEffect } from "react"

export default function SchtickSearch({ filter, dispatchFilter }: any) {
  const [search, setSearch] = useState(null)

  useEffect(() => {
      const timer = setTimeout(() => {
        console.log("about to search")
        dispatchFilter({ type: "title", payload: search })
      }, 1000)

      return () => clearTimeout(timer)
  }, [search])

  function handleChange(event: any) {
    setSearch(event.target.value)
    console.log(event.target.value)
  }

  return (
    <StyledTextField value={search || ""} onChange={handleChange} label="Schtick" />
  )
}
