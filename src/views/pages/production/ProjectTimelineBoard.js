// src/views/pages/production/ProjectTimelineBoard.js
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import CIcon from '@coreui/icons-react'
import {
  cilClock,
  cilCommentBubble,
  cilPeople,
  cilList,
  cilSpeedometer,
  cilSwapHorizontal,
} from '@coreui/icons'
import {
  CAvatar,
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CProgress,
  CRow,
  CTooltip,
} from '@coreui/react'

const projectsSeed = [
  {
    id: 'eagle',
    name: 'Eagle UCAV Integration',
    code: 'PRJ-204',
    manager: 'Eng. Sarah Ahmed',
    stage: 'Systems Integration',
    progress: 68,
    health: 'On Track',
    summary:
      'Integrating avionics, comms stack, and payload pods; validating flight control firmware updates and EMI performance.',
    focusAreas: ['Payload Qualification', 'Flight Control', 'Quality Assurance'],
    milestones: [
      {
        id: 'frz',
        date: '12 Sep',
        title: 'Hardware Freeze',
        status: 'Complete',
        owner: 'Hardware PMO',
        detail: 'All critical boards signed off and released to production.',
      },
      {
        id: 'flt',
        date: '18 Sep',
        title: 'Captive Carry Test',
        status: 'In Progress',
        owner: 'Flight Test',
        detail: 'Ground telemetry rehearsals underway; air clearance window booked.',
      },
      {
        id: 'fw',
        date: '25 Sep',
        title: 'FW v2.4 Sign-off',
        status: 'At Risk',
        owner: 'Controls',
        detail: 'Stability loops stable; awaiting updated actuator drivers from vendor.',
      },
    ],
    comments: [
      {
        id: 'c1',
        author: 'QA Lead',
        role: 'Quality',
        text: 'EMI chamber booked for 19 Sep. Need firmware freeze 24h earlier for fixtures.',
        time: '2h ago',
      },
      {
        id: 'c2',
        author: 'Flight Ops',
        role: 'Operations',
        text: 'Pilot brief updated with new telemetry bands. Risk log shared in drive.',
        time: '5h ago',
      },
    ],
  },
  {
    id: 'lynx',
    name: 'Lynx ISR Suite',
    code: 'PRJ-117',
    manager: 'Squadron Ldr. Imran',
    stage: 'Qualification',
    progress: 82,
    health: 'Guarded',
    summary:
      'ISR payload retrofit across the fleet with optimized power profiles and improved encrypted data relays.',
    focusAreas: ['Thermals', 'Data Link', 'Certification'],
    milestones: [
      {
        id: 'dl',
        date: '09 Sep',
        title: 'Data Link Redesign',
        status: 'Complete',
        owner: 'Systems',
        detail: 'Low-SWaP antennas validated; AES module passed soak test.',
      },
      {
        id: 'cert',
        date: '14 Sep',
        title: 'CAA Conformity Review',
        status: 'In Progress',
        owner: 'Certification',
        detail: 'Document set shared; waiting on revised load case for hardpoint B.',
      },
      {
        id: 'thermal',
        date: '22 Sep',
        title: 'Thermal Soak',
        status: 'Upcoming',
        owner: 'QA',
        detail: 'Need final heat spreader layout before starting 48h cycle.',
      },
    ],
    comments: [
      {
        id: 'c3',
        author: 'Systems Eng',
        role: 'Engineering',
        text: 'Re-baselined BOM signed; shipment ETA 3 days earlier after vendor confirmation.',
        time: '1d ago',
      },
      {
        id: 'c4',
        author: 'QA Lead',
        role: 'Quality',
        text: 'Thermal sensors calibrated; awaiting updated duty cycle for test script.',
        time: '2d ago',
      },
    ],
  },
  {
    id: 'atlas',
    name: 'Atlas Powertrain',
    code: 'PRJ-089',
    manager: 'Eng. Mariam Khan',
    stage: 'Build & Validation',
    progress: 54,
    health: 'Watch',
    summary:
      'Hybrid powertrain upgrade with new fuel control unit and redundant power distribution for maritime deployments.',
    focusAreas: ['Power Electronics', 'Reliability', 'Supply Chain'],
    milestones: [
      {
        id: 'bench',
        date: '11 Sep',
        title: 'Bench Test Cycle 2',
        status: 'Complete',
        owner: 'R&D Lab',
        detail: '8-hour run closed with stable temps across converters.',
      },
      {
        id: 'supply',
        date: '16 Sep',
        title: 'Supply Assurance',
        status: 'At Risk',
        owner: 'SCM',
        detail: 'Fuel control units on 1-week slip; mitigation PO raised.',
      },
      {
        id: 'harbor',
        date: '28 Sep',
        title: 'Harbor Trials',
        status: 'Upcoming',
        owner: 'Naval Ops',
        detail: 'Dock slot confirmed; instrumentation kit being prepped.',
      },
    ],
    comments: [
      {
        id: 'c5',
        author: 'Supply Chain',
        role: 'SCM',
        text: 'Alternate supplier ready to ship 5 FCUs if tests pass; need decision by Friday.',
        time: '6h ago',
      },
      {
        id: 'c6',
        author: 'Program Manager',
        role: 'PMO',
        text: 'Updated risk profile shared with leadership; mitigation owner assigned.',
        time: '1d ago',
      },
    ],
  },
]

