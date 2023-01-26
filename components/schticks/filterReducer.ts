export const initialFilter = {
  loading: true,
  saving: false,
  page: 1,
  path: "",
  paths: [],
  category: "",
  categories: [],
  schtick: { id: null, title: "" },
  schticks: [],
}

export function filterReducer (state: any, action: any) {
  switch(action.type) {
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
        saving: true
      }
    case "success":
      return {
        ...state,
        loading: false,
        saving: false
      }
    case "category":
      return {
        ...state,
        category: action.payload || initialFilter.category,
        path: initialFilter.path,
        schtick: initialFilter.schtick
      }
    case "path":
      return {
        ...state,
        path: action.payload || initialFilter.path,
      }
    case "schtick":
      return {
        ...state,
        schtick: action.payload || initialFilter.schtick,
      }
    case "schticks":
      const { schticks, meta, paths, categories } = action.payload
      return {
        ...state,
        loading: false,
        schtick: initialFilter.schtick,
        schticks: schticks,
        meta: meta,
        paths: paths,
        categories: categories
      }
    default:
      return state
  }
}
