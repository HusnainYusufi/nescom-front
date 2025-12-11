// src/views/pages/production/ProjectCreationWizard.js
import React, { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  CAlert,
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CForm,
  CFormCheck,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CProgress,
  CRow,
} from '@coreui/react'

const ProjectCreationWizard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const existingProjects = useSelector((state) => state.projects)

  const steps = useMemo(
    () => [
      { key: 'basics', title: 'Project details', summary: 'Name, code, category, and type' },
      { key: 'sets', title: 'Sets & templates', summary: 'Add sets or import from existing projects' },
      { key: 'structures', title: 'Structures & assemblies', summary: 'Capture structures and assemblies per set' },
      { key: 'review', title: 'Review & create', summary: 'Confirm details before creating the project' },
    ],
    [],
  )

  const [currentStep, setCurrentStep] = useState(0)
  const [projectForm, setProjectForm] = useState({
    name: '',
    code: '',
    category: '',
    projectType: '',
    visibility: true,
    description: '',
  })
  const [sets, setSets] = useState([
    {
      id: 'set-1',
      name: 'Set 1',
      description: 'Default starter set',
      structures: [{ id: 'st-1', name: 'Structure 1', material: 'Composite' }],
      assemblies: [{ id: 'as-1', name: 'Assembly 1', type: 'Mechanical' }],
    },
  ])
  const [selectedProjectId, setSelectedProjectId] = useState('')
  const [alert, setAlert] = useState('')
  const [errors, setErrors] = useState({})

  const progressValue = Math.round(((currentStep + 1) / steps.length) * 100)

  const updateSetField = (setId, field, value) => {
    setSets((prev) => prev.map((set) => (set.id === setId ? { ...set, [field]: value } : set)))
  }

  const addSet = () => {
    const newId = `set-${Date.now()}`
    setSets((prev) => [
      ...prev,
      {
        id: newId,
        name: `Set ${prev.length + 1}`,
        description: '',
        structures: [],
        assemblies: [],
      },
    ])
  }

  const addStructure = (setId) => {
    setSets((prev) =>
      prev.map((set) =>
        set.id === setId
          ? {
              ...set,
              structures: [
                ...set.structures,
                { id: `st-${Date.now()}`, name: `Structure ${set.structures.length + 1}`, material: '' },
              ],
            }
          : set,
      ),
    )
  }

  const addAssembly = (setId) => {
    setSets((prev) =>
      prev.map((set) =>
        set.id === setId
          ? {
              ...set,
              assemblies: [
                ...set.assemblies,
                { id: `as-${Date.now()}`, name: `Assembly ${set.assemblies.length + 1}`, type: '' },
              ],
            }
          : set,
      ),
    )
  }

  const importSets = () => {
    const templateProject = existingProjects.find((project) => project.id === selectedProjectId)
    if (!templateProject) {
      setAlert('Please select a project to import from first.')
      return
    }
    if (!templateProject.sets || templateProject.sets.length === 0) {
      setAlert('The selected project does not contain any sets to import yet.')
      return
    }

    const importedSets = templateProject.sets.map((set, index) => ({
      id: `import-${index + 1}`,
      name: set.name,
      description: `Imported from ${templateProject.name}`,
      structures: (set.structures || []).map((name, idx) => ({
        id: `st-${index + 1}-${idx + 1}`,
        name,
        material: 'Imported',
      })),
      assemblies: (set.assemblies || []).map((name, idx) => ({
        id: `as-${index + 1}-${idx + 1}`,
        name,
        type: 'Imported',
      })),
    }))

    setSets(importedSets)
    setAlert(`Imported ${importedSets.length} set(s) from ${templateProject.name} for reuse.`)
  }

  const validateBasics = () => {
    const nextErrors = {}
    if (!projectForm.name.trim()) nextErrors.name = 'Project name is required'
    if (!projectForm.code.trim()) nextErrors.code = 'Project code is required'
    if (!projectForm.category) nextErrors.category = 'Select a category'
    if (!projectForm.projectType) nextErrors.projectType = 'Choose Special or Conventional'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const goToStep = (direction) => {
    if (direction > 0 && steps[currentStep].key === 'basics' && !validateBasics()) return
    setAlert('')
    setCurrentStep((prev) => {
      const next = prev + direction
      if (next < 0) return 0
      if (next >= steps.length) return steps.length - 1
      return next
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!validateBasics()) return

    const newProject = {
      id: `proj-${Date.now()}`,
      name: projectForm.name,
      code: projectForm.code,
      description: projectForm.description,
      status: 'Draft',
      owner: 'Unassigned',
      system: 'TBD',
      category: projectForm.category,
      projectType: projectForm.projectType,
      visibility: projectForm.visibility,
      sets: sets.map((set) => ({
        id: set.id,
        name: set.name,
        structures: set.structures.map((structure) => structure.name).filter(Boolean),
        assemblies: set.assemblies.map((assembly) => assembly.name).filter(Boolean),
      })),
    }

    dispatch({ type: 'addProject', project: newProject })
    navigate(`/production/treeview?project=${newProject.id}`)
  }

  const renderBasics = () => (
    <CRow className="g-3">
      <CCol md={6}>
        <CFormInput
          label="Project name"
          name="name"
          placeholder="e.g., Guided Payload Upgrade"
          value={projectForm.name}
          onChange={(event) => {
            setProjectForm({ ...projectForm, name: event.target.value })
            setErrors({ ...errors, name: '' })
          }}
          invalid={!!errors.name}
          feedbackInvalid={errors.name}
        />
      </CCol>
      <CCol md={6}>
        <CFormInput
          label="Project code"
          name="code"
          placeholder="PX-400"
          value={projectForm.code}
          onChange={(event) => {
            setProjectForm({ ...projectForm, code: event.target.value })
            setErrors({ ...errors, code: '' })
          }}
          invalid={!!errors.code}
          feedbackInvalid={errors.code}
        />
      </CCol>
      <CCol md={6}>
        <CFormSelect
          label="Category"
          name="category"
          value={projectForm.category}
          onChange={(event) => {
            setProjectForm({ ...projectForm, category: event.target.value })
            setErrors({ ...errors, category: '' })
          }}
          invalid={!!errors.category}
          feedbackInvalid={errors.category}
        >
          <option value="">Select category</option>
          <option value="Aerial">Aerial</option>
          <option value="Ballistic">Ballistic</option>
          <option value="Naval">Naval</option>
        </CFormSelect>
      </CCol>
      <CCol md={6}>
        <CFormSelect
          label="Project type"
          name="projectType"
          value={projectForm.projectType}
          onChange={(event) => {
            setProjectForm({ ...projectForm, projectType: event.target.value })
            setErrors({ ...errors, projectType: '' })
          }}
          invalid={!!errors.projectType}
          feedbackInvalid={errors.projectType}
        >
          <option value="">Select project type</option>
          <option value="Special">Special</option>
          <option value="Conventional">Conventional</option>
        </CFormSelect>
      </CCol>
      <CCol md={6}>
        <CFormCheck
          label="Show this project for reuse and set imports"
          checked={projectForm.visibility}
          onChange={(event) => setProjectForm({ ...projectForm, visibility: event.target.checked })}
        />
      </CCol>
      <CCol md={12}>
        <CFormTextarea
          label="Short description"
          name="description"
          placeholder="What are we building in this project?"
          value={projectForm.description}
          onChange={(event) => setProjectForm({ ...projectForm, description: event.target.value })}
          rows={3}
        />
      </CCol>
    </CRow>
  )

  const renderSets = () => (
    <CRow className="g-3">
      <CCol md={6}>
        <CFormSelect
          label="Import sets from existing project"
          value={selectedProjectId}
          onChange={(event) => setSelectedProjectId(event.target.value)}
        >
          <option value="">Select project</option>
          {existingProjects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name} ({project.code})
            </option>
          ))}
        </CFormSelect>
        <CButton color="secondary" variant="outline" className="mt-2" onClick={importSets}>
          Import selected project sets
        </CButton>
      </CCol>
      <CCol md={6} className="d-flex align-items-end justify-content-md-end">
        <div className="text-md-end w-100">
          <p className="mb-2 text-body-secondary small">Start from blank or reuse a template.</p>
          <CButton color="primary" onClick={addSet}>
            Add a new set
          </CButton>
        </div>
      </CCol>
      {sets.map((set) => (
        <CCol md={6} key={set.id}>
          <CCard className="h-100 shadow-sm border-start border-4 border-primary">
            <CCardBody>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <h6 className="mb-1">{set.name}</h6>
                  <p className="text-body-secondary small mb-0">Describe the set so teams know when to reuse it.</p>
                </div>
                <CBadge color="info">Reusable</CBadge>
              </div>
              <CFormInput
                label="Set name"
                value={set.name}
                onChange={(event) => updateSetField(set.id, 'name', event.target.value)}
                className="mb-3"
              />
              <CFormTextarea
                label="Purpose / description"
                value={set.description}
                onChange={(event) => updateSetField(set.id, 'description', event.target.value)}
                rows={2}
              />
            </CCardBody>
          </CCard>
        </CCol>
      ))}
    </CRow>
  )

  const renderStructures = () => (
    <CRow className="g-3">
      {sets.map((set) => (
        <CCol md={6} key={set.id}>
          <CCard className="h-100 shadow-sm">
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-1">{set.name}</h6>
                <p className="small text-body-secondary mb-0">Capture structures and assemblies for this set.</p>
              </div>
              <CBadge color="primary">Step 3</CBadge>
            </CCardHeader>
            <CCardBody>
              <h6 className="text-body-secondary">Structures</h6>
              {set.structures.map((structure) => (
                <CFormInput
                  key={structure.id}
                  value={structure.name}
                  placeholder="Structure name"
                  className="mb-2"
                  onChange={(event) =>
                    setSets((prev) =>
                      prev.map((currentSet) =>
                        currentSet.id === set.id
                          ? {
                              ...currentSet,
                              structures: currentSet.structures.map((st) =>
                                st.id === structure.id ? { ...st, name: event.target.value } : st,
                              ),
                            }
                          : currentSet,
                      ),
                    )
                  }
                />
              ))}
              <CButton color="secondary" size="sm" variant="outline" className="mb-3" onClick={() => addStructure(set.id)}>
                Add structure
              </CButton>

              <h6 className="text-body-secondary mt-3">Assemblies</h6>
              {set.assemblies.map((assembly) => (
                <CFormInput
                  key={assembly.id}
                  value={assembly.name}
                  placeholder="Assembly name"
                  className="mb-2"
                  onChange={(event) =>
                    setSets((prev) =>
                      prev.map((currentSet) =>
                        currentSet.id === set.id
                          ? {
                              ...currentSet,
                              assemblies: currentSet.assemblies.map((as) =>
                                as.id === assembly.id ? { ...as, name: event.target.value } : as,
                              ),
                            }
                          : currentSet,
                      ),
                    )
                  }
                />
              ))}
              <CButton color="secondary" size="sm" variant="outline" onClick={() => addAssembly(set.id)}>
                Add assembly
              </CButton>
            </CCardBody>
          </CCard>
        </CCol>
      ))}
    </CRow>
  )

  const renderReview = () => (
    <CRow className="g-3">
      <CCol md={6}>
        <CCard className="h-100 shadow-sm">
          <CCardHeader>Project overview</CCardHeader>
          <CCardBody>
            <ul className="list-unstyled mb-0">
              <li className="mb-2">
                <strong>Name:</strong> {projectForm.name || '—'}
              </li>
              <li className="mb-2">
                <strong>Code:</strong> {projectForm.code || '—'}
              </li>
              <li className="mb-2">
                <strong>Category:</strong> {projectForm.category || '—'}
              </li>
              <li className="mb-2">
                <strong>Project type:</strong> {projectForm.projectType || '—'}
              </li>
              <li className="mb-2">
                <strong>Visible for reuse:</strong> {projectForm.visibility ? 'Yes' : 'Hidden'}
              </li>
              <li>
                <strong>Description:</strong> {projectForm.description || '—'}
              </li>
            </ul>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol md={6}>
        <CCard className="h-100 shadow-sm">
          <CCardHeader>Sets and reuse plan</CCardHeader>
          <CCardBody>
            {sets.map((set) => (
              <div key={set.id} className="mb-3 pb-3 border-bottom">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="mb-1">{set.name}</h6>
                    <p className="small text-body-secondary mb-1">{set.description || 'No description added yet.'}</p>
                    <p className="small mb-1">
                      <strong>Structures:</strong> {set.structures.map((st) => st.name).join(', ') || '—'}
                    </p>
                    <p className="small mb-0">
                      <strong>Assemblies:</strong> {set.assemblies.map((as) => as.name).join(', ') || '—'}
                    </p>
                  </div>
                  <CBadge color="success">Ready</CBadge>
                </div>
              </div>
            ))}
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12}>
        <CAlert color="warning" className="mb-0">
          This wizard is a front-end preview. Creating the project will store it in the local state and redirect you to the
          Projects Hierarchy to continue configuration.
        </CAlert>
      </CCol>
    </CRow>
  )

  const renderStepContent = () => {
    switch (steps[currentStep].key) {
      case 'basics':
        return renderBasics()
      case 'sets':
        return renderSets()
      case 'structures':
        return renderStructures()
      case 'review':
        return renderReview()
      default:
        return null
    }
  }

  return (
    <CContainer fluid className="mt-4">
      <CRow className="justify-content-center">
        <CCol lg={10}>
          <CCard className="shadow-sm border-0">
            <CCardHeader className="bg-white border-0 pb-0">
              <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <div>
                  <h4 className="mb-1">Create a project</h4>
                  <p className="text-body-secondary mb-0">Multi-step flow to add a project, sets, and reusable structures.</p>
                </div>
                <CBadge color="warning" className="text-dark">
                  Guided wizard
                </CBadge>
              </div>
              <CProgress height={10} color="primary" value={progressValue} className="mb-3" />
              <div className="d-flex flex-wrap gap-3 mb-3">
                {steps.map((step, index) => (
                  <div
                    key={step.key}
                    className={`d-flex flex-column step-pill ${index === currentStep ? 'active' : ''}`}
                  >
                    <span className="fw-semibold">{index + 1}. {step.title}</span>
                    <small className="text-body-secondary">{step.summary}</small>
                  </div>
                ))}
              </div>
            </CCardHeader>
            <CCardBody>
              {alert && (
                <CAlert color="info" className="mb-3">
                  {alert}
                </CAlert>
              )}
              <CForm onSubmit={handleSubmit}>
                {renderStepContent()}

                <div className="d-flex justify-content-between align-items-center pt-4 border-top mt-4">
                  <div>
                    <CButton color="secondary" variant="ghost" disabled={currentStep === 0} onClick={() => goToStep(-1)}>
                      Back
                    </CButton>
                  </div>
                  {steps[currentStep].key === 'review' ? (
                    <CButton color="warning" className="text-dark fw-semibold" type="submit">
                      Create project
                    </CButton>
                  ) : (
                    <CButton color="primary" onClick={() => goToStep(1)}>
                      Next step
                    </CButton>
                  )}
                </div>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <style>
        {`
          .step-pill {
            padding: 0.75rem 1rem;
            border-radius: 0.75rem;
            background: #f8f9fa;
            min-width: 180px;
          }
          .step-pill.active {
            background: #e8f0ff;
            border: 1px solid #6ea8fe;
          }
        `}
      </style>
    </CContainer>
  )
}

export default ProjectCreationWizard
