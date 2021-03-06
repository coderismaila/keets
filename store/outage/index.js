import dayjs from 'dayjs'

// state
export const state = () => ({
  outages: [],
  error: false,
  error_message: '',
})

// mutation
export const mutations = {
  SET_OUTAGES(state, payload) {
    state.outages = payload
  },

  ADD_OUTAGE(state, payload) {
    state.outages.push(payload)
  },
  REMOVE_OUTAGE(state, payload) {
    state.outages = state.outages.filter((outage) => outage.id !== payload.id)
  },
  UPDATE_OUTAGE(state, payload) {
    const index = state.outages.findIndex((c) => c.id === payload.id)
    state.outages.splice(index, 1, payload)
  },
  SET_ERROR(state, payload) {
    state.error = payload ? payload.error : false
    state.error_message = payload ? payload.message : ''
  },
}

// getters
export const getters = {
  getOutageById: (state) => (id) => {
    return state.outages.find((outage) => outage.id === id)
  },

  getAllUserStationOutages(state, getters, rootState) {
    if (state.outages.length === 0) return []
    if (rootState.auth.user.areaOffice.name === 'head office')
      return state.outages
    return state.outages.filter(
      (outage) => outage.feeder.stationId === rootState.auth.user.stationId
    )
  },

  dailyOutages(state, getters, rootState) {
    const result = []
    for (const outage of getters.getAllUserStationOutages) {
      if (
        dayjs(outage.timeOut).date() === dayjs().date() &&
        dayjs(outage.timeOut).year() === dayjs().year()
      ) {
        result.push(outage)
      }
    }
    return result.length
  },
  weeklyOutages(state, getters, rootState) {
    const result = []
    for (const outage of getters.getAllUserStationOutages) {
      if (
        dayjs(outage.timeOut).week() === dayjs().week() &&
        dayjs(outage.timeOut).year() === dayjs().year()
      ) {
        result.push(outage)
      }
    }
    return result.length
  },

  monthlyOutages(state, getters) {
    const result = []
    for (const outage of getters.getAllUserStationOutages) {
      if (
        dayjs(outage.timeOut).month() === dayjs().month() &&
        dayjs(outage.timeOut).year() === dayjs().year()
      ) {
        result.push(outage)
      }
    }
    return result.length
  },

  yearlyOutages(state, getters) {
    const result = []
    for (const outage of getters.getAllUserStationOutages) {
      if (dayjs(outage.timeOut).year() === dayjs().year()) {
        result.push(outage)
      }
    }
    return result.length
  },
}

// action
export const actions = {
  async getAllOutages(context) {
    try {
      context.commit('SET_ERROR')
      const outages = await this.$axios.$get('/outage')
      context.commit('SET_OUTAGES', outages)
    } catch ({ response }) {
      context.commit('SET_ERROR', {
        error: true,
        message: response.data.message,
      })
    }
  },

  async addOutage(context, payload) {
    try {
      context.commit('SET_ERROR')
      // eslint-disable-next-line no-console
      console.log(payload)
      const outage = await this.$axios.$post('/outage', payload, {
        'Content-Type': 'application/json',
      })
      context.commit('ADD_OUTAGE', outage)
      return outage
    } catch ({ response }) {
      // eslint-disable-next-line no-console
      console.log('response error', response.data)
      context.commit('SET_ERROR', {
        error: true,
        message: response.data.message,
      })
    }
  },

  async updateOutage(context, payload) {
    // eslint-disable-next-line no-console
    console.log('payload', payload)
    try {
      context.commit('SET_ERROR')
      const outage = await this.$axios.$patch(`/outage/${payload.id}`, payload)

      context.commit('UPDATE_OUTAGE', outage)
    } catch ({ response }) {
      // eslint-disable-next-line no-console
      console.log('response error', response.data)
      context.commit('SET_ERROR', {
        error: true,
        message: response.data.message,
      })
    }
  },

  async deleteOutage(context, payload) {
    try {
      context.commit('SET_ERROR')
      const outage = await this.$axios.$delete(`/outage/${payload.id}`)
      context.commit('REMOVE_OUTAGE', outage)
    } catch ({ response }) {
      // eslint-disable-next-line no-console
      console.log('response error', response.data)
      context.commit('SET_ERROR', {
        error: true,
        message: response.data.message,
      })
    }
  },
}
