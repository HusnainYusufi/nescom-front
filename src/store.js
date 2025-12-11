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
      projectType: 'Conventional',
      category: 'Ballistic',
      qcReports: [
        {
          id: 'qc-001',
          title: 'Composite layup witness report',
          owner: 'QA Lead',
          status: 'Accepted',
          date: '2025-03-01',
        },
      ],
      sets: [
        {
          id: 'set-1',
          name: 'Airframe Set',
          status: 'In Production',
          structures: [
            {
              name: 'Center fuselage',
              status: 'In Production',
              assemblies: [
                { name: 'Actuator cluster', status: 'In Production' },
                { name: 'Telemetry harness', status: 'In Configuration' },
              ],
            },
            {
              name: 'Wing spars',
              status: 'In Configuration',
              assemblies: [
                { name: 'Spar caps', status: 'Pending QC' },
                { name: 'Root fittings', status: 'Draft' },
              ],
            },
          ],
          qcReports: [
            {
              id: 'qc-002',
              title: 'Wing spar metallurgy check',
              owner: 'Metallurgy',
              status: 'Pending',
              date: '2025-03-05',
            },
          ],
        },
        {
          id: 'set-2',
          name: 'Electronics Set',
          status: 'In Configuration',
          structures: [
            {
              name: 'Guidance bay',
              status: 'Draft',
              assemblies: [
                { name: 'Seeker head', status: 'Draft' },
                { name: 'Power regulation unit', status: 'Draft' },
              ],
            },
          ],
          qcReports: [],
        },
      ],
    },
    {
      id: 'proj-002',
      name: 'Sentinel UAV',
      code: 'SN-204',
      description: 'Surveillance platform focused on propulsion and avionics integration.',
      status: 'In Production',
      owner: 'Flight Test',
      system: 'ISR Platform',
      projectType: 'Special',
      category: 'Aerial',
      qcReports: [
        {
          id: 'qc-003',
          title: 'Ground vibration test pack',
          owner: 'Flight Worthiness',
          status: 'In Progress',
          date: '2025-02-14',
        },
      ],
      sets: [
        {
          id: 'set-1',
          name: 'Propulsion Set',
          status: 'In Production',
          structures: [
            {
              name: 'Pylon mounts',
              status: 'In Production',
              assemblies: [
                { name: 'Propeller kit', status: 'In Production' },
                { name: 'Fuel feed system', status: 'In Review' },
              ],
            },
            {
              name: 'Engine cradle',
              status: 'In Configuration',
              assemblies: [{ name: 'Engine vibration dampers', status: 'In Configuration' }],
            },
          ],
          qcReports: [
            {
              id: 'qc-004',
              title: 'Engine cradle dye-penetrant report',
              owner: 'QC Cell',
              status: 'Accepted',
              date: '2025-02-28',
            },
          ],
        },
        {
          id: 'set-2',
          name: 'Sensors Set',
          status: 'In Configuration',
          structures: [
            {
              name: 'Nose compartment',
              status: 'Draft',
              assemblies: [
                { name: 'EO/IR turret', status: 'Draft' },
                { name: 'Navigation suite', status: 'Draft' },
              ],
            },
          ],
          qcReports: [],
        },
      ],
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
    case 'updateProject':
      return {
        ...state,
        projects: state.projects.map((project) =>
          project.id === rest.projectId ? { ...project, ...rest.changes } : project,
        ),
      }
    case 'updateSelection':
      return { ...state, selection: { ...state.selection, ...rest.selection } }
    default:
      return state
  }
}

const store = createStore(changeState)
export default store
