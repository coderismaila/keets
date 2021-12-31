// state
export const state = () => ({
  areaOffices: [],
  error: false,
  error_message: '',
})

// mutation
export const mutations = {
  SET_AREA_OFFICES(state, payload) {
    state.areaOffices = payload
  },
  ADD_AREA_OFFICE(state, payload) {
    state.areaOffices.push(payload)
  },
  REMOVE_AREA_OFFICE(state, payload) {
    state.areaOffices = state.areaOffices.filter(
      (areaOffice) => areaOffice.id !== payload.id
    )
  },
  UPDATE_CATEGORY(state, payload) {
    const index = state.areaOffices.findIndex((c) => c.id === payload.id)
    state.areaOffices.splice(index, 1, payload)
  },
  SET_ERROR(state, payload) {
    state.error = payload ? payload.error : false
    state.error_message = payload ? payload.message : ''
  },
}

// getters
export const getters = {
  areaOfficeNames: (state) => {
    return [...state.areaOffices.map((areaOffice) => areaOffice.name)]
  },
}

// action
export const actions = {
  async getAllAreaOffices(context) {
    try {
      // context.commit('SET_ERROR')
      const areaOffices = await this.$axios.$get('/area-office')
      context.commit('SET_AREA_OFFICES', areaOffices)
    } catch ({ response }) {
      context.commit('SET_ERROR', {
        error: true,
        message: response.data.message,
      })
    }
  },
  async addAreaOffice(context, payload) {
    try {
      context.commit('SET_ERROR')
      const areaOffice = await this.$axios.$post('/area-office', payload)
      context.commit('ADD_AREA_OFFICE', areaOffice)
    } catch ({ response }) {
      // eslint-disable-next-line no-console
      console.log('response error', response.data)
      context.commit('SET_ERROR', {
        error: true,
        message: response.data.message,
      })
    }
  },
  async updateAreaOffice(context, payload) {
    try {
      context.commit('SET_ERROR')
      const areaOffice = await this.$axios.$patch(
        `/area-office/${payload.id}`,
        payload
      )
      context.commit('UPDATE_CATEGORY', areaOffice)
    } catch ({ response }) {
      // eslint-disable-next-line no-console
      console.log('response error', response.data)
      context.commit('SET_ERROR', {
        error: true,
        message: response.data.message,
      })
    }
  },
  async deleteAreaOffice(context, payload) {
    try {
      context.commit('SET_ERROR')
      const areaOffice = await this.$axios.$delete(`/area-office/${payload.id}`)
      context.commit('REMOVE_AREA_OFFICE', areaOffice)
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
