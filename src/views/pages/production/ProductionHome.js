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
import { cilChevronRight, cilLibraryAdd } from '@coreui/icons'

const ProductionHome = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch({ type: 'set', activeModule: 'production' })
  }, [dispatch])

  const buildButton = (action) => (
    <Link
      key={action.label}
      to={action.to}
      className="btn btn-outline-primary bg-white text-start w-100 p-4 shadow-sm border-2 rounded-4 d-flex justify-content-between align-items-center"
    >
      <div>
        <div className="d-flex align-items-center gap-2 mb-1">
          <CIcon icon={cilLibraryAdd} className="text-primary" />
          <span className="fw-bold fs-5 text-primary">{action.label}</span>
        </div>
        <small className="text-body-secondary">{action.description}</small>
      </div>
      <CIcon icon={cilChevronRight} className="text-primary" size="lg" />
    </Link>
  )

  const actions = [
    {
      label: 'Projects Hierarchy',
      description:
        "This form allows Add, Delete, and Update Project Details that includes Project's Configurations, Batches, Batteries and Project Documents.",
      to: '/production/treeview',
    },
    {
      label: 'Directorates And Sites',
      description: 'Here you can Add, Delete, and Update Directorates, Sub-Directorates and Sites.',
      to: '#',
    },
    {
      label: 'Part Types, Categories and Material Forms',
      description: 'Here you can Add, Delete, Update and view all possible Materials, Part Categories and Part Types.',
      to: '#',
    },
    {
      label: 'Activities And Phases',
      description: 'Here you can Add, Delete, Update and View all possible Activities and Phases.',
      to: '#',
    },
    {
      label: 'QC Test Names',
      description: 'Here you can Add, Delete, Update and View all QC Test Names.',
      to: '#',
    },
    {
      label: 'NCR Presentation',
      description: 'New NCR form.',
      to: '#',
    },
    {
      label: 'NCR Reason',
      description: 'New NCR form.',
      to: '#',
    },
  ]

  return (
    <CContainer fluid className="py-4">
      <CCard className="border-0 shadow-sm rounded-4 overflow-hidden">
        <CCardHeader className="bg-primary text-white py-3">
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between">
            <div>
              <div className="fw-bold fs-5">Production</div>
              <small className="text-white-50">General Main Form now includes:</small>
            </div>
            <span className="badge bg-white text-primary fw-semibold px-3 py-2">Production Suite</span>
          </div>
        </CCardHeader>
        <CCardBody className="bg-light">
          <CRow className="g-3">
            {actions.map((action) => (
              <CCol key={action.label} xs={12} md={6} xl={4}>
                {buildButton(action)}
              </CCol>
            ))}
          </CRow>
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default ProductionHome
