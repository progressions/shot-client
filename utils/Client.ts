import axios from "axios"
import Api from "./Api"
import type {
  Location,
  Shot,
  Faction,
  PartiesResponse,
  WeaponsResponse,
  SchticksResponse,
  CampaignsResponse,
  SitesResponse,
  Person,
  FightsResponse,
  CharactersAndVehiclesResponse,
  PasswordWithConfirmation,
  Weapon,
  Site,
  Advancement,
  Schtick,
  CharacterEffect,
  Invitation,
  Campaign,
  Effect,
  Vehicle,
  Character,
  ID,
  Fight,
  Party,
  User
} from "../types/types"

interface ClientParams {
  jwt?: string
}

class Client {
  jwt?: string
  api: Api

  constructor(params: ClientParams = {}) {
    if (params.jwt) {
      this.jwt = params.jwt
    }
    this.api = new Api()
  }

  async getLocationForCharacter(character: Character):Promise<Location> {
    return this.get(this.api.locations(), {"shot_id": character.shot_id} as Character)
  }

  async getLocationForVehicle(vehicle: Vehicle):Promise<Location> {
    return this.get(this.api.locations(), {"shot_id": vehicle.shot_id} as Vehicle)
  }

  async setCharacterLocation(character: Character, location: Location | ID):Promise<Location> {
    return this.post(this.api.locations(), {"shot_id": character.shot_id, "location": location})
  }

  async setVehicleLocation(vehicle: Vehicle, location: Location | ID):Promise<Location> {
    return this.post(this.api.locations(), {"shot_id": vehicle.shot_id, "location": location})
  }

  async addCharacterToParty(party: Party | ID, character: Character | ID):Promise<Party> {
    return await this.post(this.api.memberships(party), {"character_id": character.id})
  }

  async addVehicleToParty(party: Party | ID, vehicle: Vehicle | ID):Promise<Party> {
    return await this.post(this.api.memberships(party), {"vehicle_id": vehicle.id})
  }

  async removeCharacterFromParty(party: Party | ID, character: Character | ID):Promise<Party> {
    return await this.delete(`${this.api.memberships(party, character)}/character`)
  }

  async removeVehicleFromParty(party: Party | ID, vehicle: Vehicle | ID):Promise<Party> {
    return await this.delete(`${this.api.memberships(party, vehicle)}/vehicle`)
  }

  async getParties(params = {}):Promise<PartiesResponse> {
    const query = Object.entries(params).map(([key, value]) => `${key}=${value || ""}`).join("&")
    return this.get<PartiesResponse>(`${this.api.parties()}?${query}`)
  }

  async deleteParty(party: Party | ID):Promise<void> {
    return await this.delete(this.api.parties(party))
  }

  async createParty(party: Party):Promise<Party> {
    return await this.post(this.api.parties(), {"party": party})
  }

  async updateParty(party: Party):Promise<Party> {
    return await this.patch(this.api.parties(party), {"party": party})
  }

  async addPartyToFight(party: Party | ID, fight: Fight | ID):Promise<Party> {
    return await this.post(this.api.addPartyToFight(party, fight))
  }

  async getFights(params = {}):Promise<FightsResponse> {
    const query = Object.entries(params).map(([key, value]) => `${key}=${value || ""}`).join("&")
    return this.get<FightsResponse>(`${this.api.fights()}?${query}`)
  }

  async getFight(fight: Fight | ID):Promise<Fight> {
    return await this.get(this.api.fights(fight))
  }

  async updateFight(fight: Fight):Promise<Fight> {
    return await this.patch(this.api.fights(fight), {"fight": fight})
  }

  async createFight(fight: Fight):Promise<Fight> {
    return await this.post(this.api.fights(), {"fight": fight})
  }

  async deleteFight(fight: Fight):Promise<void> {
    return await this.delete(this.api.fights(fight))
  }

  async getCharactersInFight(fight: Fight | ID, params = {}):Promise<Person[]> {
    const query = this.queryParams(params)
    return await this.get(`${this.api.charactersAndVehicles(fight)}/characters?${query}`)
  }

  async getVehiclesInFight(fight: Fight | ID, params = {}):Promise<Vehicle[]> {
    const query = this.queryParams(params)
    return await this.get(`${this.api.charactersAndVehicles(fight)}/vehicles?${query}`)
  }

