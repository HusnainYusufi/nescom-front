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
      name: 'Atlas Sedan Platform',
      code: 'AT-001',
      description: 'Baseline electric sedan platform with wiring, body, and trim integration.',
      status: 'In Configuration',
      owner: 'Vehicle Programs',
      system: 'Chassis & Control',
      projectType: 'Electric',
      category: 'Automotive',
      qcReports: [
        {
          id: 'qc-001',
          title: 'Body shell weld log',
          owner: 'QA Lead',
          status: 'Accepted',
          date: '2025-03-01',
        },
      ],
      sets: [
        {
          id: 'set-1',
          name: 'Chassis Set',
          status: 'In Production',
          structures: [
            {
              name: 'Front frame',
              status: 'In Production',
              assemblies: [
                { name: 'Steering column', status: 'In Production' },
                { name: 'Front harness', status: 'In Configuration' },
              ],
            },
            {
              name: 'Rear frame',
              status: 'In Configuration',
              assemblies: [
                { name: 'Suspension arms', status: 'Pending QC' },
                { name: 'Battery cradle', status: 'Draft' },
              ],
            },
          ],
          qcReports: [
            {
              id: 'qc-002',
              title: 'Suspension weld dye-penetrant check',
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
              name: 'Control bay',
              status: 'Draft',
              assemblies: [
                { name: 'Infotainment core', status: 'Draft' },
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
      name: 'Skyline Delivery Drone',
      code: 'SK-204',
      description: 'Medium-range delivery drone focused on propulsion and avionics integration.',
      status: 'In Production',
      owner: 'Flight Test',
      system: 'Urban Mobility',
      projectType: 'Special',
      category: 'Aviation',
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
