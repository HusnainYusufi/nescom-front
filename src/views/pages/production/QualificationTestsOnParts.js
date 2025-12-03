import React, { useEffect, useMemo, useState } from 'react'
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CCollapse,
  CContainer,
  CForm,
  CFormCheck,
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
import { cilArrowCircleRight, cilPlus, cilPaperclip } from '@coreui/icons'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'

const initialQualificationData = {
  'proj-001': {
    sets: [
      {
        id: 'set-gc',
        name: 'Guidance Control Set',
        parts: [
          {
            id: 'P-1001',
            revision: '0',
            description: 'Inertial Sensor Module',
            remarks: 'Vibration proofed and thermally cycled.',
            tests: [
              {
                id: 'qt-1',
                name: 'Gyro Calibration',
                document: 'CalReport_ISM.pdf',
                order: '1',
                qcWeight: '0.40',
                ncr: false,
                remarks: 'Stable across temperature sweep.',
              },
              {
                id: 'qt-2',
                name: 'Environmental Stress Screening',
                document: '',
                order: '2',
                qcWeight: '0.35',
                ncr: false,
                remarks: 'Awaiting document upload.',
              },
            ],
          },
          {
            id: 'P-1002',
            revision: 'A',
            description: 'Control Surface Servo',
            remarks: 'Torque validation pending.',
            tests: [
              {
                id: 'qt-3',
                name: 'Load Sweep',
                document: 'Servo_Load_Test.xlsx',
                order: '1',
                qcWeight: '0.25',
                ncr: true,
                remarks: 'Minor chatter observed at high torque.',
              },
            ],
          },
        ],
      },
      {
        id: 'set-telemetry',
        name: 'Telemetry & Data Set',
        parts: [
          {
            id: 'P-1101',
            revision: 'B',
            description: 'Data Recorder Board',
            remarks: 'Firmware qualified for baseline.',
            tests: [
              {
                id: 'qt-4',
                name: 'Throughput Benchmark',
                document: 'Recorder_Throughput.pdf',
                order: '1',
                qcWeight: '0.30',
                ncr: false,
                remarks: 'Met throughput requirement.',
              },
            ],
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
        parts: [
          {
            id: 'P-2001',
            revision: '0',
            description: 'Mission Processor',
            remarks: 'Thermal margin improved.',
            tests: [
              {
                id: 'qt-5',
                name: 'Processor Burn-in',
                document: '',
                order: '1',
                qcWeight: '0.20',
                ncr: false,
                remarks: '24-hour cycle planned.',
              },
            ],
          },
        ],
      },
    ],
  },
}

const QualificationTestsOnParts = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const projects = useSelector((state) => state.projects)
  const activeProjectId = useSelector((state) => state.activeProjectId)
  const [searchParams, setSearchParams] = useSearchParams()

  const [qualificationData, setQualificationData] = useState(initialQualificationData)
  const [selectedProjectId, setSelectedProjectId] = useState('')
  const [expandedSets, setExpandedSets] = useState({})
  const [expandedParts, setExpandedParts] = useState({})
  const [selectedPartId, setSelectedPartId] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [form, setForm] = useState({
    name: '',
    order: '',
    qcWeight: '',
    remarks: '',
    document: '',
    ncr: false,
  })

  useEffect(() => {
    dispatch({ type: 'set', activeModule: 'production' })
    const projectFromUrl = searchParams.get('project')
    if (projectFromUrl && qualificationData[projectFromUrl]) {
      setSelectedProjectId(projectFromUrl)
      dispatch({ type: 'setActiveProject', projectId: projectFromUrl })
      return
    }

    if (activeProjectId && qualificationData[activeProjectId]) {
      setSelectedProjectId(activeProjectId)
      return
    }

    if (!activeProjectId && projects.length) {
      const fallback = projects[0].id
      setSelectedProjectId(fallback)
      dispatch({ type: 'setActiveProject', projectId: fallback })
    }
  }, [activeProjectId, dispatch, projects, qualificationData, searchParams])

  const availableSets = useMemo(() => qualificationData[selectedProjectId]?.sets || [], [
    qualificationData,
    selectedProjectId,
  ])

  const selectedPart = useMemo(() => {
    for (const set of availableSets) {
      const found = set.parts.find((part) => part.id === selectedPartId)
      if (found) return found
    }
    return null
  }, [availableSets, selectedPartId])

  const handleProjectChange = (projectId) => {
    setSelectedProjectId(projectId)
    setSelectedPartId('')
    setExpandedSets({})
    setExpandedParts({})
    const params = new URLSearchParams(searchParams)
    if (projectId) {
      params.set('project', projectId)
      dispatch({ type: 'setActiveProject', projectId })
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

  const toggleSet = (setId) => {
    setExpandedSets((prev) => ({ ...prev, [setId]: !prev[setId] }))
  }

  const togglePart = (partId) => {
    setExpandedParts((prev) => ({ ...prev, [partId]: !prev[partId] }))
    setSelectedPartId(partId)
  }

  const handleAttachDocument = (setId, partId, testId, document) => {
    setQualificationData((prev) => {
      const next = { ...prev }
      const project = next[selectedProjectId]
      if (!project) return prev
      project.sets = project.sets.map((set) => {
        if (set.id !== setId) return set
        return {
          ...set,
          parts: set.parts.map((part) => {
            if (part.id !== partId) return part
            return {
              ...part,
              tests: part.tests.map((test) =>
                test.id === testId ? { ...test, document } : test,
              ),
            }
          }),
        }
      })
      return { ...next }
    })
  }

  const handleAddTest = (e) => {
    e.preventDefault()
    if (!selectedPartId) return

    const newTest = {
      id: `qt-${Date.now()}`,
      name: form.name || 'New Qualification Test',
      document: form.document,
      order: form.order || '1',
      qcWeight: form.qcWeight || '0.10',
      ncr: !!form.ncr,
      remarks: form.remarks,
    }

    setQualificationData((prev) => {
      const next = { ...prev }
      const project = next[selectedProjectId]
      if (!project) return prev
      project.sets = project.sets.map((set) => ({
        ...set,
        parts: set.parts.map((part) => {
          if (part.id !== selectedPartId) return part
          return { ...part, tests: [...part.tests, newTest] }
        }),
      }))
      return { ...next }
    })

    setShowAddModal(false)
    setForm({ name: '', order: '', qcWeight: '', remarks: '', document: '', ncr: false })
  }

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
        <CCol lg={3}>
          <CCard className="shadow-sm border-0 h-100">
            <CCardHeader className="bg-primary text-white fw-semibold">Selection Tree View</CCardHeader>
            <CCardBody>
              <CFormSelect
                label="Project"
                value={selectedProjectId}
                onChange={(e) => handleProjectChange(e.target.value)}
              >
                <option value="">Select Project</option>
                {projects
                  .filter((project) => qualificationData[project.id])
                  .map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
              </CFormSelect>
              <div className="mt-3 small text-uppercase text-body-secondary">Configuration</div>
              <CListGroup className="mt-2">
                {availableSets.map((set) => (
                  <React.Fragment key={set.id}>
                    <CListGroupItem
                      action
                      className="d-flex justify-content-between align-items-center"
                      onClick={() => toggleSet(set.id)}
                    >
                      <span>
                        <CIcon icon={cilArrowCircleRight} className="me-2 text-primary" />
                        {set.name}
                      </span>
                      <CBadge color="light" className="text-primary">
                        {set.parts.length}
                      </CBadge>
                    </CListGroupItem>
                    <CCollapse visible={!!expandedSets[set.id]}>
                      <CListGroup className="border-start border-2 ms-3">
                        {set.parts.map((part) => (
                          <CListGroupItem
                            key={part.id}
                            action
                            active={selectedPartId === part.id}
                            className="d-flex justify-content-between align-items-center"
                            onClick={() => togglePart(part.id)}
                          >
                            <span>{part.id}</span>
                            <CBadge color="warning" className="text-dark">
                              Rev {part.revision}
                            </CBadge>
                          </CListGroupItem>
                        ))}
                      </CListGroup>
                    </CCollapse>
                  </React.Fragment>
                ))}
              </CListGroup>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol lg={9}>
          <CCard className="shadow-sm border-0 mb-3">
            <CCardHeader className="bg-primary text-white d-flex justify-content-between align-items-center">
              <div>
                <div className="fw-semibold">Qualification Tests on Parts</div>
                <div className="small text-white-50">Attach QC reports to part revisions</div>
              </div>
              <div className="d-flex gap-2">
                <CFormSelect
                  size="sm"
                  value={selectedPartId}
                  onChange={(e) => setSelectedPartId(e.target.value)}
                  disabled={!availableSets.length}
                >
                  <option value="">Select Part</option>
                  {availableSets.flatMap((set) => set.parts).map((part) => (
                    <option key={part.id} value={part.id}>
                      {part.id} — Rev {part.revision}
                    </option>
                  ))}
                </CFormSelect>
                <CButton
                  color="light"
                  size="sm"
                  className="text-primary fw-semibold"
                  disabled={!selectedPartId}
                  onClick={() => setShowAddModal(true)}
                >
                  <CIcon icon={cilPlus} className="me-2" />
                  Add QC Test
                </CButton>
              </div>
            </CCardHeader>
            <CCardBody>
              <CRow className="g-3 mb-3">
                <CCol md={6}>
                  <CFormInput label="Part ID" value={selectedPart?.id || ''} readOnly />
                </CCol>
                <CCol md={6}>
                  <CFormInput label="Part Revision" value={selectedPart?.revision || ''} readOnly />
                </CCol>
              </CRow>
              <CTable hover responsive bordered align="middle" className="mb-0">
                <CTableHead color="dark">
                  <CTableRow>
                    <CTableHeaderCell scope="col">Part ID*</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Revision ID*</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Description*</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Remarks</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {availableSets.length === 0 && (
                    <CTableRow>
                      <CTableDataCell colSpan={4} className="text-center text-body-secondary py-4">
                        Select a project to view qualification tests on parts.
                      </CTableDataCell>
                    </CTableRow>
                  )}
                  {availableSets.flatMap((set) => set.parts).map((part) => (
                    <React.Fragment key={part.id}>
                      <CTableRow active={part.id === selectedPartId} onClick={() => togglePart(part.id)} role="button">
                        <CTableDataCell className="fw-semibold">{part.id}</CTableDataCell>
                        <CTableDataCell>{part.revision}</CTableDataCell>
                        <CTableDataCell>{part.description}</CTableDataCell>
                        <CTableDataCell>{part.remarks}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell colSpan={4} className="p-0">
                          <CCollapse visible={!!expandedParts[part.id]}>
                            <div className="p-3 bg-body-secondary">
                              <div className="d-flex align-items-center justify-content-between mb-2">
                                <div className="fw-semibold">QC Tests</div>
                                <CBadge color="secondary">{part.tests.length} entries</CBadge>
                              </div>
                              <CTable bordered small responsive align="middle" className="mb-0 bg-white">
                                <CTableHead color="light">
                                  <CTableRow>
                                    <CTableHeaderCell scope="col">QC Test*</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Document</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Order*</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">QC Weight</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Remarks</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">NCR</CTableHeaderCell>
                                  </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                  <CTableRow role="button" onClick={() => { setSelectedPartId(part.id); setShowAddModal(true) }}>
                                    <CTableDataCell colSpan={6} className="fw-semibold text-primary">
                                      Please click here to add new row...
                                    </CTableDataCell>
                                  </CTableRow>
                                  {part.tests.map((test) => (
                                    <CTableRow key={test.id}>
                                      <CTableDataCell>{test.name}</CTableDataCell>
                                      <CTableDataCell>
                                        <CButton
                                          color="link"
                                          className="p-0"
                                          onClick={() =>
                                            handleAttachDocument(
                                              availableSets.find((set) => set.parts.includes(part))?.id || '',
                                              part.id,
                                              test.id,
                                              test.document || `QC_Attachment_${test.id}.pdf`,
                                            )
                                          }
                                        >
                                          <CIcon icon={cilPaperclip} className="me-2" />
                                          {test.document ? test.document : 'Attach Doc'}
                                        </CButton>
                                      </CTableDataCell>
                                      <CTableDataCell>{test.order}</CTableDataCell>
                                      <CTableDataCell>{test.qcWeight}</CTableDataCell>
                                      <CTableDataCell>{test.remarks || '—'}</CTableDataCell>
                                      <CTableDataCell>
                                        <CBadge color={test.ncr ? 'danger' : 'success'} className="text-white">
                                          {test.ncr ? 'Yes' : 'No'}
                                        </CBadge>
                                      </CTableDataCell>
                                    </CTableRow>
                                  ))}
                                </CTableBody>
                              </CTable>
                            </div>
                          </CCollapse>
                        </CTableDataCell>
                      </CTableRow>
                    </React.Fragment>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CModal
        alignment="center"
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        scrollable
        backdrop="static"
      >
        <CForm onSubmit={handleAddTest}>
          <CCard className="mb-0 border-0">
            <CCardHeader className="fw-semibold">Add QC Test</CCardHeader>
            <CCardBody>
              <CRow className="g-3">
                <CCol md={6}>
                  <CFormInput
                    label="QC Test Name*"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    label="Document"
                    placeholder="e.g., Test_Report.pdf"
                    value={form.document}
                    onChange={(e) => setForm({ ...form, document: e.target.value })}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    label="Order*"
                    type="number"
                    min="1"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: e.target.value })}
                    required
                  />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    label="QC Weight"
                    type="number"
                    step="0.01"
                    value={form.qcWeight}
                    onChange={(e) => setForm({ ...form, qcWeight: e.target.value })}
                  />
                </CCol>
                <CCol xs={12}>
                  <CFormInput
                    label="Remarks"
                    value={form.remarks}
                    onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                  />
                </CCol>
                <CCol xs={12} className="d-flex align-items-center">
                  <CFormCheck
                    id="ncrFlag"
                    label="NCR Raised"
                    checked={form.ncr}
                    onChange={(e) => setForm({ ...form, ncr: e.target.checked })}
                  />
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
          <div className="d-flex justify-content-end gap-2 p-3">
            <CButton color="secondary" variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </CButton>
            <CButton color="primary" type="submit" disabled={!selectedPartId}>
              <CIcon icon={cilPlus} className="me-2" />
              Add Test
            </CButton>
          </div>
        </CForm>
      </CModal>
    </CContainer>
  )
}

export default QualificationTestsOnParts
