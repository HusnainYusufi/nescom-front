import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  CContainer,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavItem,
  CNavLink,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  useColorModes,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilMenu,
  cilBell,
  cilList,
  cilEnvelopeOpen,
  cilContrast,
  cilMoon,
  cilSun,
  cilFactory,
  cilMoney,
  cilSpeedometer,
  cilSettings,
  cilClipboard,
  cilBolt,
  cilChart,
  cilWarning,
} from '@coreui/icons'
import { AppBreadcrumb, AppHeaderDropdown } from './index'

const AppHeader = () => {
  const headerRef = useRef()
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const activeModule = useSelector((state) => state.activeModule)
  const [hoveredMenu, setHoveredMenu] = useState(null)

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    })
  }, [])

  const switchModule = (moduleName, path) => {
    dispatch({ type: 'set', activeModule: moduleName })
    navigate(path)
  }

  return (
    <>
      <style>
        {`
          .hover-menu {
            position: absolute;
            top: 100%;
            left: 0;
            background: #1b1b1b;
            border: 1px solid rgba(255,255,255,0.15);
            border-radius: 10px;
            box-shadow: 0 6px 16px rgba(0,0,0,0.5);
            padding: 6px 0;
            min-width: 220px;
            opacity: 0;
            transform: translateY(-10px);
            pointer-events: none;
            transition: all 0.25s ease-in-out;
            z-index: 2000;
          }
          .hover-menu.show {
            opacity: 1;
            transform: translateY(0);
            pointer-events: auto;
          }
          .hover-menu a {
            display: flex;
            align-items: center;
            color: #fff;
            padding: 8px 14px;
            text-decoration: none;
            font-size: 0.92rem;
            transition: background 0.2s, padding-left 0.2s;
          }
          .hover-menu a:hover {
            background: rgba(255,255,255,0.08);
            padding-left: 20px;
          }
          .hover-menu .c-icon {
            color: #0dcaf0;
          }
        `}
      </style>

      <CHeader position="sticky" className="mb-4 p-0 bg-dark text-white shadow-sm" ref={headerRef}>
        <CContainer className="px-4" fluid>
          {/* Sidebar Toggle */}
          <CHeaderToggler
            onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
            style={{ marginInlineStart: '-14px' }}
            className="text-white"
          >
            <CIcon icon={cilMenu} size="lg" />
          </CHeaderToggler>

          {/* ─── Main Top Modules ─── */}
          <CHeaderNav className="ms-3 d-flex align-items-center">
            {/* Dashboard */}
            <CNavItem>
              <CNavLink
                as="button"
                className={`btn btn-sm text-white ${
                  activeModule === 'dashboard' ? 'fw-bold text-info' : ''
                }`}
                onClick={() => switchModule('dashboard', '/dashboard')}
              >
                <CIcon icon={cilSpeedometer} className="me-1" /> Dashboard
              </CNavLink>
            </CNavItem>

            {/* Production Module Hover */}
            <div
              className="position-relative ms-2"
              onMouseEnter={() => setHoveredMenu('production')}
              onMouseLeave={() => setHoveredMenu(null)}
            >
              <CNavLink
                as="button"
                className={`btn btn-sm text-white ${
                  activeModule === 'production' ? 'fw-bold text-warning' : ''
                }`}
                onClick={() => switchModule('production', '/production')}
              >
                <CIcon icon={cilFactory} className="me-1" /> Production ▾
              </CNavLink>

              <div className={`hover-menu ${hoveredMenu === 'production' ? 'show' : ''}`}>
                <DropdownItem href="#/production/create-project" icon={cilSettings} label="Add Project" />
                <DropdownItem href="#/production/add-set" icon={cilClipboard} label="Add Set" />
                <DropdownItem href="#/production/create-meeting" icon={cilBolt} label="Add Meeting" />
                <DropdownItem href="#/production/add-assy-parts" icon={cilChart} label="Add Assembly" />
                <DropdownItem href="#/production/add-status" icon={cilChart} label="Add Status" />
                <DropdownItem href="#/production/add-prm-status" icon={cilChart} label="Add PRM" />
                <DropdownItem href="#/production/add-critical-issue" icon={cilWarning} label="Add Issue" />
                <DropdownItem href="#/production/project-summary" icon={cilFactory} label="Project Summary" />
              </div>
            </div>

            {/* Financial Module Hover */}
            <div
              className="position-relative ms-2"
              onMouseEnter={() => setHoveredMenu('financial')}
              onMouseLeave={() => setHoveredMenu(null)}
            >
              <CNavLink
                as="button"
                className={`btn btn-sm text-white ${
                  activeModule === 'financial' ? 'fw-bold text-success' : ''
                }`}
                onClick={() => switchModule('financial', '/financial/treeview')}
              >
                <CIcon icon={cilMoney} className="me-1" /> Financial ▾
              </CNavLink>

              <div className={`hover-menu ${hoveredMenu === 'financial' ? 'show' : ''}`}>
                <DropdownItem href="#/financial/treeview" icon={cilChart} label="Financial Overview" />
                <DropdownItem href="#/financial/reports" icon={cilClipboard} label="Add Report" />
                <DropdownItem href="#/financial/expenses" icon={cilClipboard} label="Add Expense" />
                <DropdownItem href="#/financial/settings" icon={cilSettings} label="Add Config" />
              </div>
            </div>
          </CHeaderNav>

          {/* ─── Right Icons + Profile ─── */}
          <CHeaderNav className="ms-auto align-items-center">
            <CNavItem>
              <CNavLink href="#">
                <CIcon icon={cilBell} size="lg" />
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink href="#">
                <CIcon icon={cilList} size="lg" />
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink href="#">
                <CIcon icon={cilEnvelopeOpen} size="lg" />
              </CNavLink>
            </CNavItem>

            <li className="nav-item py-1">
              <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
            </li>

            {/* Theme Switcher */}
            <CDropdown variant="nav-item" placement="bottom-end">
              <CNavLink as="button" className="text-white">
                {colorMode === 'dark' ? (
                  <CIcon icon={cilMoon} size="lg" />
                ) : colorMode === 'auto' ? (
                  <CIcon icon={cilContrast} size="lg" />
                ) : (
                  <CIcon icon={cilSun} size="lg" />
                )}
              </CNavLink>
              <CDropdownMenu>
                <CDropdownItem onClick={() => setColorMode('light')}>
                  <CIcon icon={cilSun} className="me-2" /> Light
                </CDropdownItem>
                <CDropdownItem onClick={() => setColorMode('dark')}>
                  <CIcon icon={cilMoon} className="me-2" /> Dark
                </CDropdownItem>
                <CDropdownItem onClick={() => setColorMode('auto')}>
                  <CIcon icon={cilContrast} className="me-2" /> Auto
                </CDropdownItem>
              </CDropdownMenu>
            </CDropdown>

            <li className="nav-item py-1">
              <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
            </li>

            <AppHeaderDropdown />
          </CHeaderNav>
        </CContainer>

        {/* Breadcrumb */}
        <CContainer fluid className="px-4 py-2 bg-body-secondary bg-opacity-10 border-top">
          <AppBreadcrumb />
        </CContainer>
      </CHeader>
    </>
  )
}

const DropdownItem = ({ href, icon, label }) => (
  <a href={href} className="text-decoration-none d-flex align-items-center" style={{ color: '#fff' }}>
    <CIcon icon={icon} className="me-2" size="sm" /> {label}
  </a>
)

export default AppHeader
