// state
export const state = () => ({
  feeders: [],
  error: false,
  error_message: '',
})

// mutation
export const mutations = {
  SET_FEEDERS(state, payload) {
    state.feeders = payload
  },
  ADD_FEEDER(state, payload) {
    state.feeders.push(payload)
  },
  REMOVE_FEEDER(state, payload) {
    state.feeders = state.feeders.filter((feeder) => feeder.id !== payload.id)
  },
  UPDATE_FEEDER(state, payload) {
    const index = state.feeders.findIndex((c) => c.id === payload.id)
    state.feeders.splice(index, 1, payload)
  },
  SET_ERROR(state, payload) {
    state.error = payload ? payload.error : false
    state.error_message = payload ? payload.message : ''
  },
}

// getters
export const getters = {
  getFeederById: (state) => (id) => {
    return state.feeders.find((feeder) => feeder.id === id)
  },

  get33kvFeeders: (state) => {
    return state.feeders.filter((feeder) => feeder.voltageLevel === 'KV33')
  },

  getUserStationFeeders: (state, getters, rootState) => {
    return state.feeders.filter(
      (feeder) => feeder.stationId === rootState.auth.user.stationId
    )
  },
}

// action
export const actions = {
  async getAllFeeders(context) {
    try {
      context.commit('SET_ERROR')
      const feeders = await this.$axios.$get('/feeder')
      context.commit('SET_FEEDERS', feeders)
    } catch ({ response }) {
      context.commit('SET_ERROR', {
        error: true,
        message: response.data.message,
      })
    }
  },
  async addFeeder(context, payload) {
    try {
      context.commit('SET_ERROR')
      const feeder = await this.$axios.$post('/feeder', payload)
      context.commit('ADD_FEEDER', feeder)
    } catch ({ response }) {
      // eslint-disable-next-line no-console
      console.log('response error', response.data)
      context.commit('SET_ERROR', {
        error: true,
        message: response.data.message,
      })
    }
  },

  async updateFeeder(context, payload) {
    try {
      context.commit('SET_ERROR')
      const feeder = await this.$axios.$patch(`/feeder/${payload.id}`, payload)
      context.commit('UPDATE_FEEDER', feeder)
    } catch ({ response }) {
      // eslint-disable-next-line no-console
      console.log('response error', response.data)
      context.commit('SET_ERROR', {
        error: true,
        message: response.data.message,
      })
    }
  },
  async deleteFeeder(context, payload) {
    try {
      context.commit('SET_ERROR')
      const feeder = await this.$axios.$delete(`/feeder/${payload.id}`)
      context.commit('REMOVE_STATION', feeder)
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
