import React, { useEffect, useMemo, useState } from 'react'
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormSelect,
  CListGroup,
  CListGroupItem,
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
import CIcon from '@coreui/icons-react'
import { cilChevronRight, cilPlus } from '@coreui/icons'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'

const initialConfigurations = {
  'proj-001': {
    sets: [
      {
        id: 'set-gc',
        name: 'Guidance Control Set',
        description: 'Controls stability and trajectory corrections',
        parts: [
          {
            id: 'P-1001',
            name: 'Inertial Sensor Module',
            shortName: 'ISM',
            category: 'Sensors',
            type: 'Electronic',
            level: 'L2',
            status: 'Qualified',
            owner: 'Avionics',
          },
          {
            id: 'P-1002',
            name: 'Control Surface Servo',
            shortName: 'CSS',
            category: 'Actuator',
            type: 'Mechanical',
            level: 'L3',
            status: 'Under Review',
            owner: 'Flight Controls',
          },
        ],
      },
      {
        id: 'set-telemetry',
        name: 'Telemetry & Data Set',
        description: 'Handles downlink and mission data',
        parts: [
          {
            id: 'P-1101',
            name: 'Data Recorder Board',
            shortName: 'DRB',
            category: 'Electronics',
            type: 'Digital',
            level: 'L3',
            status: 'Qualified',
            owner: 'Systems',
          },
          {
            id: 'P-1102',
            name: 'Flight Data Bus Harness',
            shortName: 'FDB',
            category: 'Harness',
            type: 'Electrical',
            level: 'L4',
            status: 'Draft',
            owner: 'Wiring',
          },
        ],
      },
    ],
  },
  'proj-002': {
    sets: [
      {
        id: 'set-avionics',
        name: 'Avionics Control Set',
        description: 'Supervises sensors and processors',
        parts: [
          {
            id: 'P-2001',
            name: 'Mission Processor',
            shortName: 'MPU',
            category: 'Processor',
            type: 'Digital',
            level: 'L2',
            status: 'Qualified',
            owner: 'Electronics',
          },
          {
            id: 'P-2002',
            name: 'Power Distribution Module',
            shortName: 'PDM',
            category: 'Power',
            type: 'Electrical',
            level: 'L3',
            status: 'Review',
            owner: 'Power Systems',
          },
        ],
      },
      {
        id: 'set-composite',
        name: 'Composite Body Set',
        description: 'External structural subassemblies',
        parts: [
          {
            id: 'P-2101',
            name: 'Airframe Spine',
            shortName: 'AFS',
            category: 'Structure',
            type: 'Composite',
            level: 'L1',
            status: 'Qualified',
            owner: 'Structures',
          },
        ],
      },
    ],
  },
}

