// src/views/dashboard/ProductionTreeView.js
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCloseButton,
  CCol,
  CContainer,
  CFormInput,
  CFormSelect,
  CListGroup,
  CListGroupItem,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CNav,
  CNavItem,
  CNavLink,
  CProgress,
  CRow,
  CToast,
  CToastBody,
  CToaster,
  CTooltip,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCheckCircle, cilInfo, cilList, cilPlus, cilWarning } from '@coreui/icons'

const ProductionTreeView = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const projects = useSelector((state) => state.projects)
  const activeProjectId = useSelector((state) => state.activeProjectId)
  const validSections = useMemo(
    () => ['general', 'configuration', 'production', 'materials', 'reports', 'administration'],
    [],
  )

  const [form, setForm] = useState({
    name: '',
    code: '',
    category: '',
    projectType: '',
    status: 'Draft',
    owner: '',
    system: '',
    description: '',
  })
  const [errors, setErrors] = useState({})
  const [showAddModal, setShowAddModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [activeSection, setActiveSection] = useState('general')
  const [viewMode, setViewMode] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get('view') === 'table' ? 'table' : 'card'
  })
  const [expandedProjects, setExpandedProjects] = useState([])
  const [qcDrafts, setQcDrafts] = useState({})
  const [toast, setToast] = useState({ visible: false, message: '', color: 'success' })

  const formatFileSize = (bytes) => {
    if (!bytes && bytes !== 0) return ''
    const kb = bytes / 1024
    if (kb < 1024) return `${kb.toFixed(1)} KB`
    return `${(kb / 1024).toFixed(1)} MB`
  }

  useEffect(() => {
    dispatch({ type: 'set', activeModule: 'production' })
    const params = new URLSearchParams(location.search)
    const projectFromUrl = params.get('project')
    const sectionFromUrl = params.get('section')
    if (projectFromUrl) {
      dispatch({ type: 'setActiveProject', projectId: projectFromUrl })
    } else if (!activeProjectId && projects[0]) {
      dispatch({ type: 'setActiveProject', projectId: projects[0].id })
    }

    if (sectionFromUrl && validSections.includes(sectionFromUrl)) {
      setActiveSection(sectionFromUrl)
    } else {
      setActiveSection('general')
    }
    const viewFromUrl = params.get('view')
    if (viewFromUrl === 'card' || viewFromUrl === 'table') {
      setViewMode(viewFromUrl)
    }
  }, [location.search, projects, activeProjectId, dispatch, validSections])

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }))
  }

  const handleSectionChange = (section) => {
    setActiveSection(section)

    const params = new URLSearchParams(location.search)
    if (section === 'general') {
      params.delete('section')
    } else {
      params.set('section', section)
    }
    if (viewMode) {
      params.set('view', viewMode)
    }
    navigate({ search: params.toString() }, { replace: true })
  }

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    params.set('view', viewMode)
    navigate({ search: params.toString() }, { replace: true })
  }, [viewMode, location.search, navigate])

  const validate = () => {
    const nextErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Project name is required'
    if (!form.code.trim()) nextErrors.code = 'Project code is required'
    if (!form.category) nextErrors.category = 'Select a category'
    if (!form.projectType) nextErrors.projectType = 'Select a project type'
    if (!form.owner.trim()) nextErrors.owner = 'Enter an owner or team'
    if (!form.system.trim()) nextErrors.system = 'Specify the system this project belongs to'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const configurationOptions = [
    {
      title: 'Configuration Parts',
      description: 'Contains detail of parts revision and revision of helping materials.',
      route: '/production/configuration-parts',
    },
    {
      title: 'Build Configuration',
      description:
        'This Build Configuration form allows Add, Delete, Replace and View parts under configuration.',
      route: '/production/build-configuration',
    },
    {
      title: 'Copy Configuration',
      description: 'You can copy configuration into newly defined Project. It saves your time.',
    },
    {
      title: 'Assembly Configuration Auxiliary Material',
      description:
        "You can Add, Delete, Update and view details of Assembly Auxiliary Materials like Fasteners, Cable, Gaskets, Helexs, Modules, O'rings, and Washers.",
    },
    {
      title: 'Qualification Tests on Parts',
      description: "Contains Qualification C's Tests Details.",
      route: '/production/qualification-tests',
    },
    {
      title: 'Phase and Activities Applies on a Part',
      description: 'You can add Phase and Activities details for a part.',
    },
  ]

  const handleConfigurationOptionClick = (option) => {
    if (!option.route) return
    const projectId = activeProjectId || projects[0]?.id
    if (projectId) {
      dispatch({ type: 'setActiveProject', projectId })
    }

    const params = new URLSearchParams()
    if (projectId) params.set('project', projectId)

    navigate({ pathname: option.route, search: params.toString() })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    const newProject = {
      id: `proj-${Date.now()}`,
      name: form.name,
      code: form.code,
      category: form.category,
      projectType: form.projectType,
      status: form.status,
      owner: form.owner,
      system: form.system,
      description: form.description,
      qcReports: [],
    }

    dispatch({ type: 'addProject', project: newProject })
    setToast({ visible: true, message: `${newProject.name} was added successfully.`, color: 'success' })
    setShowSuccessModal(true)
    setForm({
      name: '',
      code: '',
      category: '',
      projectType: '',
      status: 'Draft',
      owner: '',
      system: '',
      description: '',
    })
    setShowAddModal(false)
  }

  const toggleProjectExpansion = (projectId) => {
    setExpandedProjects((prev) =>
      prev.includes(projectId) ? prev.filter((id) => id !== projectId) : [...prev, projectId],
    )
  }

  const handleStatusChange = (projectId, status) => {
    dispatch({ type: 'updateProject', projectId, changes: { status } })
    setToast({ visible: true, message: 'Project status updated.', color: 'primary' })
  }

  const getNormalizedSets = (project) =>
    (project.sets || []).map((set) => {
      const normalizedStructures = (set.structures || []).map((structure) =>
        typeof structure === 'string'
          ? { name: structure, status: 'Draft', assemblies: [] }
          : {
              name: structure.name,
              status: structure.status || 'Draft',
              assemblies: (structure.assemblies || []).map((assembly) =>
                typeof assembly === 'string'
                  ? { name: assembly, status: 'Draft' }
                  : { name: assembly.name, status: assembly.status || 'Draft' },
              ),
            },
      )

      return {
        ...set,
        status: set.status || 'Draft',
        structures: normalizedStructures,
        qcReports: set.qcReports || [],
      }
    })

  const handleQcDraftChange = (projectId, field, value) => {
    setQcDrafts((prev) => ({
      ...prev,
      [projectId]: {
        ...prev[projectId],
        [field]: value,
      },
    }))
  }

  const handleQcFileChange = (projectId, fileList) => {
    const file = fileList?.[0]
    setQcDrafts((prev) => ({
      ...prev,
      [projectId]: { ...prev[projectId], file, fileKey: Date.now() },
    }))
  }

  const handleAddQcReport = (projectId) => {
    const project = projects.find((p) => p.id === projectId)
    const draft = qcDrafts[projectId] || {}
    if (!project || !draft.title || !draft.owner || !draft.status) {
      setToast({ visible: true, message: 'Add QC title, owner, and status.', color: 'warning' })
      return
    }

    const attachment = draft.file
      ? {
          name: draft.file.name,
          type: draft.file.type,
          size: draft.file.size,
          url: URL.createObjectURL(draft.file),
        }
      : null

    const newReport = {
      id: `qc-${Date.now()}`,
      title: draft.title,
      owner: draft.owner,
      status: draft.status,
      date: new Date().toISOString().slice(0, 10),
      comments: draft.comments || '',
      attachment,
    }

    dispatch({
      type: 'updateProject',
      projectId,
      changes: { qcReports: [...(project.qcReports || []), newReport] },
    })
    setToast({ visible: true, message: 'QC report added to project.', color: 'success' })
    setQcDrafts((prev) => ({
      ...prev,
      [projectId]: { title: '', owner: '', status: '', comments: '', file: null, fileKey: Date.now() },
    }))
  }

  useEffect(() => {
    if (location.state?.projectCreated) {
      const projectName = location.state.projectName || 'Project'
      setToast({ visible: true, message: `${projectName} was created successfully.`, color: 'success' })
      navigate({ pathname: location.pathname, search: location.search }, { replace: true })
      setViewMode(location.state.viewMode === 'card' ? 'card' : viewMode)
      setShowSuccessModal(true)
    }
  }, [location.pathname, location.search, location.state, navigate, viewMode])

  const renderQcReports = (project) => (
    <div className="mt-3">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <div className="d-flex align-items-center gap-2">
          <CIcon icon={cilInfo} className="text-info" />
          <span className="fw-semibold">QC Reports</span>
        </div>
        <CTooltip content="Add offline QC proof or report and keep it attached with the project.">
          <CIcon icon={cilWarning} className="text-warning" />
        </CTooltip>
      </div>
      <CRow className="g-3">
        {(project.qcReports || []).map((report) => (
          <CCol md={6} key={report.id}>
              <CCard className="border-start border-4 border-success h-100">
                <CCardBody className="py-2">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <div className="fw-semibold">{report.title}</div>
                      <div className="small text-body-secondary">
                        Owner: {report.owner} • {report.date || 'Dated offline'}
                      </div>
                      {report.comments && (
                        <div className="small text-body mt-2">
                          <span className="text-body-secondary">Comments:</span> {report.comments}
                        </div>
                      )}
                      {report.attachment && (
                        <div className="small text-body mt-2">
                          <div className="text-body-secondary">Attachment</div>
                          <div className="d-flex align-items-center gap-2 flex-wrap">
                            <a
                              href={report.attachment.url}
                              download={report.attachment.name}
                              target="_blank"
                              rel="noreferrer"
                              className="fw-semibold"
                            >
                              {report.attachment.name}
                            </a>
                            <span className="text-body-secondary">
                              {formatFileSize(report.attachment.size)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    <span className="badge text-bg-light text-success border">{report.status}</span>
                  </div>
                </CCardBody>
              </CCard>
          </CCol>
        ))}
        <CCol md={12}>
          <CCard className="bg-body-tertiary border-dashed h-100">
            <CCardBody>
              <CRow className="g-3">
                <CCol md={4}>
                  <CFormInput
                    label="QC title"
                    value={qcDrafts[project.id]?.title || ''}
                    onChange={(event) => handleQcDraftChange(project.id, 'title', event.target.value)}
                    placeholder="e.g., Assembly torque log"
                  />
                </CCol>
                <CCol md={4}>
                  <CFormInput
                    label="Owner / Cell"
                    value={qcDrafts[project.id]?.owner || ''}
                    onChange={(event) => handleQcDraftChange(project.id, 'owner', event.target.value)}
                    placeholder="QA Cell"
                  />
                </CCol>
                <CCol md={3}>
                  <CFormSelect
                    label="Status"
                    value={qcDrafts[project.id]?.status || ''}
                    onChange={(event) => handleQcDraftChange(project.id, 'status', event.target.value)}
                  >
                    <option value="">Select status</option>
                    <option value="Draft">Draft</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Pending">Pending</option>
                    <option value="Accepted">Accepted</option>
                  </CFormSelect>
                </CCol>
                <CCol md={1} className="d-flex align-items-end">
                  <CButton color="success" variant="outline" onClick={() => handleAddQcReport(project.id)}>
                    Save
                  </CButton>
                </CCol>
              </CRow>
              <CRow className="g-3 mt-1 align-items-end">
                <CCol md={6}>
                  <CFormInput
                    key={(qcDrafts[project.id]?.fileKey ?? project.id) + '-file-input'}
                    type="file"
                    label="Attach QC proof (PDF, docs, images)"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,image/*"
                    onChange={(event) => handleQcFileChange(project.id, event.target.files)}
                  />
                  <div className="form-text">Attach the offline report file to keep it linked with the project.</div>
                </CCol>
                <CCol md={5}>
                  <CFormInput
                    label="Comments / notes"
                    value={qcDrafts[project.id]?.comments || ''}
                    onChange={(event) => handleQcDraftChange(project.id, 'comments', event.target.value)}
                    placeholder="Add reviewer notes or context"
                  />
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )

  const renderSetBreakdown = (project) => {
    const sets = getNormalizedSets(project)
    return (
      <CListGroup flush>
        {sets.map((set) => (
          <CListGroupItem key={set.id} className="border-0 px-0">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div>
                <div className="fw-semibold">{set.name}</div>
                <div className="small text-body-secondary">{set.structures.length} structures</div>
              </div>
              <span className="badge text-bg-secondary">{set.status}</span>
            </div>
            {set.structures.map((structure, idx) => (
              <CCard className="mb-2 border-start border-4 border-primary" key={`${structure.name}-${idx}`}>
                <CCardBody className="py-3">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <div className="fw-semibold">{structure.name}</div>
                      <div className="small text-body-secondary">Assemblies</div>
                    </div>
                    <span className="badge text-bg-light border">{structure.status}</span>
                  </div>
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    {structure.assemblies.map((assembly) => (
                      <span key={assembly.name} className="badge text-bg-light border">
                        {assembly.name}
                        <small className="ms-2 text-muted">{assembly.status}</small>
                      </span>
                    ))}
                    {structure.assemblies.length === 0 && (
                      <span className="text-body-secondary small">No assemblies added yet.</span>
                    )}
                  </div>
                </CCardBody>
              </CCard>
            ))}
          </CListGroupItem>
        ))}
      </CListGroup>
    )
  }

  return (
    <CContainer fluid className="py-4">
      <CToaster placement="top-end" className="mt-5 me-3">
        {toast.visible && (
          <CToast
            autohide
            visible
            color={toast.color}
            onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
          >
            <CToastBody>{toast.message}</CToastBody>
          </CToast>
        )}
      </CToaster>
      <CNav variant="tabs" className="mb-3">
        <CNavItem>
          <CNavLink active={activeSection === 'general'} onClick={() => handleSectionChange('general')}>
            General
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink
            active={activeSection === 'configuration'}
            onClick={() => handleSectionChange('configuration')}
          >
            Configuration
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink
            active={activeSection === 'production'}
            onClick={() => handleSectionChange('production')}
          >
            Production
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink active={activeSection === 'materials'} onClick={() => handleSectionChange('materials')}>
            Materials
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink active={activeSection === 'reports'} onClick={() => handleSectionChange('reports')}>
            Reports
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink
            active={activeSection === 'administration'}
            onClick={() => handleSectionChange('administration')}
          >
            Administration
          </CNavLink>
        </CNavItem>
      </CNav>
      {activeSection === 'general' && (
        <CRow>
          <CCol xs={12}>
            <CCard className="shadow-sm border-0">
              <CCardHeader className="bg-primary text-white d-flex align-items-center justify-content-between">
                <span className="fw-semibold">Projects Hierarchy</span>
                <div className="d-flex align-items-center gap-2">
                  <CButton
                    color="light"
                    size="sm"
                    className={viewMode === 'table' ? 'border-primary text-primary' : ''}
                    onClick={() => setViewMode('table')}
                  >
                    <CIcon icon={cilList} className="me-1" /> Table
                  </CButton>
                  <CButton
                    color="light"
                    size="sm"
                    className={viewMode === 'card' ? 'border-primary text-primary' : ''}
                    onClick={() => setViewMode('card')}
                  >
                    <CIcon icon={cilInfo} className="me-1" /> Cards
                  </CButton>
                  <CButton
                    color="warning"
                    size="sm"
                    className="text-dark fw-semibold"
                    onClick={() => setShowAddModal(true)}
                  >
                    <CIcon icon={cilPlus} className="me-1" /> Add Project
                  </CButton>
                </div>
              </CCardHeader>
              <CCardBody className="p-0">
                {viewMode === 'table' ? (
                  <CTable hover responsive className="mb-0 align-middle">
                    <CTableHead className="bg-body-secondary text-uppercase">
                      <CTableRow>
                        <CTableHeaderCell scope="col" style={{ width: '64px' }}></CTableHeaderCell>
                        <CTableHeaderCell scope="col">Code*</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Name*</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Type</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Category</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Description</CTableHeaderCell>
                        <CTableHeaderCell scope="col">System</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      <CTableRow role="button" onClick={() => setShowAddModal(true)} className="bg-light">
                        <CTableDataCell colSpan={8} className="fw-semibold text-primary">
                          Please click here to add new row...
                        </CTableDataCell>
                      </CTableRow>
                      {projects.length === 0 ? (
                        <CTableRow>
                          <CTableDataCell colSpan={8} className="text-center text-body-secondary py-4">
                            No projects available. Use the Add Project button to create one.
                          </CTableDataCell>
                        </CTableRow>
                      ) : (
                        projects.map((project) => (
                          <React.Fragment key={project.id}>
                            <CTableRow
                              active={activeProjectId === project.id}
                              role="button"
                              onClick={() => dispatch({ type: 'setActiveProject', projectId: project.id })}
                            >
                              <CTableDataCell
                                className="text-body-secondary"
                                onClick={(event) => {
                                  event.stopPropagation()
                                  toggleProjectExpansion(project.id)
                                }}
                              >
                                {expandedProjects.includes(project.id) ? '▾' : '▸'}
                              </CTableDataCell>
                              <CTableDataCell className="fw-semibold">{project.code}</CTableDataCell>
                              <CTableDataCell>{project.name}</CTableDataCell>
                              <CTableDataCell className="text-capitalize">
                                {project.projectType || '—'}
                              </CTableDataCell>
                              <CTableDataCell>{project.category || '—'}</CTableDataCell>
                              <CTableDataCell className="text-wrap" style={{ maxWidth: '320px' }}>
                                {project.description || '—'}
                              </CTableDataCell>
                              <CTableDataCell>{project.system || '—'}</CTableDataCell>
                              <CTableDataCell>
                                <CFormSelect
                                  size="sm"
                                  value={project.status}
                                  onChange={(event) => handleStatusChange(project.id, event.target.value)}
                                >
                                  <option>Draft</option>
                                  <option>In Configuration</option>
                                  <option>In Production</option>
                                  <option>Complete</option>
                                </CFormSelect>
                              </CTableDataCell>
                            </CTableRow>
                            {expandedProjects.includes(project.id) && (
                              <CTableRow className="bg-body-tertiary">
                                <CTableDataCell colSpan={8}>
                                  <CRow className="g-3">
                                    <CCol md={4}>
                                      <CCard className="border-0 shadow-sm h-100">
                                        <CCardHeader className="fw-semibold bg-body-secondary">Project at a glance</CCardHeader>
                                        <CCardBody>
                                          <div className="d-flex align-items-center gap-2 mb-2">
                                            <CIcon icon={cilCheckCircle} className="text-success" />
                                            <span className="small text-body-secondary">Owner</span>
                                            <span className="fw-semibold">{project.owner || 'Unassigned'}</span>
                                          </div>
                                          <div className="d-flex align-items-center gap-2 mb-2">
                                            <CIcon icon={cilInfo} className="text-primary" />
                                            <span className="small text-body-secondary">System</span>
                                            <span className="fw-semibold">{project.system || '—'}</span>
                                          </div>
                                          <CProgress color="warning" value={project.status === 'Complete' ? 100 : 55} />
                                          <div className="small text-body-secondary mt-2">
                                            Status drive is fully offline; keep updating locally during production.
                                          </div>
                                        </CCardBody>
                                      </CCard>
                                    </CCol>
                                    <CCol md={5}>
                                      <CCard className="border-0 shadow-sm h-100">
                                        <CCardHeader className="fw-semibold bg-body-secondary">Sets, structures & assemblies</CCardHeader>
                                        <CCardBody>{renderSetBreakdown(project)}</CCardBody>
                                      </CCard>
                                    </CCol>
                                    <CCol md={3}>
                                      <CCard className="border-0 shadow-sm h-100">
                                        <CCardHeader className="fw-semibold bg-body-secondary">Quick status</CCardHeader>
                                        <CCardBody>
                                          <div className="small text-body-secondary mb-2">
                                            Mark production readiness per set.
                                          </div>
                                          {getNormalizedSets(project).map((set) => (
                                            <div className="d-flex align-items-center justify-content-between mb-2" key={set.id}>
                                              <span className="fw-semibold">{set.name}</span>
                                              <span className="badge text-bg-light border">{set.status}</span>
                                            </div>
                                          ))}
                                          <div className="small text-body-secondary">
                                            Use QC space to attach reports for every structure and assembly.
                                          </div>
                                        </CCardBody>
                                      </CCard>
                                    </CCol>
                                  </CRow>
                                  {renderQcReports(project)}
                                </CTableDataCell>
                              </CTableRow>
                            )}
                          </React.Fragment>
                        ))
                      )}
                    </CTableBody>
                  </CTable>
                ) : (
                  <CRow className="g-3 p-3">
                    {projects.map((project) => (
                      <CCol xl={4} lg={6} key={project.id}>
                        <CCard className="h-100 shadow-sm border-0">
                          <CCardHeader className="bg-body-secondary d-flex justify-content-between align-items-center">
                            <div>
                              <div className="fw-semibold">{project.name}</div>
                              <div className="small text-body-secondary">{project.code}</div>
                            </div>
                            <CFormSelect
                              size="sm"
                              aria-label="Project status"
                              value={project.status}
                              onChange={(event) => handleStatusChange(project.id, event.target.value)}
                              className="w-auto"
                            >
                              <option>Draft</option>
                              <option>In Configuration</option>
                              <option>In Production</option>
                              <option>Complete</option>
                            </CFormSelect>
                          </CCardHeader>
                          <CCardBody className="d-flex flex-column gap-3">
                            <div className="small text-body-secondary">{project.description || '—'}</div>
                            <div className="d-flex flex-wrap gap-2">
                              <span className="badge text-bg-info text-white">{project.projectType}</span>
                              <span className="badge text-bg-warning text-dark">{project.category}</span>
                              <span className="badge text-bg-light border">Owner: {project.owner || '—'}</span>
                            </div>
                            <div>
                              <div className="fw-semibold mb-2">Sets snapshot</div>
                              <div className="d-flex flex-wrap gap-2">
                                {getNormalizedSets(project).map((set) => (
                                  <span className="badge text-bg-light border" key={set.id}>
                                    {set.name}
                                    <small className="ms-2 text-muted">{set.structures.length} structures</small>
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <div className="fw-semibold mb-2">Latest QC</div>
                              {(project.qcReports || []).slice(0, 2).map((report) => (
                                <div className="d-flex align-items-center justify-content-between mb-1" key={report.id}>
                                  <span className="small">{report.title}</span>
                                  <span className="badge text-bg-light border">{report.status}</span>
                                </div>
                              ))}
                              {(project.qcReports || []).length === 0 && (
                                <div className="small text-body-secondary">No QC reports added yet.</div>
                              )}
                            </div>
                            <div className="bg-body-tertiary p-3 rounded">
                              <div className="fw-semibold mb-2">Attach QC report</div>
                              <CRow className="g-2">
                                <CCol xs={12}>
                                  <CFormInput
                                    size="sm"
                                    placeholder="Report title (e.g., Brake test pack)"
                                    value={qcDrafts[project.id]?.title || ''}
                                    onChange={(event) => handleQcDraftChange(project.id, 'title', event.target.value)}
                                  />
                                </CCol>
                                <CCol sm={6}>
                                  <CFormInput
                                    size="sm"
                                    placeholder="Owner / Cell"
                                    value={qcDrafts[project.id]?.owner || ''}
                                    onChange={(event) => handleQcDraftChange(project.id, 'owner', event.target.value)}
                                  />
                                </CCol>
                                <CCol sm={6}>
                                  <CFormSelect
                                    size="sm"
                                    value={qcDrafts[project.id]?.status || ''}
                                    onChange={(event) => handleQcDraftChange(project.id, 'status', event.target.value)}
                                  >
                                    <option value="">Status</option>
                                    <option value="Draft">Draft</option>
                                    <option value="Pending QC">Pending QC</option>
                                    <option value="Accepted">Accepted</option>
                                  </CFormSelect>
                                </CCol>
                                <CCol xs={12} className="d-flex justify-content-between align-items-center">
                                  <small className="text-body-secondary">
                                    Add quick QC notes here. Full history stays in the expanded table view.
                                  </small>
                                  <CButton color="primary" size="sm" onClick={() => handleAddQcReport(project.id)}>
                                    Save QC
                                  </CButton>
                                </CCol>
                              </CRow>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                              <span className="small text-body-secondary">Need more details? Expand in table view.</span>
                              <CButton
                                color="primary"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setExpandedProjects((prev) => [...prev, project.id])
                                  setViewMode('table')
                                  dispatch({ type: 'setActiveProject', projectId: project.id })
                                }}
                              >
                                Open in table
                              </CButton>
                            </div>
                          </CCardBody>
                        </CCard>
                      </CCol>
                    ))}
                  </CRow>
                )}
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      )}

      {activeSection === 'configuration' && (
        <CRow className="g-3">
          <CCol xs={12}>
            <CCard className="shadow-sm border-0 h-100">
              <CCardHeader className="bg-primary text-white fw-semibold">Configuration Main Form</CCardHeader>
              <CCardBody>
                <p className="text-body-secondary mb-4">
                  Configuration Main Form now includes the following options:
                </p>
                <CRow className="g-3">
                  {configurationOptions.map((option, index) => (
                    <CCol md={6} key={option.title}>
                      <CCard className="h-100 border-start border-4 border-warning shadow-sm">
                        <CCardBody>
                          <div className="d-flex align-items-start">
                            <span className="badge text-bg-warning text-dark me-3">{index + 1}</span>
                            <div>
                              <h6 className="fw-semibold mb-2">{option.title}</h6>
                              <p className="text-body-secondary mb-0 small">{option.description}</p>
                            </div>
                          </div>
                          {option.route && (
                            <CButton
                              color="primary"
                              variant="outline"
                              size="sm"
                              className="mt-3"
                              onClick={() => handleConfigurationOptionClick(option)}
                            >
                              Open {option.title}
                            </CButton>
                          )}
                        </CCardBody>
                      </CCard>
                    </CCol>
                  ))}
                </CRow>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      )}

      <CModal alignment="center" visible={showSuccessModal} onClose={() => setShowSuccessModal(false)}>
        <CModalHeader className="fw-semibold">
          Project added
          <CCloseButton className="ms-auto" onClick={() => setShowSuccessModal(false)} />
        </CModalHeader>
        <CModalBody>
          Your project has been saved locally with its sets and assemblies. Keep working offline, add QC snapshots,
          and push status updates when connected to LAN.
        </CModalBody>
        <CModalFooter className="justify-content-between">
          <CButton color="secondary" variant="ghost" onClick={() => setShowSuccessModal(false)}>
            Close
          </CButton>
          <CButton
            color="primary"
            onClick={() => {
              setViewMode('table')
              setShowSuccessModal(false)
            }}
          >
            Go to project table
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal alignment="center" visible={showAddModal} onClose={() => setShowAddModal(false)}>
        <CModalHeader className="fw-semibold">Add Project</CModalHeader>
        <CModalBody>
          <form id="addProjectForm" onSubmit={handleSubmit}>
            <CFormInput
              label="Project Name"
              name="name"
              value={form.name}
              onChange={handleInputChange}
              invalid={!!errors.name}
              feedbackInvalid={errors.name}
              className="mb-3"
            />
            <CFormInput
              label="Project Code"
              name="code"
              value={form.code}
              onChange={handleInputChange}
              invalid={!!errors.code}
              feedbackInvalid={errors.code}
              className="mb-3"
            />
            <CFormSelect
              label="Category"
              name="category"
              value={form.category}
              onChange={handleInputChange}
              invalid={!!errors.category}
              feedbackInvalid={errors.category}
              className="mb-3"
            >
              <option value="">Choose category</option>
              <option value="Automotive">Automotive</option>
              <option value="Aviation">Aviation</option>
              <option value="Marine">Marine</option>
            </CFormSelect>
            <CFormSelect
              label="Project Type"
              name="projectType"
              value={form.projectType}
              onChange={handleInputChange}
              invalid={!!errors.projectType}
              feedbackInvalid={errors.projectType}
              className="mb-3"
            >
              <option value="">Select project type</option>
              <option value="Special">Special</option>
              <option value="Conventional">Conventional</option>
            </CFormSelect>
            <CFormSelect
              label="Status"
              name="status"
              value={form.status}
              onChange={handleInputChange}
              className="mb-3"
            >
              <option>Draft</option>
              <option>In Configuration</option>
              <option>In Production</option>
            </CFormSelect>
            <CFormInput
              label="Owner / Team"
              name="owner"
              value={form.owner}
              onChange={handleInputChange}
              invalid={!!errors.owner}
              feedbackInvalid={errors.owner}
              className="mb-3"
            />
            <CFormInput
              label="System"
              name="system"
              value={form.system}
              onChange={handleInputChange}
              invalid={!!errors.system}
              feedbackInvalid={errors.system}
              className="mb-3"
              placeholder="e.g., Fire Control"
            />
            <CFormInput
              label="Short Description"
              name="description"
              value={form.description}
              onChange={handleInputChange}
              className="mb-2"
              placeholder="What is this project about?"
            />
          </form>
        </CModalBody>
        <CModalFooter className="justify-content-between">
          <CButton color="secondary" variant="ghost" onClick={() => setShowAddModal(false)}>
            Cancel
          </CButton>
          <CButton color="warning" className="text-dark fw-semibold" type="submit" form="addProjectForm">
            Save Project
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  )
}

export default ProductionTreeView
