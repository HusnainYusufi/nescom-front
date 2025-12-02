// src/views/dashboard/ProductionTreeView.js
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
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
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilFolderOpen, cilLayers, cilPlus, cilSettings } from '@coreui/icons'

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
  const [expandedNodes, setExpandedNodes] = useState({})

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

  const projectSections = [
    { key: 'general', label: 'General', icon: cilFolderOpen },
    { key: 'configuration', label: 'Configuration', icon: cilSettings },
    { key: 'production', label: 'Production', icon: cilLayers },
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

  const baseTree = [
    {
      id: 'configurations',
      label: 'Configurations',
      children: [
        { id: 'batches', label: 'Batches' },
        { id: 'batteries', label: 'Batteries' },
        { id: 'documents', label: 'Project Documents' },
      ],
    },
    {
      id: 'production',
      label: 'Production',
      children: [
        { id: 'sets', label: 'Sets' },
        { id: 'assemblies', label: 'Assemblies' },
        { id: 'parts', label: 'Parts' },
      ],
    },
  ]

  const toggleNode = (nodeId) => {
    setExpandedNodes((prev) => ({ ...prev, [nodeId]: !prev[nodeId] }))
  }

  const renderNode = (node, depth = 0, prefix = '') => {
    const hasChildren = node.children && node.children.length > 0
    const id = `${prefix}${node.id}`
    const isExpanded = expandedNodes[id] ?? depth === 0

    return (
      <li key={id} className="mb-1">
        <div
          className="d-flex align-items-center gap-2"
          role="button"
          onClick={() => (hasChildren ? toggleNode(id) : null)}
          style={{ paddingLeft: depth * 14 }}
        >
          {hasChildren ? (
            <span className="text-muted small" style={{ width: 12 }}>
              {isExpanded ? '▾' : '▸'}
            </span>
          ) : (
            <span className="text-muted small" style={{ width: 12 }}>
              •
            </span>
          )}
          <span className="small text-body">{node.label}</span>
        </div>
        {hasChildren && isExpanded && (
          <ul className="list-unstyled ms-0 mt-1 mb-0 border-start border-secondary-subtle ps-3">
            {node.children.map((child) => renderNode(child, depth + 1, `${id}-`))}
          </ul>
        )}
      </li>
    )
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
      <CRow className="g-4">
        <CCol lg={4} xl={3} className="order-lg-1 order-2">
          <CCard className="shadow-sm border-0 h-100">
            <CCardHeader className="bg-dark text-white d-flex align-items-center justify-content-between">
              <span className="fw-semibold">Projects Hierarchy</span>
              <CButton color="warning" size="sm" className="text-dark fw-semibold" onClick={() => setShowAddModal(true)}>
                <CIcon icon={cilPlus} className="me-1" /> Add Project
              </CButton>
            </CCardHeader>
            <CCardBody style={{ maxHeight: 'calc(100vh - 220px)', overflowY: 'auto' }}>
              {projects.length === 0 ? (
                <div className="small text-body-secondary">No projects yet. Start by adding one.</div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className={`p-3 rounded-3 border ${
                        activeProjectId === project.id
                          ? 'border-warning bg-warning-subtle'
                          : 'border-secondary-subtle'
                      }`}
                    >
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <div className="fw-semibold">{project.name}</div>
                          <div className="text-body-secondary small">{project.code}</div>
                          <div className="text-body-secondary small">System: {project.system || '—'}</div>
                        </div>
                        <CBadge color="warning" className="text-dark fw-semibold">
                          {project.status}
                        </CBadge>
                      </div>
                      <CListGroup flush className="mb-3">
                        {projectSections.map((section) => (
                          <CListGroupItem
                            key={`${project.id}-${section.key}`}
                            action
                            active={activeProject?.id === project.id}
                            onClick={() => dispatch({ type: 'setActiveProject', projectId: project.id })}
                            className="d-flex align-items-center gap-2"
                          >
                            <CIcon icon={section.icon} className="text-warning" /> {section.label}
                          </CListGroupItem>
                        ))}
                      </CListGroup>
                      <div className="fw-semibold small mb-2">Tree</div>
                      <ul className="list-unstyled mb-0">
                        {renderNode(
                          {
                            id: project.id,
                            label: `${project.name} (${project.code})`,
                            children: baseTree,
                          },
                          0,
                          `${project.id}-`,
                        )}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>

        <CCol lg={8} xl={9} className="order-lg-2 order-1">
          <CCard className="shadow-sm border-0">
            <CCardHeader className="bg-primary text-white fw-semibold">Projects</CCardHeader>
            <CCardBody className="p-0">
              <CTable hover responsive className="mb-0">
                <CTableHead className="bg-body-secondary">
                  <CTableRow>
                    <CTableHeaderCell scope="col">Code</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Description</CTableHeaderCell>
                    <CTableHeaderCell scope="col">System</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
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
                        <CTableDataCell className="fw-semibold">{project.code}</CTableDataCell>
                        <CTableDataCell>{project.name}</CTableDataCell>
                        <CTableDataCell className="text-wrap" style={{ maxWidth: '420px' }}>
                          {project.description}
                        </CTableDataCell>
                        <CTableDataCell>{project.system || '—'}</CTableDataCell>
                        <CTableDataCell>
                          <CBadge color="warning" className="text-dark fw-semibold">
                            {project.status}
                          </CBadge>
                        </CTableDataCell>
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