const statusAccent = {
  Complete: 'success',
  'In Progress': 'info',
  'At Risk': 'warning',
  Upcoming: 'secondary',
}

const healthTone = {
  'On Track': 'success',
  Guarded: 'warning',
  Watch: 'danger',
}

const ProjectTimelineBoard = () => {
  const dispatch = useDispatch()
  const [projects, setProjects] = useState(projectsSeed)
  const [selectedProjectId, setSelectedProjectId] = useState(null)
  const [pendingProjectId, setPendingProjectId] = useState(projectsSeed[0].id)
  const [showProjectModal, setShowProjectModal] = useState(true)
  const [commentForm, setCommentForm] = useState({
    author: '',
    role: 'Contributor',
    text: '',
  })

  useEffect(() => {
    dispatch({ type: 'set', activeModule: 'production' })
  }, [dispatch])

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId),
    [projects, selectedProjectId],
  )

  const handleCommentSubmit = (event) => {
    event.preventDefault()
    if (!selectedProject || !commentForm.author.trim() || !commentForm.text.trim()) {
      return
    }

    setProjects((prev) =>
      prev.map((project) =>
        project.id === selectedProjectId
          ? {
              ...project,
              comments: [
                {
                  id: `${project.id}-${Date.now()}`,
                  ...commentForm,
                  time: 'Just now',
                },
                ...project.comments,
              ],
            }
          : project,
      ),
    )

    setCommentForm({ author: '', role: 'Contributor', text: '' })
  }

  const handleProjectConfirm = () => {
    setSelectedProjectId(pendingProjectId)
    setShowProjectModal(false)
  }

  const closeModal = () => {
    setShowProjectModal(false)
    setPendingProjectId(selectedProjectId ?? projects[0].id)
  }

  const reopenModal = () => {
    setPendingProjectId(selectedProjectId ?? projects[0].id)
    setShowProjectModal(true)
  }

  return (
    <CContainer fluid className="py-4 timeline-surface">
      <CModal
        size="lg"
        alignment="center"
        visible={showProjectModal}
        backdrop="static"
        aria-labelledby="project-picker-title"
      >
        <CModalHeader className="border-0 px-4 pt-4">
          <CModalTitle id="project-picker-title" className="fw-bold">
            Select a project to load its timeline
          </CModalTitle>
        </CModalHeader>
        <CModalBody className="px-4 pb-2">
          <p className="text-body-secondary mb-3">
            Choose the initiative you want to brief. We will pre-fill the milestones, health, and discussion feed
            for that team.
          </p>
          <CFormSelect
            label="Project"
            value={pendingProjectId}
            onChange={(event) => setPendingProjectId(event.target.value)}
            className="bg-dark text-white border-0"
          >
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name} ({project.code})
              </option>
            ))}
          </CFormSelect>
        </CModalBody>
        <CModalFooter className="border-0 px-4 pb-4 d-flex justify-content-end">
          <CButton color="secondary" variant="outline" onClick={closeModal} disabled={!selectedProjectId}>
            Cancel
          </CButton>
          <CButton color="primary" className="px-4" onClick={handleProjectConfirm}>
            Load timeline
          </CButton>
        </CModalFooter>
      </CModal>

      <div className="timeline-hero rounded-4 shadow-lg p-4 p-md-5 mb-4 text-white">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-4">
          <div className="d-flex align-items-center gap-3">
            <span className="timeline-hero__icon d-inline-flex align-items-center justify-content-center rounded-circle">
              <CIcon icon={cilList} size="lg" />
            </span>
            <div>
              <p className="text-uppercase small mb-1 opacity-75">Product timelines</p>
              <h3 className="fw-bold mb-2">Centralized delivery & discussion board</h3>
              <p className="mb-0 text-white-50">
                Pick your project to review milestones, surface risks early, and keep conversations aligned in one place.
              </p>
            </div>
          </div>
          <div className="d-flex flex-wrap gap-2 align-items-center">
            <CBadge color="light" textColor="dark" className="px-3 py-2 rounded-pill">
              <CIcon icon={cilSpeedometer} className="me-2" /> Delivery health
            </CBadge>
            <CBadge color="warning" textColor="dark" className="px-3 py-2 rounded-pill">
              <CIcon icon={cilCommentBubble} className="me-2" /> Discussions
            </CBadge>
            <CBadge color="info" className="px-3 py-2 rounded-pill">
              <CIcon icon={cilPeople} className="me-2" /> Stakeholders
            </CBadge>
            <CButton color="light" variant="outline" onClick={reopenModal} className="text-white">
              <CIcon icon={cilSwapHorizontal} className="me-2" /> Change project
            </CButton>
          </div>
        </div>
      </div>

      <CRow className="g-4">
        <CCol lg={4}>
          <CCard className="timeline-card h-100">
            <CCardHeader className="timeline-card__header">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="text-uppercase small text-white-50 mb-1">Selected project</p>
                  <h6 className="fw-bold mb-0">Delivery capsule</h6>
                </div>
                <CBadge color="primary" shape="rounded-pill" className="px-3">
                  {projects.length} Active
                </CBadge>
              </div>
            </CCardHeader>
            <CCardBody className="timeline-card__body">
              {selectedProject ? (
                <div className="p-3 p-lg-2">
                  <div className="d-flex align-items-start gap-3 mb-3">
                    <CAvatar color="primary" textColor="white" size="lg">
                      {selectedProject.name.charAt(0)}
                    </CAvatar>
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center justify-content-between gap-2">
                        <h6 className="fw-semibold mb-0 text-white">{selectedProject.name}</h6>
                        <CBadge color={healthTone[selectedProject.health]} className="px-3">
                          {selectedProject.health}
                        </CBadge>
                      </div>
                      <p className="mb-2 text-white-50 small">{selectedProject.summary}</p>
                    </div>
                  </div>
                  <div className="bg-body-secondary rounded-3 p-3 mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="small text-white-50">Stage</span>
                      <span className="fw-semibold text-white">{selectedProject.stage}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="small text-white-50">Progress</span>
                      <span className="fw-semibold text-white">{selectedProject.progress}%</span>
                    </div>
                    <CProgress
                      thin
                      color="primary"
                      value={selectedProject.progress}
                      className="timeline-progress"
                    />
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    {selectedProject.focusAreas.map((area) => (
                      <CBadge key={area} color="light" className="text-primary border">
                        {area}
                      </CBadge>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center text-white-50 py-5">
                  <p className="mb-2 fw-semibold">Pick a project to load details</p>
                  <CButton color="primary" onClick={reopenModal}>
                    Open project picker
                  </CButton>
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>

        <CCol lg={8}>
          <CCard className="timeline-card h-100">
            <CCardHeader className="timeline-card__header d-flex align-items-center justify-content-between">
              <div>
                <p className="text-uppercase small text-white-50 mb-1">Timeline</p>
                <h6 className="fw-bold mb-0">Milestones & decisions</h6>
              </div>
              <CBadge color="info" className="px-3">
                <CIcon icon={cilClock} className="me-2" /> Live sync ready
              </CBadge>
            </CCardHeader>
            <CCardBody className="timeline-card__body">
              {selectedProject ? (
                <div className="timeline-flow">
                  {selectedProject.milestones.map((milestone, idx) => (
                    <div key={milestone.id} className="timeline-item pb-4">
                      <div className="timeline-dot" />
                      <div className="timeline-line" hidden={idx === selectedProject.milestones.length - 1} />
                      <div className="timeline-content">
                        <div className="d-flex justify-content-between align-items-start mb-1">
                          <div className="d-flex align-items-center gap-2">
                            <strong className="text-white">{milestone.title}</strong>
                            <CTooltip content={`Owner: ${milestone.owner}`} placement="bottom">
                              <CBadge color={statusAccent[milestone.status]} className="px-3">
                                {milestone.status}
                              </CBadge>
                            </CTooltip>
                          </div>
                          <span className="small text-white-50">{milestone.date}</span>
                        </div>
                        <p className="mb-1 text-white-50 small">{milestone.detail}</p>
                        <p className="small text-white-50 mb-0">Owner: {milestone.owner}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-white-50 py-4">Select a project to view its timeline.</div>
              )}
            </CCardBody>
          </CCard>
        </CCol>

        <CCol lg={4}>
          <CCard className="timeline-card h-100">
            <CCardHeader className="timeline-card__header">
              <div className="d-flex align-items-center justify-content-between">
                <h6 className="fw-bold mb-0">Post an update</h6>
                <CBadge color="light" textColor="dark">
                  Visible to project team
                </CBadge>
              </div>
            </CCardHeader>
            <CCardBody className="timeline-card__body">
              <CForm className="d-grid gap-3" onSubmit={handleCommentSubmit}>
                <CFormInput
                  label="Name"
                  placeholder="e.g. QA Lead / System Owner"
                  value={commentForm.author}
                  disabled={!selectedProject}
                  onChange={(event) =>
                    setCommentForm((current) => ({ ...current, author: event.target.value }))
                  }
                />
                <CFormSelect
                  label="Role"
                  value={commentForm.role}
                  disabled={!selectedProject}
                  onChange={(event) =>
                    setCommentForm((current) => ({ ...current, role: event.target.value }))
                  }
                  options={[
                    { label: 'Contributor', value: 'Contributor' },
                    { label: 'PMO', value: 'PMO' },
                    { label: 'Engineering', value: 'Engineering' },
                    { label: 'Quality', value: 'Quality' },
                    { label: 'Operations', value: 'Operations' },
                  ]}
                />
                <CFormTextarea
                  label="Comment"
                  rows={3}
                  value={commentForm.text}
                  disabled={!selectedProject}
                  placeholder="Capture decisions, risks, or blockers for the team"
                  onChange={(event) =>
                    setCommentForm((current) => ({ ...current, text: event.target.value }))
                  }
                />
                <CButton
                  type="submit"
                  color="primary"
                  disabled={!selectedProject}
                  className="d-flex align-items-center justify-content-center"
                >
                  <CIcon icon={cilCommentBubble} className="me-2" />
                  Add update to board
                </CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol lg={8}>
          <CCard className="timeline-card h-100">
            <CCardHeader className="timeline-card__header d-flex align-items-center justify-content-between">
              <div>
                <p className="text-uppercase small text-white-50 mb-1">Discussion feed</p>
                <h6 className="fw-bold mb-0">Decisions & notes</h6>
              </div>
              <CBadge color="secondary" textColor="dark" className="px-3">
                {selectedProject?.comments.length ?? 0} updates
              </CBadge>
            </CCardHeader>
            <CCardBody className="timeline-card__body">
              <div className="d-grid gap-3">
                {selectedProject ? (
                  selectedProject.comments.map((comment) => (
                    <div key={comment.id} className="p-3 border rounded-3 bg-body">
                      <div className="d-flex align-items-start gap-3">
                        <CAvatar color="primary" textColor="white">
                          {comment.author.charAt(0)}
                        </CAvatar>
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <div className="d-flex align-items-center gap-2">
                              <span className="fw-semibold">{comment.author}</span>
                              <CBadge color="light" textColor="dark" className="text-uppercase small">
                                {comment.role}
                              </CBadge>
                            </div>
                            <span className="text-body-secondary small">{comment.time}</span>
                          </div>
                          <p className="mb-0 text-body-secondary">{comment.text}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-white-50 py-4">Select a project to load its discussion feed.</div>
                )}
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default ProjectTimelineBoard
