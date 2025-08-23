import Api from "@/utils/Api"
import { 
  defaultCharacter, 
  defaultVehicle, 
  defaultFight, 
  defaultParty, 
  defaultWeapon,
  defaultSchtick,
  defaultSite,
  defaultFaction,
  defaultJuncture,
  defaultUser,
  defaultCampaign
} from "@/types/types"

describe("Api", () => {
  let api: Api
  
  beforeEach(() => {
    api = new Api()
    // Mock environment variables
    process.env.NEXT_PUBLIC_SERVER_URL = "http://localhost:3000"
    process.env.NEXT_PUBLIC_WEBSOCKET_URL = "ws://localhost:3000"
  })

  afterEach(() => {
    // Clean up environment variables
    delete process.env.NEXT_PUBLIC_SERVER_URL
    delete process.env.NEXT_PUBLIC_WEBSOCKET_URL
  })

  describe("base URL methods", () => {
    it("should return correct base URL", () => {
      expect(api.base()).toBe("http://localhost:3000")
    })

    it("should return correct API base URL", () => {
      expect(api.api()).toBe("http://localhost:3000/api/v1")
    })

    it("should return correct cable URL with token", () => {
      expect(api.cable("test-token")).toBe("ws://localhost:3000/cable?token=test-token")
    })

    it("should return correct cable URL without token", () => {
      expect(api.cable()).toBe("ws://localhost:3000/cable?token=")
    })

    it("should return AI endpoint", () => {
      expect(api.ai()).toBe("http://localhost:3000/api/v1/ai")
    })

    it("should return suggestions endpoint", () => {
      expect(api.suggestions()).toBe("http://localhost:3000/api/v1/suggestions")
    })
  })

  describe("locations", () => {
    it("should return locations index URL", () => {
      expect(api.locations()).toBe("http://localhost:3000/api/v1/locations")
    })

    it("should return specific location URL with object", () => {
      const location = { id: "123", name: "Test Location" }
      expect(api.locations(location)).toBe("http://localhost:3000/api/v1/locations/123")
    })

    it("should return specific location URL with ID string", () => {
      expect(api.locations({ id: "456" } as any)).toBe("http://localhost:3000/api/v1/locations/456")
    })
  })

  describe("parties", () => {
    const party = { ...defaultParty, id: "party-123" }

    it("should return parties index URL", () => {
      expect(api.parties()).toBe("http://localhost:3000/api/v1/parties")
    })

    it("should return specific party URL", () => {
      expect(api.parties(party)).toBe("http://localhost:3000/api/v1/parties/party-123")
    })

    it("should return party memberships URL", () => {
      expect(api.memberships(party)).toBe("http://localhost:3000/api/v1/parties/party-123/memberships")
    })

    it("should return specific membership URL with character", () => {
      const character = { ...defaultCharacter, id: "char-456" }
      expect(api.memberships(party, character)).toBe("http://localhost:3000/api/v1/parties/party-123/memberships/char-456")
    })

    it("should return specific membership URL with vehicle", () => {
      const vehicle = { ...defaultVehicle, id: "vehicle-789" }
      expect(api.memberships(party, vehicle)).toBe("http://localhost:3000/api/v1/parties/party-123/memberships/vehicle-789")
    })

    it("should return add party to fight URL", () => {
      const fight = { ...defaultFight, id: "fight-999" }
      expect(api.addPartyToFight(party, fight)).toBe("http://localhost:3000/api/v1/parties/party-123/fight/fight-999")
    })
  })

  describe("fights", () => {
    const fight = { ...defaultFight, id: "fight-123" }

    it("should return fights index URL", () => {
      expect(api.fights()).toBe("http://localhost:3000/api/v1/fights")
    })

    it("should return specific fight URL", () => {
      expect(api.fights(fight)).toBe("http://localhost:3000/api/v1/fights/fight-123")
    })

    it("should return fight events URL", () => {
      expect(api.fightEvents(fight)).toBe("http://localhost:3000/api/v1/fights/fight-123/fight_events")
    })

    it("should return characters and vehicles URL", () => {
      expect(api.charactersAndVehicles()).toBe("http://localhost:3000/api/v1/characters_and_vehicles")
      expect(api.charactersAndVehicles(fight)).toBe("http://localhost:3000/api/v1/characters_and_vehicles/fight-123")
    })
  })

  describe("characters", () => {
    const fight = { ...defaultFight, id: "fight-123" }
    const character = { ...defaultCharacter, id: "char-456" }

    it("should return all characters URL when no fight", () => {
      expect(api.characters()).toBe("http://localhost:3000/api/v1/characters")
      expect(api.characters(null, character)).toBe("http://localhost:3000/api/v1/characters/char-456")
    })

    it("should return fight actors URL", () => {
      expect(api.characters(fight)).toBe("http://localhost:3000/api/v1/fights/fight-123/actors")
      expect(api.characters(fight, character)).toBe("http://localhost:3000/api/v1/fights/fight-123/actors/char-456")
    })

    it("should return all characters URLs", () => {
      expect(api.allCharacters()).toBe("http://localhost:3000/api/v1/characters")
      expect(api.allCharacters(character)).toBe("http://localhost:3000/api/v1/characters/char-456")
    })

    it("should return character PDF URL", () => {
      expect(api.characterPdf(character)).toBe("http://localhost:3000/api/v1/characters/char-456/pdf")
    })

    it("should return character action URLs", () => {
      expect(api.addCharacter(fight, character)).toBe("http://localhost:3000/api/v1/fights/fight-123/actors/char-456/add")
      expect(api.actCharacter(fight, character)).toBe("http://localhost:3000/api/v1/fights/fight-123/actors/char-456/act")
      expect(api.hideCharacter(fight, character)).toBe("http://localhost:3000/api/v1/fights/fight-123/actors/char-456/hide")
      expect(api.revealCharacter(fight, character)).toBe("http://localhost:3000/api/v1/fights/fight-123/actors/char-456/reveal")
    })
  })

  describe("vehicles", () => {
    const fight = { ...defaultFight, id: "fight-123" }
    const vehicle = { ...defaultVehicle, id: "vehicle-456" }

    it("should return all vehicles URL when no fight", () => {
      expect(api.vehicles()).toBe("http://localhost:3000/api/v1/vehicles")
      expect(api.vehicles(null, vehicle)).toBe("http://localhost:3000/api/v1/vehicles/vehicle-456")
    })

    it("should return fight drivers URL", () => {
      expect(api.vehicles(fight)).toBe("http://localhost:3000/api/v1/fights/fight-123/drivers")
      expect(api.vehicles(fight, vehicle)).toBe("http://localhost:3000/api/v1/fights/fight-123/drivers/vehicle-456")
    })

    it("should return all vehicles URLs", () => {
      expect(api.allVehicles()).toBe("http://localhost:3000/api/v1/vehicles")
      expect(api.allVehicles(vehicle)).toBe("http://localhost:3000/api/v1/vehicles/vehicle-456")
    })

    it("should return vehicle action URLs", () => {
      expect(api.addVehicle(fight, vehicle)).toBe("http://localhost:3000/api/v1/fights/fight-123/drivers/vehicle-456/add")
      expect(api.actVehicle(fight, vehicle)).toBe("http://localhost:3000/api/v1/fights/fight-123/drivers/vehicle-456/act")
      expect(api.hideVehicle(fight, vehicle)).toBe("http://localhost:3000/api/v1/fights/fight-123/drivers/vehicle-456/hide")
      expect(api.revealVehicle(fight, vehicle)).toBe("http://localhost:3000/api/v1/fights/fight-123/drivers/vehicle-456/reveal")
    })
  })

  describe("character nested resources", () => {
    const character = { ...defaultCharacter, id: "char-123" }
    const advancement = { id: "adv-456", name: "Test Advancement" }
    const site = { ...defaultSite, id: "site-789" }
    const schtick = { ...defaultSchtick, id: "schtick-111" }
    const weapon = { ...defaultWeapon, id: "weapon-222" }

    it("should return character advancements URLs", () => {
      expect(api.advancements(character)).toBe("http://localhost:3000/api/v1/characters/char-123/advancements")
      expect(api.advancements(character, advancement)).toBe("http://localhost:3000/api/v1/characters/char-123/advancements/adv-456")
    })

    it("should return character sites URLs", () => {
      expect(api.sites(character)).toBe("http://localhost:3000/api/v1/characters/char-123/sites")
      expect(api.sites(character, site)).toBe("http://localhost:3000/api/v1/characters/char-123/sites/site-789")
    })

    it("should return character schticks URLs", () => {
      expect(api.characterSchticks(character)).toBe("http://localhost:3000/api/v1/characters/char-123/schticks")
      expect(api.characterSchticks(character, schtick)).toBe("http://localhost:3000/api/v1/characters/char-123/schticks/schtick-111")
    })

    it("should return character weapons URLs", () => {
      expect(api.characterWeapons(character)).toBe("http://localhost:3000/api/v1/characters/char-123/weapons")
      expect(api.characterWeapons(character, weapon)).toBe("http://localhost:3000/api/v1/characters/char-123/weapons/weapon-222")
    })
  })

  describe("global resources", () => {
    const juncture = { ...defaultJuncture, id: "juncture-123" }
    const site = { ...defaultSite, id: "site-456" }
    const faction = { ...defaultFaction, id: "faction-789" }
    const weapon = { ...defaultWeapon, id: "weapon-111" }
    const schtick = { ...defaultSchtick, id: "schtick-222" }

    it("should return junctures URLs", () => {
      expect(api.junctures()).toBe("http://localhost:3000/api/v1/junctures")
      expect(api.junctures(juncture)).toBe("http://localhost:3000/api/v1/junctures/juncture-123")
    })

    it("should return sites URLs", () => {
      expect(api.allSites()).toBe("http://localhost:3000/api/v1/sites")
      expect(api.allSites(site)).toBe("http://localhost:3000/api/v1/sites/site-456")
    })

    it("should return factions URLs", () => {
      expect(api.factions()).toBe("http://localhost:3000/api/v1/factions")
      expect(api.factions(faction)).toBe("http://localhost:3000/api/v1/factions/faction-789")
    })

    it("should return weapons URLs", () => {
      expect(api.weapons()).toBe("http://localhost:3000/api/v1/weapons")
      expect(api.weapons(weapon)).toBe("http://localhost:3000/api/v1/weapons/weapon-111")
      expect(api.importWeapons()).toBe("http://localhost:3000/api/v1/weapons/import")
    })

    it("should return schticks URLs", () => {
      expect(api.schticks()).toBe("http://localhost:3000/api/v1/schticks")
      expect(api.schticks(schtick)).toBe("http://localhost:3000/api/v1/schticks/schtick-222")
      expect(api.importSchticks()).toBe("http://localhost:3000/api/v1/schticks/import")
    })
  })

  describe("fight effects", () => {
    const fight = { ...defaultFight, id: "fight-123" }
    const effect = { id: "effect-456", name: "Test Effect" }
    const characterEffect = { id: "char-effect-789", name: "Character Effect" }

    it("should return fight effects URLs", () => {
      expect(api.effects(fight)).toBe("http://localhost:3000/api/v1/fights/fight-123/effects")
      expect(api.effects(fight, effect)).toBe("http://localhost:3000/api/v1/fights/fight-123/effects/effect-456")
    })

    it("should return character effects URLs", () => {
      expect(api.characterEffects(fight)).toBe("http://localhost:3000/api/v1/fights/fight-123/character_effects")
      expect(api.characterEffects(fight, characterEffect)).toBe("http://localhost:3000/api/v1/fights/fight-123/character_effects/char-effect-789")
    })
  })

  describe("campaigns and users", () => {
    const campaign = { ...defaultCampaign, id: "campaign-123" }
    const user = { ...defaultUser, id: "user-456" }
    const invitation = { id: "invitation-789", email: "test@example.com", maximum_count: 1, remaining_count: 1, pending_user: defaultUser }

    it("should return campaigns URLs", () => {
      expect(api.campaigns()).toBe("http://localhost:3000/api/v1/campaigns")
      expect(api.campaigns(campaign)).toBe("http://localhost:3000/api/v1/campaigns/campaign-123")
      expect(api.currentCampaign()).toBe("http://localhost:3000/api/v1/campaigns/current")
      expect(api.campaignMemberships()).toBe("http://localhost:3000/api/v1/campaign_memberships")
    })

    it("should return users URLs", () => {
      expect(api.users()).toBe("http://localhost:3000/api/v1/users")
      expect(api.users(user)).toBe("http://localhost:3000/api/v1/users/user-456")
      expect(api.adminUsers()).toBe("http://localhost:3000/api/v1/users")
      expect(api.adminUsers(user)).toBe("http://localhost:3000/api/v1/users/user-456")
    })

    it("should return auth URLs", () => {
      expect(api.signIn()).toBe("http://localhost:3000/users/sign_in")
      expect(api.registerUser()).toBe("http://localhost:3000/users")
      expect(api.unlockUser()).toBe("http://localhost:3000/users/unlock")
      expect(api.confirmUser()).toBe("http://localhost:3000/users/confirmation")
      expect(api.resetUserPassword()).toBe("http://localhost:3000/users/password")
    })

    it("should return invitations URLs", () => {
      expect(api.invitations()).toBe("http://localhost:3000/api/v1/invitations")
      expect(api.invitations(invitation)).toBe("http://localhost:3000/api/v1/invitations/invitation-789")
    })
  })

  describe("special endpoints", () => {
    it("should return notion characters URL", () => {
      expect(api.notionCharacters()).toBe("http://localhost:3000/api/v1/notion/characters")
    })
  })

  describe("edge cases", () => {
    it("should handle objects with undefined id", () => {
      const objectWithUndefinedId = { id: undefined, name: "test" }
      expect(api.characters(null, objectWithUndefinedId as any)).toBe("http://localhost:3000/api/v1/characters")
    })

    it("should handle null objects", () => {
      expect(api.characters(null, null as any)).toBe("http://localhost:3000/api/v1/characters")
    })

    it("should handle missing environment variables", () => {
      delete process.env.NEXT_PUBLIC_SERVER_URL
      expect(api.base()).toBe(undefined as any)
    })
  })
})