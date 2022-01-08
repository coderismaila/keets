<template>
  <v-container>
    <v-data-table
      :search="search"
      :headers="headers"
      :items="users"
      :loading="$fetchState.pending"
      mobile-breakpoint="0"
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>Users</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>

          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            dense
            outlined
            placeholder="Search"
            append-icon="mdi-magnify"
            single-line
            hide-details=""
            class="mx-4 max-w-sm pl-0"
          ></v-text-field>
          <!-- User Dialog -->
          <user-dialog
            :dialog-prop.sync="dialog"
            :edited-item-prop.sync="editedItem"
            :edited-index-prop.sync="editedIndex"
          />
        </v-toolbar>
      </template>

      <template #[`item.firstName`]="{ item }">
        {{
          item.firstName +
          ' ' +
          item.lastName +
          (item.middleName ? item.middleName : '')
        }}
      </template>

      <template #[`item.actions`]="{ item }">
        <div class="d-flex">
          <v-btn icon @click="editItem(item)"
            ><v-icon small> mdi-pencil-outline </v-icon></v-btn
          >

          <v-btn icon nuxt :to="`/users/${item.id}`">
            <v-icon small> mdi-eye-outline</v-icon></v-btn
          >
        </div>
      </template>
    </v-data-table>
  </v-container>
</template>
<script>
import { mapState } from 'vuex'
import UserDialog from '~/components/profile/UserDialog.vue'
export default {
  name: 'UsersPage',
  components: { UserDialog },
  data() {
    return {
      dialog: false,
      editedIndex: -1,
      editedItem: {
        username: '',
        staffId: '',
        email: '',
        password: '',
        role: '',
        firstName: '',
        lastName: '',
        designation: '',
        areaOfficeId: '',
        jobDescriptionId: '',
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
      search: '',
      headers: [
        { text: 'Staff ID', value: 'staffId', width: '95px' },
        { text: 'Name', value: 'firstName', width: '150px' },
        { text: 'Username', value: 'username', width: '150px' },
        { text: 'Email', value: 'email', width: '150px' },
        { text: 'Area Office', value: 'areaOffice.name', width: '120px' },
        { text: 'Designation', value: 'designation', width: '100px' },
        { text: 'Role', value: 'role', width: '100px' },
        { text: 'Actions', value: 'actions', sortable: false, width: '80px' },
      ],
    }
  },

  async fetch() {
    await this.$store.dispatch('user/getAllUsers')
    await this.$store.dispatch('areaoffice/getAllAreaOffices')
    await this.$store.dispatch('jobdescription/getAlljobDescriptions')
  },

  computed: {
    ...mapState('user', ['users']),
  },

  methods: {
    editItem(item) {
      this.editedIndex = this.$store.state.user.users.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
  },
}
</script>
