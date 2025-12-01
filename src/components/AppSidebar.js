// src/components/AppSidebar.js
import React, { useEffect, useMemo, useState } from 'react'
import {
  CSidebar,
  CSidebarHeader,
  CSidebarNav,
  CSidebarToggler,
  CCard,
  CCardBody,
  CBadge,
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
  CNavTitle,
  CButton,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilFactory,
  cilSettings,
  cilClipboard,
  cilMoney,
  cilChevronRight,
  cilChevronBottom,
  cilFolderOpen,
  cilLayers,
} from '@coreui/icons'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const activeModule = useSelector((state) => state.activeModule)
  const projects = useSelector((state) => state.projects)
  const activeProjectId = useSelector((state) => state.activeProjectId)
  const navigate = useNavigate()

  // Expand currently active project by default
  const [openProjects, setOpenProjects] = useState(() =>
    activeProjectId ? [activeProjectId] : projects.length ? [projects[0].id] : [],
  )

  useEffect(() => {
    if (activeProjectId && !openProjects.includes(activeProjectId)) {
      setOpenProjects((prev) => [...prev, activeProjectId])
    }
  }, [activeProjectId, openProjects])

  const projectSections = useMemo(
    () => [
      { key: 'general', label: 'General', icon: cilFolderOpen },
      { key: 'configuration', label: 'Configuration', icon: cilSettings },
      { key: 'production', label: 'Production', icon: cilFactory },
      { key: 'materials', label: 'Materials', icon: cilLayers },
      { key: 'reports', label: 'Reports', icon: cilClipboard },
      { key: 'administration', label: 'Administration', icon: cilMoney },
    ],
    [],
  )

  const handleSectionClick = (projectId, sectionKey) => {
    dispatch({ type: 'setActiveProject', projectId })
    dispatch({ type: 'set', activeModule: 'production' })
    navigate(`/production/treeview?project=${projectId}&section=${sectionKey}`)
  }

  const renderProjectTree = () => (
    <CCard className="border-0 bg-transparent text-white">
      <CCardBody className="pb-0">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <CNavTitle className="text-light mb-0">Project Hierarchy</CNavTitle>
          <CButton
            color="warning"
            size="sm"
            className="text-dark fw-semibold"
            onClick={() => navigate('/production/treeview')}
          >
            + Add Project
          </CButton>
        </div>

        {projects.length === 0 ? (
          <div className="small text-light opacity-75">No projects yet. Start by adding one.</div>
        ) : (
          <CAccordion
            alwaysOpen
            activeItemKey={openProjects}
            flush
            onChange={(key) =>
              setOpenProjects(Array.isArray(key) ? key : key ? [key] : openProjects)
            }
          >
            {projects.map((project) => (
              <CAccordionItem
                itemKey={project.id}
                key={project.id}
                className={`bg-dark text-light rounded-3 mb-2 ${
                  activeProjectId === project.id ? 'border border-warning' : 'border-0'
                }`}
              >
                <CAccordionHeader
                  className="text-light"
                  onClick={() => dispatch({ type: 'setActiveProject', projectId: project.id })}
                >
                  <div className="d-flex flex-column">
                    <span className="fw-semibold">{project.name}</span>
                    <small className="text-body-secondary">{project.code}</small>
                  </div>
                  <CBadge color="warning" className="ms-2 text-dark fw-semibold">
                    {project.status}
                  </CBadge>
                </CAccordionHeader>
                <CAccordionBody className="pt-0">
                  <div className="small text-body-secondary mb-3">{project.description}</div>
                  <div className="d-grid gap-2">
                    {projectSections.map((section) => (
                      <CButton
                        key={section.key}
                        color="secondary"
                        variant="outline"
                        className="d-flex align-items-center justify-content-between text-start"
                        onClick={() => handleSectionClick(project.id, section.key)}
                      >
                        <span>
                          <CIcon icon={section.icon} className="me-2 text-warning" />
                          {section.label}
                        </span>
                        <CIcon icon={openProjects.includes(project.id) ? cilChevronBottom : cilChevronRight} />
                      </CButton>
                    ))}
                  </div>
                  <div className="d-flex align-items-center gap-2 mt-3 small text-body-secondary">
                    <span className="fw-semibold text-light">Owner:</span>
                    <span>{project.owner}</span>
                  </div>
                </CAccordionBody>
              </CAccordionItem>
            ))}
          </CAccordion>
        )}
      </CCardBody>
    </CCard>
  )

  const renderFinancialSelector = () => (
    <CCard className="border-0 bg-transparent text-white">
      <CCardBody>
        <CNavTitle className="text-light">Financial</CNavTitle>
        <div className="text-body-secondary small">
          Financial navigation will live here. Use the top menu to jump to reports or expenses.
        </div>
      </CCardBody>
    </CCard>
  )

  const renderDashboardMenu = () => (
    <CCard className="border-0 bg-transparent text-white">
      <CCardBody>
        <CNavTitle className="text-light">Dashboard</CNavTitle>
        <div className="text-body-secondary small">Welcome back. Choose a module to get started.</div>
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
          ? renderProjectTree()
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