  async getCharactersAndVehicles(params = {}):Promise<CharactersAndVehiclesResponse> {
    const query = Object.entries(params).map(([key, value]) => `${key}=${value || ""}`).join("&")
    return this.get(`${this.api.charactersAndVehicles()}?${query}`)
  }

  async getCharacter(character: Character | ID):Promise<Person> {
    return await this.get(this.api.characters(null, character))
  }

  async getVehicle(vehicle: Vehicle | ID):Promise<Vehicle> {
    return await this.get(this.api.vehicles(null, vehicle))
  }

  async updateCharacter(character: Character, fight?: Fight | null):Promise<Person> {
    // No need to send the character's schticks or weapons to the server
    const updatedCharacter = {...character, schticks: undefined, weapons: undefined}
    return await this.patch(this.api.characters(fight, {id: character.id} as ID), {"character": updatedCharacter})
  }

  async createCharacter(character: Character, fight?: Fight | null):Promise<Person> {
    return await this.post(this.api.characters(fight, character), {"character": character})
  }

  async deleteCharacter(character: Character, fight?: Fight | null):Promise<void> {
    return await this.delete(this.api.characters(fight, { id: character.shot_id } as Character))
  }

  async actCharacter(character: Character, fight: Fight, shots: number):Promise<Character> {
    return await this.patch(this.api.actCharacter(fight, { id: character.id } as Character), {"character": { id: character.id, shot_id: character.shot_id } as Character, "shots": shots})
  }

  async hideCharacter(fight: Fight, character: Character | ID):Promise<Character> {
    return await this.patch(this.api.hideCharacter(fight, character as Character), {"character": character})
  }

  async showCharacter(fight: Fight, character: Character | ID):Promise<Character> {
    return await this.patch(this.api.revealCharacter(fight, character as Character), {"character": character})
  }

  async addCharacter(fight: Fight, character: Character | ID):Promise<Character> {
    return await this.post(this.api.addCharacter(fight, character), {"character": {"current_shot": 0}})
  }

  async createVehicle(vehicle: Vehicle, fight?: Fight | null):Promise<Vehicle> {
    return await this.post(this.api.vehicles(fight, vehicle), {"vehicle": vehicle})
  }

  async updateVehicle(vehicle: Vehicle, fight?: Fight | null):Promise<Vehicle> {
    return await this.patch(this.api.vehicles(fight, vehicle), {"vehicle": vehicle})
  }

  async deleteVehicle(vehicle: Vehicle, fight?: Fight | null):Promise<void> {
    return await this.delete(this.api.vehicles(fight, { id: vehicle.shot_id } as Vehicle))
  }

  async actVehicle(vehicle: Vehicle, fight: Fight, shots: number):Promise<Vehicle> {
    return await this.patch(this.api.actVehicle(fight, vehicle), {"vehicle": { id: vehicle.id, shot_id: vehicle.shot_id } as Vehicle, "shots": shots})
  }

  async addVehicle(fight: Fight, vehicle: Vehicle | ID):Promise<Vehicle> {
    return await this.post(this.api.addVehicle(fight, vehicle), {"vehicle": {"current_shot": 0}})
  }

  async hideVehicle(fight: Fight, vehicle: Vehicle | ID):Promise<Vehicle> {
    return await this.patch(this.api.hideVehicle(fight, vehicle as Vehicle), {"vehicle": vehicle})
  }

  async showVehicle(fight: Fight, vehicle: Vehicle | ID):Promise<Vehicle> {
    return await this.patch(this.api.revealVehicle(fight, vehicle as Vehicle), {"vehicle": vehicle})
  }

  async getAllVehicles():Promise<Vehicle[]> {
    return await this.get(this.api.allVehicles())
  }

  async getAllCharacters():Promise<Character[]> {
    return await this.get(this.api.allCharacters())
  }

  async createAdvancement(character: Character, advancement: Advancement):Promise<Advancement> {
    return await this.post(this.api.advancements(character), {"advancement": advancement})
  }

  async deleteAdvancement(character: Character, advancement: Advancement):Promise<void> {
    return await this.delete(this.api.advancements(character, advancement))
  }

  async getSites(params = {}):Promise<SitesResponse> {
    const query = Object.entries(params).map(([key, value]) => `${key}=${value || ""}`).join("&")
    return this.get(`${this.api.allSites()}?${query}`)
  }

  async createSite(site: Site):Promise<Site> {
    return await this.post(this.api.allSites(), {"site": site})
  }

  async getSite(site: Site | ID):Promise<Site> {
    return await this.get(this.api.allSites(site))
  }

