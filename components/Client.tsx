import Api from "./Api"
import type { Character, ID, Fight, User } from "../types/types"

interface ClientParams {
  jwt?: string
}

class Client {
  jwt?: string
  api: any

  constructor(params: ClientParams = {}) {
    if (params.jwt) {
      this.jwt = params.jwt
    }
    this.api = new Api()
  }

  async getFights():Promise<any> {
    return await this.get(this.api.fights())
  }

  async getFight(fight: Fight):Promise<Response> {
    return await this.get(this.api.fights(fight))
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

  async actCharacter(character: Character, fight: Fight):Promise<Response> {
    return await this.patch(this.api.actCharacter(fight, character), {"character": character})
  }

  async addCharacter(fight: Fight, character: Character | ID):Promise<Response> {
    return await this.post(this.api.addCharacter(fight, character), {"character": {"current_shot": 0}})
  }

  async getAllCharacters():Promise<Response> {
    return await this.get(this.api.allCharacters())
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
      }
    } as any)
  }

  async delete(url:string):Promise<Response> {
    return await fetch(url, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.jwt
      }
    } as any)
  }
}

export default Client