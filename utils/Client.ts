import axios, { AxiosResponse } from "axios"
import Api from "@/utils/Api"
import type {
  Location,
  Shot,
  Faction,
  FactionsResponse,
  SuggestionsResponse,
  PartiesResponse,
  WeaponsResponse,
  SchticksResponse,
  CampaignsResponse,
  SitesResponse,
  JuncturesResponse,
  Juncture,
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
  FightEvent,
  Party,
  User,
  VehicleArchetype
} from "@/types/types"
import { createConsumer } from "@rails/actioncable"

interface ClientParams {
  jwt?: string
}

class Client {
  jwt?: string
  api: Api
  consumerInstance?: any

  constructor(params: ClientParams = {}) {
    if (params.jwt) {
      this.jwt = params.jwt
    }
    this.api = new Api()
  }

  consumer() {
    if (this.jwt && this.consumerInstance) {
      return this.consumerInstance
    }
    const websocketUrl = this.api.cable(this.jwt)
    this.consumerInstance = createConsumer(websocketUrl)
    return this.consumerInstance
  }

  async getSuggestions(params = {}):Promise<SuggestionsResponse> {
    const query = Object.entries(params).map(([key, value]) => `${key}=${value || ""}`).join("&")
    return this.get(`${this.api.suggestions()}?${query}`)
  }

  async getNotionCharacters(params = {}) {
    const query = Object.entries(params).map(([key, value]) => `${key}=${value || ""}`).join("&")
    return this.get(`${this.api.notionCharacters()}?${query}`)
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
    return this.post(this.api.memberships(party), {"character_id": character.id})
  }

  async addVehicleToParty(party: Party | ID, vehicle: Vehicle | ID):Promise<Party> {
    return this.post(this.api.memberships(party), {"vehicle_id": vehicle.id})
  }

  async removeCharacterFromParty(party: Party | ID, character: Character | ID):Promise<Party> {
    return this.delete(`${this.api.memberships(party, character)}/character`)
  }

  async removeVehicleFromParty(party: Party | ID, vehicle: Vehicle | ID):Promise<Party> {
    return this.delete(`${this.api.memberships(party, vehicle)}/vehicle`)
  }

  async getParties(params = {}):Promise<PartiesResponse> {
    const query = Object.entries(params).map(([key, value]) => `${key}=${value || ""}`).join("&")
    return this.get<PartiesResponse>(`${this.api.parties()}?${query}`)
  }

  async getParty(party: Party | ID):Promise<Party> {
    return this.get(this.api.parties(party))
  }

  async deleteParty(party: Party | ID):Promise<void> {
    return this.delete(this.api.parties(party))
  }

  async createParty(party: Party):Promise<Party> {
    return this.post(this.api.parties(), {"party": party})
  }

  async updateParty(party: Party):Promise<Party> {
    return this.patch(this.api.parties(party), {"party": party})
  }

  async deletePartyImage(party: Party):Promise<void> {
    return this.delete(`${this.api.parties(party)}/image`)
  }

  async addPartyToFight(party: Party | ID, fight: Fight | ID):Promise<Party> {
    return this.post(this.api.addPartyToFight(party, fight))
  }

  async getFights(params = {}):Promise<FightsResponse> {
    const query = Object.entries(params).map(([key, value]) => `${key}=${value || ""}`).join("&")
    return this.get<FightsResponse>(`${this.api.fights()}?${query}`)
  }

  async getFight(fight: Fight | ID):Promise<Fight> {
    return this.get(this.api.fights(fight))
  }

  async touchFight(fight: Fight | ID):Promise<Fight> {
    return this.patch(`${this.api.fights(fight)}/touch`)
  }

  async updateFight(fight: Fight):Promise<Fight> {
    return this.patch(this.api.fights(fight), {"fight": fight})
  }

  async createFight(fight: Fight):Promise<Fight> {
    return this.post(this.api.fights(), {"fight": fight})
  }

  async deleteFight(fight: Fight):Promise<void> {
    return this.delete(this.api.fights(fight))
  }

  async getFightEvents(fight: Fight | ID):Promise<FightEvent[]> {
    return this.get<FightEvent[]>(this.api.fightEvents(fight))
  }

  async createFightEvent(fight: Fight | ID, fightEvent: FightEvent):Promise<FightEvent> {
    return this.post(this.api.fightEvents(fight), {"fight_event": fightEvent})
  }

