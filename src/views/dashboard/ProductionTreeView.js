// src/views/dashboard/ProductionTreeView.js
import React from 'react'
import { useSelector } from 'react-redux'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CAlert,
  CBadge,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilFactory } from '@coreui/icons'

const ProductionTreeView = () => {
  // ⛓ Get live selection data from Redux (updated by sidebar)
  const selection = useSelector((state) => state.selection)

  // Check if nothing selected yet
  const isEmpty =
    !selection.project &&
    !selection.set &&
    !selection.component &&
    !selection.assembly &&
    !selection.part

  if (isEmpty) {
    return (
      <div className="p-4">
        <CCard className="shadow-sm border-0">
          <CCardHeader className="bg-dark text-white">
            <CIcon icon={cilFactory} className="me-2" />
            Production Overview
          </CCardHeader>
          <CCardBody>
            <CAlert color="secondary" className="text-center">
              Please select a project, set, component, and part from the left treeview.
            </CAlert>
          </CCardBody>
        </CCard>
      </div>
    )
  }

  // ✅ Dynamic table view
  return (
    <div className="p-4">
      <CCard className="shadow-sm border-0 fade-in">
        <CCardHeader className="bg-dark text-white">
          <CIcon icon={cilFactory} className="me-2" />
          Current Production Selection
        </CCardHeader>
        <CCardBody>
          <CTable bordered hover responsive className="align-middle text-center">
            <CTableHead color="dark">
              <CTableRow>
                <CTableHeaderCell>Project</CTableHeaderCell>
                <CTableHeaderCell>Set</CTableHeaderCell>
                <CTableHeaderCell>Component</CTableHeaderCell>
                <CTableHeaderCell>Assembly</CTableHeaderCell>
                <CTableHeaderCell>Part</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow>
                <CTableDataCell>
                  {selection.project ? (
                    <CBadge color="info" className="px-3 py-2">
                      {selection.project}
                    </CBadge>
                  ) : (
                    '—'
                  )}
                </CTableDataCell>
                <CTableDataCell>
                  {selection.set ? (
                    <CBadge color="secondary" className="px-3 py-2">
                      {selection.set}
                    </CBadge>
                  ) : (
                    '—'
                  )}
                </CTableDataCell>
                <CTableDataCell>
                  {selection.component ? (
                    <CBadge color="success" className="px-3 py-2">
                      {selection.component}
                    </CBadge>
                  ) : (
                    '—'
                  )}
                </CTableDataCell>
                <CTableDataCell>
                  {selection.assembly ? (
                    <CBadge color="warning" className="px-3 py-2">
                      {selection.assembly}
                    </CBadge>
                  ) : (
                    '—'
                  )}
                </CTableDataCell>
                <CTableDataCell>
                  {selection.part ? (
                    <CBadge color="danger" className="px-3 py-2">
                      {selection.part}
                    </CBadge>
                  ) : (
                    '—'
                  )}
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      <style>
        {`
          .fade-in { animation: fadeIn 0.3s ease-in-out; }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  )
}

export default ProductionTreeView
