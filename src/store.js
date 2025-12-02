// src/store.js
import { legacy_createStore as createStore } from 'redux'

const initialState = {
  sidebarShow: true,
  sidebarUnfoldable: false,
  theme: 'light',
  activeModule: 'dashboard',
  activeProjectId: null,
  projects: [
    {
      id: 'proj-001',
      name: 'Phoenix Missile',
      code: 'PX-001',
      description: 'Baseline airframe with electrical and composite work packages.',
      status: 'In Configuration',
      owner: 'Systems Team',
      system: 'Guidance & Control',
    },
    {
      id: 'proj-002',
      name: 'Sentinel UAV',
      code: 'SN-204',
      description: 'Surveillance platform focused on propulsion and avionics integration.',
      status: 'In Production',
      owner: 'Flight Test',
      system: 'ISR Platform',
    },
  ],
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
    case 'addProject': {
      const newProject = rest.project
      return {
        ...state,
        projects: [...state.projects, newProject],
        activeProjectId: newProject.id,
      }
    }
    case 'setActiveProject':
      return { ...state, activeProjectId: rest.projectId }
    case 'updateSelection':
      return { ...state, selection: { ...state.selection, ...rest.selection } }
    default:
      return state
  }
}

const store = createStore(changeState)
export default store