  async deleteSite(site: Site):Promise<void> {
    return await this.delete(this.api.allSites(site))
  }

  async updateSite(site: Site):Promise<Site> {
    return await this.patch(this.api.allSites(site), {"site": site})
  }

  async addCharacterToSite(site: Site, character: Character):Promise<Site> {
    return await this.post(this.api.sites(character), {"site": site})
  }

  async removeCharacterFromSite(site: Site, character: Character):Promise<void> {
    return await this.delete(this.api.sites(character, site))
  }

  async createEffect(effect: Effect, fight: Fight):Promise<Effect> {
    return await this.post(this.api.effects(fight, effect), {"effect": effect})
  }

  async updateEffect(effect: Effect, fight: Fight):Promise<Effect> {
    return await this.patch(this.api.effects(fight, effect), {"effect": effect})
  }

  async deleteEffect(effect: Effect, fight: Fight):Promise<void> {
    return await this.delete(this.api.effects(fight, effect))
  }

  async createCharacterEffect(characterEffect: CharacterEffect, fight: Fight):Promise<CharacterEffect> {
    return await this.post(this.api.characterEffects(fight), {"character_effect": characterEffect})
  }

  async updateCharacterEffect(characterEffect: CharacterEffect, fight: Fight):Promise<CharacterEffect> {
    return await this.patch(this.api.characterEffects(fight, characterEffect), {"character_effect": characterEffect})
  }

  async deleteCharacterEffect(characterEffect: CharacterEffect, fight: Fight):Promise<void> {
    return await this.delete(this.api.characterEffects(fight, characterEffect))
  }

  async addPlayer(user: User, campaign: Campaign):Promise<Campaign> {
    return await this.post(this.api.campaignMemberships(), {
      "campaign_id": campaign.id,
      "user_id": user.id
    })
  }

  async removePlayer(user: User, campaign: Campaign):Promise<void> {
    const url = `${this.api.campaignMemberships()}?campaign_id=${campaign.id}&user_id=${user.id}`
    return await this.delete(url)
  }

  async getInvitation(invitation: Invitation | ID):Promise<Invitation> {
    return await this.get(this.api.invitations(invitation as Invitation))
  }

  async createInvitation(invitation: Invitation, campaign: Campaign):Promise<Invitation> {
    return await this.post(this.api.invitations(), {"invitation": { ...invitation, "campaign_id": campaign.id }})
  }

  async deleteInvitation(invitation: Invitation):Promise<void> {
    return await this.delete(this.api.invitations(invitation))
  }

  async redeemInvitation(invitation: Invitation, user: User | ID):Promise<User> {
    return await this.patch(`${this.api.invitations(invitation)}/redeem`, {"user": user})
  }

  async resendInvitation(invitation: Invitation):Promise<void> {
    return await this.post(`${this.api.invitations(invitation)}/resend`)
  }

  async createCampaign(campaign: Campaign):Promise<Campaign> {
    return await this.post(this.api.campaigns(), {"campaign": campaign})
  }

  async getCampaigns():Promise<CampaignsResponse> {
    return await this.get(this.api.campaigns())
  }

  async getCampaign(campaign: Campaign | ID):Promise<Campaign> {
    return await this.get(this.api.campaigns(campaign))
  }

  async updateCampaign(campaign: Campaign):Promise<Campaign> {
    return await this.patch(this.api.campaigns(campaign), {"campaign": campaign})
  }

  async deleteCampaign(campaign: Campaign):Promise<void> {
    return await this.delete(this.api.campaigns(campaign))
  }

  async setCurrentCampaign(campaign: Campaign | null):Promise<Campaign | null> {
    return await this.post(this.api.currentCampaign(), {"id": campaign?.id})
  }

  async getCurrentCampaign():Promise<Campaign | null> {
    return await this.get(this.api.currentCampaign())
  }

  async createUser(user: User):Promise<User> {
    // override options to exclude JWT, no authentication exists yet for a new user
    return await this.post(this.api.registerUser(), {"user": user})
  }

  async updateUser(user: User):Promise<User> {
    return await this.patch(this.api.adminUsers(user), {"user": user})
  }

  async deleteUser(user: User):Promise<void> {
    return await this.delete(this.api.adminUsers(user))
  }

  async getUser(user: User | ID):Promise<User> {
    return await this.get(this.api.adminUsers(user))
  }

