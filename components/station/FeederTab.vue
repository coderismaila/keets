<template>
  <div class="mt-4">
    <v-data-table
      :headers="headers"
      mobile-breakpoint="0"
      :items="getFeedersByStationId($route.params.id)"
      disable-filtering
      disable-pagination
      hide-default-footer
    >
      <template #top>
        <v-toolbar flat class="table-header">
          <v-toolbar-title>Feeders</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>

          <v-spacer></v-spacer>
          <!-- Station Dialog -->
          <feeder-dialog
            :dialog-prop.sync="dialog"
            :edited-item-prop="editedItem"
            :editing-prop.sync="editing"
          />

          <!-- Station Dialog -->
        </v-toolbar>
      </template>

      <template #[`item.actions`]="{ item }">
        <div class="d-flex">
          <v-btn icon @click="editItem(item)">
            <v-icon small> mdi-pencil-outline </v-icon></v-btn
          >
          <v-btn icon @click="deleteItem(item)">
            <v-icon small> mdi-delete-outline </v-icon></v-btn
          >
        </div>
      </template>
    </v-data-table>
  </div>
</template>
<script>
import { Confirm, Notify, Report } from 'notiflix'
import { mapActions, mapGetters, mapState } from 'vuex'
import FeederDialog from '../feeder/FeederDialog.vue'

export default {
  name: 'FeederTab',
  components: { FeederDialog },
  data() {
    return {
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
      dialog: false,
      editing: false,
      editedItem: {
        name: null,
        capacityKVA: null,
        voltageRating: null,
        ratedCurrent: null,
        transformerPeakLoadMW: null,
        sourceStationId: null,
        sourcePowerTransformerId: null,
        feeder33kvId: null,
        stationId: this.$route.params.id,
      },
      defaultItem: {
        name: '',
        capacity: '',
        voltageRating: '',
        routeLength: 0,
        ratedCurrent: '',
        transformerPeakLoadMW: 0,
        sourceStationId: null,
        sourcePowerTransformerId: null,
        feeder33kvId: null,
        stationId: '',
      },
    }
  },

  async fetch() {
    Promise.all([
      await this.$store.dispatch('station/getAllStations'),
      await this.$store.dispatch('station/getAllFeeders'),
    ])
  },

  computed: {
    ...mapState('feeder', {
      feeder_error: 'error',
      feeder_error_message: 'error_message',
    }),

    ...mapGetters('feeder', ['getFeedersByStationId']),
  },

  methods: {
    ...mapActions('feeder', ['deleteFeeder']),

    editItem(item) {
      this.editing = true
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.editedItem = Object.assign({}, item)

      Confirm.show(
        'Delete Station',
        'Are you sure you want to delete this station?',
        'Yes',
        'No',
        async () => {
          try {
            await this.deleteFeeder(this.editedItem)
            if (this.feeder_error) {
              Notify.failure(`Error: ${this.feeder_error_message}`, () => {
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
