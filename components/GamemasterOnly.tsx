export default function GamemasterOnly({ user, children, character, override }: any) {
  if (override || user?.gamemaster || ["PC", "Ally"].includes(character?.action_values?.['Type'])) {
    return children
  }
}
