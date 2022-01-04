<template>
  <v-container class="mt-8">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="pa-8">
          <v-card-title class="headline justify-center">Sign In </v-card-title>
          <v-alert v-if="error" type="error" dismissible dense>
            {{ error_message }}
          </v-alert>
          <v-form v-model="valid" lazy-validation class="mt-8">
            <v-text-field
              v-model="formData.username"
              outlined
              placeholder="Username, Staff ID or Email"
              prepend-inner-icon="mdi-account"
              :rules="[rules.required]"
            />
            <v-text-field
              v-model="formData.password"
              outlined
              placeholder="Password"
              :type="hidePassword ? 'password' : 'text'"
              prepend-inner-icon="mdi-lock"
              :append-icon="hidePassword ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[rules.required]"
              @click:append="() => (hidePassword = !hidePassword)"
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
              :disabled="!valid"
              @click.prevent="handleSubmit"
              >sign in</v-btn
            >
            <p class="mt-4 text-center">
              Don't have an account?
              <nuxt-link to="/auth/signup">Sign Up </nuxt-link>
            </p>
          </v-form>
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
      valid: false,
      loading: false,
      hidePassword: true,
      error: false,
      error_message: '',
      formData: {
        username: '',
        password: '',
      },
      rules: {
        required: (v) => !!v || 'Required.',
      },
    }
  },
  methods: {
    async handleSubmit() {
      this.loading = true
      this.error = false
      this.error_message = ''
      try {
        await this.$auth.loginWith('local', {
          data: this.formData,
        })

        this.loading = false
        this.$router.back()
      } catch ({ response }) {
        this.error = true
        this.error_message = response.data.message
        this.loading = false
      }
    },
  },
}
</script>
<style scoped>
a {
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
