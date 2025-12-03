import React, { useEffect, useMemo, useState } from 'react'
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CFormSelect,
  CListGroup,
  CListGroupItem,
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

const BuildConfiguration = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const projects = useSelector((state) => state.projects)
  const activeProjectId = useSelector((state) => state.activeProjectId)

  const [selectedProjectId, setSelectedProjectId] = useState('')
  const [selectedNodeId, setSelectedNodeId] = useState('')

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

  useEffect(() => {
    const firstNode = currentTree[0]
    if (firstNode && !selectedNodeId) {
      const findFirstLeaf = (node) => {
        if (node.parts?.length) return node.id
        if (node.children?.length) {
          for (const child of node.children) {
            const found = findFirstLeaf(child)
            if (found) return found
          }
        }
        return node.id
      }
      setSelectedNodeId(findFirstLeaf(firstNode))
    }
  }, [currentTree, selectedNodeId])

  const handleProjectChange = (projectId) => {
    setSelectedProjectId(projectId)
    setSelectedNodeId('')
    dispatch({ type: 'setActiveProject', projectId })
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev)
      if (projectId) params.set('project', projectId)
      else params.delete('project')
      return params
    })
  }

  const findNodeById = (nodes, targetId) => {
    for (const node of nodes) {
      if (node.id === targetId) return node
      if (node.children) {
        const found = findNodeById(node.children, targetId)
        if (found) return found
      }
    }
    return null
  }

  const selectedNode = useMemo(
    () => findNodeById(currentTree, selectedNodeId) || currentTree[0] || null,
    [currentTree, selectedNodeId],
  )

  const renderTree = (nodes, depth = 0) =>
    nodes.map((node) => (
      <React.Fragment key={node.id}>
        <CListGroupItem
          action
          active={node.id === selectedNodeId}
          className="d-flex align-items-center border-0 border-bottom"
          style={{ paddingLeft: `${depth * 16 + 12}px` }}
          onClick={() => setSelectedNodeId(node.id)}
        >
          <span className="me-2 text-secondary">▸</span>
          <span className="flex-grow-1">{node.label}</span>
          {node.badge && (
            <CBadge color="warning" className="text-dark fw-semibold">
              {node.badge}
            </CBadge>
          )}
        </CListGroupItem>
        {node.children?.length ? renderTree(node.children, depth + 1) : null}
      </React.Fragment>
    ))

  return (
    <CContainer fluid className="py-4">
      <CRow className="align-items-center mb-3">
        <CCol>
          <h4 className="mb-0">Build Configuration</h4>
          <p className="text-body-secondary mb-0">
            Navigate the configuration tree on the left to review part build details.
          </p>
        </CCol>
        <CCol xs="12" md="4" className="text-md-end">
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

      <CRow>
        <CCol lg={3} className="mb-3 mb-lg-0">
          <CCard className="shadow-sm border-0 h-100">
            <CCardHeader className="fw-semibold">Configuration Tree</CCardHeader>
            <CCardBody className="p-0">
              <CListGroup flush>{renderTree(currentTree)}</CListGroup>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol lg={9}>
          <CCard className="shadow-sm border-0">
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <div>
                <div className="fw-semibold">Build Details</div>
                <small className="text-body-secondary">
                  {selectedNode?.label || 'Select a node to view build rows'}
                </small>
              </div>
              <CButton
                color="primary"
                variant="ghost"
                size="sm"
                onClick={() => navigate('/production/treeview')}
              >
                Back to Configuration
              </CButton>
            </CCardHeader>
            <CCardBody className="p-0">
              <CTable responsive hover className="mb-0">
                <CTableHead className="bg-body-secondary">
                  <CTableRow>
                    {columns.map((column) => (
                      <CTableHeaderCell key={column} scope="col" className="small text-uppercase">
                        {column}
                      </CTableHeaderCell>
                    ))}
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {selectedNode?.parts?.length ? (
                    selectedNode.parts.map((part) => (
                      <CTableRow key={part.id}>
                        <CTableDataCell>{part.id}</CTableDataCell>
                        <CTableDataCell className="fw-semibold">{part.name}</CTableDataCell>
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
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default BuildConfiguration
