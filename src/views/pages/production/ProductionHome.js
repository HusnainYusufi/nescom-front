// src/views/pages/production/ProductionHome.js
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilFactory,
  cilFolderOpen,
  cilPlus,
  cilClipboard,
  cilCheckCircle,
  cilLayers,
  cilChart,
  cilWarning,
} from '@coreui/icons'

const ProductionHome = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch({ type: 'set', activeModule: 'production' })
  }, [dispatch])

  const buildButton = (action) => (
    <Link
      key={action.to}
      to={action.to}
      className="btn btn-light border d-flex align-items-center justify-content-between text-start w-100"
    >
      <div className="d-flex align-items-center">
        <CIcon icon={action.icon} className="me-2 text-primary" />
        <span className="fw-semibold">{action.label}</span>
      </div>
      {action.note && <small className="text-body-secondary ms-3">{action.note}</small>}
    </Link>
  )

  const setupActions = [
    { label: 'Projects Hierarchy', to: '/production/treeview', icon: cilFactory, note: 'Browse and manage projects' },
    { label: 'Add Project', to: '/production/create-project', icon: cilPlus, note: 'Create a new project record' },
    { label: 'Add Set', to: '/production/add-set', icon: cilLayers, note: 'Attach sets to a project' },
    { label: 'Add Meeting', to: '/production/create-meeting', icon: cilClipboard, note: 'Schedule project meetings' },
    { label: 'Add Assembly Parts', to: '/production/add-assy-parts', icon: cilFolderOpen, note: 'Register assemblies and parts' },
    { label: 'Add Status', to: '/production/add-status', icon: cilCheckCircle, note: 'Record configuration status' },
    { label: 'Add PRM Status', to: '/production/add-prm-status', icon: cilCheckCircle, note: 'Track PRM milestones' },
    { label: 'Project Summary', to: '/production/project-summary', icon: cilChart, note: 'View a project rollup' },
  ]

  const viewActions = [
    { label: 'View Projects', to: '/production/view-projects', icon: cilFactory },
    { label: 'View Sets', to: '/production/view-sets', icon: cilLayers },
    { label: 'View Meetings', to: '/production/view-meetings', icon: cilClipboard },
    { label: 'View Assembly', to: '/production/view-assembly', icon: cilFolderOpen },
    { label: 'View Status', to: '/production/view-status', icon: cilCheckCircle },
    { label: 'View PRM', to: '/production/view-prm', icon: cilCheckCircle },
    { label: 'View Issues', to: '/production/view-issues', icon: cilWarning },
  ]

  return (
    <CContainer fluid className="py-4">
      <CRow className="g-4">
        <CCol lg={6}>
          <CCard className="shadow-sm border-0 h-100">
            <CCardHeader className="bg-primary text-white fw-semibold">Production Actions</CCardHeader>
            <CCardBody className="d-grid gap-3">{setupActions.map((action) => buildButton(action))}</CCardBody>
          </CCard>
        </CCol>

        <CCol lg={6}>
          <CCard className="shadow-sm border-0 h-100">
            <CCardHeader className="bg-dark text-white fw-semibold">Reports & Views</CCardHeader>
            <CCardBody className="d-grid gap-3">{viewActions.map((action) => buildButton(action))}</CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default ProductionHome
