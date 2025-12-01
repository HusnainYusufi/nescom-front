// src/views/dashboard/ProductionTreeView.js
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import {
  CAlert,
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCardTitle,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormSelect,
  CListGroup,
  CListGroupItem,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilFactory,
  cilSettings,
  cilClipboard,
  cilLayers,
  cilPeople,
  cilCheckCircle,
  cilPlus,
} from '@coreui/icons'

const ProductionTreeView = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const projects = useSelector((state) => state.projects)
  const activeProjectId = useSelector((state) => state.activeProjectId)

  const [form, setForm] = useState({
    name: '',
    code: '',
    category: '',
    status: 'Draft',
    owner: '',
    description: '',
  })
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState('')

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

  const quickLinks = [
    { label: 'Project Hierarchy', icon: cilFactory, description: 'Manage project details, batches and documents.' },
    {
      label: 'Configuration Parts',
      icon: cilSettings,
      description: 'Add, delete, replace and revise parts under configurations.',
    },
    {
      label: 'Copy Configurations',
      icon: cilClipboard,
      description: 'Clone configurations into newly defined projects.',
    },
    {
      label: 'Categories & Material Forms',
      icon: cilLayers,
      description: 'Manage part categories and material forms.',
    },
    { label: 'Assign Auxiliary Material', icon: cilPeople, description: 'Assign auxiliary materials to selected parts.' },
  ]

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }))
  }

  const validate = () => {
    const nextErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Project name is required'
    if (!form.code.trim()) nextErrors.code = 'Project code is required'
    if (!form.category) nextErrors.category = 'Select a category'
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
      status: form.status,
      owner: form.owner,
      description: form.description,
    }

    dispatch({ type: 'addProject', project: newProject })
    setSuccess(`Project "${form.name}" added to the workspace.`)
    setForm({ name: '', code: '', category: '', status: 'Draft', owner: '', description: '' })
  }

  return (
    <CContainer fluid className="py-4">
      <CRow className="g-4">
        <CCol md={6} xl={5}>
          <CCard className="shadow-sm border-0 h-100">
            <CCardHeader className="bg-dark text-white d-flex align-items-center">
              <CIcon icon={cilPlus} className="me-2" /> Add New Project
            </CCardHeader>
            <CCardBody>
              {success && (
                <CAlert color="success" className="fw-semibold">
                  <CIcon icon={cilCheckCircle} className="me-2" /> {success}
                </CAlert>
              )}
              <CForm className="mt-2" onSubmit={handleSubmit}>
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
                  <option value="Aerial">Aerial</option>
                  <option value="Ballistic">Ballistic</option>
                  <option value="Naval">Naval</option>
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
                  label="Short Description"
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  className="mb-4"
                  placeholder="What is this project about?"
                />
                <div className="d-grid gap-2">
                  <CButton color="warning" type="submit" className="text-dark fw-semibold">
                    Add Project
                  </CButton>
                </div>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol md={6} xl={7}>
          <CCard className="shadow-sm border-0 mb-4">
            <CCardHeader className="bg-light fw-semibold">Projects at a glance</CCardHeader>
            <CCardBody>
              {projects.length === 0 ? (
                <CAlert color="secondary" className="text-center mb-0">
                  Start by adding a project to populate the navigation tree.
                </CAlert>
              ) : (
                <CListGroup flush>
                  {projects.map((project) => (
                    <CListGroupItem
                      key={project.id}
                      className={`d-flex justify-content-between align-items-center ${
                        activeProject?.id === project.id ? 'bg-body-secondary' : ''
                      }`}
                    >
                      <div>
                        <div className="fw-semibold">{project.name}</div>
                        <div className="small text-body-secondary">{project.description}</div>
                      </div>
                      <div className="text-end">
                        <CBadge color="warning" className="text-dark fw-semibold mb-1">
                          {project.status}
                        </CBadge>
                        <div className="small text-body-secondary">Owner: {project.owner}</div>
                      </div>
                    </CListGroupItem>
                  ))}
                </CListGroup>
              )}
            </CCardBody>
          </CCard>

          <CCard className="shadow-sm border-0">
            <CCardHeader className="bg-primary text-white fw-semibold">
              What would you like to do next?
            </CCardHeader>
            <CCardBody>
              <CRow className="g-3">
                {quickLinks.map((item, idx) => (
                  <CCol md={6} key={idx}>
                    <CCard className="h-100 border-0 bg-body-secondary bg-opacity-50">
                      <CCardBody>
                        <CCardTitle className="h6 d-flex align-items-center">
                          <CIcon icon={item.icon} className="me-2 text-primary" />
                          {item.label}
                        </CCardTitle>
                        <div className="small text-body-secondary mb-3">{item.description}</div>
                        <CButton
                          size="sm"
                          color="primary"
                          variant="outline"
                          onClick={() =>
                            dispatch({ type: 'setActiveProject', projectId: activeProject?.id || null })
                          }
                        >
                          Open from project tree
                        </CButton>
                      </CCardBody>
                    </CCard>
                  </CCol>
                ))}
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default ProductionTreeView
