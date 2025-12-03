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
        name: 'Projects Hierarchy',
        to: '/production/treeview',
        icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Qualification Tests',
        to: '/production/qualification-tests',
        icon: <CIcon icon={cilLayers} customClassName="nav-icon" />,
      },
    ],
  },
]

export default _nav
