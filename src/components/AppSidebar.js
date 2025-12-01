// src/components/AppSidebar.js
import React, { useState, useEffect } from 'react'
import {
  CSidebar,
  CSidebarHeader,
  CSidebarNav,
  CNavTitle,
  CFormSelect,
  CCard,
  CCardBody,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilFactory,
  cilLayers,
  cilSettings,
  cilClipboard,
  cilMoney,
  cilSpeedometer,
} from '@coreui/icons'
import { useSelector, useDispatch } from 'react-redux'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const activeModule = useSelector((state) => state.activeModule)

  // ─── Mock Data ───
  const mockProductionData = [
    {
      project: 'S2',
      sets: [
        {
          name: 'S3',
          components: [
            {
              name: 'Electrical',
              assemblies: [{ name: 'Main Wiring', parts: ['E-01', 'E-02'] }],
            },
            {
              name: 'Structure',
              assemblies: [
                { name: 'NOSE', parts: ['N-01', 'N-02'] },
                { name: 'FEC', parts: ['F-01', 'F-02', 'F-03'] },
                { name: 'WH', parts: ['W-01', 'W-02'] },
                { name: 'IC', parts: ['I-01'] },
                { name: 'TCS', parts: ['T-01', 'T-02'] },
              ],
            },
            { name: 'Composite', assemblies: [{ name: 'Shell Integration', parts: ['C-01', 'C-02'] }] },
            { name: 'Pyros', assemblies: [{ name: 'Ignition System', parts: ['P-01', 'P-02'] }] },
            { name: 'GNC', assemblies: [{ name: 'Guidance Module', parts: ['G-01', 'G-02'] }] },
          ],
        },
      ],
    },
  ]

  const mockFinancialData = [
    {
      project: '2025 R&D Budget',
      departments: [
        { name: 'Engineering', expenses: ['Procurement', 'Testing'] },
        { name: 'Operations', expenses: ['Maintenance', 'Logistics'] },
      ],
    },
  ]

  // ─── State ───
  const [selectedProject, setSelectedProject] = useState('')
  const [selectedSet, setSelectedSet] = useState('')
  const [selectedComponent, setSelectedComponent] = useState('')
  const [selectedAssembly, setSelectedAssembly] = useState('')
  const [selectedPart, setSelectedPart] = useState('')

  // ─── Lookup Helpers ───
  const currentProject = mockProductionData.find((p) => p.project === selectedProject)
  const currentSet = currentProject?.sets.find((s) => s.name === selectedSet)
  const currentComponent = currentSet?.components.find((c) => c.name === selectedComponent)
  const currentAssembly = currentComponent?.assemblies.find((a) => a.name === selectedAssembly)

  // ─── 🔄 Dispatch selection to Redux whenever changed ───
  useEffect(() => {
    dispatch({
      type: 'updateSelection',
      selection: {
        project: selectedProject || null,
        set: selectedSet || null,
        component: selectedComponent || null,
        assembly: selectedAssembly || null,
        part: selectedPart || null,
      },
    })
  }, [selectedProject, selectedSet, selectedComponent, selectedAssembly, selectedPart])

  // ─── Production Selector ───
  const renderProductionSelector = () => (
    <CCard className="border-0 bg-transparent text-white">
      <CCardBody>
        <CNavTitle className="text-light">Production Selector</CNavTitle>

        {/* 1️⃣ Project */}
        <CFormSelect
          label="Select Project"
          className="mb-3 bg-dark text-white"
          value={selectedProject}
          onChange={(e) => {
            setSelectedProject(e.target.value)
            setSelectedSet('')
            setSelectedComponent('')
            setSelectedAssembly('')
            setSelectedPart('')
          }}
        >
          <option value="">-- Choose Project --</option>
          {mockProductionData.map((p, i) => (
            <option key={i} value={p.project}>
              {p.project}
            </option>
          ))}
        </CFormSelect>

        {/* 2️⃣ Set */}
        {selectedProject && (
          <CFormSelect
            label="Select Set"
            className="mb-3 bg-dark text-white"
            value={selectedSet}
            onChange={(e) => {
              setSelectedSet(e.target.value)
              setSelectedComponent('')
              setSelectedAssembly('')
              setSelectedPart('')
            }}
          >
            <option value="">-- Choose Set --</option>
            {currentProject?.sets.map((s, i) => (
              <option key={i} value={s.name}>
                {s.name}
              </option>
            ))}
          </CFormSelect>
        )}

        {/* 3️⃣ Component */}
        {selectedSet && (
          <CFormSelect
            label="Select Component"
            className="mb-3 bg-dark text-white"
            value={selectedComponent}
            onChange={(e) => {
              setSelectedComponent(e.target.value)
              setSelectedAssembly('')
              setSelectedPart('')
            }}
          >
            <option value="">-- Choose Component --</option>
            {currentSet?.components.map((c, i) => (
              <option key={i} value={c.name}>
                {c.name}
              </option>
            ))}
          </CFormSelect>
        )}

        {/* 4️⃣ Assembly */}
        {selectedComponent && (
          <CFormSelect
            label="Select Assembly"
            className="mb-3 bg-dark text-white"
            value={selectedAssembly}
            onChange={(e) => {
              setSelectedAssembly(e.target.value)
              setSelectedPart('')
            }}
          >
            <option value="">-- Choose Assembly --</option>
            {currentComponent?.assemblies.map((a, i) => (
              <option key={i} value={a.name}>
                {a.name}
              </option>
            ))}
          </CFormSelect>
        )}

        {/* 5️⃣ Part */}
        {selectedAssembly && (
          <CFormSelect
            label="Select Part"
            className="mb-3 bg-dark text-white"
            value={selectedPart}
            onChange={(e) => setSelectedPart(e.target.value)}
          >
            <option value="">-- Choose Part --</option>
            {currentAssembly?.parts.map((p, i) => (
              <option key={i} value={p}>
                {p}
              </option>
            ))}
          </CFormSelect>
        )}
      </CCardBody>
    </CCard>
  )

  // ─── Financial Selector ───
  const renderFinancialSelector = () => (
    <CCard className="border-0 bg-transparent text-white">
      <CCardBody>
        <CNavTitle className="text-light">Financial Selector</CNavTitle>

        <CFormSelect className="bg-dark text-white mb-3">
          <option>-- Choose Budget --</option>
          {mockFinancialData.map((p, i) => (
            <option key={i}>{p.project}</option>
          ))}
        </CFormSelect>
        <CFormSelect className="bg-dark text-white mb-3">
          <option>-- Choose Department --</option>
          <option>Engineering</option>
          <option>Operations</option>
        </CFormSelect>
        <CFormSelect className="bg-dark text-white mb-3">
          <option>-- Choose Expense Type --</option>
          <option>Procurement</option>
          <option>Maintenance</option>
        </CFormSelect>
      </CCardBody>
    </CCard>
  )

  // ─── Dashboard Menu ───
  const renderDashboardMenu = () => (
    <CCard className="border-0 bg-transparent text-white">
      <CCardBody>
        <CNavTitle className="text-light">Dashboard Navigation</CNavTitle>
        <div className="ps-2">
          <div className="py-1">
            <CIcon icon={cilSpeedometer} className="me-2 text-info" /> Overview
          </div>
          <div className="py-1">
            <CIcon icon={cilClipboard} className="me-2 text-warning" /> Reports
          </div>
        </div>
      </CCardBody>
    </CCard>
  )

  return (
    <CSidebar
      position="fixed"
      visible={sidebarShow}
      unfoldable={unfoldable}
      onVisibleChange={(visible) => dispatch({ type: 'set', sidebarShow: visible })}
      className="bg-dark text-white border-end"
    >
      <CSidebarHeader className="border-bottom text-center py-3 fw-bold text-light">
        {activeModule === 'production'
          ? '⚙️ Production Tree'
          : activeModule === 'financial'
          ? '💰 Financial Tree'
          : '🏠 Dashboard'}
      </CSidebarHeader>

      <CSidebarNav className="pt-2 pb-4" style={{ overflowY: 'auto' }}>
        {activeModule === 'production'
          ? renderProductionSelector()
          : activeModule === 'financial'
          ? renderFinancialSelector()
          : renderDashboardMenu()}
      </CSidebarNav>

      <CSidebarToggler
        className="border-top d-none d-lg-flex justify-content-center"
        onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
      />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
