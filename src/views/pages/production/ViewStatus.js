import React, { useState, useMemo } from 'react'
import {
  CCard, CCardHeader, CCardBody, CTable, CTableHead, CTableRow,
  CTableHeaderCell, CTableBody, CTableDataCell, CFormInput, CButton,
  CPagination, CPaginationItem
} from '@coreui/react'
import { cilCloudDownload } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const ViewStatus = () => {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const itemsPerPage = 5

  const statuses = [
    { id: 'ST-001', project: 'Aerial Defense System', part: 'Launcher Tube', current: 'In Progress', updated: '2025-11-03', remarks: 'Testing phase' },
    { id: 'ST-002', project: 'Radar Control Unit', part: 'Signal Board', current: 'Completed', updated: '2025-10-29', remarks: 'QA done' },
    { id: 'ST-003', project: 'Thermal Imaging Core', part: 'Sensor Module', current: 'Pending', updated: '2025-11-01', remarks: 'Awaiting review' },
  ]

  const filtered = useMemo(() => statuses.filter(s =>
    Object.values(s).some(v => v.toString().toLowerCase().includes(search.toLowerCase()))
  ), [search, statuses])

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const currentData = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  const exportCSV = () => {
    const csv = [
      ['ID', 'Project', 'Part', 'Status', 'Last Updated', 'Remarks'],
      ...filtered.map(s => [s.id, s.project, s.part, s.current, s.updated, s.remarks]),
    ].map(e => e.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'status.csv'
    a.click()
  }

  return (
    <CCard className="shadow-sm border-0">
      <CCardHeader className="bg-dark text-white d-flex justify-content-between align-items-center">
        <strong>All Status</strong>
        <div className="d-flex gap-2">
          <CFormInput type="text" size="sm" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <CButton color="success" size="sm" onClick={exportCSV}><CIcon icon={cilCloudDownload} className="me-1" /> Export CSV</CButton>
        </div>
      </CCardHeader>
      <CCardBody>
        <CTable striped hover responsive bordered align="middle">
          <CTableHead color="dark">
            <CTableRow>
              <CTableHeaderCell>ID</CTableHeaderCell>
              <CTableHeaderCell>Project</CTableHeaderCell>
              <CTableHeaderCell>Part</CTableHeaderCell>
              <CTableHeaderCell>Status</CTableHeaderCell>
              <CTableHeaderCell>Updated</CTableHeaderCell>
              <CTableHeaderCell>Remarks</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {currentData.map((s) => (
              <CTableRow key={s.id}>
                <CTableDataCell>{s.id}</CTableDataCell>
                <CTableDataCell>{s.project}</CTableDataCell>
                <CTableDataCell>{s.part}</CTableDataCell>
                <CTableDataCell><span className={`badge bg-${
                  s.current === 'Completed' ? 'success' :
                  s.current === 'In Progress' ? 'info' : 'warning'
                }`}>{s.current}</span></CTableDataCell>
                <CTableDataCell>{s.updated}</CTableDataCell>
                <CTableDataCell>{s.remarks}</CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
        <PaginationInfo filtered={filtered} currentData={currentData} page={page} totalPages={totalPages} setPage={setPage} />
      </CCardBody>
    </CCard>
  )
}

const PaginationInfo = ({ filtered, currentData, page, totalPages, setPage }) => (
  <div className="d-flex justify-content-between align-items-center mt-3">
    <span className="text-muted small">Showing {currentData.length} of {filtered.length} entries</span>
    <CPagination align="end">
      {[...Array(totalPages)].map((_, i) => (
        <CPaginationItem key={i} active={i + 1 === page} onClick={() => setPage(i + 1)} style={{ cursor: 'pointer' }}>
          {i + 1}
        </CPaginationItem>
      ))}
    </CPagination>
  </div>
)

export default ViewStatus
