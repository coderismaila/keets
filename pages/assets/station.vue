<template>
  <v-container>
    <v-data-table
      calculate-widths
      mobile-breakpoint="0"
      :headers="headers"
      :items="stationTableData"
      :items-per-page="5"
      :loading="$fetchState.pending"
    >
      <template #top="{ item }">
        <v-toolbar flat>
          <v-toolbar-title>Station</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <!-- Station Dialog -->
          <station-dialog
            :item="{ item }"
            :dialog-prop.sync="dialog"
            :edited-item-prop.sync="editedItem"
            :edited-index-prop.sync="editedIndex"
          />
          <!-- Station Dialog -->
        </v-toolbar>
      </template>
      <template #[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
    </v-data-table>
  </v-container>
</template>
<script>
import { Confirm, Notify, Report } from 'notiflix'
import { mapActions, mapGetters } from 'vuex'
import rules from '~/mixins/rules'

export default {
  name: 'StationPage',
  mixins: [rules],
  data() {
    return {
      title: 'Station',
      loading: false,
      dialog: false,
      editedIndex: -1,
      editedItem: {
        name: '',
        stationType: '',
        areaOfficeName: '',
        powerTransformer: [
          {
            name: '',
            capacityKVA: 0,
          },
        ],
      },
      defaultItem: {
        name: '',
        stationType: '',
        areaOfficeName: '',
        powerTransformer: [
          {
            name: '',
            capacityKVA: '',
          },
        ],
      },
      headers: [
        {
          text: 'Station Name',
          align: 'start',
          sortable: false,
          value: 'name',
          width: '300px',
        },
        { text: 'Capacity(KVA)', value: 'capacity', width: '150px' },
        { text: 'Area Office', value: 'areaOfficeName', width: '150px' },
        { text: 'Type', value: 'stationType', width: '100px' },
        { text: 'Actions', value: 'actions', sortable: false, width: '100px' },
      ],
    }
  },
  async fetch() {
    await this.$store.dispatch('station/getAllStations')
    await this.$store.dispatch('area-office/getAllAreaOffices')
  },

  computed: {
    ...mapGetters('station', ['stationTableData']),
  },

  methods: {
    ...mapActions('station', ['deleteStation']),

    editItem(item) {
      this.editedIndex = this.stationTableData.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.stationTableData.indexOf(item)
      this.editedItem = Object.assign({}, item)

      Confirm.show(
        'Delete Station',
        'Are you sure you want to delete this station?',
        'Yes',
        'No',
        async () => {
          try {
            await this.deleteStation(this.editedItem)
            if (this.station_error) {
              Notify.failure(this.station_error_message, () => {
                this.$store.commit('station/SET_ERROR')
              })
            } else {
              Notify.success('Station deleted successfully')
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
