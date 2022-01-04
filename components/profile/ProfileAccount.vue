<template>
  <div class="d-flex align-center justify-center w-full">
    <v-card flat class="mt-8" max-width="400">
      <v-card-text>
        <v-form>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="formData.username"
                label="Username"
                dense
                outlined
                disabled
                readonly
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="formData.staffId"
                label="Staff ID"
                dense
                outlined
                disabled
                readonly
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="formData.email"
                label="E-mail"
                dense
                outlined
                readonly
                disabled
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-select
                v-model="formData.role"
                dense
                outlined
                disabled
                readonly
                label="Role"
                :items="roles"
              ></v-select>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
export default {
  name: 'ProfileAccount',
  data() {
    return {
      formData: {
        username: '',
        name: '',
        email: '',
        role: '',
      },
      roles: [
        { text: 'Admin', value: 'ADMIN' },
        { text: 'Staff', value: 'USER' },
        { text: 'Staff', value: 'MODERATOR' },
        { text: 'Staff', value: 'SUPER' },
      ],
    }
  },
  async fetch() {},
  created() {
    this.formData = this.$auth.user.user
  },
}
</script>
