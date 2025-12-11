// src/views/pages/production/ProjectCreationWizard.js
import React, { useEffect, useMemo, useState } from 'react'
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

  const assemblyLibrary = useMemo(() => {
    const collected = []
    existingProjects.forEach((project) => {
      ;(project.sets || []).forEach((set) => {
        ;(set.assemblies || []).forEach((assembly, idx) => {
          collected.push({
            id: `${project.id}-${set.id}-${idx}`,
            name: assembly,
            type: 'Assembly',
            description: 'Imported from existing project',
            source: `${project.name} / ${set.name}`,
          })
        })
      })
    })
    return collected
  }, [existingProjects])

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
      assemblies: [
        {
          id: 'as-1',
          name: 'Assembly 1',
          type: 'Assembly',
          description: 'Baseline assembly for this set',
          source: 'Local',
          saved: true,
        },
      ],
    },
  ])
  const [assemblyInventory, setAssemblyInventory] = useState([])
  const [selectedProjectId, setSelectedProjectId] = useState('')
  const [alert, setAlert] = useState('')
  const [errors, setErrors] = useState({})

  const progressValue = Math.round(((currentStep + 1) / steps.length) * 100)

  const stepStates = useMemo(
    () =>
      steps.map((step, index) => {
        if (index < currentStep) return { ...step, state: 'complete' }
        if (index === currentStep) return { ...step, state: 'active' }
        return { ...step, state: 'upcoming' }
      }),
    [currentStep, steps],
  )

  useEffect(() => {
    setAssemblyInventory((prev) => {
      const seen = new Set(prev.map((item) => item.id))
      const additions = assemblyLibrary.filter((item) => !seen.has(item.id))
      return additions.length ? [...prev, ...additions] : prev
    })
  }, [assemblyLibrary])

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
                {
                  id: `st-${Date.now()}`,
                  name: `Structure ${set.structures.length + 1}`,
                  material: '',
                },
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
                {
                  id: `as-${Date.now()}`,
                  name: `Assembly ${set.assemblies.length + 1}`,
                  type: 'Assembly',
                  description: '',
                  source: 'Local',
                  saved: false,
                },
              ],
            }
          : set,
      ),
    )
  }

  const updateStructureField = (setId, structureId, field, value) => {
    setSets((prev) =>
      prev.map((set) =>
        set.id === setId
          ? {
              ...set,
              structures: set.structures.map((structure) =>
                structure.id === structureId ? { ...structure, [field]: value } : structure,
              ),
            }
          : set,
      ),
    )
  }

  const updateAssemblyField = (setId, assemblyId, field, value) => {
    setSets((prev) =>
      prev.map((set) =>
        set.id === setId
          ? {
              ...set,
              assemblies: set.assemblies.map((assembly) =>
                assembly.id === assemblyId ? { ...assembly, [field]: value } : assembly,
              ),
            }
          : set,
      ),
    )
  }

  const addAssemblyFromInventory = (setId, inventoryId) => {
    const template = assemblyInventory.find((item) => item.id === inventoryId)
    if (!template) return

    setSets((prev) =>
      prev.map((set) =>
        set.id === setId
          ? {
              ...set,
              assemblies: [
                ...set.assemblies,
                {
                  id: `as-${Date.now()}`,
                  name: template.name,
                  type: template.type || 'Assembly',
                  description: template.description || '',
                  source: template.source || 'Inventory',
                  saved: true,
                },
              ],
            }
          : set,
      ),
    )
  }

  const saveAssemblyToInventory = (assembly) => {
    if (!assembly.name) return
    const exists = assemblyInventory.some(
      (item) => item.name.toLowerCase() === assembly.name.toLowerCase(),
    )
    if (exists) return

    const newInventoryItem = {
      id: `inventory-${Date.now()}`,
      name: assembly.name,
      type: assembly.type || 'Assembly',
      description: assembly.description || 'Saved from project wizard',
      source: 'Wizard inventory',
    }
    setAssemblyInventory((prev) => [...prev, newInventoryItem])
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
      {sets.map((set) => {
        const existingAssemblyNames = assemblyInventory.map((item) => item.name.toLowerCase())
        return (
          <CCol xs={12} key={set.id}>
            <CCard className="shadow-sm composition-card">
              <CCardHeader className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div>
                  <h6 className="mb-1">{set.name}</h6>
                  <p className="small text-body-secondary mb-0">
                    Capture structures and assemblies for this set. Pull from inventory or create new ones on the fly.
                  </p>
                </div>
                <CBadge color="primary">Step 3</CBadge>
              </CCardHeader>
              <CCardBody>
                <CRow className="g-4">
                  <CCol md={6}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="text-body-secondary mb-0">Structures</h6>
                      <CButton color="secondary" size="sm" variant="outline" onClick={() => addStructure(set.id)}>
                        Add structure
                      </CButton>
                    </div>
                    <CRow className="g-2">
                      {set.structures.map((structure) => (
                        <CCol md={12} key={structure.id}>
                          <div className="p-3 border rounded-3 bg-body-tertiary h-100">
                            <CFormInput
                              label="Structure name"
                              value={structure.name}
                              placeholder="e.g., Control frame"
                              className="mb-2"
                              onChange={(event) =>
                                updateStructureField(set.id, structure.id, 'name', event.target.value)
                              }
                            />
                            <CFormInput
                              label="Material / spec"
                              value={structure.material}
                              placeholder="Composite, metallic, etc."
                              onChange={(event) =>
                                updateStructureField(set.id, structure.id, 'material', event.target.value)
                              }
                            />
                          </div>
                        </CCol>
                      ))}
                      {set.structures.length === 0 && (
                        <CCol>
                          <CAlert color="light" className="text-center mb-0">
                            No structures yet. Add a structure to describe the core build items.
                          </CAlert>
                        </CCol>
                      )}
                    </CRow>
                  </CCol>

                  <CCol md={6}>
                    <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
                      <div>
                        <h6 className="text-body-secondary mb-0">Assemblies</h6>
                        <small className="text-body-secondary">Reuse from inventory or create new.</small>
                      </div>
                      <CButton color="secondary" size="sm" variant="outline" onClick={() => addAssembly(set.id)}>
                        Add new assembly
                      </CButton>
                    </div>

                    <CFormSelect
                      size="sm"
                      className="mb-3"
                      value=""
                      onChange={(event) => addAssemblyFromInventory(set.id, event.target.value)}
                    >
                      <option value="">Pull an assembly from inventory</option>
                      {assemblyInventory.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name} — {item.source}
                        </option>
                      ))}
                    </CFormSelect>

                    <CRow className="g-3">
                      {set.assemblies.map((assembly) => {
                        const alreadySaved = existingAssemblyNames.includes(assembly.name?.toLowerCase())
                        return (
                          <CCol md={12} key={assembly.id}>
                            <div className="p-3 border rounded-3 bg-body h-100 shadow-sm">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                  <h6 className="mb-0">{assembly.name || 'New assembly'}</h6>
                                  <small className="text-body-secondary">{assembly.source || 'Local'}</small>
                                </div>
                                <CBadge color={assembly.saved || alreadySaved ? 'success' : 'secondary'}>
                                  {assembly.saved || alreadySaved ? 'In inventory' : 'Draft'}
                                </CBadge>
                              </div>

                              <CRow className="g-2 mb-2">
                                <CCol md={8}>
                                  <CFormInput
                                    label="Assembly name"
                                    value={assembly.name}
                                    placeholder="e.g., Avionics rack"
                                    onChange={(event) =>
                                      updateAssemblyField(set.id, assembly.id, 'name', event.target.value)
                                    }
                                  />
                                </CCol>
                                <CCol md={4}>
                                  <CFormSelect
                                    label="Type"
                                    value={assembly.type}
                                    onChange={(event) =>
                                      updateAssemblyField(set.id, assembly.id, 'type', event.target.value)
                                    }
                                  >
                                    <option value="Assembly">Assembly</option>
                                    <option value="Sub-assembly">Sub-assembly</option>
                                    <option value="Kit">Kit</option>
                                  </CFormSelect>
                                </CCol>
                                <CCol md={12}>
                                  <CFormTextarea
                                    label="Notes / parts"
                                    value={assembly.description || ''}
                                    placeholder="List key parts or notes for procurement"
                                    rows={2}
                                    onChange={(event) =>
                                      updateAssemblyField(set.id, assembly.id, 'description', event.target.value)
                                    }
                                  />
                                </CCol>
                              </CRow>

                              <div className="d-flex justify-content-between align-items-center">
                                <small className="text-body-secondary">Save frequently used assemblies to reuse later.</small>
                                <CButton
                                  color="success"
                                  size="sm"
                                  disabled={!assembly.name || alreadySaved}
                                  onClick={() => {
                                    saveAssemblyToInventory(assembly)
                                    updateAssemblyField(set.id, assembly.id, 'saved', true)
                                  }}
                                >
                                  {alreadySaved ? 'Already in inventory' : 'Save to inventory'}
                                </CButton>
                              </div>
                            </div>
                          </CCol>
                        )
                      })}
                      {set.assemblies.length === 0 && (
                        <CCol>
                          <CAlert color="light" className="text-center mb-0">
                            No assemblies yet. Select from inventory or add a new one to get started.
                          </CAlert>
                        </CCol>
                      )}
                    </CRow>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          </CCol>
        )
      })}
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
          <CCard className="shadow-sm border-0 wizard-card">
            <CCardHeader className="wizard-card__header border-0 pb-0">
              <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <div>
                  <h4 className="mb-1">Create a project</h4>
                  <p className="text-body-secondary mb-0">Multi-step flow to add a project, sets, and reusable structures.</p>
                </div>
                <CBadge color="warning" className="text-dark">
                  Guided wizard
                </CBadge>
              </div>
              <CProgress height={12} color="primary" value={progressValue} className="mb-3 wizard-progress" />
              <CRow className="g-3 mb-3 wizard-steps" role="list">
                {stepStates.map((step, index) => (
                  <CCol key={step.key} sm={6} lg={3} role="listitem">
                    <div className={`wizard-step wizard-step--${step.state}`}>
                      <div className="wizard-step__icon">
                        {step.state === 'complete' ? '✓' : index + 1}
                      </div>
                      <div className="wizard-step__content">
                        <span className="wizard-step__title">{step.title}</span>
                        <small className="text-body-secondary d-block">{step.summary}</small>
                      </div>
                    </div>
                  </CCol>
                ))}
              </CRow>
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
          .wizard-card {
            background: var(--cui-body-bg);
          }
          .wizard-card__header {
            background: transparent;
          }
          .wizard-progress {
            --cui-progress-bg: var(--cui-tertiary-bg);
          }
          .wizard-steps {
            --wizard-step-gap: 0.75rem;
          }
          .wizard-step {
            display: flex;
            gap: var(--wizard-step-gap);
            align-items: center;
            border: 1px solid var(--cui-border-color);
            border-radius: 0.75rem;
            padding: 0.75rem 0.85rem;
            background: var(--cui-body-bg);
            min-height: 80px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
          }
          .wizard-step__icon {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            background: var(--cui-tertiary-bg);
            color: var(--cui-body-color);
          }
          .wizard-step__title {
            font-weight: 700;
            display: block;
          }
          .wizard-step--active {
            border-color: var(--cui-primary);
            box-shadow: 0 6px 18px rgba(0, 98, 204, 0.25);
          }
          .wizard-step--active .wizard-step__icon {
            background: var(--cui-primary);
            color: #fff;
          }
          .wizard-step--complete {
            border-color: var(--cui-success);
            background: rgba(25, 135, 84, 0.08);
          }
          .wizard-step--complete .wizard-step__icon {
            background: var(--cui-success);
            color: #fff;
          }
          .wizard-step--upcoming {
            opacity: 0.8;
          }
          .composition-card {
            border: 1px solid var(--cui-border-color);
          }
          .composition-card .bg-body-tertiary {
            background: var(--cui-tertiary-bg) !important;
          }
          .composition-card .bg-body {
            background: var(--cui-body-bg) !important;
          }
          @media (max-width: 767.98px) {
            .wizard-step {
              min-height: auto;
            }
          }
        `}
      </style>
    </CContainer>
  )
}

export default ProjectCreationWizard
