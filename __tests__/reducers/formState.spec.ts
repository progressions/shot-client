import { renderHook, act } from '@testing-library/react'
import {
  FormActions,
  FormStateType,
  FormStateAction,
  initializeFormState,
  formReducer,
  useForm
} from '../../reducers/formState'

describe('formState', () => {
  interface TestFormData extends Record<string, unknown> {
    name: string
    email: string
    age: number
    active: boolean
  }

  type ExtendedFormState = FormStateType<TestFormData> & TestFormData & {
    complex?: any
    items?: any[]
  }

  const initialTestData: TestFormData = {
    name: 'John Doe',
    email: 'john@example.com',
    age: 30,
    active: true
  }

  describe('initializeFormState', () => {
    it('should initialize with default values when no data provided', () => {
      const state = initializeFormState<TestFormData>()

      expect(state).toEqual({
        edited: false,
        loading: true,
        saving: false,
        disabled: true,
        open: false,
        error: null,
        success: null,
        formData: {}
      })
    })

    it('should initialize with provided form data', () => {
      const state = initializeFormState(initialTestData)

      expect(state).toEqual({
        edited: false,
        loading: true,
        saving: false,
        disabled: true,
        open: false,
        error: null,
        success: null,
        formData: initialTestData
      })
    })

    it('should handle null form data gracefully', () => {
      const state = initializeFormState<TestFormData>(null)

      expect(state.formData).toEqual({})
      expect(state.loading).toBe(true)
      expect(state.disabled).toBe(true)
    })
  })

  describe('formReducer', () => {
    let initialState: FormStateType<TestFormData>

    beforeEach(() => {
      initialState = initializeFormState(initialTestData)
    })

    describe('EDIT action', () => {
      it('should set edited to true without name and value', () => {
        const action: FormStateAction<TestFormData> = { type: FormActions.EDIT }
        const newState = formReducer(initialState, action)

        expect(newState.edited).toBe(true)
        expect(newState.formData).toEqual(initialTestData)
      })

      it('should update specific field when name and value provided', () => {
        const action: FormStateAction<TestFormData> = {
          type: FormActions.EDIT,
          name: 'name',
          value: 'Jane Doe'
        }
        const newState = formReducer(initialState, action) as ExtendedFormState

        expect(newState.edited).toBe(true)
        expect(newState.loading).toBe(false)
        expect(newState.name).toBe('Jane Doe') // Field directly on state
      })

      it('should handle boolean values', () => {
        const action: FormStateAction<TestFormData> = {
          type: FormActions.EDIT,
          name: 'active',
          value: false
        }
        const newState = formReducer(initialState, action) as ExtendedFormState

        expect(newState.edited).toBe(true)
        expect(newState.active).toBe(false)
      })

      it('should handle number values', () => {
        const action: FormStateAction<TestFormData> = {
          type: FormActions.EDIT,
          name: 'age',
          value: 35
        }
        const newState = formReducer(initialState, action) as ExtendedFormState

        expect(newState.edited).toBe(true)
        expect(newState.age).toBe(35)
      })

      it('should not update when value is undefined', () => {
        const action: FormStateAction<TestFormData> = {
          type: FormActions.EDIT,
          name: 'name',
          value: undefined
        }
        const newState = formReducer(initialState, action) as ExtendedFormState

        expect(newState.edited).toBe(true)
        expect(newState.formData).toEqual(initialTestData)
        expect(newState.name).toBeUndefined()
      })
    })

    describe('UPDATE action', () => {
      // Suppress console.log for tests
      let consoleSpy: jest.SpyInstance

      beforeEach(() => {
        consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
      })

      afterEach(() => {
        consoleSpy.mockRestore()
      })

      it('should update form data and set proper flags', () => {
        const action: FormStateAction<TestFormData> = {
          type: FormActions.UPDATE,
          name: 'email',
          value: 'newemail@example.com'
        }
        const newState = formReducer(initialState, action)

        expect(newState.edited).toBe(true)
        expect(newState.disabled).toBe(false)
        expect(newState.loading).toBe(false)
        expect(newState.saving).toBe(false)
        expect(newState.formData.email).toBe('newemail@example.com')
      })

      it('should log the update action', () => {
        const action: FormStateAction<TestFormData> = {
          type: FormActions.UPDATE,
          name: 'name',
          value: 'New Name'
        }
        formReducer(initialState, action)

        expect(consoleSpy).toHaveBeenCalledWith('FormReducer UPDATE', 'name', 'New Name')
      })

      it('should handle nested object values', () => {
        const complexValue = { nested: { field: 'value' } }
        const action: FormStateAction<TestFormData> = {
          type: FormActions.UPDATE,
          name: 'complex',
          value: complexValue
        }
        const newState = formReducer(initialState, action) as ExtendedFormState

        expect(newState.formData.complex).toEqual(complexValue)
      })

      it('should handle array values', () => {
        const arrayValue = [1, 2, 3, 'test']
        const action: FormStateAction<TestFormData> = {
          type: FormActions.UPDATE,
          name: 'items',
          value: arrayValue
        }
        const newState = formReducer(initialState, action) as ExtendedFormState

        expect(newState.formData.items).toEqual(arrayValue)
      })
    })

    describe('OPEN action', () => {
      it('should set open state to true', () => {
        const action: FormStateAction<TestFormData> = { type: FormActions.OPEN, payload: true }
        const newState = formReducer(initialState, action)

        expect(newState.open).toBe(true)
        expect(newState.formData).toEqual(initialTestData)
      })

      it('should set open state to false', () => {
        const stateWithOpen = { ...initialState, open: true }
        const action: FormStateAction<TestFormData> = { type: FormActions.OPEN, payload: false }
        const newState = formReducer(stateWithOpen, action)

        expect(newState.open).toBe(false)
      })
    })

    describe('DISABLE action', () => {
      it('should set disabled state to true', () => {
        const stateWithEnabled = { ...initialState, disabled: false }
        const action: FormStateAction<TestFormData> = { type: FormActions.DISABLE, payload: true }
        const newState = formReducer(stateWithEnabled, action)

        expect(newState.disabled).toBe(true)
      })

      it('should set disabled state to false', () => {
        const action: FormStateAction<TestFormData> = { type: FormActions.DISABLE, payload: false }
        const newState = formReducer(initialState, action)

        expect(newState.disabled).toBe(false)
      })
    })

    describe('LOADING action', () => {
      it('should set loading state to true', () => {
        const stateWithoutLoading = { ...initialState, loading: false }
        const action: FormStateAction<TestFormData> = { type: FormActions.LOADING, payload: true }
        const newState = formReducer(stateWithoutLoading, action)

        expect(newState.loading).toBe(true)
      })

      it('should set loading state to false', () => {
        const action: FormStateAction<TestFormData> = { type: FormActions.LOADING, payload: false }
        const newState = formReducer(initialState, action)

        expect(newState.loading).toBe(false)
      })
    })

    describe('ERROR action', () => {
      it('should set error state and clear success', () => {
        const stateWithSuccess = { ...initialState, success: 'Previous success', saving: true, loading: true }
        const action: FormStateAction<TestFormData> = { type: FormActions.ERROR, payload: 'Something went wrong' }
        const newState = formReducer(stateWithSuccess, action)

        expect(newState.error).toBe('Something went wrong')
        expect(newState.success).toBe(null)
        expect(newState.disabled).toBe(true)
        expect(newState.saving).toBe(false)
        expect(newState.loading).toBe(false)
      })

      it('should handle null error payload', () => {
        const action: FormStateAction<TestFormData> = { type: FormActions.ERROR, payload: null }
        const newState = formReducer(initialState, action)

        expect(newState.error).toBe(null)
        expect(newState.disabled).toBe(true)
        expect(newState.saving).toBe(false)
        expect(newState.loading).toBe(false)
      })
    })

    describe('SUCCESS action', () => {
      it('should set success state and clear error', () => {
        const stateWithError = { ...initialState, error: 'Previous error', disabled: true, saving: true, loading: true }
        const action: FormStateAction<TestFormData> = { type: FormActions.SUCCESS, payload: 'Operation successful' }
        const newState = formReducer(stateWithError, action)

        expect(newState.success).toBe('Operation successful')
        expect(newState.error).toBe(null)
        expect(newState.disabled).toBe(false)
        expect(newState.saving).toBe(false)
        expect(newState.loading).toBe(false)
      })

      it('should handle null success payload', () => {
        const action: FormStateAction<TestFormData> = { type: FormActions.SUCCESS, payload: null }
        const newState = formReducer(initialState, action)

        expect(newState.success).toBe(null)
        expect(newState.error).toBe(null)
        expect(newState.disabled).toBe(false)
      })
    })

    describe('SUBMIT action', () => {
      it('should set saving state and clear messages', () => {
        const stateWithMessages = { 
          ...initialState, 
          error: 'Previous error', 
          success: 'Previous success',
          edited: true
        }
        const action: FormStateAction<TestFormData> = { type: FormActions.SUBMIT }
        const newState = formReducer(stateWithMessages, action)

        expect(newState.saving).toBe(true)
        expect(newState.edited).toBe(false)
        expect(newState.error).toBe(null)
        expect(newState.success).toBe(null)
      })
    })

    describe('RESET action', () => {
      it('should reset to provided state', () => {
        const currentState = { 
          ...initialState, 
          edited: true, 
          saving: true, 
          error: 'Some error' 
        }
        const resetState = initializeFormState({ name: 'Reset Name', email: 'reset@example.com', age: 25, active: false })
        const action: FormStateAction<TestFormData> = { type: FormActions.RESET, payload: resetState }
        const newState = formReducer(currentState, action)

        expect(newState).toEqual(resetState)
      })
    })

    describe('default case', () => {
      it('should return unchanged state for unknown action', () => {
        const unknownAction = { type: 'UNKNOWN_ACTION' as FormStateAction<TestFormData>['type'] }
        const newState = formReducer(initialState, unknownAction as FormStateAction<TestFormData>)

        expect(newState).toBe(initialState)
      })
    })
  })

  describe('useForm hook', () => {
    it('should initialize with provided data', () => {
      const { result } = renderHook(() => useForm(initialTestData))

      expect(result.current.formState.formData).toEqual(initialTestData)
      expect(result.current.formState.edited).toBe(false)
      expect(result.current.formState.loading).toBe(true)
      expect(result.current.formState.disabled).toBe(true)
    })

    it('should provide dispatch function', () => {
      const { result } = renderHook(() => useForm(initialTestData))

      expect(typeof result.current.dispatchForm).toBe('function')
      expect(result.current.initialFormState).toBeDefined()
    })

    it('should update state when dispatching actions', () => {
      const { result } = renderHook(() => useForm(initialTestData))

      act(() => {
        result.current.dispatchForm({ type: FormActions.OPEN, payload: true })
      })

      expect(result.current.formState.open).toBe(true)
    })

    it('should handle UPDATE action through dispatch', () => {
      const { result } = renderHook(() => useForm(initialTestData))

      act(() => {
        result.current.dispatchForm({ 
          type: FormActions.UPDATE, 
          name: 'name', 
          value: 'Updated Name' 
        })
      })

      expect(result.current.formState.formData.name).toBe('Updated Name')
      expect(result.current.formState.edited).toBe(true)
      expect(result.current.formState.disabled).toBe(false)
    })

    it('should handle multiple sequential dispatches', () => {
      const { result } = renderHook(() => useForm(initialTestData))

      act(() => {
        result.current.dispatchForm({ type: FormActions.LOADING, payload: false })
        result.current.dispatchForm({ type: FormActions.DISABLE, payload: false })
        result.current.dispatchForm({ type: FormActions.OPEN, payload: true })
      })

      expect(result.current.formState.loading).toBe(false)
      expect(result.current.formState.disabled).toBe(false)
      expect(result.current.formState.open).toBe(true)
    })

    it('should maintain reference equality for initialFormState', () => {
      const { result } = renderHook(() => useForm(initialTestData))
      const initialRef = result.current.initialFormState

      act(() => {
        result.current.dispatchForm({ type: FormActions.EDIT })
      })

      expect(result.current.initialFormState).toStrictEqual(initialRef)
    })
  })

  describe('complex scenarios', () => {
    it('should handle form submission workflow', () => {
      const { result } = renderHook(() => useForm(initialTestData))

      // Simulate form editing
      act(() => {
        result.current.dispatchForm({ 
          type: FormActions.UPDATE, 
          name: 'email', 
          value: 'updated@example.com' 
        })
      })

      expect(result.current.formState.edited).toBe(true)
      expect(result.current.formState.disabled).toBe(false)

      // Simulate form submission
      act(() => {
        result.current.dispatchForm({ type: FormActions.SUBMIT })
      })

      expect(result.current.formState.saving).toBe(true)
      expect(result.current.formState.edited).toBe(false)
      expect(result.current.formState.error).toBe(null)
      expect(result.current.formState.success).toBe(null)

      // Simulate successful response
      act(() => {
        result.current.dispatchForm({ 
          type: FormActions.SUCCESS, 
          payload: 'Form saved successfully' 
        })
      })

      expect(result.current.formState.saving).toBe(false)
      expect(result.current.formState.success).toBe('Form saved successfully')
      expect(result.current.formState.disabled).toBe(false)
    })

    it('should handle error recovery workflow', () => {
      const { result } = renderHook(() => useForm(initialTestData))

      // Simulate submission failure
      act(() => {
        result.current.dispatchForm({ type: FormActions.SUBMIT })
        result.current.dispatchForm({ 
          type: FormActions.ERROR, 
          payload: 'Network error' 
        })
      })

      expect(result.current.formState.error).toBe('Network error')
      expect(result.current.formState.disabled).toBe(true)
      expect(result.current.formState.saving).toBe(false)

      // User fixes issue and resubmits
      act(() => {
        result.current.dispatchForm({ type: FormActions.DISABLE, payload: false })
        result.current.dispatchForm({ type: FormActions.SUBMIT })
        result.current.dispatchForm({ 
          type: FormActions.SUCCESS, 
          payload: 'Retry successful' 
        })
      })

      expect(result.current.formState.error).toBe(null)
      expect(result.current.formState.success).toBe('Retry successful')
    })
  })
})