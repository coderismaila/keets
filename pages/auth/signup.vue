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
              :rules="[rules.required, rules.min4]"
            />
            <v-text-field
              v-model="formData.staffId"
              type="number"
              outlined
              placeholder="Staff ID"
              prepend-inner-icon="mdi-numeric"
              :rules="[rules.required, rules.min4, rules.max6]"
            />
            <v-text-field
              v-model="formData.email"
              type="email"
              outlined
              placeholder="Email"
              prepend-inner-icon="mdi-email"
              :rules="[rules.required, rules.email]"
            />
            <v-text-field
              v-model="formData.password"
              outlined
              placeholder="Password"
              :type="hidePassword ? 'password' : 'text'"
              prepend-inner-icon="mdi-lock"
              :append-icon="hidePassword ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[rules.required, rules.min8]"
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
export default {
  name: 'SignupPage',
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
      rules: {
        required: (v) => !!v || 'Required.',
        min8: (v) => v.length >= 8 || 'Min 8 characters',
        min4: (v) => v.length >= 4 || 'Min 4 characters',
        max6: (v) => v.length <= 6 || 'Max 6 characters',
        email: (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
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
