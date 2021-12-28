<template>
  <v-container class="mt-8">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="pa-8">
          <v-card-title class="headline justify-center">Sign In </v-card-title>
          <v-alert v-if="error" type="error" dismissible dense>
            {{ error_message }}
          </v-alert>
          <form class="mt-8">
            <v-text-field
              v-model="formData.username"
              outlined
              placeholder="Username, Staff ID or Email"
              prepend-inner-icon="mdi-account"
              required
            />
            <v-text-field
              v-model="formData.password"
              outlined
              placeholder="Password"
              :type="showPassword ? 'password' : 'text'"
              prepend-inner-icon="mdi-lock"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              required
              @click:append="() => (showPassword = !showPassword)"
            />
            <nuxt-link to="/auth/forgot-password" class="block"
              >Forgot password?</nuxt-link
            >
            <v-btn
              class="mt-8"
              color="primary"
              block
              large
              :loading="loading"
              type="submit"
              @click.prevent="handleSubmit"
              >sign in</v-btn
            >
            <p class="mt-4 text-center">
              Don't have an account?
              <nuxt-link to="/auth/signup">Sign Up </nuxt-link>
            </p>
          </form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: 'SigninPage',
  auth: false,
  layout: 'auth',
  data() {
    return {
      loading: false,
      showPassword: false,
      error: false,
      error_message: '',
      formData: {
        username: '',
        password: '',
      },
    }
  },
  methods: {
    async handleSubmit() {
      this.error = false
      this.error_message = ''
      try {
        this.loading = true
        await this.$auth.loginWith('local', {
          data: this.formData,
        })
        this.loading = false
        this.$router.push('/dashboard')
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error)
        this.error = true
        this.error_message = error.response.data.message
        this.loading = false
      }
    },
  },
}
</script>
<style>
a {
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
