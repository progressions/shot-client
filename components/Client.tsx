import Api from "./Api"
import type { Schtick, CharacterEffect, Invitation, Campaign, Effect, Vehicle, Character, ID, Fight, User } from "../types/types"

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

  async getFights():Promise<Response> {
    return await this.get(this.api.fights())
  }

  async getFight(fight: Fight | ID):Promise<Response> {
    return await this.get(this.api.fights(fight))
  }

  async updateFight(fight: Fight):Promise<Response> {
    return await this.patch(this.api.fights(fight), {"fight": fight})
  }

  async createFight(fight: Fight):Promise<Response> {
    return await this.post(this.api.fights(), {"fight": fight})
  }

  async deleteFight(fight: Fight):Promise<Response> {
    return await this.delete(this.api.fights(fight))
  }

  async getCharacter(character: Character | ID):Promise<Response> {
    return await this.get(this.api.characters(null, character))
  }

  async updateCharacter(character: Character, fight?: Fight | null):Promise<Response> {
    return await this.patch(this.api.characters(fight, character), {"character": character})
  }

  async createCharacter(character: Character, fight?: Fight | null):Promise<Response> {
    return await this.post(this.api.characters(fight, character), {"character": character})
  }

  async deleteCharacter(character: Character, fight?: Fight | null):Promise<Response> {
    return await this.delete(this.api.characters(fight, character))
  }

  async actCharacter(character: Character, fight: Fight, shots: number):Promise<Response> {
    return await this.patch(this.api.actCharacter(fight, character), {"character": character, "shots": shots})
  }

  async addCharacter(fight: Fight, character: Character | ID):Promise<Response> {
    return await this.post(this.api.addCharacter(fight, character), {"character": {"current_shot": 0}})
  }

  async createVehicle(vehicle: Vehicle, fight?: Fight | null):Promise<Response> {
    return await this.post(this.api.vehicles(fight, vehicle), {"vehicle": vehicle})
  }

  async updateVehicle(vehicle: Vehicle, fight?: Fight | null):Promise<Response> {
    return await this.patch(this.api.vehicles(fight, vehicle), {"vehicle": vehicle})
  }

  async deleteVehicle(vehicle: Vehicle, fight?: Fight | null):Promise<Response> {
    return await this.delete(this.api.vehicles(fight, vehicle))
  }

  async actVehicle(vehicle: Vehicle, fight: Fight, shots: number):Promise<Response> {
    return await this.patch(this.api.actVehicle(fight, vehicle), {"vehicle": vehicle, "shots": shots})
  }

  async addVehicle(fight: Fight, vehicle: Vehicle | ID):Promise<Response> {
    return await this.post(this.api.addVehicle(fight, vehicle), {"vehicle": {"current_shot": 0}})
  }

  async getAllVehicles():Promise<Response> {
    return await this.get(this.api.allVehicles())
  }

  async getAllCharacters():Promise<Response> {
    return await this.get(this.api.allCharacters())
  }

  async createEffect(effect: Effect, fight: Fight):Promise<Response> {
    return await this.post(this.api.effects(fight, effect), {"effect": effect})
  }

  async updateEffect(effect: Effect, fight: Fight):Promise<Response> {
    return await this.patch(this.api.effects(fight, effect), {"effect": effect})
  }

  async deleteEffect(effect: Effect, fight: Fight):Promise<Response> {
    return await this.delete(this.api.effects(fight, effect))
  }

  async createCharacterEffect(characterEffect: CharacterEffect, fight: Fight):Promise<Response> {
    return await this.post(this.api.characterEffects(fight), {"character_effect": characterEffect})
  }

  async updateCharacterEffect(characterEffect: CharacterEffect, fight: Fight):Promise<Response> {
    return await this.patch(this.api.characterEffects(fight, characterEffect), {"character_effect": characterEffect})
  }

  async deleteCharacterEffect(characterEffect: CharacterEffect, fight: Fight):Promise<Response> {
    return await this.delete(this.api.characterEffects(fight, characterEffect))
  }

  async addPlayer(user: User, campaign: Campaign) {
    return await this.post(this.api.campaignMemberships(), {
      "campaign_id": campaign.id,
      "user_id": user.id
    })
  }

  async removePlayer(user: User, campaign: Campaign) {
    const url = `${this.api.campaignMemberships()}?campaign_id=${campaign.id}&user_id=${user.id}`
    return await this.delete(url)
  }

  async getInvitation(invitation: Invitation | ID) {
    return await this.get(this.api.invitations(invitation as Invitation))
  }

  async createInvitation(invitation: Invitation, campaign: Campaign) {
    return await this.post(this.api.invitations(), {"invitation": { ...invitation, "campaign_id": campaign.id }})
  }

  async deleteInvitation(invitation: Invitation) {
    return await this.delete(this.api.invitations(invitation))
  }

  async redeemInvitation(invitation: Invitation, user: any) {
    return await this.patch(`${this.api.invitations(invitation)}/redeem`, {"user": user})
  }

  async resendInvitation(invitation: Invitation) {
    return await this.post(`${this.api.invitations(invitation)}/resend`)
  }

  async createCampaign(campaign: Campaign) {
    return await this.post(this.api.campaigns(), {"campaign": campaign})
  }

  async getCampaigns() {
    return await this.get(this.api.campaigns())
  }

  async getCampaign(campaign: Campaign | ID) {
    return await this.get(this.api.campaigns(campaign))
  }

  async updateCampaign(campaign: Campaign) {
    return await this.patch(this.api.campaigns(campaign), {"campaign": campaign})
  }

  async deleteCampaign(campaign: Campaign) {
    return await this.delete(this.api.campaigns(campaign))
  }

  async setCurrentCampaign(campaign: Campaign | null) {
    return await this.post(this.api.currentCampaign(), {"id": campaign?.id})
  }

  async getCurrentCampaign() {
    return await this.get(this.api.currentCampaign())
  }

  async createUser(user: User):Promise<Response> {
    // override options to exclude JWT, no authentication exists yet for a new user
    return await this.post(this.api.registerUser(), {"user": user}, {
      headers: {
        "Content-Type": "application/json"
      }
    })
  }

  async updateUser(user: User):Promise<Response> {
    return await this.patch(this.api.adminUsers(user), {"user": user})
  }

  async deleteUser(user: User):Promise<Response> {
    return await this.delete(this.api.adminUsers(user))
  }

  async getUser(user: User | ID):Promise<Response> {
    return await this.get(this.api.adminUsers(user))
  }

  async unlockUser(unlock_token: string):Promise<Response> {
    return await this.get(`${this.api.unlockUser()}?unlock_token=${unlock_token}`)
  }

  async confirmUser(confirmation_token: string):Promise<Response> {
    return await this.post(this.api.confirmUser(), { "confirmation_token": confirmation_token })
  }

  async sendResetPasswordLink(email: string):Promise<Response> {
    return await this.post(this.api.resetUserPassword(), {
      "user": { "email": email }
    })
  }

  async resetUserPassword(reset_password_token: string, password: any):Promise<Response> {
    return await this.patch(this.api.resetUserPassword(), {
      "user": { ...password, "reset_password_token": reset_password_token }
    })
  }

  async getUsers():Promise<Response> {
    return await this.get(this.api.adminUsers())
  }

  async getFactions():Promise<Response> {
    return await this.get(this.api.factions())
  }

  async getSchticks({ character_id="", archetype="", foe="", category="", path="", title="" }={}):Promise<Response> {
    const query = `character_id=${character_id}&archetype=${archetype}&category=${category}&path=${path}&title=${title}`
    return await this.get(`${this.api.schticks()}?${query}`)
  }

  async getSchtick(schtick: Schtick | ID):Promise<Response> {
    return await this.get(this.api.schticks(schtick))
  }

  async createSchtick(schtick: Schtick):Promise<Response> {
    return await this.post(this.api.schticks(), {
      "schtick": schtick
    })
  }

  async updateSchtick(schtick: Schtick):Promise<Response> {
    return await this.patch(this.api.schticks(schtick), {
      "schtick": schtick
    })
  }

  async deleteSchtick(schtick: Schtick):Promise<Response> {
    return await this.delete(this.api.schticks(schtick))
  }

  async addSchtick(character: Character | ID, schtick: Schtick):Promise<Response> {
    return await this.post(this.api.characterSchticks(character), {
      "schtick": schtick
    })
  }

  async uploadSchticks(content: string):Promise<Response> {
    return await this.post(this.api.importSchticks(), {
      "schtick": { "yaml": content }
    })
  }

  async removeSchtick(character: Character | ID, schtick: Schtick | ID):Promise<Response> {
    return await this.delete(this.api.characterSchticks(character, schtick))
  }

  async patch(url:string, body:any, options?:any):Promise<Response> {
    return await this.request("PATCH", url, body, options)
  }

  async post(url:string, body?:any, options?:any):Promise<Response> {
    return await this.request("POST", url, body, options)
  }

  async request(method:string, url:string, body:any, options?:any):Promise<Response> {
    body ||= {}

    return await fetch(url, {
      // The method is POST because we are sending data.
      method: method,
      mode: 'cors',
      // Tell the server we're sending JSON.
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.jwt
      },
      // Body of the request is the JSON data we created above.
      body: JSON.stringify(body),
      ...options
    })
  }

  async get(url:string, options?:any):Promise<Response> {
    return await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.jwt
      } as HeadersInit
    })
  }

  async delete(url:string):Promise<Response> {
    return await fetch(url, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.jwt
      } as HeadersInit
    })
  }
}

export default Client
