import axios from 'axios'
import Client from '../../utils/Client'
import Api from '../../utils/Api'
import { createConsumer } from '@rails/actioncable'
import {
  Character,
  Vehicle,
  Fight,
  Party,
  Campaign,
  User,
  Weapon,
  Schtick,
  FightEvent,
  CharacterJson
} from '../../types/types'

jest.mock('axios')
jest.mock('../../utils/Api')
jest.mock('@rails/actioncable', () => ({
  createConsumer: jest.fn()
}))

const mockAxios = axios as jest.Mocked<any>
const mockApi = Api as jest.MockedClass<typeof Api>
const mockCreateConsumer = createConsumer as jest.MockedFunction<typeof createConsumer>

describe('Client', () => {
  let client: Client
  let mockApiInstance: jest.Mocked<Api>
  let mockConsumer: any

  beforeEach(() => {
    jest.clearAllMocks()
    
    mockApiInstance = {
      cable: jest.fn().mockReturnValue('ws://localhost:3000/cable?token=test-jwt'),
      ai: jest.fn().mockReturnValue('/api/ai'),
      suggestions: jest.fn().mockReturnValue('/api/suggestions'),
      notionCharacters: jest.fn().mockReturnValue('/api/notion_characters'),
      locations: jest.fn().mockReturnValue('/api/locations'),
      memberships: jest.fn().mockReturnValue('/api/memberships'),
      parties: jest.fn().mockReturnValue('/api/parties'),
      fights: jest.fn().mockReturnValue('/api/fights'),
      fightEvents: jest.fn().mockReturnValue('/api/fight_events'),
      characters: jest.fn().mockReturnValue('/api/characters'),
      allCharacters: jest.fn().mockReturnValue('/api/all_characters'),
      vehicles: jest.fn().mockReturnValue('/api/vehicles'),
      allVehicles: jest.fn().mockReturnValue('/api/all_vehicles'),
      characterPdf: jest.fn().mockReturnValue('/api/character_pdf'),
      campaigns: jest.fn().mockReturnValue('/api/campaigns')
    } as any

    mockApi.mockImplementation(() => mockApiInstance)
    
    mockConsumer = {
      subscriptions: {
        create: jest.fn()
      }
    }
    mockCreateConsumer.mockReturnValue(mockConsumer)

    client = new Client({ jwt: 'test-jwt' })
  })

  describe('constructor', () => {
    it('should create client without JWT', () => {
      const clientNoJwt = new Client()
      expect(clientNoJwt.jwt).toBeUndefined()
      expect(mockApi).toHaveBeenCalled()
    })

    it('should create client with JWT', () => {
      const clientWithJwt = new Client({ jwt: 'test-token' })
      expect(clientWithJwt.jwt).toBe('test-token')
      expect(mockApi).toHaveBeenCalled()
    })
  })

  describe('consumer', () => {
    it('should create and cache WebSocket consumer', () => {
      const consumer = client.consumer()
      
      expect(mockApiInstance.cable).toHaveBeenCalledWith('test-jwt')
      expect(mockCreateConsumer).toHaveBeenCalledWith('ws://localhost:3000/cable?token=test-jwt')
      expect(consumer).toBe(mockConsumer)
    })

    it('should return cached consumer on subsequent calls', () => {
      const consumer1 = client.consumer()
      const consumer2 = client.consumer()
      
      expect(consumer1).toBe(consumer2)
      expect(mockCreateConsumer).toHaveBeenCalledTimes(1)
    })

    it('should create new consumer if no JWT initially but then JWT is available', () => {
      const clientNoJwt = new Client()
      clientNoJwt.jwt = 'new-jwt'
      
      const consumer = clientNoJwt.consumer()
      
      expect(mockApiInstance.cable).toHaveBeenCalledWith('new-jwt')
      expect(consumer).toBe(mockConsumer)
    })
  })

  describe('generateAiCharacter', () => {
    it('should make POST request to AI endpoint with description', async () => {
      const expectedResponse: CharacterJson = { name: 'Generated Character' } as CharacterJson
      const mockPost = jest.spyOn(client, 'post').mockResolvedValue(expectedResponse)

      const result = await client.generateAiCharacter({ description: 'A brave warrior' })

      expect(mockPost).toHaveBeenCalledWith('/api/ai', { ai: { description: 'A brave warrior' } })
      expect(result).toEqual(expectedResponse)
    })

    it('should handle empty description', async () => {
      const expectedResponse: CharacterJson = { name: 'Generated Character' } as CharacterJson
      const mockPost = jest.spyOn(client, 'post').mockResolvedValue(expectedResponse)

      const result = await client.generateAiCharacter()

      expect(mockPost).toHaveBeenCalledWith('/api/ai', { ai: { description: '' } })
      expect(result).toEqual(expectedResponse)
    })
  })

  describe('getSuggestions', () => {
    it('should make GET request to suggestions endpoint with query params', async () => {
      const expectedResponse = { suggestions: ['suggestion1', 'suggestion2'] }
      const mockGet = jest.spyOn(client, 'get').mockResolvedValue(expectedResponse)

      const result = await client.getSuggestions({ type: 'character', limit: '5' })

      expect(mockGet).toHaveBeenCalledWith('/api/suggestions?type=character&limit=5')
      expect(result).toEqual(expectedResponse)
    })

    it('should handle empty params', async () => {
      const expectedResponse = { suggestions: [] }
      const mockGet = jest.spyOn(client, 'get').mockResolvedValue(expectedResponse)

      const result = await client.getSuggestions()

      expect(mockGet).toHaveBeenCalledWith('/api/suggestions?')
      expect(result).toEqual(expectedResponse)
    })
  })

  describe('Party operations', () => {
    const mockParty: Party = { id: 'party-1', name: 'Test Party' } as Party
    const mockCharacter: Character = { id: 'char-1', name: 'Test Character' } as Character
    const mockVehicle: Vehicle = { id: 'vehicle-1', name: 'Test Vehicle' } as Vehicle

    describe('addCharacterToParty', () => {
      it('should add character to party', async () => {
        const expectedResponse = { ...mockParty, characters: [mockCharacter] }
        const mockPost = jest.spyOn(client, 'post').mockResolvedValue(expectedResponse)

        const result = await client.addCharacterToParty(mockParty, mockCharacter)

        expect(mockPost).toHaveBeenCalledWith('/api/memberships', { character_id: 'char-1' })
        expect(result).toEqual(expectedResponse)
      })
    })

    describe('addVehicleToParty', () => {
      it('should add vehicle to party', async () => {
        const expectedResponse = { ...mockParty, vehicles: [mockVehicle] }
        const mockPost = jest.spyOn(client, 'post').mockResolvedValue(expectedResponse)

        const result = await client.addVehicleToParty(mockParty, mockVehicle)

        expect(mockPost).toHaveBeenCalledWith('/api/memberships', { vehicle_id: 'vehicle-1' })
        expect(result).toEqual(expectedResponse)
      })
    })

    describe('removeCharacterFromParty', () => {
      it('should remove character from party', async () => {
        const expectedResponse = mockParty
        const mockDelete = jest.spyOn(client, 'delete').mockResolvedValue(expectedResponse)
        mockApiInstance.memberships.mockReturnValue('/api/memberships/char-1')

        const result = await client.removeCharacterFromParty(mockParty, mockCharacter)

        expect(mockDelete).toHaveBeenCalledWith('/api/memberships/char-1/character')
        expect(result).toEqual(expectedResponse)
      })
    })
  })

  describe('Fight operations', () => {
    const mockFight: Fight = { 
      id: 'fight-1', 
      name: 'Test Fight', 
      sequence: 1, 
      shot: 0,
      active: true,
      effects: [],
      shot_order: [],
      character_effects: {},
      vehicle_effects: {}
    } as Fight
    const mockFightEvent: FightEvent = { 
      event_type: 'test', 
      description: 'Test event' 
    } as FightEvent

    describe('getFight', () => {
      it('should get specific fight', async () => {
        const mockGet = jest.spyOn(client, 'get').mockResolvedValue(mockFight)

        const result = await client.getFight(mockFight)

        expect(mockGet).toHaveBeenCalledWith('/api/fights')
        expect(result).toEqual(mockFight)
      })
    })

    describe('createFightEvent', () => {
      it('should create fight event', async () => {
        const expectedResponse = { ...mockFightEvent, id: 'event-1' }
        const mockPost = jest.spyOn(client, 'post').mockResolvedValue(expectedResponse)

        const result = await client.createFightEvent(mockFight, mockFightEvent)

        expect(mockPost).toHaveBeenCalledWith('/api/fight_events', { fight_event: mockFightEvent })
        expect(result).toEqual(expectedResponse)
      })
    })

    describe('touchFight', () => {
      it('should touch fight to update timestamp', async () => {
        const mockPatch = jest.spyOn(client, 'patch').mockResolvedValue(mockFight)
        mockApiInstance.fights.mockReturnValue('/api/fights/fight-1')

        const result = await client.touchFight(mockFight)

        expect(mockPatch).toHaveBeenCalledWith('/api/fights/fight-1/touch')
        expect(result).toEqual(mockFight)
      })
    })
  })

  describe('Character operations', () => {
    const mockCharacter = { 
      id: 'char-1', 
      name: 'Test Character',
      schticks: [],
      weapons: [],
      advancements: [],
      sites: []
    } as any as Character

    describe('updateCharacter', () => {
      it('should update character excluding nested associations', async () => {
        const mockPatch = jest.spyOn(client, 'patch').mockResolvedValue(mockCharacter)

        const result = await client.updateCharacter(mockCharacter)

        const expectedCharacter = {
          ...mockCharacter,
          advancements: undefined,
          sites: undefined,
          schticks: undefined,
          weapons: undefined
        }

        expect(mockPatch).toHaveBeenCalledWith('/api/characters', { character: expectedCharacter })
        expect(result).toEqual(mockCharacter)
      })

      it('should update character with fight context', async () => {
        const mockFight: Fight = { id: 'fight-1' } as Fight
        const mockPatch = jest.spyOn(client, 'patch').mockResolvedValue(mockCharacter)

        const result = await client.updateCharacter(mockCharacter, mockFight)

        expect(mockPatch).toHaveBeenCalled()
        expect(result).toEqual(mockCharacter)
      })
    })

    describe('deleteCharacter', () => {
      it('should delete character without fight', async () => {
        const mockDelete = jest.spyOn(client, 'delete').mockResolvedValue(undefined)

        await client.deleteCharacter(mockCharacter)

        expect(mockDelete).toHaveBeenCalledWith('/api/characters')
      })

      it('should delete character from fight using shot_id', async () => {
        const mockFight: Fight = { id: 'fight-1' } as Fight
        const characterWithShotId = { ...mockCharacter, shot_id: 'shot-123' }
        const mockDelete = jest.spyOn(client, 'delete').mockResolvedValue(undefined)

        await client.deleteCharacter(characterWithShotId, mockFight)

        expect(mockDelete).toHaveBeenCalledWith('/api/characters')
      })
    })
  })

  describe('Campaign operations', () => {
    const mockCampaign: Campaign = { id: 'camp-1', name: 'Test Campaign' } as Campaign
    const mockUser: User = { id: 'user-1', name: 'Test User' } as User

    describe('setCurrentCampaign', () => {
      it('should set current campaign', async () => {
        const mockPost = jest.spyOn(client, 'post').mockResolvedValue(mockCampaign)
        mockApiInstance.currentCampaign = jest.fn().mockReturnValue('/api/current_campaign')

        const result = await client.setCurrentCampaign(mockCampaign)

        expect(mockPost).toHaveBeenCalledWith('/api/current_campaign', { id: 'camp-1' })
        expect(result).toEqual(mockCampaign)
      })

      it('should clear current campaign with null', async () => {
        const mockPost = jest.spyOn(client, 'post').mockResolvedValue(null)
        mockApiInstance.currentCampaign = jest.fn().mockReturnValue('/api/current_campaign')

        const result = await client.setCurrentCampaign(null)

        expect(mockPost).toHaveBeenCalledWith('/api/current_campaign', { id: undefined })
        expect(result).toBeNull()
      })
    })

    describe('addPlayer', () => {
      it('should add player to campaign', async () => {
        const mockPost = jest.spyOn(client, 'post').mockResolvedValue(mockCampaign)
        mockApiInstance.campaignMemberships = jest.fn().mockReturnValue('/api/campaign_memberships')

        const result = await client.addPlayer(mockUser, mockCampaign)

        expect(mockPost).toHaveBeenCalledWith('/api/campaign_memberships', {
          campaign_id: 'camp-1',
          user_id: 'user-1'
        })
        expect(result).toEqual(mockCampaign)
      })
    })
  })

  describe('HTTP methods', () => {
    describe('get', () => {
      it('should make GET request with JWT', async () => {
        const expectedResponse = { data: 'test' }
        mockAxios.mockResolvedValue({ data: expectedResponse })

        const result = await client.get('/test/url', { param: 'value' })

        expect(mockAxios).toHaveBeenCalledWith({
          url: '/test/url',
          method: 'GET',
          params: { param: 'value' },
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'test-jwt'
          }
        })
        expect(result).toEqual(expectedResponse)
      })

      it('should reject when no JWT provided', async () => {
        const clientNoJwt = new Client()

        await expect(clientNoJwt.get('/test/url')).rejects.toThrow('No JWT provided')
      })
    })

    describe('post', () => {
      it('should make POST request', async () => {
        const expectedResponse = { id: 'new-id' }
        const mockRequest = jest.spyOn(client, 'request').mockResolvedValue(expectedResponse)

        const result = await client.post('/test/url', { data: 'value' })

        expect(mockRequest).toHaveBeenCalledWith('POST', '/test/url', { data: 'value' })
        expect(result).toEqual(expectedResponse)
      })
    })

    describe('patch', () => {
      it('should make PATCH request', async () => {
        const expectedResponse = { id: 'updated-id' }
        const mockRequest = jest.spyOn(client, 'request').mockResolvedValue(expectedResponse)

        const result = await client.patch('/test/url', { data: 'updated' })

        expect(mockRequest).toHaveBeenCalledWith('PATCH', '/test/url', { data: 'updated' })
        expect(result).toEqual(expectedResponse)
      })
    })

    describe('delete', () => {
      it('should make DELETE request', async () => {
        mockAxios.mockResolvedValue({ data: null })

        const result = await client.delete('/test/url')

        expect(mockAxios).toHaveBeenCalledWith({
          url: '/test/url',
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'test-jwt'
          }
        })
        expect(result).toBeNull()
      })
    })
  })

  describe('request', () => {
    it('should use params for GET requests', async () => {
      mockAxios.mockResolvedValue({ data: { result: 'success' } })

      const result = await client.request('GET', '/test/url', { param: 'value' })

      expect(mockAxios).toHaveBeenCalledWith({
        url: '/test/url',
        method: 'GET',
        params: { param: 'value' },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'test-jwt'
        }
      })
      expect(result).toEqual({ result: 'success' })
    })

    it('should use data for POST requests', async () => {
      mockAxios.mockResolvedValue({ data: { result: 'created' } })

      const result = await client.request('POST', '/test/url', { data: 'value' })

      expect(mockAxios).toHaveBeenCalledWith({
        url: '/test/url',
        method: 'POST',
        data: { data: 'value' },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'test-jwt'
        }
      })
      expect(result).toEqual({ result: 'created' })
    })
  })

  describe('queryParams', () => {
    it('should convert object to query string', () => {
      const params = { name: 'test', type: 'character', active: 'true' }
      const result = client.queryParams(params)

      expect(result).toBe('name=test&type=character&active=true')
    })

    it('should handle empty values', () => {
      const params = { name: '', type: 'character', active: null }
      const result = client.queryParams(params)

      expect(result).toBe('name=&type=character&active=')
    })

    it('should handle empty params object', () => {
      const result = client.queryParams()

      expect(result).toBe('')
    })
  })

  describe('getCharacterPdf', () => {
    it('should make request for character PDF with arraybuffer response', async () => {
      const mockPdfData = new ArrayBuffer(1024)
      mockAxios.mockResolvedValue({ data: mockPdfData })

      const result = await client.getCharacterPdf({ id: 'char-1' } as Character)

      expect(mockAxios).toHaveBeenCalledWith({
        url: '/api/character_pdf',
        method: 'GET',
        params: {},
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'test-jwt'
        }
      })
      expect(result).toBe(mockPdfData)
    })
  })
})