  async getCharactersInFight(fight: Fight | ID, params = {}):Promise<Person[]> {
    const query = this.queryParams(params)
    return this.get(`${this.api.charactersAndVehicles(fight)}/characters?${query}`)
  }

  async getVehiclesInFight(fight: Fight | ID, params = {}):Promise<Vehicle[]> {
    const query = this.queryParams(params)
    return this.get(`${this.api.charactersAndVehicles(fight)}/vehicles?${query}`)
  }

  async getCharactersAndVehicles(params = {}):Promise<CharactersAndVehiclesResponse> {
    const query = Object.entries(params).map(([key, value]) => `${key}=${value || ""}`).join("&")
    return this.get(`${this.api.charactersAndVehicles()}?${query}`)
  }

  async getCharacter(character: Character | ID):Promise<Person> {
    return this.get(this.api.characters(null, character))
  }

  async getCharacterPdf(character: Character | ID):Promise<string> {
    const url = `${this.api.characterPdf(character)}`

    return await axios({
      url: url,
      method: "GET",
      params: {},
      responseType: 'arraybuffer', // Ensure the response is treated as binary data
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.jwt
      }
    })
    .then(response => response.data)
  }

  async getVehicle(vehicle: Vehicle | ID):Promise<Vehicle> {
    return this.get(this.api.vehicles(null, vehicle))
  }

  async getVehicleArchetypes():Promise<VehicleArchetype[]> {
    return this.get(`${this.api.vehicles()}/archetypes`)
  }

  async updateCharacter(character: Character, fight?: Fight | null):Promise<Person> {
    // No need to send the character's schticks or weapons to the server
    const updatedCharacter = {...character, advancements: undefined, sites: undefined, schticks: undefined, weapons: undefined}
    return this.patch(this.api.characters(fight, {id: character.id} as ID), {"character": updatedCharacter})
  }

  async createCharacter(character: Character, fight?: Fight | null):Promise<Person> {
    return this.post(this.api.characters(fight, character), {"character": character})
  }

  async deleteCharacter(character: Character, fight?: Fight | null):Promise<void> {
    return this.delete(this.api.characters(fight, { id: character.shot_id } as Character))
  }

  async deleteCharacterImage(character: Character):Promise<void> {
    return this.delete(`${this.api.characters(null, character)}/image`)
  }

  async syncCharacter(character: Character):Promise<Person> {
    return this.post(`${this.api.characters(null, character)}/sync`)
  }

  async actCharacter(character: Character, fight: Fight, shots: number):Promise<Character> {
    return this.patch(this.api.actCharacter(fight, { id: character.id } as Character), {"character": { id: character.id, shot_id: character.shot_id } as Character, "shots": shots})
  }

  async hideCharacter(fight: Fight, character: Character):Promise<Character> {
    return this.patch(this.api.hideCharacter(fight, { id: character.id } as Character), {"character": { id: character.id, shot_id: character.shot_id } as Character})
  }

  async showCharacter(fight: Fight, character: Character):Promise<Character> {
    return this.patch(this.api.revealCharacter(fight, { id: character.id } as Character), {"character": { id: character.id, shot_id: character.shot_id } as Character })
  }

  async addCharacter(fight: Fight, character: Character | ID):Promise<Character> {
    return this.post(this.api.addCharacter(fight, character), {"character": {"current_shot": 0}})
  }

  async createVehicle(vehicle: Vehicle, fight?: Fight | null):Promise<Vehicle> {
    return this.post(this.api.vehicles(fight, vehicle), {"vehicle": vehicle})
  }

  async updateVehicle(vehicle: Vehicle, fight?: Fight | null):Promise<Vehicle> {
    return this.patch(this.api.vehicles(fight, vehicle), {"vehicle": vehicle})
  }

  async deleteVehicle(vehicle: Vehicle, fight?: Fight | null):Promise<void> {
    return this.delete(this.api.vehicles(fight, { id: vehicle.shot_id } as Vehicle))
  }

  async deleteVehicleImage(vehicle: Vehicle):Promise<void> {
    return this.delete(`${this.api.allVehicles(vehicle)}/image`)
  }

  async actVehicle(vehicle: Vehicle, fight: Fight, shots: number):Promise<Vehicle> {
    return this.patch(this.api.actVehicle(fight, vehicle), {"vehicle": { id: vehicle.id, shot_id: vehicle.shot_id } as Vehicle, "shots": shots})
  }

  async addVehicle(fight: Fight, vehicle: Vehicle | ID):Promise<Vehicle> {
    return this.post(this.api.addVehicle(fight, vehicle), {"vehicle": {"current_shot": 0}})
  }

  async hideVehicle(fight: Fight, vehicle: Vehicle | ID):Promise<Vehicle> {
    return this.patch(this.api.hideVehicle(fight, vehicle as Vehicle), {"vehicle": vehicle})
  }

  async showVehicle(fight: Fight, vehicle: Vehicle | ID):Promise<Vehicle> {
    return this.patch(this.api.revealVehicle(fight, vehicle as Vehicle), {"vehicle": vehicle})
  }

  async getAllVehicles():Promise<Vehicle[]> {
    return this.get(this.api.allVehicles())
  }

  async getAllCharacters():Promise<Character[]> {
    return this.get(this.api.allCharacters())
  }

  async createAdvancement(character: Character, advancement: Advancement):Promise<Advancement> {
    return this.post(this.api.advancements(character), {"advancement": advancement})
  }

  async deleteAdvancement(character: Character, advancement: Advancement):Promise<void> {
    return this.delete(this.api.advancements(character, advancement))
  }

  async getJunctures(params = {}):Promise<JuncturesResponse> {
    const query = Object.entries(params).map(([key, value]) => `${key}=${value || ""}`).join("&")
    return this.get(`${this.api.junctures()}?${query}`)
  }

  async createJuncture(juncture: Juncture):Promise<Juncture> {
    return this.post(this.api.junctures(), {"juncture": juncture})
  }

  async getJuncture(juncture: Juncture | ID):Promise<Juncture> {
    return this.get(this.api.junctures(juncture))
  }

  async deleteJuncture(juncture: Juncture):Promise<void> {
    return this.delete(this.api.junctures(juncture))
  }

  async updateJuncture(juncture: Juncture):Promise<Juncture> {
    return this.patch(this.api.junctures(juncture), {"juncture": juncture})
  }

  async deleteJunctureImage(juncture: Juncture):Promise<void> {
    return this.delete(`${this.api.junctures(juncture)}/image`)
  }

  async getSites(params = {}):Promise<SitesResponse> {
    const query = Object.entries(params).map(([key, value]) => `${key}=${value || ""}`).join("&")
    return this.get(`${this.api.allSites()}?${query}`)
  }

  async createSite(site: Site):Promise<Site> {
    return this.post(this.api.allSites(), {"site": site})
  }

  async getSite(site: Site | ID):Promise<Site> {
    return this.get(this.api.allSites(site))
  }

  async deleteSite(site: Site):Promise<void> {
    return this.delete(this.api.allSites(site))
  }

  async updateSite(site: Site):Promise<Site> {
    return this.patch(this.api.allSites(site), {"site": site})
  }

  async deleteSiteImage(site: Site):Promise<void> {
    return this.delete(`${this.api.allSites(site)}/image`)
  }

  async addCharacterToSite(site: Site, character: Character):Promise<Site> {
    return this.post(this.api.sites(character), {"site": site})
  }

  async removeCharacterFromSite(site: Site, character: Character):Promise<void> {
    return this.delete(this.api.sites(character, site))
  }

  async createEffect(effect: Effect, fight: Fight):Promise<Effect> {
    return this.post(this.api.effects(fight, effect), {"effect": effect})
  }

  async updateEffect(effect: Effect, fight: Fight):Promise<Effect> {
    return this.patch(this.api.effects(fight, effect), {"effect": effect})
  }

  async deleteEffect(effect: Effect, fight: Fight):Promise<void> {
    return this.delete(this.api.effects(fight, effect))
  }

  async createCharacterEffect(characterEffect: CharacterEffect, fight: Fight):Promise<CharacterEffect> {
    return this.post(this.api.characterEffects(fight), {"character_effect": characterEffect})
  }

  async updateCharacterEffect(characterEffect: CharacterEffect, fight: Fight):Promise<CharacterEffect> {
    return this.patch(this.api.characterEffects(fight, characterEffect), {"character_effect": characterEffect})
  }

  async deleteCharacterEffect(characterEffect: CharacterEffect, fight: Fight):Promise<void> {
    return this.delete(this.api.characterEffects(fight, characterEffect))
  }

  async addPlayer(user: User, campaign: Campaign):Promise<Campaign> {
    return this.post(this.api.campaignMemberships(), {
      "campaign_id": campaign.id,
      "user_id": user.id
    })
  }

  async removePlayer(user: User, campaign: Campaign):Promise<void> {
    const url = `${this.api.campaignMemberships()}?campaign_id=${campaign.id}&user_id=${user.id}`
    return this.delete(url)
  }

  async getInvitation(invitation: Invitation | ID):Promise<Invitation> {
    return this.get(this.api.invitations(invitation as Invitation))
  }

  async createInvitation(invitation: Invitation, campaign: Campaign):Promise<Invitation> {
    return this.post(this.api.invitations(), {"invitation": { ...invitation, "campaign_id": campaign.id }})
  }

  async deleteInvitation(invitation: Invitation):Promise<void> {
    return this.delete(this.api.invitations(invitation))
  }

  async redeemInvitation(invitation: Invitation, user: User | ID):Promise<User> {
    return this.patch(`${this.api.invitations(invitation)}/redeem`, {"user": user})
  }

  async resendInvitation(invitation: Invitation):Promise<void> {
    return this.post(`${this.api.invitations(invitation)}/resend`)
  }

  async createCampaign(campaign: Campaign):Promise<Campaign> {
    return this.post(this.api.campaigns(), {"campaign": campaign})
  }

  async getCampaigns():Promise<CampaignsResponse> {
    return this.get(this.api.campaigns())
  }

  async getCampaign(campaign: Campaign | ID):Promise<Campaign> {
    return this.get(this.api.campaigns(campaign))
  }

  async updateCampaign(campaign: Campaign):Promise<Campaign> {
    return this.patch(this.api.campaigns(campaign), {"campaign": campaign})
  }

  async deleteCampaign(campaign: Campaign):Promise<void> {
    return this.delete(this.api.campaigns(campaign))
  }

  async setCurrentCampaign(campaign: Campaign | null):Promise<Campaign | null> {
    return this.post(this.api.currentCampaign(), {"id": campaign?.id})
  }

  async getCurrentCampaign():Promise<Campaign | null> {
    return this.get(this.api.currentCampaign())
  }

  async createUser(user: User):Promise<User> {
    // override options to exclude JWT, no authentication exists yet for a new user
    return this.post(this.api.registerUser(), {"user": user})
  }

  async updateUser(user: User):Promise<User> {
    return this.patch(this.api.adminUsers(user), {"user": user})
  }

  async deleteUser(user: User):Promise<void> {
    return this.delete(this.api.adminUsers(user))
  }

  async deleteUserImage(user: User):Promise<void> {
    return this.delete(`${this.api.users(user)}/image`)
  }

  async getUser(user: User | ID):Promise<User> {
    return this.get(this.api.adminUsers(user))
  }

  async unlockUser(unlock_token: string):Promise<User> {
    return this.get(`${this.api.unlockUser()}?unlock_token=${unlock_token}`)
  }

  async confirmUser(confirmation_token: string):Promise<User> {
    return this.post(this.api.confirmUser(), { "confirmation_token": confirmation_token })
  }

  async sendResetPasswordLink(email: string):Promise<void> {
    return this.post(this.api.resetUserPassword(), {
      "user": { "email": email }
    })
  }

  async resetUserPassword(reset_password_token: string, password: PasswordWithConfirmation):Promise<User> {
    return this.patch(this.api.resetUserPassword(), {
      "user": { ...password, "reset_password_token": reset_password_token }
    })
  }

  async getUsers():Promise<User[]> {
    return this.get(this.api.adminUsers())
  }

  async deleteFaction(faction: Faction | ID):Promise<void> {
    return this.delete(this.api.factions(faction))
  }

  async getFaction(faction: Faction | ID):Promise<Faction> {
    return this.get(this.api.factions(faction))
  }

  async getFactions(params = {}):Promise<FactionsResponse> {
    const query = Object.entries(params).map(([key, value]) => `${key}=${value || ""}`).join("&")
    return this.get(`${this.api.factions()}?${query}`)
  }

  async createFaction(faction: Faction):Promise<Faction> {
    return this.post(this.api.factions(), {"faction": faction})
  }

  async updateFaction(faction: Faction):Promise<Faction> {
    return this.patch(this.api.factions(faction), {"faction": faction})
  }

  async deleteFactionImage(faction: Faction):Promise<void> {
    return this.delete(`${this.api.factions(faction)}/image`)
  }

  async getSchticks(params={}):Promise<SchticksResponse> {
    const query = Object.entries(params).map(([key, value]) => `${key}=${value || ""}`).join("&")
    return this.get(`${this.api.schticks()}?${query}`)
  }

  async getSchtick(schtick: Schtick | ID):Promise<Schtick> {
    return this.get(this.api.schticks(schtick))
  }

  async createSchtick(schtick: Schtick):Promise<Schtick> {
    return this.post(this.api.schticks(), {
      "schtick": schtick
    })
  }

  async updateSchtick(schtick: Schtick):Promise<Schtick> {
    return this.patch(this.api.schticks(schtick), {
      "schtick": schtick
    })
  }

  async deleteSchtick(schtick: Schtick):Promise<void> {
    return this.delete(this.api.schticks(schtick))
  }

  async getCharacterSchticks(character: Character | ID, params = {}):Promise<SchticksResponse> {
    const query = Object.entries(params).map(([key, value]) => `${key}=${value || ""}`).join("&")
    return this.get(`${this.api.characterSchticks(character)}?${query}`)
  }

  async addSchtick(character: Character | ID, schtick: Schtick):Promise<Character> {
    return this.post(this.api.characterSchticks(character), {
      "schtick": schtick
    })
  }

  async uploadSchticks(content: string):Promise<void> {
    return this.post(this.api.importSchticks(), {
      "schtick": { "yaml": content }
    })
  }

  async removeSchtick(character: Character | ID, schtick: Schtick | ID):Promise<void> {
    return this.delete(this.api.characterSchticks(character, schtick))
  }

  async getCharacterWeapons(character: Character | ID, params = {}):Promise<WeaponsResponse> {
    const query = Object.entries(params).map(([key, value]) => `${key}=${value || ""}`).join("&")
    return this.get(`${this.api.characterWeapons(character)}?${query}`)
  }

  async getWeapons(params={}):Promise<WeaponsResponse> {
    const query = Object.entries(params).map(([key, value]) => `${key}=${value || ""}`).join("&")
    return this.get(`${this.api.weapons()}?${query}`)
  }

  async getWeapon(weapon: Weapon | ID):Promise<Weapon> {
    return this.get(this.api.weapons(weapon))
  }

  async createWeapon(weapon: Weapon):Promise<Weapon> {
    return this.post(this.api.weapons(), {
      "weapon": weapon
    })
  }

  async updateWeapon(weapon: Weapon):Promise<Weapon> {
    return this.patch(this.api.weapons(weapon), {
      "weapon": weapon
    })
  }

  async deleteWeapon(weapon: Weapon):Promise<void> {
    return this.delete(this.api.weapons(weapon))
  }

  async deleteWeaponImage(weapon: Weapon):Promise<void> {
    return this.delete(`${this.api.weapons(weapon)}/image`)
  }

  async addWeapon(character: Character | ID, weapon: Weapon):Promise<Character> {
    return this.post(this.api.characterWeapons(character), {
      "weapon": weapon
    })
  }

  async uploadWeapons(content: string):Promise<void> {
    return this.post(this.api.importWeapons(), {
      "weapon": { "yaml": content }
    })
  }

  async removeWeapon(character: Character | ID, weapon: Weapon | ID):Promise<Weapon> {
    return this.delete(this.api.characterWeapons(character, weapon))
  }

  async patch<T>(url:string, params = {}):Promise<T> {
    return await this.request("PATCH", url, params)
  }

  async post<T>(url:string, params = {}):Promise<T> {
    return await this.request("POST", url, params)
  }

  async request<T>(method: string, url: string, params = {}): Promise<T> {
    const config: any = {
      url: url,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.jwt
      }
    }

    // Use `data` for POST and PATCH, `params` for GET
    if (method === "GET") {
      config.params = params
    } else {
      config.data = params
    }

    return await axios(config)
      .then(response => response.data)
  }

  async get<T>(url:string, params = {}):Promise<T> {
    if (!this.jwt) {
      console.log("No JWT provided, cannot make GET request", url)
      return Promise.reject(new Error("No JWT provided"))
    }
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

  async requestFormData<T>(method: string, url: string, formData: FormData): Promise<T> {
    // Make the PATCH request with multipart/form-data
    return await axios({
      url: url,
      method: method,
      data: formData, // Use FormData as the request data
      headers: {
        'Content-Type': 'multipart/form-data', // Set the content type to multipart/form-data
        'Authorization': this.jwt
      }
    })
    .then((response: AxiosResponse<T>) => response.data);
  }

  queryParams(params={}) {
    return Object.entries(params).map(([key, value]) => `${key}=${value || ""}`).join("&")
  }
}

export default Client
