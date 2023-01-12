import type { Effect, Fight, Character, User, ID } from "../types/types"

class Api {
  base():string { return process.env.NEXT_PUBLIC_SERVER_URL as string }

  api():string { return `${this.base()}/api/v1` }

  fights(fight?: Fight | ID | undefined): string {
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
    if (character?.id) {
      return `${this.fights(fight)}/characters/${character.id}`
    } else {
      return `${this.fights(fight)}/characters`
    }
  }

  vehicles(fight?: Fight | null, vehicle?: Character | ID): string {
    if (!fight) {
      return this.allCharacters(vehicle)
    }
    if (vehicle?.id) {
      return `${this.fights(fight)}/vehicles/${vehicle.id}`
    } else {
      return `${this.fights(fight)}/vehicles`
    }
  }

  actVehicle(fight: Fight, vehicle: Character): string {
    return `${this.vehicles(fight, vehicle)}/act`
  }

  addCharacter(fight: Fight, character: Character | ID): string {
    return `${this.characters(fight, character)}/add`
  }

  actCharacter(fight: Fight, character: Character): string {
    return `${this.characters(fight, character)}/act`
  }

  allCharacters(character?: Character | ID): string {
    if (character?.id) {
      return `${this.api()}/all_characters/${character.id}`
    } else {
      return `${this.api()}/all_characters`
    }
  }

  effects(fight: Fight, effect?: Effect | ID): string {
    if (effect?.id) {
      return `${this.fights(fight)}/effects/${effect.id}`
    } else {
      return `${this.fights(fight)}/effects`
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
