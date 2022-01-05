<template>
  <v-dialog v-model="dialog" max-width="400px">
    <template #activator="{ on, attrs }">
      <v-btn
        tile
        color="primary"
        dark
        class="flex-inline"
        v-bind="attrs"
        v-on="on"
      >
        <span> New User </span>

        <v-icon dark> mdi-plus </v-icon>
      </v-btn>
    </template>
    <v-card class="py-4">
      <v-card-title>
        <span class="text-h5">{{ formTitle }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-alert v-if="area_office_error" dense type="error" dismissible>{{
            area_office_error_message
          }}</v-alert>
          <v-row>
            <v-col cols="12" class="pb-0">
              <v-text-field
                v-model="editedItem.user.staffId"
                outlined
                dense
                label="Staff ID*"
              ></v-text-field>
            </v-col>

            <v-col cols="12" class="py-0">
              <v-text-field
                v-model="editedItem.user.username"
                outlined
                dense
                label="Username *"
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="py-0">
              <v-text-field
                v-model="editedItem.user.email"
                type="email"
                outlined
                dense
                label="Email*"
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="py-0">
              <v-select
                v-model="editedItem.user.role"
                :items="roles"
                outlined
                dense
                label="Role*"
              ></v-select>
            </v-col>
            <v-col cols="12" class="py-0">
              <v-text-field
                v-model="editedItem.firstName"
                outlined
                dense
                label="First Name *"
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="py-0">
              <v-text-field
                v-model="editedItem.lastName"
                type="email"
                outlined
                dense
                label="Last Name*"
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="py-0">
              <v-text-field
                v-model="editedItem.middleName"
                type="email"
                outlined
                dense
                label="Other Name"
              ></v-text-field>
            </v-col>

            <v-col cols="12" class="py-0">
              <v-combobox
                v-model="editedItem.areaOffice.name"
                :items="$store.getters['area-office/areaOfficeNames']"
                outlined
                dense
                label="Area Office*"
              ></v-combobox>
            </v-col>

            <v-col cols="12" class="pb-0">
              <v-text-field
                v-model="editedItem.phoneNumber"
                label="Phone Number"
                dense
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="py-0">
              <v-radio-group v-model="editedItem.gender" row label="Gender">
                <v-radio label="Male" value="MALE"></v-radio>
                <v-radio label="Female" value="FEMALE"></v-radio>
              </v-radio-group>
            </v-col>
            <v-col cols="12">
              <date-picker
                :disabled-prop="disabled"
                :date-prop.sync="editedItem.birthDate"
              />
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="editedItem.addressLine1"
                label="Address Line 1"
                dense
                outlined
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="editedItem.addressLine2"
                label="Address Line 2"
                dense
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="editedItem.state"
                label="State"
                dense
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="editedItem.city"
                label="City"
                dense
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="editedItem.stateOfOrigin"
                label="State of Origin"
                dense
                outlined
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn small tile @click="close"> Cancel </v-btn>
        <v-btn small tile color="primary" :loading="loading" @click="save">
          {{ buttonText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { Notify } from 'notiflix'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'UserDialog',
  props: {
    dialogProp: {
      type: Boolean,
      required: true,
    },
    editedItemProp: {
      type: Object,
      required: true,
    },
    editedIndexProp: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      disabled: false,
      defaultItem: {
        user: {
          username: '',
          staffId: '',
          email: '',
          password: '',
          role: '',
        },
        firstName: '',
        lastName: '',
        areaOffice: '',
        jobDescription: '',
        phoneNumber: '',
        gender: '',
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
      loading: false,
      roles: ['ADMIN', 'USER', 'MOD', 'SUPER'],
    }
  },
  computed: {
    ...mapState('area-office', {
      areaOffices: 'areaOffices',
      area_office_error: 'error',
      area_office_error_message: 'error_message',
    }),

    formTitle() {
      return this.editedIndex === -1 ? 'New User' : 'Edit User'
    },
    buttonText() {
      return this.editedIndex === -1 ? 'Save' : 'Update'
    },
    dialog: {
      get() {
        return this.dialogProp
      },
      set(dialogProp) {
        this.$emit('update:dialogProp', dialogProp)
      },
    },

    editedItem: {
      get() {
        return this.editedItemProp
      },
      set(editedItemProp) {
        this.$emit('update:editedItemProp', editedItemProp)
      },
    },
    editedIndex: {
      get() {
        return this.editedIndexProp
      },
      set(editedIndexProp) {
        this.$emit('update:editedIndexProp', editedIndexProp)
      },
    },
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
  },

  methods: {
    ...mapActions('station', ['addUser', 'updateUser', 'deleteUser']),

    async save() {
      this.loading = true
      if (this.editedIndex > -1) {
        await this.updateUser(this.editedItem)
      } else {
        await this.addUser(this.editedItem)
      }
      this.loading = false
      // TODO: revisit this
      if (this.station_error) {
        return
      }
      this.close()
      Notify.success(
        `${this.editedItem.name} has been ${
          this.editedIndex > -1 ? 'updated' : 'added'
        }`
      )
    },
    close() {
      this.dialog = false
      this.$store.commit('station/SET_ERROR')
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
  },
}
</script>
