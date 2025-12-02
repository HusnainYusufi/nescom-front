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
      description:
        "This form allows Add, Delete, and Update Project Details that includes Project’s Configurations, Batches, Batteries and Project Documents.",
    },
    {
      label: 'Directorates And Sites',
      description:
        'Here you can Add, Delete, Update and View Directorates, Sub-Directorates and Sites.',
    },
    {
      label: 'Part Types, Categories and Material Forms',
      description:
        'Here you can Add, Delete, Update and View all possible Materials, Part Categories and Part Types.',
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

  const renderButton = (action, idx) => (
    <CCol key={`${action.label}-${idx}`} md={6} xl={4} className="d-flex">
      <div
        role="button"
        className="btn btn-light border shadow-sm w-100 text-start p-3 d-flex flex-column h-100 gap-2 rounded-3"
      >
        <div className="fw-semibold lh-sm text-primary fs-6">{action.label}</div>
        <div className="text-body-secondary small lh-base flex-grow-1">{action.description}</div>
      </div>
    </CCol>
  )

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
