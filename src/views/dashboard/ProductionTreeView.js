// src/views/dashboard/ProductionTreeView.js
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import {
  CAlert,
  CBadge,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCheckCircle, cilPlus } from '@coreui/icons'

const ProductionTreeView = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const projects = useSelector((state) => state.projects)
  const activeProjectId = useSelector((state) => state.activeProjectId)

  const [form, setForm] = useState({
    name: '',
    code: '',
    system: '',
    owner: '',
    description: '',
  })
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [activeTab, setActiveTab] = useState('projects')

  useEffect(() => {
    dispatch({ type: 'set', activeModule: 'production' })
    const params = new URLSearchParams(location.search)
    const projectFromUrl = params.get('project')
    if (projectFromUrl) {
      dispatch({ type: 'setActiveProject', projectId: projectFromUrl })
    } else if (!activeProjectId && projects[0]) {
      dispatch({ type: 'setActiveProject', projectId: projects[0].id })
    }
  }, [location.search, projects, activeProjectId, dispatch])

  const activeProject = useMemo(
    () => projects.find((p) => p.id === activeProjectId) || projects[0],
    [projects, activeProjectId],
  )

  const navTabs = [
    { key: 'general', label: 'General' },
    { key: 'configuration', label: 'Configuration' },
    { key: 'production', label: 'Production' },
    { key: 'materials', label: 'Materials' },
    { key: 'reports', label: 'Reports' },
    { key: 'administration', label: 'Administration' },
    { key: 'projects', label: 'Projects Hierarchy' },
  ]

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }))
  }

  const validate = () => {
    const nextErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Project name is required'
    if (!form.code.trim()) nextErrors.code = 'Project code is required'
    if (!form.system.trim()) nextErrors.system = 'System is required'
    if (!form.owner.trim()) nextErrors.owner = 'Enter an owner or team'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    const newProject = {
      id: `proj-${Date.now()}`,
      name: form.name,
      code: form.code,
      status: 'Draft',
      system: form.system,
      owner: form.owner,
      description: form.description,
    }

    dispatch({ type: 'addProject', project: newProject })
    setSuccess(`Project "${form.name}" added to the workspace.`)
    setForm({ name: '', code: '', system: '', owner: '', description: '' })
    setShowModal(false)
  }

  return (
    <CContainer fluid className="py-4">
      <CCard className="shadow-sm border-0 mb-4">
        <CCardHeader className="bg-white">
          <div className="d-flex flex-wrap align-items-center justify-content-between">
            <div className="fw-semibold">Production</div>
            <CButtonGroup role="group" aria-label="Production tabs">
              {navTabs.map((tab) => (
                <CButton
                  key={tab.key}
                  color="link"
                  className={`fw-semibold text-decoration-underline ${
                    activeTab === tab.key ? 'text-danger' : 'text-body'
                  }`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </CButton>
              ))}
            </CButtonGroup>
          </div>
        </CCardHeader>
      </CCard>

      {activeTab !== 'projects' ? (
        <CAlert color="secondary" className="mb-0">
          Select <span className="fw-semibold">Projects Hierarchy</span> to view and manage all projects. Other tabs will
          be wired as their modules are built.
        </CAlert>
      ) : (
        <CCard className="shadow-sm border-0">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <span className="fw-semibold">Projects Hierarchy</span>
            <CButton color="primary" size="sm" onClick={() => setShowModal(true)}>
              <CIcon icon={cilPlus} className="me-2" /> Add New Project
            </CButton>
          </CCardHeader>
          <CCardBody>
            {success && (
              <CAlert color="success" className="fw-semibold">
                <CIcon icon={cilCheckCircle} className="me-2" /> {success}
              </CAlert>
            )}

            {projects.length === 0 ? (
              <CAlert color="secondary" className="text-center mb-0">
                Start by adding a project to populate the navigation tree.
              </CAlert>
            ) : (
              <CTable hover responsive>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell scope="col">Code</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Description</CTableHeaderCell>
                    <CTableHeaderCell scope="col">System</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {projects.map((project) => (
                    <CTableRow
                      key={project.id}
                      active={activeProject?.id === project.id}
                      role="button"
                      onClick={() => dispatch({ type: 'setActiveProject', projectId: project.id })}
                    >
                      <CTableDataCell className="fw-semibold">{project.code}</CTableDataCell>
                      <CTableDataCell>{project.name}</CTableDataCell>
                      <CTableDataCell className="text-wrap" style={{ maxWidth: 320 }}>
                        {project.description}
                      </CTableDataCell>
                      <CTableDataCell>{project.system || '—'}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="warning" className="text-dark fw-semibold">
                          {project.status}
                        </CBadge>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            )}
          </CCardBody>
        </CCard>
      )}

      <CModal visible={showModal} onClose={() => setShowModal(false)} backdrop="static">
        <CModalHeader closeButton>
          <CModalTitle>Add New Project</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleSubmit}>
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
            <CFormInput
              label="System"
              name="system"
              value={form.system}
              onChange={handleInputChange}
              invalid={!!errors.system}
              feedbackInvalid={errors.system}
              className="mb-3"
              placeholder="e.g. Guidance, Propulsion"
            />
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
              label="Short Description"
              name="description"
              value={form.description}
              onChange={handleInputChange}
              className="mb-1"
              placeholder="What is this project about?"
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" variant="outline" onClick={() => setShowModal(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleSubmit}>
            <CIcon icon={cilPlus} className="me-2" /> Add Project
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  )
}

export default ProductionTreeView
