import React, { useState, useMemo } from 'react'
import {
  CCard, CCardHeader, CCardBody, CTable, CTableHead, CTableRow,
  CTableHeaderCell, CTableBody, CTableDataCell, CFormInput, CButton,
  CPagination, CPaginationItem
} from '@coreui/react'
import { cilCloudDownload } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const ViewSets = () => {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const itemsPerPage = 5

  const sets = [
    { id: 'S-001', project: 'Aerial Defense System', name: 'Main Wing Assembly', supervisor: 'Eng. Nida Khan', parts: 25, progress: '85%' },
    { id: 'S-002', project: 'Radar Control Unit', name: 'Signal Processor Set', supervisor: 'Eng. Rafiq Ahmed', parts: 18, progress: '70%' },
    { id: 'S-003', project: 'Cruise Launcher Mk-II', name: 'Engine Control Set', supervisor: 'Eng. Murtaza Ali', parts: 30, progress: '60%' },
    { id: 'S-004', project: 'Thermal Imaging Core', name: 'Sensor Array Set', supervisor: 'Eng. Fatima Noor', parts: 22, progress: '90%' },
    { id: 'S-005', project: 'Guidance Controller', name: 'Gyro Stabilizer Set', supervisor: 'Eng. Bilal Ashraf', parts: 16, progress: '75%' },
  ]

  const filtered = useMemo(() => {
    return sets.filter(s =>
      Object.values(s).some(v => v.toString().toLowerCase().includes(search.toLowerCase()))
    )
  }, [search, sets])

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const currentData = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  const exportCSV = () => {
    const csv = [
      ['ID', 'Project', 'Set Name', 'Supervisor', 'Parts Count', 'Progress'],
      ...filtered.map(s => [s.id, s.project, s.name, s.supervisor, s.parts, s.progress]),
    ].map(e => e.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sets.csv'
    a.click()
  }

  return (
    <CCard className="shadow-sm border-0">
      <CCardHeader className="bg-dark text-white d-flex justify-content-between align-items-center">
        <strong>All Sets</strong>
        <div className="d-flex gap-2">
          <CFormInput
            type="text"
            size="sm"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <CButton color="success" size="sm" onClick={exportCSV}>
            <CIcon icon={cilCloudDownload} className="me-1" /> Export CSV
          </CButton>
        </div>
      </CCardHeader>

      <CCardBody>
        <CTable striped hover responsive bordered align="middle">
          <CTableHead color="dark">
            <CTableRow>
              <CTableHeaderCell>ID</CTableHeaderCell>
              <CTableHeaderCell>Project</CTableHeaderCell>
              <CTableHeaderCell>Set Name</CTableHeaderCell>
              <CTableHeaderCell>Supervisor</CTableHeaderCell>
              <CTableHeaderCell>Parts Count</CTableHeaderCell>
              <CTableHeaderCell>Progress</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {currentData.map((s) => (
              <CTableRow key={s.id}>
                <CTableDataCell>{s.id}</CTableDataCell>
                <CTableDataCell>{s.project}</CTableDataCell>
                <CTableDataCell>{s.name}</CTableDataCell>
                <CTableDataCell>{s.supervisor}</CTableDataCell>
                <CTableDataCell>{s.parts}</CTableDataCell>
                <CTableDataCell>
                  <span className="badge bg-info">{s.progress}</span>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <span className="text-muted small">
            Showing {currentData.length} of {filtered.length} entries
          </span>
          <CPagination align="end">
            {[...Array(totalPages)].map((_, i) => (
              <CPaginationItem
                key={i}
                active={i + 1 === page}
                onClick={() => setPage(i + 1)}
                style={{ cursor: 'pointer' }}
              >
                {i + 1}
              </CPaginationItem>
            ))}
          </CPagination>
        </div>
      </CCardBody>
    </CCard>
  )
}

export default ViewSets
