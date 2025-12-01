import React, { useState, useMemo } from 'react'
import {
  CCard, CCardHeader, CCardBody, CTable, CTableHead, CTableRow,
  CTableHeaderCell, CTableBody, CTableDataCell, CFormInput, CButton,
  CPagination, CPaginationItem
} from '@coreui/react'
import { cilCloudDownload } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const ViewIssues = () => {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const itemsPerPage = 5

  const issues = [
    { id: 'ISS-045', project: 'Guidance Controller', severity: 'High', assigned: 'Eng. Ahmed Raza', status: 'Open', remarks: 'Requires urgent fix' },
    { id: 'ISS-038', project: 'Power Unit Integration', severity: 'Medium', assigned: 'Eng. Ali Qureshi', status: 'In Progress', remarks: 'Parts replacement ongoing' },
    { id: 'ISS-022', project: 'Cooling System Module', severity: 'Low', assigned: 'Eng. Mariam Ali', status: 'Resolved', remarks: 'Tested and closed' },
  ]

  const filtered = useMemo(() => issues.filter(i =>
    Object.values(i).some(v => v.toString().toLowerCase().includes(search.toLowerCase()))
  ), [search, issues])

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const currentData = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  const exportCSV = () => {
    const csv = [
      ['ID', 'Project', 'Severity', 'Assigned Engineer', 'Status', 'Remarks'],
      ...filtered.map(i => [i.id, i.project, i.severity, i.assigned, i.status, i.remarks]),
    ].map(e => e.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'issues.csv'
    a.click()
  }

  return (
    <CCard className="shadow-sm border-0">
      <CCardHeader className="bg-dark text-white d-flex justify-content-between align-items-center">
        <strong>All Critical Issues</strong>
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
              <CTableHeaderCell>Severity</CTableHeaderCell>
              <CTableHeaderCell>Assigned</CTableHeaderCell>
              <CTableHeaderCell>Status</CTableHeaderCell>
              <CTableHeaderCell>Remarks</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {currentData.map((i) => (
              <CTableRow key={i.id}>
                <CTableDataCell>{i.id}</CTableDataCell>
                <CTableDataCell>{i.project}</CTableDataCell>
                <CTableDataCell>
                  <span className={`badge bg-${
                    i.severity === 'High' ? 'danger' :
                    i.severity === 'Medium' ? 'warning' : 'success'
                  }`}>{i.severity}</span>
                </CTableDataCell>
                <CTableDataCell>{i.assigned}</CTableDataCell>
                <CTableDataCell>
                  <span className={`badge bg-${
                    i.status === 'Resolved' ? 'success' :
                    i.status === 'In Progress' ? 'info' : 'danger'
                  }`}>{i.status}</span>
                </CTableDataCell>
                <CTableDataCell>{i.remarks}</CTableDataCell>
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

export default ViewIssues
