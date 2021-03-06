// state
export const state = () => ({
  powerTransformers: [],
  error: false,
  error_message: '',
})

// mutation
export const mutations = {
  SET_POWER_TRANSFORMERS(state, payload) {
    state.powerTransformers = payload
  },

  ADD_POWER_TRANSFORMER(state, payload) {
    state.powerTransformers.push(payload)
  },

  REMOVE_POWER_TRANSFORMER(state, payload) {
    state.powerTransformers = state.powerTransformers.filter(
      (powerTransformer) => powerTransformer.id !== payload.id
    )
  },

  UPDATE_POWER_TRANSFORMER(state, payload) {
    const index = state.powerTransformers.findIndex((c) => c.id === payload.id)
    state.powerTransformers.splice(index, 1, payload)
  },

  SET_ERROR(state, payload) {
    state.error = payload ? payload.error : false
    state.error_message = payload ? payload.message : ''
  },
}

// getters
export const getters = {
  getPowerTransformerById: (state) => (id) => {
    return state.powerTransformers.filter(
      (transformer) => transformer.stationId === id
    )
  },
}

// action
export const actions = {
  async getAllPowerTransformers(context) {
    try {
      context.commit('SET_ERROR')
      const powerTransformers = await this.$axios.$get('/power-transformer')
      context.commit('SET_POWER_TRANSFORMERS', powerTransformers)
    } catch ({ response }) {
      context.commit('SET_ERROR', {
        error: true,
        message: response.data.message,
      })
    }
  },
  async addPowerTransformer(context, payload) {
    try {
      context.commit('SET_ERROR')
      const powerTransformer = await this.$axios.$post(
        `/station/${payload.stationId}/power-transformer`,
        payload
      )
      context.commit('ADD_POWER_TRANSFORMER', powerTransformer)
    } catch ({ response }) {
      // eslint-disable-next-line no-console
      console.log('response error', response.data)
      context.commit('SET_ERROR', {
        error: true,
        message: response.data.message,
      })
    }
  },
  async updatePowerTransformer(context, payload) {
    try {
      context.commit('SET_ERROR')
      const powerTransformer = await this.$axios.$patch(
        `/power-transformer/${payload.id}`,
        payload
      )
      context.commit('UPDATE_POWER_TRANSFORMER', powerTransformer)
    } catch ({ response }) {
      // eslint-disable-next-line no-console
      console.log('response error', response.data)
      context.commit('SET_ERROR', {
        error: true,
        message: response.data.message,
      })
    }
  },
  async deletePowerTransformer(context, payload) {
    try {
      context.commit('SET_ERROR')
      const powerTransformer = await this.$axios.$delete(
        `/power-transformer/${payload.id}`
      )
      context.commit('REMOVE_POWER_TRANSFORMER', powerTransformer)
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
