import React from 'react'
import { render, screen, renderHook, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { LocalStorageProvider, useLocalStorage } from '@/contexts/LocalStorageContext'

describe('LocalStorageContext', () => {
  // Mock localStorage
  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
    length: 0,
    key: jest.fn()
  }

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks()
    // Replace global localStorage with mock
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    })
  })

  describe('LocalStorageProvider', () => {
    it('should render children correctly', () => {
      render(
        <LocalStorageProvider>
          <div data-testid="child">Test Child</div>
        </LocalStorageProvider>
      )

      expect(screen.getByTestId('child')).toBeInTheDocument()
      expect(screen.getByText('Test Child')).toBeInTheDocument()
    })

    it('should provide context values to children', () => {
      const TestComponent = () => {
        const { saveLocally, getLocally } = useLocalStorage()
        return (
          <div>
            <span>{typeof saveLocally}</span>
            <span>{typeof getLocally}</span>
          </div>
        )
      }

      render(
        <LocalStorageProvider>
          <TestComponent />
        </LocalStorageProvider>
      )

      expect(screen.getByText('function', { selector: 'span:first-child' })).toBeInTheDocument()
      expect(screen.getByText('function', { selector: 'span:last-child' })).toBeInTheDocument()
    })
  })

  describe('useLocalStorage hook', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <LocalStorageProvider>{children}</LocalStorageProvider>
    )

    describe('saveLocally', () => {
      it('should save string values to localStorage', () => {
        const { result } = renderHook(() => useLocalStorage(), { wrapper })

        act(() => {
          result.current.saveLocally('testKey', 'testValue')
        })

        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          'testKey',
          JSON.stringify('testValue')
        )
        expect(localStorageMock.setItem).toHaveBeenCalledTimes(1)
      })

      it('should save object values to localStorage as JSON', () => {
        const { result } = renderHook(() => useLocalStorage(), { wrapper })
        const testObject = { name: 'Test', value: 123, nested: { key: 'value' } }

        act(() => {
          result.current.saveLocally('objectKey', testObject)
        })

        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          'objectKey',
          JSON.stringify(testObject)
        )
      })

      it('should save array values to localStorage', () => {
        const { result } = renderHook(() => useLocalStorage(), { wrapper })
        const testArray = [1, 2, 3, 'test', { key: 'value' }]

        act(() => {
          result.current.saveLocally('arrayKey', testArray)
        })

        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          'arrayKey',
          JSON.stringify(testArray)
        )
      })

      it('should save null and undefined values', () => {
        const { result } = renderHook(() => useLocalStorage(), { wrapper })

        act(() => {
          result.current.saveLocally('nullKey', null)
          result.current.saveLocally('undefinedKey', undefined)
        })

        expect(localStorageMock.setItem).toHaveBeenCalledWith('nullKey', 'null')
        expect(localStorageMock.setItem).toHaveBeenCalledWith('undefinedKey', undefined)
        expect(localStorageMock.setItem).toHaveBeenCalledTimes(2)
      })

      it('should save boolean values', () => {
        const { result } = renderHook(() => useLocalStorage(), { wrapper })

        act(() => {
          result.current.saveLocally('boolTrue', true)
          result.current.saveLocally('boolFalse', false)
        })

        expect(localStorageMock.setItem).toHaveBeenCalledWith('boolTrue', 'true')
        expect(localStorageMock.setItem).toHaveBeenCalledWith('boolFalse', 'false')
      })

      it('should save number values', () => {
        const { result } = renderHook(() => useLocalStorage(), { wrapper })

        act(() => {
          result.current.saveLocally('intNumber', 42)
          result.current.saveLocally('floatNumber', 3.14159)
          result.current.saveLocally('negativeNumber', -100)
          result.current.saveLocally('zero', 0)
        })

        expect(localStorageMock.setItem).toHaveBeenCalledWith('intNumber', '42')
        expect(localStorageMock.setItem).toHaveBeenCalledWith('floatNumber', '3.14159')
        expect(localStorageMock.setItem).toHaveBeenCalledWith('negativeNumber', '-100')
        expect(localStorageMock.setItem).toHaveBeenCalledWith('zero', '0')
      })

      it('should handle localStorage not being available', () => {
        // Temporarily remove localStorage
        Object.defineProperty(window, 'localStorage', {
          value: undefined,
          writable: true
        })

        const { result } = renderHook(() => useLocalStorage(), { wrapper })

        // Should not throw error
        expect(() => {
          act(() => {
            result.current.saveLocally('key', 'value')
          })
        }).not.toThrow()

        // Restore localStorage mock
        Object.defineProperty(window, 'localStorage', {
          value: localStorageMock,
          writable: true
        })
      })
    })

    describe('getLocally', () => {
      it('should retrieve string values from localStorage', () => {
        localStorageMock.getItem.mockReturnValue(JSON.stringify('testValue'))
        const { result } = renderHook(() => useLocalStorage(), { wrapper })

        const value = result.current.getLocally('testKey')

        expect(localStorageMock.getItem).toHaveBeenCalledWith('testKey')
        expect(value).toBe('testValue')
      })

      it('should retrieve object values from localStorage', () => {
        const testObject = { name: 'Test', value: 123, nested: { key: 'value' } }
        localStorageMock.getItem.mockReturnValue(JSON.stringify(testObject))
        const { result } = renderHook(() => useLocalStorage(), { wrapper })

        const value = result.current.getLocally('objectKey')

        expect(localStorageMock.getItem).toHaveBeenCalledWith('objectKey')
        expect(value).toEqual(testObject)
      })

      it('should retrieve array values from localStorage', () => {
        const testArray = [1, 2, 3, 'test', { key: 'value' }]
        localStorageMock.getItem.mockReturnValue(JSON.stringify(testArray))
        const { result } = renderHook(() => useLocalStorage(), { wrapper })

        const value = result.current.getLocally('arrayKey')

        expect(localStorageMock.getItem).toHaveBeenCalledWith('arrayKey')
        expect(value).toEqual(testArray)
      })

      it('should handle null values from localStorage', () => {
        localStorageMock.getItem.mockReturnValue(null)
        const { result } = renderHook(() => useLocalStorage(), { wrapper })

        const value = result.current.getLocally('nonExistentKey')

        expect(localStorageMock.getItem).toHaveBeenCalledWith('nonExistentKey')
        expect(value).toBeNull()
      })

      it('should retrieve boolean values from localStorage', () => {
        localStorageMock.getItem.mockReturnValueOnce('true')
        localStorageMock.getItem.mockReturnValueOnce('false')
        const { result } = renderHook(() => useLocalStorage(), { wrapper })

        const trueValue = result.current.getLocally('boolTrue')
        const falseValue = result.current.getLocally('boolFalse')

        expect(trueValue).toBe(true)
        expect(falseValue).toBe(false)
      })

      it('should retrieve number values from localStorage', () => {
        localStorageMock.getItem.mockReturnValueOnce('42')
        localStorageMock.getItem.mockReturnValueOnce('3.14159')
        localStorageMock.getItem.mockReturnValueOnce('-100')
        localStorageMock.getItem.mockReturnValueOnce('0')
        const { result } = renderHook(() => useLocalStorage(), { wrapper })

        const intValue = result.current.getLocally('intNumber')
        const floatValue = result.current.getLocally('floatNumber')
        const negativeValue = result.current.getLocally('negativeNumber')
        const zeroValue = result.current.getLocally('zero')

        expect(intValue).toBe(42)
        expect(floatValue).toBe(3.14159)
        expect(negativeValue).toBe(-100)
        expect(zeroValue).toBe(0)
      })

      it('should handle localStorage not being available', () => {
        // Temporarily remove localStorage
        Object.defineProperty(window, 'localStorage', {
          value: undefined,
          writable: true
        })

        const { result } = renderHook(() => useLocalStorage(), { wrapper })

        const value = result.current.getLocally('key')

        expect(value).toBeNull()

        // Restore localStorage mock
        Object.defineProperty(window, 'localStorage', {
          value: localStorageMock,
          writable: true
        })
      })

      it('should handle malformed JSON in localStorage gracefully', () => {
        localStorageMock.getItem.mockReturnValue('not valid json{')
        const { result } = renderHook(() => useLocalStorage(), { wrapper })

        // Should throw when trying to parse invalid JSON
        expect(() => {
          result.current.getLocally('malformedKey')
        }).toThrow()
      })
    })

    describe('edge cases', () => {
      it('should handle very large strings', () => {
        const { result } = renderHook(() => useLocalStorage(), { wrapper })
        const largeString = 'x'.repeat(10000)

        act(() => {
          result.current.saveLocally('largeKey', largeString)
        })

        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          'largeKey',
          JSON.stringify(largeString)
        )
      })

      it('should handle deeply nested objects', () => {
        const { result } = renderHook(() => useLocalStorage(), { wrapper })
        const deepObject = {
          level1: {
            level2: {
              level3: {
                level4: {
                  level5: {
                    value: 'deep'
                  }
                }
              }
            }
          }
        }

        act(() => {
          result.current.saveLocally('deepKey', deepObject)
        })

        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          'deepKey',
          JSON.stringify(deepObject)
        )
      })

      it('should handle special characters in keys', () => {
        const { result } = renderHook(() => useLocalStorage(), { wrapper })

        act(() => {
          result.current.saveLocally('key with spaces', 'value1')
          result.current.saveLocally('key-with-dashes', 'value2')
          result.current.saveLocally('key.with.dots', 'value3')
          result.current.saveLocally('key/with/slashes', 'value4')
        })

        expect(localStorageMock.setItem).toHaveBeenCalledWith('key with spaces', '"value1"')
        expect(localStorageMock.setItem).toHaveBeenCalledWith('key-with-dashes', '"value2"')
        expect(localStorageMock.setItem).toHaveBeenCalledWith('key.with.dots', '"value3"')
        expect(localStorageMock.setItem).toHaveBeenCalledWith('key/with/slashes', '"value4"')
      })

      it('should handle empty strings', () => {
        const { result } = renderHook(() => useLocalStorage(), { wrapper })

        act(() => {
          result.current.saveLocally('', 'value with empty key')
          result.current.saveLocally('normalKey', '')
        })

        expect(localStorageMock.setItem).toHaveBeenCalledWith('', '"value with empty key"')
        expect(localStorageMock.setItem).toHaveBeenCalledWith('normalKey', '""')
      })
    })

    describe('integration scenarios', () => {
      it('should save and retrieve the same value', () => {
        const { result } = renderHook(() => useLocalStorage(), { wrapper })
        const testData = { id: 1, name: 'Test', active: true }

        // Mock getItem to return what was set
        localStorageMock.setItem.mockImplementation((key, value) => {
          localStorageMock.getItem.mockReturnValue(value)
        })

        act(() => {
          result.current.saveLocally('integrationKey', testData)
        })

        const retrieved = result.current.getLocally('integrationKey')

        expect(retrieved).toEqual(testData)
      })

      it('should overwrite existing values', () => {
        const { result } = renderHook(() => useLocalStorage(), { wrapper })

        act(() => {
          result.current.saveLocally('overwriteKey', 'initial value')
          result.current.saveLocally('overwriteKey', 'updated value')
        })

        expect(localStorageMock.setItem).toHaveBeenCalledTimes(2)
        expect(localStorageMock.setItem).toHaveBeenLastCalledWith(
          'overwriteKey',
          '"updated value"'
        )
      })
    })
  })

  describe('context without provider', () => {
    it('should use default context values when no provider', () => {
      const TestComponent = () => {
        const { saveLocally, getLocally } = useLocalStorage()
        const saveResult = saveLocally('test', 'value')
        const getResult = getLocally('test')
        return (
          <div>
            <span data-testid="save-result">{String(saveResult)}</span>
            <span data-testid="get-result">{String(getResult)}</span>
          </div>
        )
      }

      render(<TestComponent />)

      // Default implementations return true
      expect(screen.getByTestId('save-result')).toHaveTextContent('true')
      expect(screen.getByTestId('get-result')).toHaveTextContent('true')
    })
  })
})