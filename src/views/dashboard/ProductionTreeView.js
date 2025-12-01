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
import { cilFactory, cilSettings, cilClipboard, cilLayers, cilPeople, cilCheckCircle, cilPlus } from '@coreui/icons'

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
  const [showModal, setShowModal] = useState(false)

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

  const generalSections = [
    {
      title: 'Projects Hierarchy',
      description:
        "This form allows Add, Delete, and Update Project Details including Project's Configurations, Batches and Project Documents.",
    },
    {
      title: 'Directories and Sites',
      description: 'Here you can Add, Delete, Update and view Directories, Sub-Directories and Sites.',
    },
    {
      title: 'Part Types, Categories and Material Forms',
      description: 'Here you can Add, Delete, Update and view all possible Materials, Part Categories and Part Types.',
    },
    {
      title: 'Sets and KTs',
      description: 'Here you can Add, Delete, Update and View Kt Test Types.',
    },
    {
      title: 'NCR Presentation New',
      description: 'This is presented in NCRs.',
    },
    {
      title: 'NCR Reason',
      description: 'Add and maintain reasons here.',
    },
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
    setShowModal(false)
  }

  return (
    <CContainer fluid className="py-4">
      <CRow className="g-4">
        <CCol lg={5} xl={4}>
          <CCard className="shadow-sm border-0 h-100">
            <CCardHeader className="bg-light fw-semibold">General Main Form now includes:</CCardHeader>
            <CCardBody>
              <CListGroup flush className="mb-3">
                {generalSections.map((item) => (
                  <CListGroupItem key={item.title} className="py-3">
                    <div className="fw-semibold text-primary">{item.title}</div>
                    <div className="small text-body-secondary">{item.description}</div>
                  </CListGroupItem>
                ))}
              </CListGroup>
              <CAlert color="secondary" className="mb-0">
                Use the project tree on the left to jump directly into a project&apos;s configuration areas.
              </CAlert>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol lg={7} xl={8}>
          <CCard className="shadow-sm border-0 mb-4">
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
                      <CTableHeaderCell scope="col">Owner</CTableHeaderCell>
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
                        <CTableDataCell>{project.owner}</CTableDataCell>
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

          <CCard className="shadow-sm border-0">
            <CCardHeader className="bg-primary text-white fw-semibold">
              Configuration & Navigation
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
