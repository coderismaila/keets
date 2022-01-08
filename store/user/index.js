// state
export const state = () => ({
  users: [],
  error: false,
  error_message: '',
})

// mutation
export const mutations = {
  SET_USERS(state, payload) {
    state.users = payload
  },
  ADD_USER(state, payload) {
    state.users.push(payload)
  },
  REMOVE_USER(state, payload) {
    state.users = state.users.filter((user) => user.id !== payload.id)
  },
  UPDATE_USER(state, payload) {
    const index = state.users.findIndex((c) => c.id === payload.id)
    state.users.splice(index, 1, payload)
  },
  SET_ERROR(state, payload) {
    state.error = payload ? payload.error : false
    state.error_message = payload ? payload.message : ''
  },
}

// getters
export const getters = {
  getUserById: (state) => (id) => {
    return state.users.find((station) => station.id === id)
  },
}

// action
export const actions = {
  async getAllUsers(context) {
    try {
      context.commit('SET_ERROR')
      const users = await this.$axios.$get('/user')
      context.commit('SET_USERS', users)
    } catch ({ response }) {
      context.commit('SET_ERROR', {
        error: true,
        message: response.data.message,
      })
    }
  },
  async addUser(context, payload) {
    try {
      context.commit('SET_ERROR')
      const user = await this.$axios.$post('/user', payload)
      context.commit('ADD_USER', user)
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
      const station = await this.$axios.$patch(`/user/${payload.id}`, payload)
      context.commit('UPDATE_USER', station)
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
      const user = await this.$axios.$delete(`/user/${payload.id}`)
      context.commit('REMOVE_STATION', user)
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
