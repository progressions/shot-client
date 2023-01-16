import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

export default function GroupedEffects({ fight, shot }) {
  const effectsForShot = (fight: Fight, shot: number) => {
    return fight.effects.filter((effect) => {
      return shot > 0 && (
        (fight.sequence == effect.start_sequence && shot <= effect.start_shot) ||
          (fight.sequence == effect.end_sequence && shot > effect.end_shot)
      )
    })
  }

  const effectsGroupedByType = (eff: any) => {
    return eff.reduce((acc: any, effect: any) => {
      acc[effect.severity] ||= []
      acc[effect.severity].push(effect)
      return acc
    }, {})
  }
  const finalEffects = effectsGroupedByType(effectsForShot(fight, shot))

  console.log("what")
  console.log({ finalEffects })

  const severities = ["error", "warning", "info", "success"]

  return (
    <>
      {
        severities.map((severity) => {
          return finalEffects[severity]?.map((effect) => {
            return <p>{effect.title}</p>
          })
        }).flat()
      }
    </>
  )
}
