<template>
  <v-container class="mt-8">
    <v-card shaped width="450px" class="pa-4 mx-auto">
      <nuxt-link to="/">
        <v-img
          src="/images/logo.png"
          height="50px"
          width="50px"
          class="d-block mx-auto"
        ></v-img>
      </nuxt-link>
      <v-card-title class="headline justify-center"
        >Create an Account</v-card-title
      >

      <v-card-text>
        <v-alert v-if="error" type="error" dismissible>
          {{ error_message }}
        </v-alert>
      </v-card-text>
      <v-window v-model="step">
        <v-window-item :value="1">
          <v-card flat>
            <v-card-title>Account Info</v-card-title>
            <v-card-text>
              <v-form ref="accountForm" v-model="accountValid" lazy-validation>
                <v-text-field
                  v-model="formData.username"
                  outlined
                  label="Username"
                  prepend-inner-icon="mdi-account"
                  :rules="['required', 'min4']"
                />
                <v-text-field
                  v-model="formData.staffId"
                  outlined
                  label="Staff ID"
                  prepend-inner-icon="mdi-numeric"
                  :rules="['required', 'min4', 'max6']"
                />
                <v-text-field
                  v-model="formData.email"
                  type="email"
                  outlined
                  label="Email"
                  prepend-inner-icon="mdi-email"
                  :rules="['required', 'email']"
                />

                <v-text-field
                  v-model="formData.password"
                  outlined
                  label="Password"
                  :type="hidePassword ? 'password' : 'text'"
                  prepend-inner-icon="mdi-lock"
                  :append-icon="hidePassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="['required', 'min8']"
                  @click:append="() => (hidePassword = !hidePassword)"
                />
                <!-- <v-btn
              type="submit"
              color="primary"
              x-large
              block
              :disabled="!valid"
              :loading="loading"
              @click.prevent="handleSubmit"
              >sign up</v-btn
            > -->
              </v-form>
            </v-card-text>
          </v-card>
        </v-window-item>
        <v-window-item :value="2">
          <v-card flat>
            <v-card-title>Basic Info</v-card-title>
            <v-card-text>
              <v-form ref="infoForm" v-model="infoValid" lazy-validation>
                <v-text-field
                  v-model="formData.firstName"
                  outlined
                  label="First Name"
                  prepend-inner-icon="mdi-account"
                  :rules="['required']"
                />
                <v-text-field
                  v-model="formData.lastName"
                  outlined
                  label="Last Name"
                  prepend-inner-icon="mdi-numeric"
                  :rules="['required']"
                />
                <v-text-field
                  v-model="formData.middleName"
                  outlined
                  label="Middle Name(Optional)"
                  prepend-inner-icon="mdi-numeric"
                />
                <!-- <v-text-field
                v-model="formData.phoneNumber"
                type="email"
                outlined
                label="Phone Number"
                prepend-inner-icon="mdi-phone-outline"
                :rules="['required']"
              /> -->

                <!-- <date-picker
                :date-prop.sync="formData.birthDate"
                :text-field-props="{}"
                title="Birth Date"
              /> -->

                <v-radio-group
                  v-model="formData.gender"
                  row
                  label="Gender"
                  :rules="['required']"
                >
                  <v-radio label="Male" value="MALE"></v-radio>
                  <v-radio label="Female" value="FEMALE"></v-radio>
                </v-radio-group>
              </v-form>
            </v-card-text>
          </v-card>
        </v-window-item>
        <v-window-item :value="3">
          <v-card flat>
            <v-card-title>Work Info</v-card-title>
            <v-card-text>
              <v-form ref="workForm" v-model="workValid" lazy-validation>
                <v-select
                  v-model="formData.jobDescriptionId"
                  :items="$store.state.jobdescription.jobDescriptions"
                  item-text="name"
                  item-value="id"
                  outlined
                  label="Job Description"
                  prepend-inner-icon="mdi-email"
                  :rules="['required']"
                />
                <v-select
                  v-model="formData.designation"
                  outlined
                  :items="designations"
                  item-text="text"
                  item-value="value"
                  label="Designation"
                  prepend-inner-icon="mdi-email"
                  :rules="['required']"
                />
                <v-select
                  v-model="formData.areaOfficeId"
                  :items="$store.state.areaoffice.areaOffices"
                  item-text="name"
                  item-value="id"
                  outlined
                  label="Area Office"
                  prepend-inner-icon="mdi-email"
                  :rules="['required']"
                />
                <v-select
                  v-model="formData.stationId"
                  :items="$store.state.station.stations"
                  item-text="name"
                  item-value="id"
                  outlined
                  label="Station"
                  prepend-inner-icon="mdi-email"
                />
              </v-form>
            </v-card-text>
          </v-card>
        </v-window-item>
      </v-window>
      <v-card-actions>
        <v-btn :disabled="step === 1" text @click="step--"> Back </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          v-if="step === 3"
          :disabled="!workValid"
          type="submit"
          color="primary"
          :loading="loading"
          @click.prevent="handleSubmit"
          >sign up</v-btn
        >
        <v-btn
          v-else
          :disabled="step === 3 || !accountValid || !infoValid"
          color="primary"
          depressed
          @click="nextForm()"
        >
          Next
        </v-btn>
      </v-card-actions>
      <v-card-text class="d-flex justify-center align-center">
        Already have an account?
        <nuxt-link to="/auth/signin" class="ml-2"> Sign in </nuxt-link>
      </v-card-text>
    </v-card>
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
      step: 1,
      accountValid: true,
      infoValid: true,
      workValid: true,
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
        firstName: '',
        lastName: '',
        middleName: '',
        gender: '',
        jobDescriptionId: '',
        birthDate: this.$dayjs().toISOString(),
        // phoneNumber: '',
        areaOfficeId: '',
        designation: '',
        stationId: '',
      },
      designations: [
        { text: 'Chief Technical Office', value: 'CHIEF_TECHNICAL_OFFICER' },
        { text: 'Head of Unit', value: 'HEAD_OF_UNIT' },
        { text: 'Technical Manager', value: 'TECHNICAL_MANAGER' },
        { text: 'Team Lead', value: 'TEAM_LEAD' },
        { text: 'Team Member', value: 'TEAM_MEMBER' },
      ],
    }
  },
  async fetch() {
    await Promise.all([
      this.$store.dispatch('station/getAllStations'),
      this.$store.dispatch('areaoffice/getAllAreaOffices'),
      this.$store.dispatch('jobdescription/getAlljobDescriptions'),
    ])
  },

  methods: {
    async handleSubmit() {
      if (!this.$refs.workForm.validate()) return

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
    validateForm() {
      if (this.step === 1) {
        return this.$refs.accountForm.validate()
      } else if (this.step === 2) {
        return this.$refs.infoForm.validate()
      } else if (this.step === 3) {
        return this.$refs.workForm.validate()
      }
    },
    nextForm() {
      if (!this.validateForm()) return

      this.step++
    },
  },
}
</script>
