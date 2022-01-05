<template>
  <v-container>
    <v-data-table
      :search="search"
      :headers="headers"
      :items="$store.state.user.users"
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
        user: {
          username: '',
          staffId: '',
          email: '',
          password: '',
          role: '',
        },

        firstName: '',
        lastName: '',
        areaOffice: { name: '' },
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
        { text: 'Staff ID', value: 'user.staffId', width: '100px' },
        { text: 'First Name', value: 'firstName', width: '120px' },
        { text: 'Last Name', value: 'lastName', width: '120px' },
        { text: 'Other Name', value: 'middleName', width: '120px' },
        { text: 'Username', value: 'user.username', width: '150px' },
        { text: 'Role', value: 'user.role', width: '50px' },
        { text: 'Email', value: 'user.email', width: '200px' },
        { text: 'Area Office', value: 'areaOffice.name', width: '120px' },
        { text: 'Actions', value: 'actions', sortable: false, width: '80px' },
      ],
    }
  },

  async fetch() {
    await this.$store.dispatch('user/getAllUsers')
    await this.$store.dispatch('area-office/getAllAreaOffices')
  },

  computed: {
    ...mapState('users', ['users']),
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
