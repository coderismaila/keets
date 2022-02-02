<template>
  <div class="d-flex align-center justify-center w-full">
    <v-card flat class="mt-8" max-width="400">
      <v-card-subtitle class="headline text-center"
        >Profile Information</v-card-subtitle
      >
      <v-divider class="mb-4" />
      <v-card-actions
        ><v-btn class="mb-2" block color="secondary" @click="handleEdit">{{
          disabled ? 'Edit Profile' : 'Cancel Edit'
        }}</v-btn></v-card-actions
      >

      <v-form>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="formData.firstName"
                label="First Name"
                dense
                outlined
                :disabled="disabled"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="formData.lastName"
                label="Last Name"
                dense
                outlined
                :disabled="disabled"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="formData.middleName"
                label="Middle Name"
                dense
                outlined
                :disabled="disabled"
              ></v-text-field>
            </v-col>

            <v-col cols="12" class="pb-0">
              <v-text-field
                v-model="formData.phoneNumber"
                label="Phone Number"
                dense
                outlined
                :disabled="disabled"
              ></v-text-field>
            </v-col>

            <v-col cols="12" class="py-0">
              <v-radio-group
                v-model="formData.gender"
                row
                label="Gender"
                :disabled="disabled"
              >
                <v-radio label="Male" value="MALE"></v-radio>
                <v-radio label="Female" value="FEMALE"></v-radio>
              </v-radio-group>
            </v-col>

            <v-col cols="12">
              <v-select
                v-model="formData.areaOfficeId"
                :items="$store.state.areaoffice.areaOffices"
                item-text="name"
                item-value="id"
                :disabled="disabled"
                cache-items
                placeholder="Area Office"
                outlined
                dense
                :loading="loading"
              ></v-select>
            </v-col>

            <v-col cols="12" class="py-0">
              <v-select
                v-model="formData.designation"
                :items="designations"
                item-text="text"
                item-value="value"
                :disabled="disabled"
                outlined
                dense
                label="Designation*"
              ></v-select>
            </v-col>

            <v-col cols="12">
              <v-select
                v-model="formData.jobDescriptionId"
                :items="$store.state.jobdescription.jobDescriptions"
                item-text="name"
                item-value="id"
                :disabled="disabled"
                cache-items
                label="Job Description"
                outlined
                dense
                :loading="loading"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="formData.stationId"
                :items="$store.state.station.stations"
                item-text="name"
                item-value="id"
                :disabled="disabled"
                cache-items
                label="Station"
                outlined
                dense
                :loading="loading"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <date-picker
                :disabled-prop="disabled"
                :date-prop.sync="formData.birthDate"
                title="Birth Date"
              />
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="formData.addressLine1"
                label="Address Line 1"
                dense
                outlined
                :disabled="disabled"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="formData.addressLine2"
                label="Address Line 2"
                dense
                outlined
                :disabled="disabled"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="formData.state"
                label="State"
                dense
                outlined
                :disabled="disabled"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="formData.city"
                label="City"
                dense
                outlined
                :disabled="disabled"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="formData.stateOfOrigin"
                label="State of Origin"
                dense
                outlined
                :disabled="disabled"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            block
            type="submit"
            :disabled="disabled"
            :loading="loading"
            color="primary"
            @click.prevent="handleSubmit"
            >Update Profile</v-btn
          >
        </v-card-actions>
      </v-form>
    </v-card>
  </div>
</template>
<script>
import { Notify } from 'notiflix'
export default {
  name: 'ProfileInfo',
  data() {
    return {
      picker: this.birthDate,
      disabled: true,
      loading: false,
      formData: {
        firstName: '',
        lastName: '',
        middleName: '',
        phoneNumber: '',
        gender: '',
        areaOfficeId: '',
        designation: '',
        jobDescriptionId: '',
        stationId: '',
        birthDate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .substr(0, 10),
        addressLine1: '',
        addressLine2: '',
        state: '',
        city: '',
        stateOfOrigin: '',
        country: '',
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
    await this.$store.dispatch('areaoffice/getAllAreaOffices')
    await this.$store.dispatch('jobdescription/getAlljobDescriptions')
    await this.$store.dispatch('station/getAllStations')
  },

  computed: {
    areaOffices() {
      return this.$store.state.areaoffice.areaOffices
    },
  },

  created() {
    this.formData = { ...this.$auth.user }
  },

  methods: {
    async handleSubmit() {
      try {
        this.loading = true
        await this.$axios.patch(`/user/${this.$auth.user.id}`, this.formData)
        await this.$auth.fetchUser()
        this.loading = false
        this.disabled = true
        Notify.success('Profile updated successfully')
      } catch ({ response }) {
        this.loading = false
        Notify.failure(response.data.message)
      }
    },

    handleEdit() {
      if (!this.disabled) {
        this.disabled = !this.disabled
        this.formData = { ...this.$auth.user }
      } else {
        this.disabled = false
      }
    },
  },
}
</script>
