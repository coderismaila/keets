<template>
  <v-app>
    <v-app-bar elevate-on-scroll elevation="1" clipped-left fixed app>
      <v-toolbar-title v-text="title" />
      <v-spacer />

      <v-btn v-if="!$auth.loggedIn" color="primary" nuxt to="/auth/signin"
        >sign in</v-btn
      >
      <v-btn v-if="!$auth.loggedIn" nuxt to="/auth/signup" class="ml-2"
        >sign up</v-btn
      >
      <v-btn v-if="$auth.loggedIn" @click="signOut">sign out</v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>
<script>
export default {
  name: 'HomeLayout',
  data() {
    return {
      title: 'KEETS',
    }
  },
  methods: {
    async signOut() {
      try {
        await this.$auth.logout()
        this.$router.push('/')
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error)
      }
    },
  },
}
</script>
