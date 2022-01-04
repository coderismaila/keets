<template>
  <div class="d-flex align-center justify-center w-full">
    <v-card flat class="mt-8 pa-0" max-width="400">
      <v-card-text class="pa-0">
        <v-form>
          <v-row>
            <v-col cols="12">
              <!-- current password -->
              <v-text-field
                v-model="formData.currentPassword"
                :type="isCurrentPasswordVisible ? 'text' : 'password'"
                :append-icon="
                  isCurrentPasswordVisible
                    ? 'mdi-eye-off-outline'
                    : 'mdi-eye-outline'
                "
                placeholder="Current Password"
                outlined
                dense
                @click:append="
                  isCurrentPasswordVisible = !isCurrentPasswordVisible
                "
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <!-- new password -->
              <v-text-field
                v-model="formData.newPassword"
                :type="isNewPasswordVisible ? 'text' : 'password'"
                :append-icon="
                  isNewPasswordVisible
                    ? 'mdi-eye-off-outline'
                    : 'mdi-eye-outline'
                "
                placeholder="New Password"
                outlined
                dense
                hint="Make sure it's at least 8 characters."
                persistent-hint
                @click:append="isNewPasswordVisible = !isNewPasswordVisible"
              ></v-text-field>
            </v-col>

            <!-- confirm password -->
            <v-col cols="12">
              <v-text-field
                v-model="formData.confirmPassword"
                :type="isConfirmPasswordVisible ? 'text' : 'password'"
                :append-icon="
                  isConfirmPasswordVisible
                    ? 'mdi-eye-off-outline'
                    : 'mdi-eye-outline'
                "
                placeholder="Confirm New Password"
                outlined
                dense
                class="mt-3"
                @click:append="
                  isConfirmPasswordVisible = !isConfirmPasswordVisible
                "
              ></v-text-field>
            </v-col>
            <v-col class="d-flex">
              <v-spacer />
              <v-btn>Cancel</v-btn>
              <v-btn color="primary" :loading="loading" @click="handleSubmit"
                >Change Password</v-btn
              >
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import { Notify } from 'notiflix'
export default {
  name: 'ProfileSecirity',
  data() {
    return {
      loading: false,
      formData: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      },
      defaultData: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      },
      isCurrentPasswordVisible: false,
      isNewPasswordVisible: false,
      isConfirmPasswordVisible: false,
    }
  },
  methods: {
    async handleSubmit() {
      try {
        this.loading = true
        await this.$axios.patch('/user/change-password', {
          password: this.formData.currentPassword,
          newPassword: this.formData.newPassword,
        })
        this.loading = false
        this.formData = this.defaultData
        Notify.success('Password changed successfully')
      } catch ({ response }) {
        Notify.failure(response.data.message)
        this.loading = false
      }
    },
  },
}
</script>
