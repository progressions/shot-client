class Api {
  base():string { return process.env.NEXT_PUBLIC_SERVER_URL as string }

  api():string { return `${this.base()}/api/v1` }

  fights(fight: any): string {
    if (fight) {
      return `${this.api()}/fights/${fight.id}`
    } else {
      return `${this.api()}/fights`
    }
  }

  characters(fight: any, character: any): string {
    if (!fight) {
      return this.allCharacters(character)
    }
    if (character) {
      return `${this.fights(fight)}/characters/${character.id}`
    } else {
      return `${this.fights(fight)}/characters`
    }
  }

  addCharacter(fight: any, character: any): string {
    return `${this.characters(fight, character)}/add`
  }

  actCharacter(fight: any, character: any): string {
    return `${this.characters(fight, character)}/act`
  }

  allCharacters(character: any): string {
    if (character) {
      return `${this.api()}/all_characters/${character.id}`
    } else {
      return `${this.api()}/all_characters`
    }
  }

  adminUsers(user: any): string {
    if (user) {
      return `${this.api()}/users/${user.id}`
    } else {
      return `${this.api()}/users`
    }
  }

  signIn(): string {
    return `${this.base()}/users/sign_in`
  }

}

export default Api
