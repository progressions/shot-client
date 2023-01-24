import type { Schtick, CharacterEffect, Invitation, Campaign, Vehicle, Effect, Fight, Character, User, ID } from "../types/types"

class Api {
  base():string { return process.env.NEXT_PUBLIC_SERVER_URL as string }

  api():string { return `${this.base()}/api/v1` }

  fights(fight?: Fight | ID | undefined): string {
    if (fight?.id) {
      return `${this.api()}/fights/${fight.id}`
    } else {
      return `${this.api()}/fights`
    }
  }

  characters(fight?: Fight | null, character?: Character | ID): string {
    if (!fight?.id) {
      return this.allCharacters(character)
    }
    if (character?.id) {
      return `${this.fights(fight)}/characters/${character.id}`
    } else {
      return `${this.fights(fight)}/characters`
    }
  }

  vehicles(fight?: Fight | null, vehicle?: Vehicle | ID): string {
    if (!fight?.id) {
      return this.allVehicles(vehicle)
    }
    if (vehicle?.id) {
      return `${this.fights(fight)}/vehicles/${vehicle.id}`
    } else {
      return `${this.fights(fight)}/vehicles`
    }
  }

  actVehicle(fight: Fight, vehicle: Vehicle): string {
    return `${this.vehicles(fight, vehicle)}/act`
  }

  addVehicle(fight: Fight, vehicle: Vehicle | ID): string {
    return `${this.vehicles(fight, vehicle)}/add`
  }

  addCharacter(fight: Fight, character: Character | ID): string {
    return `${this.characters(fight, character)}/add`
  }

  actCharacter(fight: Fight, character: Character): string {
    return `${this.characters(fight, character)}/act`
  }

  allVehicles(vehicle?: Vehicle | ID): string {
    if (vehicle?.id) {
      return `${this.api()}/all_vehicles/${vehicle.id}`
    } else {
      return `${this.api()}/all_vehicles`
    }
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

  characterEffects(fight: Fight, characterEffect?: CharacterEffect | ID): string {
    if (characterEffect?.id) {
      return `${this.fights(fight)}/character_effects/${characterEffect.id}`
    } else {
      return `${this.fights(fight)}/character_effects`
    }
  }

  invitations(invitation?: Invitation):string {
    if (invitation?.id) {
      return `${this.api()}/invitations/${invitation.id}`
    } else {
      return `${this.api()}/invitations`
    }
  }

  currentCampaign() {
    return `${this.campaigns()}/current`
  }

  campaigns(campaign?: Campaign | ID) {
    if (campaign) {
      return `${this.api()}/campaigns/${campaign.id}`
    } else {
      return `${this.api()}/campaigns`
    }
  }

  campaignMemberships() {
    return `${this.api()}/campaign_memberships`
  }

  adminUsers(user?: User | ID): string {
    if (user) {
      return `${this.api()}/users/${user.id}`
    } else {
      return `${this.api()}/users`
    }
  }

  unlockUser(): string {
    return `${this.base()}/users/unlock`
  }

  confirmUser(): string {
    return `${this.base()}/users/confirmation`
  }

  resetUserPassword(): string {
    return `${this.base()}/users/password`
  }

  signIn(): string {
    return `${this.base()}/users/sign_in`
  }

  registerUser(): string {
    return `${this.base()}/users`
  }

  factions(): string {
    return `${this.api()}/factions`
  }

  characterSchticks(character: Character | ID, schtick?: Schtick | ID): string {
    if (schtick?.id) {
      return `${this.allCharacters(character)}/schticks/${schtick.id}`
    } else {
      return `${this.allCharacters(character)}/schticks`
    }
  }

  schticks(schtick?: Schtick | ID): string {
    if (schtick?.id) {
      return `${this.api()}/schticks/${schtick.id}`
    } else {
      return `${this.api()}/schticks`
    }
  }

}

export default Api