  async unlockUser(unlock_token: string):Promise<User> {
    return await this.get(`${this.api.unlockUser()}?unlock_token=${unlock_token}`)
  }

  async confirmUser(confirmation_token: string):Promise<User> {
    return await this.post(this.api.confirmUser(), { "confirmation_token": confirmation_token })
  }

  async sendResetPasswordLink(email: string):Promise<void> {
    return await this.post(this.api.resetUserPassword(), {
      "user": { "email": email }
    })
  }

  async resetUserPassword(reset_password_token: string, password: PasswordWithConfirmation):Promise<User> {
    return await this.patch(this.api.resetUserPassword(), {
      "user": { ...password, "reset_password_token": reset_password_token }
    })
  }

  async getUsers():Promise<User[]> {
    return await this.get(this.api.adminUsers())
  }

  async getFactions():Promise<Faction[]> {
    return await this.get(this.api.factions())
  }

  async getSchticks(params={}):Promise<SchticksResponse> {
    const query = Object.entries(params).map(([key, value]) => `${key}=${value || ""}`).join("&")
    return await this.get(`${this.api.schticks()}?${query}`)
  }

  async getSchtick(schtick: Schtick | ID):Promise<Schtick> {
    return await this.get(this.api.schticks(schtick))
  }

  async createSchtick(schtick: Schtick):Promise<Schtick> {
    return await this.post(this.api.schticks(), {
      "schtick": schtick
    })
  }

  async updateSchtick(schtick: Schtick):Promise<Schtick> {
    return await this.patch(this.api.schticks(schtick), {
      "schtick": schtick
    })
  }

  async deleteSchtick(schtick: Schtick):Promise<void> {
    return await this.delete(this.api.schticks(schtick))
  }

  async addSchtick(character: Character | ID, schtick: Schtick):Promise<Character> {
    return await this.post(this.api.characterSchticks(character), {
      "schtick": schtick
    })
  }

  async uploadSchticks(content: string):Promise<void> {
    return await this.post(this.api.importSchticks(), {
      "schtick": { "yaml": content }
    })
  }

  async removeSchtick(character: Character | ID, schtick: Schtick | ID):Promise<void> {
    return await this.delete(this.api.characterSchticks(character, schtick))
  }

  async getWeapons(params={}):Promise<WeaponsResponse> {
    const query = Object.entries(params).map(([key, value]) => `${key}=${value || ""}`).join("&")
    return await this.get(`${this.api.weapons()}?${query}`)
  }

  async getWeapon(weapon: Weapon | ID):Promise<Weapon> {
    return await this.get(this.api.weapons(weapon))
  }

  async createWeapon(weapon: Weapon):Promise<Weapon> {
    return await this.post(this.api.weapons(), {
      "weapon": weapon
    })
  }

  async updateWeapon(weapon: Weapon):Promise<Weapon> {
    return await this.patch(this.api.weapons(weapon), {
      "weapon": weapon
    })
  }

  async deleteWeapon(weapon: Weapon):Promise<void> {
    return await this.delete(this.api.weapons(weapon))
  }

  async addWeapon(character: Character | ID, weapon: Weapon):Promise<Character> {
    return await this.post(this.api.characterWeapons(character), {
      "weapon": weapon
    })
  }

  async uploadWeapons(content: string):Promise<void> {
    return await this.post(this.api.importWeapons(), {
      "weapon": { "yaml": content }
    })
  }

  async removeWeapon(character: Character | ID, weapon: Weapon | ID):Promise<Weapon> {
    return await this.delete(this.api.characterWeapons(character, weapon))
  }

  async patch<T>(url:string, params = {}):Promise<T> {
    return await this.request("PATCH", url, params)
  }

  async post<T>(url:string, params = {}):Promise<T> {
    return await this.request("POST", url, params)
  }

  async request<T>(method:string, url:string, params = {}):Promise<T> {
    return await axios({
      url: url,
      method: method,
      params: params,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.jwt
      }
    })
    .then(response => response.data)
  }

  async get<T>(url:string, params = {}):Promise<T> {
    return await axios({
      url: url,
      method: "GET",
      params: params,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.jwt
      }
    })
    .then(response => response.data)
  }

  async delete<T>(url:string):Promise<T> {
    return await axios({
      url: url,
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.jwt
      }
    })
    .then(response => response.data)
  }

  queryParams(params={}) {
    return Object.entries(params).map(([key, value]) => `${key}=${value || ""}`).join("&")
  }
}

export default Client
