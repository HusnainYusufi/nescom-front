
import api from './api'

const orderService = {

  getList: async (params = {}) => {
    const { data } = await api.get('/orders', { params })
    return data
  },

  getMyAssigned: async (params = {}) => {
    const { data } = await api.get('/orders/my-assigned', { params })
    return data
  },


  getAll: async () => {
    const { data } = await api.get('/orders')
    return data.orders
  },

  // POST /imports/upload (form-data key = orderSheet)
  importSheet: async (file) => {
    const formData = new FormData()
    formData.append('orderSheet', file)
    const { data } = await api.post('/imports/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  // POST /orders/:orderNo/boxes
  createBox: async (orderNo, box) => {
    const { data } = await api.post(`/orders/${orderNo}/boxes`, box)
    return data
  },

  // POST /orders/manual
  createManual: async (orderData) => {
    const { data } = await api.post('/orders/manual', orderData)
    return data
  },

  // POST /orders/royal-box/bulk
  markRoyalBoxBulk: async (orderNos) => {
    const res = await api.post('/orders/royal-box/bulk', { orderNos })
    return res.data
  },

  // POST /orders/:orderNo/royal-box/disable
  unmarkRoyalBox: async (orderNo) => {
    const res = await api.post(`/orders/${orderNo}/royal-box/disable`)
    return res.data
  },


  assignWarehouse: async (orderNo, userId) => {
    const { data } = await api.post(`/orders/${orderNo}/assign-warehouse`, { userId })
    return data
  },

  // POST /orders/:orderNo/assign-royal      
  assignRoyal: async (orderNo, userA, userB) => {
    const { data } = await api.post(`/orders/${orderNo}/assign-royal`, { userA, userB })
    return data
  },

  // ===== Item Allocation (claim picks) =====
  // POST /orders/:orderNo/items/allocate
  // body: { userId: string, picks: [{ lineIndex: number, quantity: number }] }
  allocateItems: async (orderNo, userId, picks) => {
    const { data } = await api.post(`/orders/${orderNo}/items/allocate`, { userId, picks })
    return data
  },

  // ===== Prep flow =====
  // POST /orders/:orderNo/prep/start
  startPrep: async (orderNo) => {
    const { data } = await api.post(`/orders/${orderNo}/prep/start`)
    return data
  },

  // POST /orders/:orderNo/prep/complete
  completePrep: async (orderNo) => {
    const { data } = await api.post(`/orders/${orderNo}/prep/complete`)
    return data
  },

  // GET /orders/:orderNo/next-statuses
  getNextStatuses: async (orderNo) => {
    const { data } = await api.get(`/orders/${orderNo}/next-statuses`)
    return data
  },

  // POST /orders/:orderNo/scan
  scanStatus: async (orderNo, payload) => {
    const { data } = await api.post(`/orders/${orderNo}/scan`, payload)
    return data
  },


  getCarriers: async () => {
    const { data } = await api.get('/carriers')
    // returns { status: 200, result: [ ... ] } based on your sample
    return data
  },


  selectCarrier: async (orderNo, carrierCode) => {
    const { data } = await api.post(`/orders/${orderNo}/select-carrier`, { carrierCode })
    return data
  },


  getLineCarriers: async (orderNo) => {
    const { data } = await api.get(`/orders/${orderNo}/line-carriers`)
    return data
  },

  setLineCarriers: async (orderNo, lines) => {
    const { data } = await api.post(`/orders/${orderNo}/line-carriers`, { lines })
    return data
  },

  mergeLineCarriers: async (orderNo, lines) => {
    const { data } = await api.post(`/orders/${orderNo}/line-carriers`, lines, {
      params: { mode: 'merge' },
    })
    return data
  },

  previewDispatchPlan: async (orderNo, lines) => {
    const { data } = await api.post(`/orders/${orderNo}/dispatch-plan/preview`, { lines })
    return data
  },


  createDispatchPlan: async (orderNo, lines) => {
    const { data } = await api.post(`/orders/${orderNo}/dispatch-plan`, { lines })
    return data
  },
  
}

export default orderService
