import React, { useState, useMemo } from 'react'
import {
  CCard, CCardHeader, CCardBody, CTable, CTableHead, CTableRow,
  CTableHeaderCell, CTableBody, CTableDataCell, CFormInput, CButton,
  CPagination, CPaginationItem
} from '@coreui/react'
import { cilCloudDownload } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const ViewAssembly = () => {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const itemsPerPage = 5

  const assemblies = [
    { id: 'A-001', project: 'Radar Control Unit', name: 'Signal Processor Assembly', parts: 18, supervisor: 'Eng. Imran Khan', status: 'In Progress' },
    { id: 'A-002', project: 'Cruise Launcher Mk-II', name: 'Engine Mount Assembly', parts: 22, supervisor: 'Eng. Rafiq Ahmed', status: 'Pending' },
    { id: 'A-003', project: 'Aerial Defense System', name: 'Launcher Assembly', parts: 30, supervisor: 'Eng. Saad Qureshi', status: 'Completed' },
  ]

  const filtered = useMemo(() => assemblies.filter(a =>
    Object.values(a).some(v => v.toString().toLowerCase().includes(search.toLowerCase()))
  ), [search, assemblies])

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const currentData = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  const exportCSV = () => {
    const csv = [
      ['ID', 'Project', 'Assembly Name', 'Parts Count', 'Supervisor', 'Status'],
      ...filtered.map(a => [a.id, a.project, a.name, a.parts, a.supervisor, a.status]),
    ].map(e => e.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'assemblies.csv'
    a.click()
  }

  return (
    <CCard className="shadow-sm border-0">
      <CCardHeader className="bg-dark text-white d-flex justify-content-between align-items-center">
        <strong>All Assembly Parts</strong>
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
              <CTableHeaderCell>Assembly Name</CTableHeaderCell>
              <CTableHeaderCell>Parts Count</CTableHeaderCell>
              <CTableHeaderCell>Supervisor</CTableHeaderCell>
              <CTableHeaderCell>Status</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {currentData.map((a) => (
              <CTableRow key={a.id}>
                <CTableDataCell>{a.id}</CTableDataCell>
                <CTableDataCell>{a.project}</CTableDataCell>
                <CTableDataCell>{a.name}</CTableDataCell>
                <CTableDataCell>{a.parts}</CTableDataCell>
                <CTableDataCell>{a.supervisor}</CTableDataCell>
                <CTableDataCell>
                  <span className={`badge bg-${
                    a.status === 'Completed' ? 'success' :
                    a.status === 'In Progress' ? 'info' : 'warning'
                  }`}>{a.status}</span>
                </CTableDataCell>
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

export default ViewAssembly
