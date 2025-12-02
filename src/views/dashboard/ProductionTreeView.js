// src/views/dashboard/ProductionTreeView.js
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CFormInput,
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
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
import { cilPlus } from '@coreui/icons'

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
    system: '',
    description: '',
  })
  const [errors, setErrors] = useState({})
  const [showAddModal, setShowAddModal] = useState(false)

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
    if (!form.system.trim()) nextErrors.system = 'Specify the system this project belongs to'
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
      system: form.system,
      description: form.description,
    }

    dispatch({ type: 'addProject', project: newProject })
    setForm({ name: '', code: '', category: '', status: 'Draft', owner: '', system: '', description: '' })
    setShowAddModal(false)
  }

  return (
    <CContainer fluid className="py-4">
      <CNav variant="tabs" className="mb-3">
        <CNavItem>
          <CNavLink active>General</CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink disabled>Configuration</CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink disabled>Production</CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink disabled>Materials</CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink disabled>Reports</CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink disabled>Administration</CNavLink>
        </CNavItem>
      </CNav>
      <CRow>
        <CCol xs={12}>
          <CCard className="shadow-sm border-0">
            <CCardHeader className="bg-primary text-white d-flex align-items-center justify-content-between">
              <span className="fw-semibold">Projects Hierarchy</span>
              <CButton color="warning" size="sm" className="text-dark fw-semibold" onClick={() => setShowAddModal(true)}>
                <CIcon icon={cilPlus} className="me-1" /> Add Project
              </CButton>
            </CCardHeader>
            <CCardBody className="p-0">
              <CTable hover responsive className="mb-0 align-middle">
                <CTableHead className="bg-body-secondary text-uppercase">
                  <CTableRow>
                    <CTableHeaderCell scope="col" style={{ width: '64px' }}></CTableHeaderCell>
                    <CTableHeaderCell scope="col">Code*</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Name*</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Description</CTableHeaderCell>
                    <CTableHeaderCell scope="col">System</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  <CTableRow role="button" onClick={() => setShowAddModal(true)} className="bg-light">
                    <CTableDataCell colSpan={5} className="fw-semibold text-primary">
                      Please click here to add new row...
                    </CTableDataCell>
                  </CTableRow>
                  {projects.length === 0 ? (
                    <CTableRow>
                      <CTableDataCell colSpan={5} className="text-center text-body-secondary py-4">
                        No projects available. Use the Add Project button to create one.
                      </CTableDataCell>
                    </CTableRow>
                  ) : (
                    projects.map((project) => (
                      <CTableRow
                        key={project.id}
                        active={activeProjectId === project.id}
                        role="button"
                        onClick={() => dispatch({ type: 'setActiveProject', projectId: project.id })}
                      >
                        <CTableDataCell className="text-body-secondary">▸</CTableDataCell>
                        <CTableDataCell className="fw-semibold">{project.code}</CTableDataCell>
                        <CTableDataCell>{project.name}</CTableDataCell>
                        <CTableDataCell className="text-wrap" style={{ maxWidth: '640px' }}>
                          {project.description || '—'}
                        </CTableDataCell>
                        <CTableDataCell>{project.system || '—'}</CTableDataCell>
                      </CTableRow>
                    ))
                  )}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

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
