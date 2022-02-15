<template>
  <v-container class="mt-8">
    <v-card width="450px" shaped class="pa-12 mx-auto">
      <nuxt-link to="/">
        <v-img
          src="/images/logo.png"
          height="50px"
          width="50px"
          class="d-block mx-auto"
        ></v-img>
      </nuxt-link>
      <v-card-title class="mt-3 px-0 justify-center headline">
        Welcome Back, Sign In
      </v-card-title>
      <v-alert v-if="error" type="error" dismissible dense>
        {{ error_message }}
      </v-alert>
      <v-form v-model="valid" lazy-validation class="mt-6">
        <v-text-field
          v-model="formData.username"
          outlined
          placeholder="Username, Staff ID or Email"
          prepend-inner-icon="mdi-account"
          :rules="[required]"
        />
        <v-text-field
          v-model="formData.password"
          outlined
          placeholder="Password"
          :type="hidePassword ? 'password' : 'text'"
          prepend-inner-icon="mdi-lock"
          :append-icon="hidePassword ? 'mdi-eye' : 'mdi-eye-off'"
          :rules="[required]"
          @click:append="() => (hidePassword = !hidePassword)"
        />
        <v-btn
          class="mt-4"
          color="primary"
          block
          x-large
          :loading="loading"
          type="submit"
          :disabled="!valid"
          @click.prevent="handleSubmit"
          >sign in</v-btn
        >
        <v-card-text class="mt-4 text-center">
          Don't have an account?
          <nuxt-link to="/auth/signup">Sign Up </nuxt-link>
        </v-card-text>
      </v-form>
    </v-card>
  </v-container>
</template>
<script>
import rules from '~/mixins/rules'
export default {
  name: 'SigninPage',
  auth: false,
  mixins: [rules],
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
<style>
/* a {
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
} */
</style>
