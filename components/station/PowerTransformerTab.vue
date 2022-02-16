<template>
  <div class="mt-4">
    <v-data-table
      :headers="headers"
      mobile-breakpoint="0"
      :items="getPowerTransformerById($route.params.id)"
      disable-filtering
      disable-pagination
      hide-default-footer
    >
      <template #top>
        <v-toolbar flat class="table-header">
          <v-toolbar-title>Power Transformers</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>

          <v-spacer></v-spacer>
          <!-- Station Dialog -->
          <power-transformer-dialog
            ref="transformerDialog"
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
      editing: false,
      editedItem: {},
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

  watch: {
    dialog(val) {
      val || this.$refs.transformerDialog.close()
    },
  },

  methods: {
    ...mapActions('power-transformer', ['deletePowerTransformer']),

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
            await this.deletePowerTransformer(this.editedItem)
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
