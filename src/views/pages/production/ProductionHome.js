// src/views/pages/production/ProductionHome.js
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { CCard, CCardBody, CCardHeader, CCol, CContainer, CRow } from '@coreui/react'

const ProductionHome = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch({ type: 'set', activeModule: 'production' })
  }, [dispatch])

  const buttons = [
    {
      label: 'Projects Hierarchy',
      description: 'This form allows Add, Delete, and Update Project Details that includes Project’s Configurations, Batches, Batteries and Project Documents.',
    },
    {
      label: 'Directorates And Sites',
      description: 'Here you can Add, Delete, Update and View Directorates, Sub-Directorates and Sites.',
    },
    {
      label: 'Part Types, Categories and Material Forms',
      description: 'Here you can Add, Delete, Update and View all possible Materials, Part Categories and Part Types.',
    },
    {
      label: 'Activities And Phases',
      description: 'Here you can Add, Delete, Update and View all possible Activities and Phases.',
    },
    {
      label: 'QC Test Names',
      description: 'Here you can Add, Delete, Update and View QC Test Types.',
    },
    {
      label: 'NCR Presentation New',
      description: '… (no detailed text provided)',
    },
    {
      label: 'NCR Reason',
      description: '… (no detailed text provided)',
    },
  ]

  const accentColors = ['primary', 'info', 'success', 'warning', 'danger', 'secondary']

  const renderButton = (action, idx) => {
    const accent = accentColors[idx % accentColors.length]

    return (
      <CCol key={`${action.label}-${idx}`} md={6} xl={4} className="d-flex">
        <CCard className="w-100 h-100 shadow-sm border-0 overflow-hidden">
          <div className={`px-3 pt-3 pb-2 border-start border-4 border-${accent} bg-light`}>
            <div className="text-uppercase small fw-semibold text-body-secondary">Production Setup</div>
            <div className="fw-semibold fs-5 text-dark lh-sm">{action.label}</div>
          </div>
          <CCardBody className="d-flex flex-column justify-content-between gap-3">
            <p className="mb-0 text-body-secondary lh-base">{action.description}</p>
            <div className="d-flex align-items-center justify-content-between text-primary fw-semibold">
              <span className="small">Open module</span>
              <span aria-hidden className="fs-5">→</span>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    )
  }

  return (
    <CContainer fluid className="py-4">
      <CCard className="shadow-sm border-0">
        <CCardHeader className="bg-primary text-white fw-semibold py-3">
          Production
        </CCardHeader>
        <CCardBody className="p-4">
          <CRow className="g-3">{buttons.map((action, idx) => renderButton(action, idx))}</CRow>
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default ProductionHome
