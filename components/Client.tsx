import Api from "./Api"
import type { Invitation, Campaign, Effect, Vehicle, Character, ID, Fight, User } from "../types/types"

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

  async updateEffect(effect: Effect, fight: Fight):Promise<Response> {
    return await this.patch(this.api.effects(fight, effect), {"effect": effect})
  }

  async createEffect(effect: Effect, fight: Fight):Promise<Response> {
    return await this.post(this.api.effects(fight, effect), {"effect": effect})
  }

  async deleteEffect(effect: Effect, fight: Fight):Promise<Response> {
    return await this.delete(this.api.effects(fight, effect))
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

  async createInvitation(invitation: Invitation) {
    return await this.post(this.api.invitations(), {"invitation": invitation})
  }

  async deleteInvitation(invitation: Invitation) {
    return await this.delete(this.api.invitations(invitation))
  }

  async redeemInvitation(invitation: Invitation, { first_name, last_name }: any) {
    return await this.patch(`${this.api.invitations(invitation)}/redeem`, {"user": { first_name, last_name }})
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

  async getUsers():Promise<Response> {
    return await this.get(this.api.adminUsers())
  }

  async patch(url:string, body:any, options?:any):Promise<Response> {
    return await this.request("PATCH", url, body, options)
  }

  async post(url:string, body:any, options?:any):Promise<Response> {
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
