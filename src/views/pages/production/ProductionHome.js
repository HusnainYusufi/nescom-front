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
import { cilArrowRight } from '@coreui/icons'

const ProductionHome = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch({ type: 'set', activeModule: 'production' })
  }, [dispatch])

  const buttons = [
    {
      label: 'Projects Hierarchy',
      to: '/production/treeview',
      description: "This form allows Add, Delete, and Update Project Details that includes Project’s Configurations, Batches, Batteries and Project Documents.",
    },
    {
      label: 'Directorates And Sites',
      to: '/production/add-set',
      description:
        'Here you can Add, Delete, Update and View Directorates, Sub-Directorates and Sites.',
    },
    {
      label: 'Part Types, Categories and Material Forms',
      to: '/production/add-assy-parts',
      description: 'Here you can Add, Delete, Update and View all possible Materials, Part Categories and Part Types.',
    },
    {
      label: 'Activities And Phases',
      to: '/production/add-status',
      description: 'Here you can Add, Delete, Update and View all possible Activities and Phases.',
    },
    {
      label: 'QC Test Names',
      to: '/production/add-prm-status',
      description: 'Here you can Add, Delete, Update and View QC Test Types.',
    },
    {
      label: 'NCR Presentation New',
      to: '/production/view-issues',
      description: '…. (no detailed text provided)',
    },
    {
      label: 'NCR Reason',
      to: '/production/view-issues',
      description: '…. (no detailed text provided)',
    },
  ]

  const renderButton = (action) => (
    <CCol key={action.to + action.label} md={6} xl={4} className="d-flex">
      <Link
        to={action.to}
        className="btn btn-light border shadow-sm w-100 text-start p-3 d-flex flex-column h-100 gap-2"
      >
        <div className="d-flex align-items-start justify-content-between">
          <div className="fw-semibold lh-sm">{action.label}</div>
          <CIcon icon={cilArrowRight} className="text-primary" />
        </div>
        <div className="text-body-secondary small lh-sm flex-grow-1">{action.description}</div>
      </Link>
    </CCol>
  )

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
