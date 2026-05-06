import secureStoreService from '../app/services/secureStore.service'

const mockStore: Record<string, string> = {}

jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn((key: string, value: string) => {
    mockStore[key] = value
    return Promise.resolve()
  }),
  getItemAsync: jest.fn((key: string) => Promise.resolve(mockStore[key] ?? null)),
  deleteItemAsync: jest.fn((key: string) => {
    delete mockStore[key]
    return Promise.resolve()
  }),
}))

describe('SecureStoreService', () => {
  beforeEach(() => {
    Object.keys(mockStore).forEach((k) => delete mockStore[k])
    jest.clearAllMocks()
  })

  describe('token management', () => {
    it('saves and retrieves the access token', async () => {
      await secureStoreService.saveToken('my-access-token')
      const token = await secureStoreService.getToken()
      expect(token).toBe('my-access-token')
    })

    it('returns null when no access token is stored', async () => {
      const token = await secureStoreService.getToken()
      expect(token).toBeNull()
    })

    it('saves and retrieves the refresh token', async () => {
      await secureStoreService.saveRefreshToken('my-refresh-token')
      const token = await secureStoreService.getRefreshToken()
      expect(token).toBe('my-refresh-token')
    })
  })

  describe('user management', () => {
    it('saves and retrieves a user object (JSON serialization)', async () => {
      const user = { email: 'test@test.com', firstName: 'John', lastName: 'Doe' }
      await secureStoreService.saveUser(user)
      const retrieved = await secureStoreService.getUser<typeof user>()
      expect(retrieved).toEqual(user)
    })

    it('returns null when no user is stored', async () => {
      const user = await secureStoreService.getUser()
      expect(user).toBeNull()
    })
  })

  describe('isAuthenticated', () => {
    it('returns true when a refresh token is present', async () => {
      await secureStoreService.saveRefreshToken('refresh-token')
      const result = await secureStoreService.isAuthenticated()
      expect(result).toBe(true)
    })

    it('returns false when no refresh token is present', async () => {
      const result = await secureStoreService.isAuthenticated()
      expect(result).toBe(false)
    })
  })

  describe('logout', () => {
    it('clears all stored auth data', async () => {
      await secureStoreService.saveToken('access')
      await secureStoreService.saveRefreshToken('refresh')
      await secureStoreService.saveUser({ email: 'test@test.com' })

      await secureStoreService.logout()

      expect(await secureStoreService.getToken()).toBeNull()
      expect(await secureStoreService.getRefreshToken()).toBeNull()
      expect(await secureStoreService.getUser()).toBeNull()
    })
  })
})
