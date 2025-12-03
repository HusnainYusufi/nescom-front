import React, { useEffect, useMemo, useState } from 'react'
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CFormSelect,
  CNav,
  CNavItem,
  CNavLink,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'

const buildConfigurations = {
  'proj-001': {
    projectName: 'Project Falcon-X',
    tree: [
      {
        id: 'proj-001',
        label: 'Project Falcon-X',
        badge: 'Project',
        children: [
          {
            id: 'proj-001-config',
            label: 'Configuration',
            badge: 'CFG',
            children: [
              {
                id: 'proj-001-config-guidance',
                label: 'Set - Guidance Control',
                badge: 'Set',
                parts: [
                  {
                    id: 'GC-001',
                    name: 'Gyro Assembly',
                    quantity: 2,
                    order: '1',
                    productionStatus: 'In Progress',
                    hardwareView: 'Yes',
                    qc: 'Yes',
                  },
                  {
                    id: 'GC-002',
                    name: 'Actuator Bracket',
                    quantity: 4,
                    order: '2',
                    productionStatus: 'Pending',
                    hardwareView: 'No',
                    qc: 'No',
                  },
                ],
              },
              {
                id: 'proj-001-config-telemetry',
                label: 'Set - Telemetry',
                badge: 'Set',
                parts: [
                  {
                    id: 'TM-010',
                    name: 'Recorder Module',
                    quantity: 1,
                    order: '1',
                    productionStatus: 'Qualified',
                    hardwareView: 'Yes',
                    qc: 'Yes',
                  },
                  {
                    id: 'TM-011',
                    name: 'Harness Bundle',
                    quantity: 3,
                    order: '2',
                    productionStatus: 'In Progress',
                    hardwareView: 'Yes',
                    qc: 'No',
                  },
                ],
              },
            ],
          },
          {
            id: 'proj-001-parts',
            label: 'Parts Library',
            badge: 'Library',
            children: [
              {
                id: 'proj-001-parts-structures',
                label: 'Structures',
                badge: 'Category',
                parts: [
                  {
                    id: 'ST-301',
                    name: 'Nose Section',
                    quantity: 1,
                    order: '1',
                    productionStatus: 'Review',
                    hardwareView: 'Yes',
                    qc: 'Pending',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  'proj-002': {
    projectName: 'Project Orion',
    tree: [
      {
        id: 'proj-002',
        label: 'Project Orion',
        badge: 'Project',
        children: [
          {
            id: 'proj-002-config',
            label: 'Configuration',
            badge: 'CFG',
            children: [
              {
                id: 'proj-002-config-avionics',
                label: 'Set - Avionics',
                badge: 'Set',
                parts: [
                  {
                    id: 'AV-201',
                    name: 'Mission Processor',
                    quantity: 2,
                    order: '1',
                    productionStatus: 'Qualified',
                    hardwareView: 'Yes',
                    qc: 'Yes',
                  },
                  {
                    id: 'AV-202',
                    name: 'Power Distribution Module',
                    quantity: 1,
                    order: '2',
                    productionStatus: 'Draft',
                    hardwareView: 'No',
                    qc: 'No',
                  },
                ],
              },
            ],
          },
          {
            id: 'proj-002-parts',
            label: 'Assembly Parts',
            badge: 'Parts',
            children: [
              {
                id: 'proj-002-parts-payload',
                label: 'Payload',
                badge: 'Category',
                parts: [
                  {
                    id: 'PY-401',
                    name: 'Payload Adapter',
                    quantity: 1,
                    order: '1',
                    productionStatus: 'In Progress',
                    hardwareView: 'Yes',
                    qc: 'Pending',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
}

const columns = [
  'Part Id#',
  'Part Name*',
  'Qty*',
  'Order#',
  'Prod Status*',
  'HW View',
  'QC',
]

const navigationTabs = [
  'Home',
  'General',
  'Configuration',
  'Production',
  'Materials',
  'Reports',
  'Administration',
]

const BuildConfiguration = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const projects = useSelector((state) => state.projects)
  const activeProjectId = useSelector((state) => state.activeProjectId)

  const [selectedProjectId, setSelectedProjectId] = useState('')

  const currentTree = useMemo(() => buildConfigurations[selectedProjectId]?.tree || [], [
    selectedProjectId,
  ])

  useEffect(() => {
    dispatch({ type: 'set', activeModule: 'production' })
  }, [dispatch])

  useEffect(() => {
    const projectFromUrl = searchParams.get('project')
    if (projectFromUrl && buildConfigurations[projectFromUrl]) {
      setSelectedProjectId(projectFromUrl)
      dispatch({ type: 'setActiveProject', projectId: projectFromUrl })
      return
    }

    if (activeProjectId && buildConfigurations[activeProjectId]) {
      setSelectedProjectId(activeProjectId)
    } else if (projects.length) {
      const fallback = projects[0].id
      setSelectedProjectId(fallback)
      dispatch({ type: 'setActiveProject', projectId: fallback })
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev)
        params.set('project', fallback)
        return params
      })
    }
  }, [activeProjectId, dispatch, projects, searchParams, setSearchParams])

  const handleProjectChange = (projectId) => {
    setSelectedProjectId(projectId)
    dispatch({ type: 'setActiveProject', projectId })
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev)
      if (projectId) params.set('project', projectId)
      else params.delete('project')
      return params
    })
  }

  const selectedNode = useMemo(() => {
    const findFirstLeaf = (nodes) => {
      for (const node of nodes) {
        if (node.parts?.length) return node
        if (node.children?.length) {
          const found = findFirstLeaf(node.children)
          if (found) return found
        }
      }
      return nodes[0] || null
    }

    return findFirstLeaf(currentTree)
  }, [currentTree])

  const handleTabNavigation = (tab) => {
    if (tab === 'Configuration') return

    const params = new URLSearchParams()
    params.set('section', tab.toLowerCase())

    const projectId = selectedProjectId || activeProjectId || projects[0]?.id
    if (projectId) params.set('project', projectId)

    navigate({ pathname: '/production/treeview', search: params.toString() })
  }

  return (
    <CContainer fluid className="py-4">
      <CRow className="align-items-center mb-3">
        <CCol>
          <h4 className="mb-1">Build Configuration</h4>
          <p className="text-body-secondary mb-0">
            Review build rows for the selected project without the on-screen tree view.
          </p>
        </CCol>
        <CCol xs="12" md="4" className="text-md-end mt-3 mt-md-0">
          <CFormSelect
            aria-label="Select project"
            value={selectedProjectId}
            onChange={(e) => handleProjectChange(e.target.value)}
          >
            <option value="">Select Project</option>
            {Object.entries(buildConfigurations).map(([projectId, meta]) => (
              <option key={projectId} value={projectId}>
                {meta.projectName}
              </option>
            ))}
          </CFormSelect>
        </CCol>
      </CRow>

      <CNav variant="tabs" className="mb-3">
        {navigationTabs.map((tab) => (
          <CNavItem key={tab}>
            <CNavLink
              active={tab === 'Configuration'}
              onClick={() => handleTabNavigation(tab)}
            >
              {tab}
            </CNavLink>
          </CNavItem>
        ))}
      </CNav>

      <CCard className="shadow-sm border-0">
        <CCardHeader className="bg-primary-subtle text-primary d-flex flex-wrap align-items-center justify-content-between">
          <div className="fw-semibold">Configuration Summary</div>
          <div className="d-flex flex-wrap gap-3 small text-body">
            <span>
              Project:{' '}
              <CBadge color="primary" className="ms-1">
                {buildConfigurations[selectedProjectId]?.projectName || 'N/A'}
              </CBadge>
            </span>
            <span>
              Configuration:{' '}
              <CBadge color="info" className="text-dark ms-1">
                {selectedNode?.label || 'Not selected'}
              </CBadge>
            </span>
            <span>
              Tree Source: <CBadge color="warning" className="text-dark ms-1">Sidebar</CBadge>
            </span>
          </div>
        </CCardHeader>
        <CCardBody className="p-0">
          <CTable responsive hover className="mb-0">
            <CTableHead className="bg-body-secondary text-primary-emphasis">
              <CTableRow>
                {columns.map((column) => (
                  <CTableHeaderCell key={column} scope="col" className="small text-uppercase">
                    {column}
                  </CTableHeaderCell>
                ))}
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow className="table-warning text-primary fw-semibold">
                <CTableDataCell colSpan={columns.length}>
                  * Please click here to add new row to make assemblies and subassemblies with their childs in this configuration.
                </CTableDataCell>
              </CTableRow>
              {selectedNode?.parts?.length ? (
                selectedNode.parts.map((part) => (
                  <CTableRow key={part.id}>
                    <CTableDataCell>{part.id}</CTableDataCell>
                    <CTableDataCell className="fw-semibold text-primary">{part.name}</CTableDataCell>
                    <CTableDataCell>{part.quantity}</CTableDataCell>
                    <CTableDataCell>{part.order}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color="info" className="text-dark">
                        {part.productionStatus}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell>{part.hardwareView}</CTableDataCell>
                    <CTableDataCell>{part.qc}</CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan={columns.length} className="text-center py-4 text-body-secondary">
                    No build rows for this selection.
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default BuildConfiguration
