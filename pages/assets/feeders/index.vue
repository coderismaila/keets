<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="feeders"
      :search="search"
      mobile-breakpoint="0"
      :items-per-page="10"
      :loading="$fetchState.pending"
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>Feeders</v-toolbar-title>
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

          <!-- Station Dialog -->
          <feeder-dialog
            ref="feederDialog"
            :dialog-prop.sync="dialog"
            :edited-item-prop="editedItem"
            :editing-prop.sync="editing"
          />
          <!-- Station Dialog -->
        </v-toolbar>
      </template>

      <template #[`item.actions`]="{ item }">
        <div class="d-flex">
          <v-btn icon @click="editItem({ ...item })">
            <v-icon small> mdi-pencil-outline </v-icon></v-btn
          >
          <v-btn icon @click="deleteItem(item)">
            <v-icon small> mdi-delete-outline </v-icon></v-btn
          >
        </div>
      </template>
    </v-data-table>
  </v-container>
</template>
<script>
import { mapState } from 'vuex'
import { Confirm, Notify, Report } from 'notiflix'

export default {
  name: 'FeedersPage',
  data() {
    return {
      search: '',
      dialog: false,
      editing: false,
      headers: [
        {
          text: 'Feeder Name',
          align: 'start',
          sortable: true,
          search: true,
          value: 'name',
          width: '150px',
        },
        { text: 'Source Station', value: 'station.name', width: '200px' },
        { text: 'Route Length(km)', value: 'routeLength', width: '50px' },
        { text: 'Area Office', value: 'areaOffice.name', width: '120px' },
        { text: 'Actions', value: 'actions', sortable: false, width: '100px' },
      ],
      editedItem: {},
      defaultItem: {
        name: '',
        voltageLevel: '',
        routeLength: 0,
        kaedcoCode: '',
        nercCode: '',
        powerTransformerId: '',
        stationId: '',
        areaOfficeId: '',
      },
    }
  },

  async fetch() {
    await this.$store.dispatch('feeder/getAllFeeders')
  },

  computed: {
    ...mapState('feeder', ['feeders', 'error', 'error_message']),
  },

  watch: {
    dialog(value) {
      value || this.$refs.feederDialog.close()
    },
  },

  methods: {
    editItem(item) {
      this.editing = true
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.editedItem = Object.assign({}, item)

      Confirm.show(
        'Delete Feeder',
        'Are you sure you want to delete this station?',
        'Yes',
        'No',
        async () => {
          try {
            await this.deleteStation(this.editedItem)
            if (this.error) {
              Notify.failure(`Error: ${this.error_message}`, () => {
                this.$store.commit('feeder/SET_ERROR')
              })
            } else {
              Notify.success('Feeder deleted successfully')
            }
          } catch ({ response }) {
            Report.failure('Error', response.data.message, 'OK')
          }
        },
        () => {}
      )
    },
  },
}
</script>
