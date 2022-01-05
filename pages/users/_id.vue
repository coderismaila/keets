<template>
  <v-container>
    <v-card>
      <v-card-title>User Details</v-card-title>
      <v-card-text>
        <p>
          Full Name:
          {{
            user.firstName +
            ' ' +
            user.lastName +
            ' ' +
            (user.middleName ? user.middleName : '')
          }}
        </p>
        <p>Username: {{ user.user.username }}</p>
        <p>Email: {{ user.user.email }}</p>
        <p>Staff ID: {{ user.user.staffId }}</p>
        <p>Role: {{ user.user.role }}</p>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
export default {
  name: 'UserDetail',
  data() {
    return {}
  },
  async fetch() {
    await this.$store.dispatch('user/getAllUsers')
  },

  computed: {
    user() {
      return this.$store.getters['user/getUserById'](this.$route.params.id)
    },
  },
}
</script>
