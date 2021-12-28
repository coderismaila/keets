<template>
  <v-container class="mt-8">
    <v-row justify="center" align="center">
      <v-col cols="12" md="6" sm="8">
        <v-card class="pa-8">
          <v-card-title class="headline justify-center"
            >Create an Account</v-card-title
          >
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
              :type="showPassword ? 'password' : 'text'"
              prepend-inner-icon="mdi-lock"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[rules.required, rules.min8]"
              @click:append="() => (showPassword = !showPassword)"
            />
            <v-btn
              type="submit"
              color="primary"
              block
              large
              :disabled="!valid"
              @click.prevent="handleSubmit"
              >sign in</v-btn
            >
            <p class="mt-4 text-center">
              Already have an account?
              <nuxt-link to="/auth/signin">Sign In </nuxt-link>
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
      valid: false,
      showPassword: false,
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
    handleSubmit() {
      // eslint-disable-next-line no-console
      console.log(this.formData)
    },
  },
}
</script>
