<template>
  <div class="mt-4">
    <v-data-table
      :headers="headers"
      :items="getPowerTransformerById($route.params.id)"
      disable-filtering
      disable-pagination
      hide-default-footer
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>Power Transformers</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>

          <v-spacer></v-spacer>
          <!-- Station Dialog -->
          <power-transformer-dialog
            :dialog-prop.sync="dialog"
            :edited-item-prop.sync="editedItem"
            :edited-index-prop.sync="editedIndex"
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
  </div>
</template>
<script>
import { Confirm, Notify, Report } from 'notiflix'
import { isEqual } from 'lodash'
import { mapGetters, mapState } from 'vuex'
import PowerTransformerDialog from '~/components/station/PowerTransformerDialog.vue'

export default {
  name: 'PowerTransformerTab',
  components: { PowerTransformerDialog },
  data() {
    return {
      headers: [
        {
          text: 'Name',
          align: 'start',
          sortable: true,
          value: 'name',
          width: '50px',
        },
        {
          text: 'Capacity(KVA)',
          value: 'capacityKVA',
          align: 'center',
          width: '100px',
        },
        {
          text: 'Rated Current',
          value: 'ratedCurrent',
          align: 'center',
          width: '100px',
        },

        {
          text: 'Peak Load(MW)',
          value: 'transformerPeakLoadMW',
          align: 'center',
          width: '100px',
        },
        {
          text: 'Actions',
          value: 'actions',
          sortable: false,
          align: 'start',
          width: '100px',
        },
      ],
      dialog: false,
      editedIndex: -1,
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
    await this.$store.dispatch('power-transformer/getAllPowerTransformers')
  },

  computed: {
    ...mapState('power-transformer', {
      powerTransformers: 'powerTransformers',
      power_transformer_error: 'error',
      power_transformer_error_message: 'error_message',
    }),

    ...mapState('feeder', {
      feeders: 'feeders',
      feeder_error: 'error',
      feeder_error_message: 'error_message',
    }),

    ...mapState('station', {
      stations: 'stations',
      station_error: 'error',
      station_error_message: 'error_message',
    }),

    ...mapGetters('power-transformer', ['getPowerTransformerById']),
  },

  methods: {
    findIndex(array, item) {
      for (let i = 0; i < array.length; i++) {
        if (isEqual(array[i], item)) return i
      }
      return -1
    },

    editItem(item) {
      this.editedIndex = this.findIndex(
        this.getPowerTransformerById(this.$route.params.id),
        item
      )
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.getPowerTransformerById(
        this.$route.params.id
      ).indexOf(item)
      this.editedItem = Object.assign({}, item)

      Confirm.show(
        'Delete Station',
        'Are you sure you want to delete this station?',
        'Yes',
        'No',
        async () => {
          try {
            await this.deleteStation(this.editedItem)
            if (this.error) {
              Notify.failure(
                `Error deleting station. \n ${this.error_message}`,
                () => {
                  this.$store.commit('station/SET_ERROR')
                }
              )
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
