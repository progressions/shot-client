import type { Fight, Character, User, ID } from "../types/types"

class Api {
  base():string { return process.env.NEXT_PUBLIC_SERVER_URL as string }

  api():string { return `${this.base()}/api/v1` }

  fights(fight?: Fight | undefined): string {
    if (fight) {
      return `${this.api()}/fights/${fight.id}`
    } else {
      return `${this.api()}/fights`
    }
  }

  characters(fight?: Fight | null, character?: Character | ID): string {
    if (!fight) {
      return this.allCharacters(character)
    }
    if (character) {
      return `${this.fights(fight)}/characters/${character.id}`
    } else {
      return `${this.fights(fight)}/characters`
    }
  }

  addCharacter(fight: Fight, character: Character | ID): string {
    return `${this.characters(fight, character)}/add`
  }

  actCharacter(fight: Fight, character: Character): string {
    return `${this.characters(fight, character)}/act`
  }

  allCharacters(character?: Character | ID): string {
    if (character) {
      return `${this.api()}/all_characters/${character.id}`
    } else {
      return `${this.api()}/all_characters`
    }
  }

  adminUsers(user?: User | ID): string {
    if (user) {
      return `${this.api()}/users/${user.id}`
    } else {
      return `${this.api()}/users`
    }
  }

  signIn(): string {
    return `${this.base()}/users/sign_in`
  }

  registerUser(): string {
    return `${this.base()}/users`
  }

}

export default Api
