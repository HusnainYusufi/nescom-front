// src/store.js
import { legacy_createStore as createStore } from 'redux'

const initialState = {
  sidebarShow: true,
  sidebarUnfoldable: false,
  theme: 'light',
  activeModule: 'dashboard',
  selection: {
    project: null,
    set: null,
    component: null,
    assembly: null,
    part: null,
  },
}

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    case 'updateSelection':
      return { ...state, selection: { ...state.selection, ...rest.selection } }
    default:
      return state
  }
}

const store = createStore(changeState)
export default store
