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
  cilMap,
  cilTags,
  cilTask,
  cilCheckCircle,
  cilWarning,
  cilListRich,
} from '@coreui/icons'

const ProductionHome = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch({ type: 'set', activeModule: 'production' })
  }, [dispatch])

  const buildButton = (action) => (
    <Link key={action.to} to={action.to} className="btn btn-light border text-start w-100 py-3">
      <div className="d-flex align-items-center mb-1">
        <CIcon icon={action.icon} className="me-2 text-primary" />
        <span className="fw-semibold">{action.label}</span>
        {action.note && <small className="text-body-secondary ms-2">{action.note}</small>}
      </div>
      {action.description && <div className="text-body-secondary small lh-sm">{action.description}</div>}
    </Link>
  )

  const setupActions = [
    {
      label: 'Projects Hierarchy',
      to: '/production/treeview',
      icon: cilFactory,
      description:
        "Add, delete, and update project details including configurations, batches, batteries, and documents.",
    },
    {
      label: 'Add Project',
      to: '/production/create-project',
      icon: cilPlus,
      description: 'Create a new project record with essential configuration and scheduling details.',
    },
    {
      label: 'Add Set',
      to: '/production/add-set',
      icon: cilLayers,
      description: 'Define directorates, sub-directorates, or site-level sets to organize production work.',
    },
    {
      label: 'Add Meeting',
      to: '/production/create-meeting',
      icon: cilClipboard,
      description: 'Schedule, document, and follow up on production coordination meetings.',
    },
    {
      label: 'Add Assembly Parts',
      to: '/production/add-assy-parts',
      icon: cilFolderOpen,
      description: 'Register assemblies, parts, materials, and related categories for the project.',
    },
    {
      label: 'Add Status',
      to: '/production/add-status',
      icon: cilCheckCircle,
      description: 'Capture activity and phase status updates to keep production tracking current.',
    },
    {
      label: 'Add PRM Status',
      to: '/production/add-prm-status',
      icon: cilCheckCircle,
      description: 'Record QC or PRM milestones, tests, and readiness indicators.',
    },
    {
      label: 'Project Summary',
      to: '/production/project-summary',
      icon: cilChart,
      description: 'Review a consolidated snapshot of project progress and open items.',
    },
  ]

  const viewActions = [
    {
      label: 'View Projects',
      to: '/production/view-projects',
      icon: cilFactory,
      description: 'Browse all projects with quick access to configurations, documents, and milestones.',
    },
    {
      label: 'View Sets',
      to: '/production/view-sets',
      icon: cilLayers,
      description: 'Review directorates, sub-directorates, or location sets linked to each project.',
    },
    {
      label: 'View Meetings',
      to: '/production/view-meetings',
      icon: cilClipboard,
      description: 'See upcoming and past coordination meetings with agendas and outcomes.',
    },
    {
      label: 'View Assembly',
      to: '/production/view-assembly',
      icon: cilFolderOpen,
      description: 'Look up assembly structures, parts, and material references for your builds.',
    },
    {
      label: 'View Status',
      to: '/production/view-status',
      icon: cilCheckCircle,
      description: 'Track activity and phase progress with the latest reported statuses.',
    },
    {
      label: 'View PRM',
      to: '/production/view-prm',
      icon: cilCheckCircle,
      description: 'Check QC/PRM readiness, completed tests, and pending verifications.',
    },
    {
      label: 'View Issues',
      to: '/production/view-issues',
      icon: cilWarning,
      description: 'Review NCRs, reasons, and related issues that require attention.',
    },
  ]

  return (
    <CContainer fluid className="py-4">
      <CCard className="shadow-sm border-0">
        <CCardHeader className="bg-primary text-white fw-semibold">
          Production Setup & Navigation
        </CCardHeader>
        <CCardBody>
          <CRow className="g-3">{buttons.map((action) => renderButton(action))}</CRow>
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default ProductionHome