const ConfigurationParts = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const projects = useSelector((state) => state.projects)
  const activeProjectId = useSelector((state) => state.activeProjectId)

  const [configurations, setConfigurations] = useState(initialConfigurations)
  const [selectedProjectId, setSelectedProjectId] = useState('')
  const [selectedSetId, setSelectedSetId] = useState('')
  const [selectedPartId, setSelectedPartId] = useState('')
  const [form, setForm] = useState({
    id: '',
    name: '',
    shortName: '',
    category: '',
    type: '',
    level: '',
    owner: '',
    status: 'Draft',
  })
  const [errors, setErrors] = useState({})

  const availableSets = useMemo(() => configurations[selectedProjectId]?.sets || [], [
    configurations,
    selectedProjectId,
  ])

  useEffect(() => {
    dispatch({ type: 'set', activeModule: 'production' })
  }, [dispatch])

  useEffect(() => {
    const projectFromUrl = searchParams.get('project')
    if (projectFromUrl && configurations[projectFromUrl]) {
      setSelectedProjectId(projectFromUrl)
      dispatch({ type: 'setActiveProject', projectId: projectFromUrl })
      return
    }

    if (activeProjectId && configurations[activeProjectId]) {
      setSelectedProjectId(activeProjectId)
    } else if (projects.length) {
      const fallback = projects[0].id
      setSelectedProjectId(fallback)
      dispatch({ type: 'setActiveProject', projectId: fallback })
    }
  }, [activeProjectId, configurations, dispatch, projects, searchParams])

  useEffect(() => {
    if (!selectedProjectId) return
    const currentSets = configurations[selectedProjectId]?.sets || []
    if (!currentSets.length) {
      setSelectedSetId('')
      return
    }
    if (!currentSets.find((set) => set.id === selectedSetId)) {
      setSelectedSetId(currentSets[0].id)
      setSelectedPartId('')
    }
  }, [configurations, selectedProjectId, selectedSetId])

  const handleProjectChange = (value) => {
    setSelectedProjectId(value)
    setSelectedPartId('')
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set('project', value)
      dispatch({ type: 'setActiveProject', projectId: value })
    } else {
      params.delete('project')
    }
    setSearchParams(params)
  }

  const handleSectionNavigate = (section) => {
    if (section === 'configuration') return
    const query = selectedProjectId ? `?project=${selectedProjectId}&section=${section}` : `?section=${section}`
    navigate(`/production/treeview${query}`)
  }

  const selectedSet = useMemo(() => {
    return availableSets.find((set) => set.id === selectedSetId) || null
  }, [availableSets, selectedSetId])

  const visibleParts = selectedSet?.parts || []

  const validate = () => {
    const nextErrors = {}
    if (!selectedProjectId) nextErrors.project = 'Select a project'
    if (!selectedSetId) nextErrors.set = 'Select a set'
    if (!form.id.trim()) nextErrors.id = 'Part Id is required'
    if (!form.name.trim()) nextErrors.name = 'Name is required'
    if (!form.category) nextErrors.category = 'Choose a category'
    if (!form.type) nextErrors.type = 'Choose a type'
    if (!form.level) nextErrors.level = 'Select a level'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleAddPart = (e) => {
    e.preventDefault()
    if (!validate()) return

    setConfigurations((prev) => {
      const projectConfig = prev[selectedProjectId]
      if (!projectConfig) return prev
      const nextSets = projectConfig.sets.map((set) => {
        if (set.id !== selectedSetId) return set
        return {
          ...set,
          parts: [
            ...set.parts,
            {
              id: form.id,
              name: form.name,
              shortName: form.shortName,
              category: form.category,
              type: form.type,
              level: form.level,
              owner: form.owner,
              status: form.status,
            },
          ],
        }
      })

      return {
        ...prev,
        [selectedProjectId]: {
          ...projectConfig,
          sets: nextSets,
        },
      }
    })

    setForm({ id: '', name: '', shortName: '', category: '', type: '', level: '', owner: '', status: 'Draft' })
    setSelectedPartId(form.id)
  }

  const renderTree = () => (
    <CCard className="shadow-sm border-0 h-100">
      <CCardHeader className="bg-dark text-white fw-semibold">Configuration Tree</CCardHeader>
      <CCardBody className="p-0">
        <CListGroup flush>
          {availableSets.map((set) => (
            <React.Fragment key={set.id}>
              <CListGroupItem
                action
                active={selectedSetId === set.id}
                className="d-flex justify-content-between align-items-center"
                onClick={() => setSelectedSetId(set.id)}
              >
                <span className="fw-semibold">{set.name}</span>
                <CBadge color="secondary" shape="rounded-pill">
                  {set.parts.length} parts
                </CBadge>
              </CListGroupItem>
              {selectedSetId === set.id && (
                <div className="ps-4">
                  {set.parts.map((part) => (
                    <CListGroupItem
                      key={part.id}
                      action
                      onClick={() => setSelectedPartId(part.id)}
                      active={selectedPartId === part.id}
                      className="border-0 border-top"
                    >
                      <CIcon icon={cilChevronRight} className="me-2 text-secondary" />
                      <span className="fw-semibold">{part.id}</span> — {part.name}
                    </CListGroupItem>
                  ))}
                </div>
              )}
            </React.Fragment>
          ))}

          {!availableSets.length && (
            <CListGroupItem className="text-body-secondary">No sets for this project yet.</CListGroupItem>
          )}
        </CListGroup>
      </CCardBody>
    </CCard>
  )

  return (
    <CContainer fluid className="py-4">
      <CNav variant="tabs" className="mb-3">
        <CNavItem>
          <CNavLink onClick={() => handleSectionNavigate('general')}>Home</CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink onClick={() => handleSectionNavigate('general')}>General</CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink active>Configuration</CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink onClick={() => handleSectionNavigate('production')}>Production</CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink onClick={() => handleSectionNavigate('materials')}>Materials</CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink onClick={() => handleSectionNavigate('reports')}>Reports</CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink onClick={() => handleSectionNavigate('administration')}>Administration</CNavLink>
        </CNavItem>
      </CNav>

      <CRow className="g-3">
        <CCol md={4} lg={3}>
          {renderTree()}
        </CCol>
        <CCol md={8} lg={9}>
          <CCard className="shadow-sm border-0 mb-3">
            <CCardHeader className="bg-primary text-white d-flex align-items-center justify-content-between">
              <span className="fw-semibold">Configuration Parts</span>
              <div className="d-flex gap-2">
                <CFormSelect
                  size="sm"
                  value={selectedProjectId}
                  onChange={(e) => handleProjectChange(e.target.value)}
                  invalid={!!errors.project}
                >
                  <option value="">Select Project</option>
                  {projects
                    .filter((project) => configurations[project.id])
                    .map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                </CFormSelect>
                <CFormSelect
                  size="sm"
                  value={selectedSetId}
                  onChange={(e) => setSelectedSetId(e.target.value)}
                  disabled={!availableSets.length}
                  invalid={!!errors.set}
                >
                  <option value="">{availableSets.length ? 'Select Set' : 'No sets available'}</option>
                  {availableSets.map((set) => (
                    <option key={set.id} value={set.id}>
                      {set.name}
                    </option>
                  ))}
                </CFormSelect>
              </div>
            </CCardHeader>
            <CCardBody className="p-0">
              <CTable hover responsive bordered align="middle" className="mb-0">
                <CTableHead color="dark">
                  <CTableRow>
                    <CTableHeaderCell scope="col">Part Id*</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Name*</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Short Name</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Category*</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Type*</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Part Level</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Owner</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {!visibleParts.length && (
                    <CTableRow>
                      <CTableDataCell colSpan={8} className="text-center text-body-secondary py-4">
                        Select a project and set to see configuration parts.
                      </CTableDataCell>
                    </CTableRow>
                  )}
                  {visibleParts.map((part) => (
                    <CTableRow key={part.id} active={part.id === selectedPartId}>
                      <CTableDataCell className="fw-semibold">{part.id}</CTableDataCell>
                      <CTableDataCell>{part.name}</CTableDataCell>
                      <CTableDataCell>{part.shortName || '—'}</CTableDataCell>
                      <CTableDataCell>{part.category}</CTableDataCell>
                      <CTableDataCell>{part.type}</CTableDataCell>
                      <CTableDataCell>{part.level}</CTableDataCell>
                      <CTableDataCell>{part.owner || '—'}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={part.status === 'Qualified' ? 'success' : 'warning'} className="text-dark">
                          {part.status}
                        </CBadge>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>

          <CCard className="shadow-sm border-0">
            <CCardHeader className="bg-light fw-semibold d-flex align-items-center gap-2">
              <CIcon icon={cilPlus} className="text-primary" />
              Add Configuration Part
            </CCardHeader>
            <CCardBody>
              <CForm onSubmit={handleAddPart} className="row g-3">
                <CCol md={4}>
                  <CFormInput
                    label="Part Id*"
                    value={form.id}
                    onChange={(e) => setForm({ ...form, id: e.target.value })}
                    invalid={!!errors.id}
                    feedbackInvalid={errors.id}
                  />
                </CCol>
                <CCol md={4}>
                  <CFormInput
                    label="Name*"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    invalid={!!errors.name}
                    feedbackInvalid={errors.name}
                  />
                </CCol>
                <CCol md={4}>
                  <CFormInput
                    label="Short Name"
                    value={form.shortName}
                    onChange={(e) => setForm({ ...form, shortName: e.target.value })}
                  />
                </CCol>

                <CCol md={4}>
                  <CFormSelect
                    label="Category*"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    invalid={!!errors.category}
                    feedbackInvalid={errors.category}
                  >
                    <option value="">Select</option>
                    <option value="Sensors">Sensors</option>
                    <option value="Actuator">Actuator</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Processor">Processor</option>
                    <option value="Structure">Structure</option>
                    <option value="Power">Power</option>
                    <option value="Harness">Harness</option>
                  </CFormSelect>
                </CCol>
                <CCol md={4}>
                  <CFormSelect
                    label="Type*"
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    invalid={!!errors.type}
                    feedbackInvalid={errors.type}
                  >
                    <option value="">Select</option>
                    <option value="Electronic">Electronic</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Digital">Digital</option>
                    <option value="Composite">Composite</option>
                  </CFormSelect>
                </CCol>
                <CCol md={4}>
                  <CFormSelect
                    label="Part Level*"
                    value={form.level}
                    onChange={(e) => setForm({ ...form, level: e.target.value })}
                    invalid={!!errors.level}
                    feedbackInvalid={errors.level}
                  >
                    <option value="">Select level</option>
                    <option value="L1">L1 - System</option>
                    <option value="L2">L2 - Sub System</option>
                    <option value="L3">L3 - Assembly</option>
                    <option value="L4">L4 - Sub Assembly</option>
                  </CFormSelect>
                </CCol>

                <CCol md={6}>
                  <CFormInput
                    label="Owner"
                    value={form.owner}
                    onChange={(e) => setForm({ ...form, owner: e.target.value })}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormSelect
                    label="Status"
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    <option>Draft</option>
                    <option>Under Review</option>
                    <option>Qualified</option>
                  </CFormSelect>
                </CCol>

                <CCol xs={12} className="d-flex justify-content-end gap-2">
                  <CButton color="secondary" variant="outline" onClick={() => setForm({ id: '', name: '', shortName: '', category: '', type: '', level: '', owner: '', status: 'Draft' })}>
                    Reset
                  </CButton>
                  <CButton color="primary" type="submit" disabled={!selectedSetId}>
                    <CIcon icon={cilPlus} className="me-2" />
                    Add Part
                  </CButton>
                </CCol>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default ConfigurationParts
