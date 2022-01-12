// state
export const state = () => ({
  stations: [],
  error: false,
  error_message: '',
})

// mutation
export const mutations = {
  SET_STATIONS(state, payload) {
    state.stations = payload
  },
  ADD_STATION(state, payload) {
    state.stations.push(payload)
  },
  REMOVE_STATION(state, payload) {
    state.stations = state.stations.filter(
      (station) => station.id !== payload.id
    )
  },
  UPDATE_STATION(state, payload) {
    const index = state.stations.findIndex((c) => c.id === payload.id)
    state.stations.splice(index, 1, payload)
  },
  SET_ERROR(state, payload) {
    state.error = payload ? payload.error : false
    state.error_message = payload ? payload.message : ''
  },
}

// getters
export const getters = {
  getStationById: (state) => (id) => {
    return state.stations.find((station) => station.id === id)
  },

  getStationFeeders: (state, getters) => (id) => {
    const feeders = []
    const stations = getters.getStationById(id)

    stations.powerTransformer.forEach((powertx) =>
      feeders.push(...powertx.feeder)
    )
    return feeders
  },

  stationTableData: (state) => {
    const data = []
    state.stations.forEach((station) => {
      data.push({
        id: station.id,
        name: station.name,
        capacity: station.powerTransformer?.reduce(function (acc, cur) {
          return acc + cur.capacityKVA
        }, 0),
        stationType: station.stationType,
        areaOfficeName: station.areaOffice?.name,
        powerTransformer: station.powerTransformer,
      })
    })
    return data
  },
}

// action
export const actions = {
  async getAllStations(context) {
    try {
      context.commit('SET_ERROR')
      const stations = await this.$axios.$get('/station')
      context.commit('SET_STATIONS', stations)
    } catch ({ response }) {
      context.commit('SET_ERROR', {
        error: true,
        message: response.data.message,
      })
    }
  },

  async addStation(context, payload) {
    try {
      context.commit('SET_ERROR')
      const category = await this.$axios.$post('/station', payload)
      context.commit('ADD_STATION', category)
    } catch ({ response }) {
      // eslint-disable-next-line no-console
      console.log('response error', response.data)
      context.commit('SET_ERROR', {
        error: true,
        message: response.data.message,
      })
    }
  },

  async updateStation(context, payload) {
    try {
      context.commit('SET_ERROR')
      const station = await this.$axios.$patch(
        `/station/${payload.id}`,
        payload
      )

      context.commit('UPDATE_STATION', station)
    } catch ({ response }) {
      // eslint-disable-next-line no-console
      console.log('response error', response.data)
      context.commit('SET_ERROR', {
        error: true,
        message: response.data.message,
      })
    }
  },

  async deleteStation(context, payload) {
    try {
      context.commit('SET_ERROR')
      const station = await this.$axios.$delete(`/station/${payload.id}`)
      context.commit('REMOVE_STATION', station)
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
