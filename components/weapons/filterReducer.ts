export const initialFilter = {
  edited: true,
  loading: true,
  saving: false,
  page: 1,
  juncture: "",
  junctures: [],
  name: "",
  weapon: { id: null, name: "" },
  weapons: [],
}

export function filterReducer (state: any, action: any) {
  switch(action.type) {
    case "edit":
      return {
        ...state,
        edited: true
      }
    case "previous":
      return {
        ...state,
        page: state.meta["prev_page"]
      }
    case "next":
      return {
        ...state,
        page: state.meta["next_page"]
      }
    case "saving":
      return {
        ...state,
        saving: true,
        edited: false
      }
    case "success":
      return {
        ...state,
        loading: false,
        saving: false,
        edited: false
      }
    case "juncture":
      return {
        ...state,
        juncture: action.payload || initialFilter.juncture,
        weapon: initialFilter.weapon
      }
    case "name":
      return {
        ...state,
        name: action.payload || initialFilter.name,
      }
    case "weapon":
      return {
        ...state,
        weapon: action.payload || initialFilter.weapon,
      }
    case "weapons":
      const { weapons, meta, junctures } = action.payload
      return {
        ...state,
        loading: false,
        weapons: weapons,
        meta: meta,
        edited: false,
        junctures: junctures
      }
    default:
      return state
  }
}
