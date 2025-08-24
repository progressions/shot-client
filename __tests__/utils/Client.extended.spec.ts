import Client from '../../utils/Client'
import axios, { AxiosError } from 'axios'
import { createMockCharacter, createMockFight, createMockCampaign, createMockUser } from '../factories/MockFactories'

// Mock axios
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('Client Extended Error Handling Tests', () => {
  let client: Client

  beforeEach(() => {
    client = new Client({ jwt: 'test-jwt-token' })
    jest.clearAllMocks()
  })

  describe('network error recovery', () => {
    it('should handle network timeout errors', async () => {
      const networkError = new Error('Network Error')
      networkError.name = 'ECONNABORTED'
      mockedAxios.mockRejectedValue(networkError)

      await expect(client.getAllCharacters()).rejects.toThrow('Network Error')
    })

    it('should handle connection refused errors', async () => {
      const connectionError = new Error('connect ECONNREFUSED 127.0.0.1:3000')
      connectionError.name = 'ECONNREFUSED'
      mockedAxios.mockRejectedValue(connectionError)

      await expect(client.getFights()).rejects.toThrow('connect ECONNREFUSED')
    })

    it('should handle DNS resolution errors', async () => {
      const dnsError = new Error('getaddrinfo ENOTFOUND localhost')
      dnsError.name = 'ENOTFOUND'
      mockedAxios.mockRejectedValue(dnsError)

      await expect(client.getCampaigns()).rejects.toThrow('getaddrinfo ENOTFOUND')
    })

    it('should handle request timeout errors', async () => {
      const timeoutError: AxiosError = new AxiosError('timeout of 5000ms exceeded')
      timeoutError.code = 'ECONNABORTED'
      mockedAxios.mockRejectedValue(timeoutError)

      await expect(client.getUsers()).rejects.toThrow('timeout of 5000ms exceeded')
    })
  })

  describe('401 unauthorized handling', () => {
    it('should handle 401 errors for character requests', async () => {
      const unauthorized: AxiosError = new AxiosError('Unauthorized')
      unauthorized.response = {
        status: 401,
        statusText: 'Unauthorized',
        data: { error: 'Invalid token' },
        headers: {},
        config: {}
      } as any

      mockedAxios.mockRejectedValue(unauthorized)

      await expect(client.getAllCharacters()).rejects.toThrow('Unauthorized')
    })

    it('should handle 401 errors for campaign requests', async () => {
      const unauthorized: AxiosError = new AxiosError('Token expired')
      unauthorized.response = {
        status: 401,
        statusText: 'Unauthorized',
        data: { error: 'Token expired', expired: true },
        headers: {},
        config: {}
      } as any

      mockedAxios.mockRejectedValue(unauthorized)

      await expect(client.getCampaigns()).rejects.toThrow('Token expired')
    })

    it('should handle missing JWT token', async () => {
      const clientWithoutJWT = new Client()
      
      await expect(clientWithoutJWT.getAllCharacters()).rejects.toThrow('No JWT provided')
    })

    it('should handle invalid JWT format', async () => {
      const invalidJWT: AxiosError = new AxiosError('Invalid JWT format')
      invalidJWT.response = {
        status: 401,
        statusText: 'Unauthorized',
        data: { error: 'JWT decode error' },
        headers: {},
        config: {}
      } as any

      mockedAxios.mockRejectedValue(invalidJWT)

      await expect(client.getUser({ id: '123' })).rejects.toThrow('Invalid JWT format')
    })

    it('should handle JWT signature verification failure', async () => {
      const signatureError: AxiosError = new AxiosError('JWT signature verification failed')
      signatureError.response = {
        status: 401,
        statusText: 'Unauthorized',
        data: { error: 'signature verification failed' },
        headers: {},
        config: {}
      } as any

      mockedAxios.mockRejectedValue(signatureError)

      await expect(client.getCurrentCampaign()).rejects.toThrow('JWT signature verification failed')
    })
  })

  describe('403 forbidden handling', () => {
    it('should handle 403 errors for admin operations', async () => {
      const forbidden: AxiosError = new AxiosError('Forbidden')
      forbidden.response = {
        status: 403,
        statusText: 'Forbidden',
        data: { error: 'Insufficient permissions' },
        headers: {},
        config: {}
      } as any

      mockedAxios.mockRejectedValue(forbidden)

      const user = createMockUser({ id: '123' })
      await expect(client.deleteUser(user)).rejects.toThrow('Forbidden')
    })

    it('should handle 403 errors for gamemaster-only operations', async () => {
      const forbidden: AxiosError = new AxiosError('Access denied')
      forbidden.response = {
        status: 403,
        statusText: 'Forbidden',
        data: { error: 'Gamemaster access required' },
        headers: {},
        config: {}
      } as any

      mockedAxios.mockRejectedValue(forbidden)

      const fight = createMockFight({ id: '123' })
      await expect(client.deleteFight(fight)).rejects.toThrow('Access denied')
    })

    it('should handle 403 errors for campaign ownership violations', async () => {
      const forbidden: AxiosError = new AxiosError('Not campaign owner')
      forbidden.response = {
        status: 403,
        statusText: 'Forbidden',
        data: { error: 'Only campaign owner can perform this action' },
        headers: {},
        config: {}
      } as any

      mockedAxios.mockRejectedValue(forbidden)

      const campaign = createMockCampaign({ id: '123' })
      await expect(client.deleteCampaign(campaign)).rejects.toThrow('Not campaign owner')
    })
  })

  describe('404 not found handling', () => {
    it('should handle 404 errors for missing characters', async () => {
      const notFound: AxiosError = new AxiosError('Character not found')
      notFound.response = {
        status: 404,
        statusText: 'Not Found',
        data: { error: 'Character with ID 999 not found' },
        headers: {},
        config: {}
      } as any

      mockedAxios.mockRejectedValue(notFound)

      await expect(client.getCharacter({ id: '999' })).rejects.toThrow('Character not found')
    })

    it('should handle 404 errors for missing campaigns', async () => {
      const notFound: AxiosError = new AxiosError('Campaign not found')
      notFound.response = {
        status: 404,
        statusText: 'Not Found',
        data: { error: 'Campaign not found' },
        headers: {},
        config: {}
      } as any

      mockedAxios.mockRejectedValue(notFound)

      await expect(client.getCampaign({ id: '999' })).rejects.toThrow('Campaign not found')
    })

    it('should handle 404 errors for missing fights', async () => {
      const notFound: AxiosError = new AxiosError('Fight not found')
      notFound.response = {
        status: 404,
        statusText: 'Not Found',
        data: { error: 'Fight not found or inactive' },
        headers: {},
        config: {}
      } as any

      mockedAxios.mockRejectedValue(notFound)

      await expect(client.getFight({ id: '999' })).rejects.toThrow('Fight not found')
    })

    it('should handle 404 errors for missing resources with nested routes', async () => {
      const notFound: AxiosError = new AxiosError('Weapon not found')
      notFound.response = {
        status: 404,
        statusText: 'Not Found',
        data: { error: 'Weapon not associated with character' },
        headers: {},
        config: {}
      } as any

      mockedAxios.mockRejectedValue(notFound)

      const character = createMockCharacter({ id: '123' })
      await expect(client.getCharacterWeapons(character)).rejects.toThrow('Weapon not found')
    })
  })

  describe('500 server error handling', () => {
    it('should handle 500 internal server errors', async () => {
      const serverError: AxiosError = new AxiosError('Internal Server Error')
      serverError.response = {
        status: 500,
        statusText: 'Internal Server Error',
        data: { error: 'Database connection failed' },
        headers: {},
        config: {}
      } as any

      mockedAxios.mockRejectedValue(serverError)

      await expect(client.getAllVehicles()).rejects.toThrow('Internal Server Error')
    })

    it('should handle 502 bad gateway errors', async () => {
      const badGateway: AxiosError = new AxiosError('Bad Gateway')
      badGateway.response = {
        status: 502,
        statusText: 'Bad Gateway',
        data: { error: 'Upstream server error' },
        headers: {},
        config: {}
      } as any

      mockedAxios.mockRejectedValue(badGateway)

      await expect(client.getSuggestions()).rejects.toThrow('Bad Gateway')
    })

    it('should handle 503 service unavailable errors', async () => {
      const serviceUnavailable: AxiosError = new AxiosError('Service Unavailable')
      serviceUnavailable.response = {
        status: 503,
        statusText: 'Service Unavailable',
        data: { error: 'Server is temporarily unavailable' },
        headers: {},
        config: {}
      } as any

      mockedAxios.mockRejectedValue(serviceUnavailable)

      await expect(client.generateAiCharacter()).rejects.toThrow('Service Unavailable')
    })

    it('should handle 504 gateway timeout errors', async () => {
      const gatewayTimeout: AxiosError = new AxiosError('Gateway Timeout')
      gatewayTimeout.response = {
        status: 504,
        statusText: 'Gateway Timeout',
        data: { error: 'Request timeout' },
        headers: {},
        config: {}
      } as any

      mockedAxios.mockRejectedValue(gatewayTimeout)

      const character = createMockCharacter({ id: '123' })
      await expect(client.getCharacterPdf(character)).rejects.toThrow('Gateway Timeout')
    })
  })

  describe('request validation and malformed data handling', () => {
    it('should handle 422 unprocessable entity errors', async () => {
      const validationError: AxiosError = new AxiosError('Validation failed')
      validationError.response = {
        status: 422,
        statusText: 'Unprocessable Entity',
        data: { 
          error: 'Validation failed',
          errors: {
            name: ['is required'],
            action_values: ['must be valid numbers']
          }
        },
        headers: {},
        config: {}
      } as any

      mockedAxios.mockRejectedValue(validationError)

      const invalidCharacter = createMockCharacter({ name: '', action_values: { guns: -1 } as any })
      await expect(client.createCharacter(invalidCharacter)).rejects.toThrow('Validation failed')
    })

    it('should handle malformed JSON responses', async () => {
      const parseError = new Error('Unexpected token in JSON at position 0')
      parseError.name = 'SyntaxError'
      
      // Mock axios to return malformed JSON
      mockedAxios.mockResolvedValue({ 
        data: 'invalid-json{',
        status: 200 
      } as any)

      // The client relies on axios to parse JSON, so this would be handled by axios internally
      const result = await client.getAllCharacters()
      expect(result).toBe('invalid-json{')
    })

    it('should handle empty response bodies', async () => {
      mockedAxios.mockResolvedValue({ 
        data: null,
        status: 204 
      } as any)

      const result = await client.deleteCharacter(createMockCharacter({ id: '123' }))
      expect(result).toBeNull()
    })
  })

  describe('WebSocket connection error handling', () => {
    it('should handle WebSocket connection failures gracefully', () => {
      const clientWithInvalidWS = new Client({ jwt: 'valid-jwt' })
      
      // Mock environment to point to invalid WebSocket URL
      process.env.NEXT_PUBLIC_WEBSOCKET_URL = 'ws://invalid-host:9999'
      
      // consumer() method should still return a consumer object even if connection fails
      const consumer = clientWithInvalidWS.consumer()
      expect(consumer).toBeDefined()
    })

    it('should handle WebSocket connection without JWT', () => {
      const clientWithoutJWT = new Client()
      
      const consumer = clientWithoutJWT.consumer()
      expect(consumer).toBeDefined()
    })

    it('should reuse existing consumer instance', () => {
      client.jwt = 'test-jwt'
      
      const consumer1 = client.consumer()
      const consumer2 = client.consumer()
      
      expect(consumer1).toBe(consumer2) // Should be the same instance
    })
  })

  describe('form data upload error handling', () => {
    it('should handle form data upload failures', async () => {
      const uploadError: AxiosError = new AxiosError('File too large')
      uploadError.response = {
        status: 413,
        statusText: 'Payload Too Large',
        data: { error: 'File size exceeds limit' },
        headers: {},
        config: {}
      } as any

      mockedAxios.mockRejectedValue(uploadError)

      const formData = new FormData()
      formData.append('file', new Blob(['test'], { type: 'application/pdf' }))

      await expect(client.uploadCharacterPdf(formData)).rejects.toThrow('File too large')
    })

    it('should handle unsupported file type errors', async () => {
      const fileTypeError: AxiosError = new AxiosError('Unsupported file type')
      fileTypeError.response = {
        status: 400,
        statusText: 'Bad Request',
        data: { error: 'Only PDF files are supported' },
        headers: {},
        config: {}
      } as any

      mockedAxios.mockRejectedValue(fileTypeError)

      const formData = new FormData()
      formData.append('file', new Blob(['test'], { type: 'text/plain' }))

      await expect(client.uploadCharacterPdf(formData)).rejects.toThrow('Unsupported file type')
    })
  })

  describe('rate limiting and throttling', () => {
    it('should handle 429 rate limit exceeded errors', async () => {
      const rateLimitError: AxiosError = new AxiosError('Too Many Requests')
      rateLimitError.response = {
        status: 429,
        statusText: 'Too Many Requests',
        data: { error: 'Rate limit exceeded' },
        headers: {
          'retry-after': '60'
        },
        config: {}
      } as any

      mockedAxios.mockRejectedValue(rateLimitError)

      await expect(client.generateAiCharacter()).rejects.toThrow('Too Many Requests')
    })

    it('should handle API quota exceeded errors', async () => {
      const quotaError: AxiosError = new AxiosError('Quota exceeded')
      quotaError.response = {
        status: 402,
        statusText: 'Payment Required',
        data: { error: 'API quota exceeded, upgrade required' },
        headers: {},
        config: {}
      } as any

      mockedAxios.mockRejectedValue(quotaError)

      await expect(client.getNotionCharacters()).rejects.toThrow('Quota exceeded')
    })
  })

  describe('concurrent request handling', () => {
    it('should handle multiple simultaneous requests', async () => {
      // Mock different responses for concurrent requests
      mockedAxios
        .mockResolvedValue({ data: [createMockCharacter({ id: '1' })] })
        .mockResolvedValue({ data: [createMockFight({ id: '1' })] })
        .mockResolvedValue({ data: [createMockCampaign({ id: '1' })] })

      const promises = [
        client.getAllCharacters(),
        client.getFights(),
        client.getCampaigns()
      ]

      const results = await Promise.all(promises)
      
      expect(results).toHaveLength(3)
      expect(results[0]).toEqual([createMockCharacter({ id: '1' })])
      expect(results[1]).toEqual([createMockFight({ id: '1' })])
      expect(results[2]).toEqual([createMockCampaign({ id: '1' })])
    })

    it('should handle mixed success/failure in concurrent requests', async () => {
      const networkError = new Error('Network Error')
      
      mockedAxios
        .mockResolvedValue({ data: [createMockCharacter({ id: '1' })] })
        .mockRejectedValue(networkError)
        .mockResolvedValue({ data: [createMockCampaign({ id: '1' })] })

      const promises = [
        client.getAllCharacters(),
        client.getFights(),
        client.getCampaigns()
      ]

      const results = await Promise.allSettled(promises)
      
      expect(results[0].status).toBe('fulfilled')
      expect(results[1].status).toBe('rejected')
      expect(results[2].status).toBe('fulfilled')
      
      if (results[1].status === 'rejected') {
        expect(results[1].reason).toBe(networkError)
      }
    })
  })
})