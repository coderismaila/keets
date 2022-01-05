// state
export const state = () => ({
  jobDescriptions: [],
  error: false,
  error_message: '',
})

// mutation
export const mutations = {
  SET_JOB_DESCRIPTIONS(state, payload) {
    state.jobDescriptions = payload
  },
  ADD_JOB_DESCRIPTION(state, payload) {
    state.jobDescriptions.push(payload)
  },
  REMOVE_JOB_DESCRIPTION(state, payload) {
    state.jobDescriptions = state.jobDescriptions.filter(
      (jobDescription) => jobDescription.id !== payload.id
    )
  },
  UPDATE_JOB_DESCRIPTION(state, payload) {
    const index = state.jobDescriptions.findIndex((c) => c.id === payload.id)
    state.jobDescriptions.splice(index, 1, payload)
  },
  SET_ERROR(state, payload) {
    state.error = payload ? payload.error : false
    state.error_message = payload ? payload.message : ''
  },
}

// getters
export const getters = {
  getUserById: (state) => (id) => {
    return state.jobDescriptions.find(
      (jobDescription) => jobDescription.id === id
    )
  },
}

// action
export const actions = {
  async getAlljobDescriptions(context) {
    try {
      context.commit('SET_ERROR')
      const jobDescriptions = await this.$axios.$get('/job-description')
      context.commit('SET_JOB_DESCRIPTIONS', jobDescriptions)
    } catch ({ response }) {
      context.commit('SET_ERROR', {
        error: true,
        message: response.data.message,
      })
    }
  },
  async addJobDescription(context, payload) {
    try {
      context.commit('SET_ERROR')
      const jobDescription = await this.$axios.$post(
        '/job-description',
        payload
      )
      context.commit('ADD_JOB_DESCRIPTION', jobDescription)
    } catch ({ response }) {
      // eslint-disable-next-line no-console
      console.log('response error', response.data)
      context.commit('SET_ERROR', {
        error: true,
        message: response.data.message,
      })
    }
  },
  async updateUser(context, payload) {
    try {
      context.commit('SET_ERROR')
      const jobDescription = await this.$axios.$patch(
        `/job-description/${payload.id}`,
        payload
      )
      context.commit('UPDATE_JOB_DESCRIPTION', jobDescription)
    } catch ({ response }) {
      // eslint-disable-next-line no-console
      console.log('response error', response.data)
      context.commit('SET_ERROR', {
        error: true,
        message: response.data.message,
      })
    }
  },
  async deleteUser(context, payload) {
    try {
      context.commit('SET_ERROR')
      const jobDescription = await this.$axios.$delete(
        `/job-description/${payload.id}`
      )
      context.commit('REMOVE_JOB_DESCRIPTION', jobDescription)
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
