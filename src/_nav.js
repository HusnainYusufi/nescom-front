// src/_nav.js
import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilFactory,
  cilSettings,
  cilBolt,
  cilChart,
  cilWarning,
  cilLayers,
} from '@coreui/icons'
import { CNavTitle, CNavItem, CNavGroup } from '@coreui/react'

const _nav = [
  // Dashboard
  {
    component: CNavTitle,
    name: 'Dashboard',
  },
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },

  // 🔧 Production Module
  {
    component: CNavTitle,
    name: 'Production Module',
  },
  {
    component: CNavGroup,
    name: 'Production',
    to: '/production',
    icon: <CIcon icon={cilFactory} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Create Project',
        to: '/production/create-project',
        icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Add Set',
        to: '/production/add-set',
        icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Create Meeting',
        to: '/production/create-meeting',
        icon: <CIcon icon={cilBolt} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Add Assembly Parts',
        to: '/production/add-assy-parts',
        icon: <CIcon icon={cilLayers} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Add Status',
        to: '/production/add-status',
        icon: <CIcon icon={cilChart} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Add PRM Status',
        to: '/production/add-prm-status',
        icon: <CIcon icon={cilChart} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Add Critical Issue',
        to: '/production/add-critical-issue',
        icon: <CIcon icon={cilWarning} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Project Summary',
        to: '/production/project-summary',
        icon: <CIcon icon={cilFactory} customClassName="nav-icon" />,
      },
    ],
  },
]

export default _nav
