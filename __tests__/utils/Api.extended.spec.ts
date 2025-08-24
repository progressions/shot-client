import Api from '../../utils/Api'
import { createMockCharacter, createMockFight, createMockWeapon, createMockVehicle, createMockParty } from '../factories/MockFactories'

describe('Api Extended Tests', () => {
  let api: Api

  beforeEach(() => {
    api = new Api()
    // Mock environment variables
    process.env.NEXT_PUBLIC_SERVER_URL = 'http://localhost:3000'
    process.env.NEXT_PUBLIC_WEBSOCKET_URL = 'ws://localhost:3000'
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('URL building for all resource types', () => {
    it('should build correct base URLs for all resource endpoints', () => {
      expect(api.base()).toBe('http://localhost:3000')
      expect(api.api()).toBe('http://localhost:3000/api/v1')
      expect(api.ai()).toBe('http://localhost:3000/api/v1/ai')
      expect(api.suggestions()).toBe('http://localhost:3000/api/v1/suggestions')
      expect(api.locations()).toBe('http://localhost:3000/api/v1/locations')
      expect(api.parties()).toBe('http://localhost:3000/api/v1/parties')
      expect(api.fights()).toBe('http://localhost:3000/api/v1/fights')
      expect(api.allCharacters()).toBe('http://localhost:3000/api/v1/characters')
      expect(api.allVehicles()).toBe('http://localhost:3000/api/v1/vehicles')
      expect(api.junctures()).toBe('http://localhost:3000/api/v1/junctures')
      expect(api.allSites()).toBe('http://localhost:3000/api/v1/sites')
      expect(api.campaigns()).toBe('http://localhost:3000/api/v1/campaigns')
      expect(api.factions()).toBe('http://localhost:3000/api/v1/factions')
      expect(api.weapons()).toBe('http://localhost:3000/api/v1/weapons')
      expect(api.schticks()).toBe('http://localhost:3000/api/v1/schticks')
      expect(api.users()).toBe('http://localhost:3000/api/v1/users')
      expect(api.invitations()).toBe('http://localhost:3000/api/v1/invitations')
      expect(api.campaignMemberships()).toBe('http://localhost:3000/api/v1/campaign_memberships')
      expect(api.notionCharacters()).toBe('http://localhost:3000/api/v1/notion/characters')
      expect(api.importSchticks()).toBe('http://localhost:3000/api/v1/schticks/import')
      expect(api.importWeapons()).toBe('http://localhost:3000/api/v1/weapons/import')
    })

    it('should build correct individual resource URLs', () => {
      const character = createMockCharacter({ id: '123' })
      const fight = createMockFight({ id: '456' })
      const weapon = createMockWeapon({ id: '789' })

      expect(api.allCharacters(character)).toBe('http://localhost:3000/api/v1/characters/123')
      expect(api.fights(fight)).toBe('http://localhost:3000/api/v1/fights/456')
      expect(api.weapons(weapon)).toBe('http://localhost:3000/api/v1/weapons/789')
    })
  })

  describe('nested resource URL construction', () => {
    it('should build correct nested URLs for character resources', () => {
      const character = createMockCharacter({ id: '123' })
      const weapon = createMockWeapon({ id: '456' })
      const schtick = { id: '789' }
      const advancement = { id: '101' }
      const site = { id: '102' }

      expect(api.characterWeapons(character)).toBe('http://localhost:3000/api/v1/characters/123/weapons')
      expect(api.characterWeapons(character, weapon)).toBe('http://localhost:3000/api/v1/characters/123/weapons/456')
      expect(api.characterSchticks(character)).toBe('http://localhost:3000/api/v1/characters/123/schticks')
      expect(api.characterSchticks(character, schtick)).toBe('http://localhost:3000/api/v1/characters/123/schticks/789')
      expect(api.advancements(character)).toBe('http://localhost:3000/api/v1/characters/123/advancements')
      expect(api.advancements(character, advancement)).toBe('http://localhost:3000/api/v1/characters/123/advancements/101')
      expect(api.sites(character)).toBe('http://localhost:3000/api/v1/characters/123/sites')
      expect(api.sites(character, site)).toBe('http://localhost:3000/api/v1/characters/123/sites/102')
    })

    it('should build correct nested URLs for fight resources', () => {
      const fight = createMockFight({ id: '123' })
      const character = createMockCharacter({ id: '456' })
      const vehicle = createMockVehicle({ id: '789' })
      const effect = { id: '101' }
      const characterEffect = { id: '102' }

      expect(api.characters(fight)).toBe('http://localhost:3000/api/v1/fights/123/actors')
      expect(api.characters(fight, character)).toBe('http://localhost:3000/api/v1/fights/123/actors/456')
      expect(api.vehicles(fight)).toBe('http://localhost:3000/api/v1/fights/123/drivers')
      expect(api.vehicles(fight, vehicle)).toBe('http://localhost:3000/api/v1/fights/123/drivers/789')
      expect(api.effects(fight)).toBe('http://localhost:3000/api/v1/fights/123/effects')
      expect(api.effects(fight, effect)).toBe('http://localhost:3000/api/v1/fights/123/effects/101')
      expect(api.characterEffects(fight)).toBe('http://localhost:3000/api/v1/fights/123/character_effects')
      expect(api.characterEffects(fight, characterEffect)).toBe('http://localhost:3000/api/v1/fights/123/character_effects/102')
      expect(api.fightEvents(fight)).toBe('http://localhost:3000/api/v1/fights/123/fight_events')
    })

    it('should build correct action URLs for fight participants', () => {
      const fight = createMockFight({ id: '123' })
      const character = createMockCharacter({ id: '456' })
      const vehicle = createMockVehicle({ id: '789' })

      expect(api.addCharacter(fight, character)).toBe('http://localhost:3000/api/v1/fights/123/actors/456/add')
      expect(api.actCharacter(fight, character)).toBe('http://localhost:3000/api/v1/fights/123/actors/456/act')
      expect(api.hideCharacter(fight, character)).toBe('http://localhost:3000/api/v1/fights/123/actors/456/hide')
      expect(api.revealCharacter(fight, character)).toBe('http://localhost:3000/api/v1/fights/123/actors/456/reveal')
      
      expect(api.addVehicle(fight, vehicle)).toBe('http://localhost:3000/api/v1/fights/123/drivers/789/add')
      expect(api.actVehicle(fight, vehicle)).toBe('http://localhost:3000/api/v1/fights/123/drivers/789/act')
      expect(api.hideVehicle(fight, vehicle)).toBe('http://localhost:3000/api/v1/fights/123/drivers/789/hide')
      expect(api.revealVehicle(fight, vehicle)).toBe('http://localhost:3000/api/v1/fights/123/drivers/789/reveal')
    })

    it('should build correct party and membership URLs', () => {
      const party = createMockParty({ id: '123' })
      const character = createMockCharacter({ id: '456' })
      const fight = createMockFight({ id: '789' })

      expect(api.parties(party)).toBe('http://localhost:3000/api/v1/parties/123')
      expect(api.memberships(party)).toBe('http://localhost:3000/api/v1/parties/123/memberships')
      expect(api.memberships(party, character)).toBe('http://localhost:3000/api/v1/parties/123/memberships/456')
      expect(api.addPartyToFight(party, fight)).toBe('http://localhost:3000/api/v1/parties/123/fight/789')
    })
  })

  describe('WebSocket URL generation', () => {
    it('should generate correct WebSocket URL with token', () => {
      const token = 'jwt-token-123'
      expect(api.cable(token)).toBe('ws://localhost:3000/cable?token=jwt-token-123')
    })

    it('should generate correct WebSocket URL without token', () => {
      expect(api.cable()).toBe('ws://localhost:3000/cable?token=')
    })

    it('should handle undefined token', () => {
      expect(api.cable(undefined)).toBe('ws://localhost:3000/cable?token=')
    })

    it('should handle empty token', () => {
      expect(api.cable('')).toBe('ws://localhost:3000/cable?token=')
    })
  })

  describe('edge cases with empty IDs', () => {
    it('should handle objects with empty/null IDs', () => {
      const characterWithEmptyId = { id: '' }
      const fightWithNullId = { id: null as any }
      
      // Should fall back to collection URLs when ID is empty/null
      expect(api.allCharacters(characterWithEmptyId)).toBe('http://localhost:3000/api/v1/characters')
      expect(api.fights(fightWithNullId)).toBe('http://localhost:3000/api/v1/fights')
    })

    it('should handle undefined objects gracefully', () => {
      expect(api.allCharacters(undefined)).toBe('http://localhost:3000/api/v1/characters')
      expect(api.fights(undefined)).toBe('http://localhost:3000/api/v1/fights')
      expect(api.weapons(undefined)).toBe('http://localhost:3000/api/v1/weapons')
    })

    it('should handle null objects gracefully', () => {
      expect(api.characters(null)).toBe('http://localhost:3000/api/v1/characters')
      expect(api.vehicles(null)).toBe('http://localhost:3000/api/v1/vehicles')
    })
  })

  describe('environment variable usage', () => {
    it('should handle missing SERVER_URL environment variable', () => {
      delete process.env.NEXT_PUBLIC_SERVER_URL
      
      const newApi = new Api()
      expect(newApi.base()).toBe(undefined)
      expect(newApi.api()).toBe('undefined/api/v1')
    })

    it('should handle missing WEBSOCKET_URL environment variable', () => {
      delete process.env.NEXT_PUBLIC_WEBSOCKET_URL
      
      const newApi = new Api()
      expect(newApi.cable('token')).toBe('undefined/cable?token=token')
    })

    it('should work with different environment URLs', () => {
      process.env.NEXT_PUBLIC_SERVER_URL = 'https://api.example.com'
      process.env.NEXT_PUBLIC_WEBSOCKET_URL = 'wss://ws.example.com'
      
      const newApi = new Api()
      expect(newApi.base()).toBe('https://api.example.com')
      expect(newApi.api()).toBe('https://api.example.com/api/v1')
      expect(newApi.cable('token')).toBe('wss://ws.example.com/cable?token=token')
    })
  })

  describe('special characters in IDs', () => {
    it('should handle special characters in resource IDs', () => {
      const characterWithSpecialId = createMockCharacter({ id: 'char-123_test@domain.com' })
      const fightWithUuidId = createMockFight({ id: '550e8400-e29b-41d4-a716-446655440000' })
      const weaponWithEncodedId = createMockWeapon({ id: 'weapon%20with%20spaces' })

      expect(api.allCharacters(characterWithSpecialId)).toBe('http://localhost:3000/api/v1/characters/char-123_test@domain.com')
      expect(api.fights(fightWithUuidId)).toBe('http://localhost:3000/api/v1/fights/550e8400-e29b-41d4-a716-446655440000')
      expect(api.weapons(weaponWithEncodedId)).toBe('http://localhost:3000/api/v1/weapons/weapon%20with%20spaces')
    })

    it('should handle numeric IDs as strings', () => {
      const characterWithNumericId = createMockCharacter({ id: '12345' })
      const fightWithNumericId = createMockFight({ id: '67890' })

      expect(api.allCharacters(characterWithNumericId)).toBe('http://localhost:3000/api/v1/characters/12345')
      expect(api.fights(fightWithNumericId)).toBe('http://localhost:3000/api/v1/fights/67890')
    })
  })

  describe('authentication and user management URLs', () => {
    it('should build correct user authentication URLs', () => {
      expect(api.signIn()).toBe('http://localhost:3000/users/sign_in')
      expect(api.registerUser()).toBe('http://localhost:3000/users')
      expect(api.unlockUser()).toBe('http://localhost:3000/users/unlock')
      expect(api.confirmUser()).toBe('http://localhost:3000/users/confirmation')
      expect(api.resetUserPassword()).toBe('http://localhost:3000/users/password')
    })

    it('should build correct admin and regular user URLs', () => {
      const user = { id: '123' }
      
      expect(api.users()).toBe('http://localhost:3000/api/v1/users')
      expect(api.users(user)).toBe('http://localhost:3000/api/v1/users/123')
      expect(api.adminUsers()).toBe('http://localhost:3000/api/v1/users')
      expect(api.adminUsers(user)).toBe('http://localhost:3000/api/v1/users/123')
    })
  })

  describe('campaign management URLs', () => {
    it('should build correct campaign URLs', () => {
      const campaign = { id: '123' }
      
      expect(api.campaigns()).toBe('http://localhost:3000/api/v1/campaigns')
      expect(api.campaigns(campaign)).toBe('http://localhost:3000/api/v1/campaigns/123')
      expect(api.currentCampaign()).toBe('http://localhost:3000/api/v1/campaigns/current')
    })

    it('should handle campaign ID as object or string', () => {
      const campaignObject = { id: '123' }
      const campaignId = '456'
      
      expect(api.campaigns(campaignObject)).toBe('http://localhost:3000/api/v1/campaigns/123')
      expect(api.campaigns({ id: campaignId })).toBe('http://localhost:3000/api/v1/campaigns/456')
    })
  })

  describe('fight context switching', () => {
    it('should return fight-specific character URLs when fight is provided', () => {
      const fight = createMockFight({ id: '123' })
      const character = createMockCharacter({ id: '456' })

      expect(api.characters(fight)).toBe('http://localhost:3000/api/v1/fights/123/actors')
      expect(api.characters(fight, character)).toBe('http://localhost:3000/api/v1/fights/123/actors/456')
    })

    it('should return global character URLs when fight is not provided', () => {
      const character = createMockCharacter({ id: '456' })

      expect(api.characters(null)).toBe('http://localhost:3000/api/v1/characters')
      expect(api.characters(null, character)).toBe('http://localhost:3000/api/v1/characters/456')
      expect(api.characters(undefined)).toBe('http://localhost:3000/api/v1/characters')
    })

    it('should handle vehicle context switching correctly', () => {
      const fight = createMockFight({ id: '123' })
      const vehicle = createMockVehicle({ id: '789' })

      expect(api.vehicles(fight)).toBe('http://localhost:3000/api/v1/fights/123/drivers')
      expect(api.vehicles(fight, vehicle)).toBe('http://localhost:3000/api/v1/fights/123/drivers/789')
      expect(api.vehicles(null)).toBe('http://localhost:3000/api/v1/vehicles')
      expect(api.vehicles(null, vehicle)).toBe('http://localhost:3000/api/v1/vehicles/789')
    })
  })

  describe('specialized endpoints', () => {
    it('should build PDF generation URL correctly', () => {
      const character = createMockCharacter({ id: '123' })
      expect(api.characterPdf(character)).toBe('http://localhost:3000/api/v1/characters/123/pdf')
    })

    it('should build characters and vehicles endpoint correctly', () => {
      expect(api.charactersAndVehicles()).toBe('http://localhost:3000/api/v1/characters_and_vehicles')
      
      const fight = createMockFight({ id: '123' })
      expect(api.charactersAndVehicles(fight)).toBe('http://localhost:3000/api/v1/characters_and_vehicles/123')
    })
  })
})