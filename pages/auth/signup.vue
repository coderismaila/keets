<template>
  <v-container class="mt-8">
    <v-row justify="center" align="center">
      <v-col cols="12" md="6" sm="8">
        <v-card class="pa-8">
          <v-card-title class="headline justify-center"
            >Create an Account</v-card-title
          >
          <v-alert v-if="error" type="error" dismissible>
            {{ error_message }}
          </v-alert>
          <v-form ref="form" v-model="valid" lazy-validation class="mt-8">
            <v-text-field
              v-model="formData.username"
              outlined
              placeholder="Username"
              prepend-inner-icon="mdi-account"
              :rules="[required, min4]"
            />
            <v-text-field
              v-model="formData.staffId"
              type="number"
              outlined
              placeholder="Staff ID"
              prepend-inner-icon="mdi-numeric"
              :rules="[required, min4, max6]"
            />
            <v-text-field
              v-model="formData.email"
              type="email"
              outlined
              placeholder="Email"
              prepend-inner-icon="mdi-email"
              :rules="[required, email]"
            />
            <v-text-field
              v-model="formData.password"
              outlined
              placeholder="Password"
              :type="hidePassword ? 'password' : 'text'"
              prepend-inner-icon="mdi-lock"
              :append-icon="hidePassword ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[required, min8]"
              @click:append="() => (hidePassword = !hidePassword)"
            />
            <v-btn
              type="submit"
              color="primary"
              block
              large
              :disabled="!valid"
              :loading="loading"
              @click.prevent="handleSubmit"
              >sign up</v-btn
            >
            <p class="mt-4 text-center">
              Already have an account?
              <nuxt-link to="/auth/signin">Sign in </nuxt-link>
            </p>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import rules from '~/mixins/rules'

export default {
  name: 'SignupPage',
  mixins: [rules],
  auth: false,
  layout: 'auth',
  data() {
    return {
      valid: true,
      hidePassword: true,
      loading: false,
      showPassword: false,
      error: false,
      error_message: '',
      formData: {
        username: '',
        email: '',
        staffId: '',
        password: '',
      },
    }
  },
  methods: {
    async handleSubmit() {
      if (!this.$refs.form.validate()) return

      this.error = false
      this.error_message = ''
      try {
        this.loading = true
        const response = await this.$axios.$post('auth/signup', this.formData)
        await this.$auth.setUserToken(response.access_token)
        await this.$auth.fetchUser()
        this.loading = false
        this.$router.push('/dashboard')
      } catch ({ response }) {
        this.error = true
        this.error_message = response.data.message
        this.loading = false
      }
    },
  },
}
</script>
