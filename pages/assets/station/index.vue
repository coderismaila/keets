<template>
  <v-container>
    <v-data-table
      :search="search"
      mobile-breakpoint="0"
      :headers="headers"
      :items="stationTableData"
      :items-per-page="10"
      :loading="$fetchState.pending"
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title v-if="!$vuetify.breakpoint.mobile"
            >Station</v-toolbar-title
          >
          <v-divider class="mx-4" inset vertical></v-divider>

          <v-spacer v-if="!$vuetify.breakpoint.mobile"></v-spacer>
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
          <station-dialog
            :dialog-prop.sync="dialog"
            :edited-item-prop.sync="editedItem"
            :edited-index-prop.sync="editedIndex"
          />
          <!-- Station Dialog -->
        </v-toolbar>
      </template>

      <template #[`item.actions`]="{ item }">
        <div class="d-flex">
          <v-btn icon nuxt :to="`/assets/station/${item.id}`">
            <v-icon small> mdi-eye-outline </v-icon></v-btn
          >
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
import { Confirm, Notify, Report } from 'notiflix'
import { isEqual } from 'lodash'
import { mapActions, mapGetters, mapState } from 'vuex'
import rules from '~/mixins/rules'

export default {
  name: 'StationPage',
  mixins: [rules],
  data() {
    return {
      title: 'Station',
      search: '',
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
          sortable: true,
          search: true,
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
    await this.$store.dispatch('areaoffice/getAllAreaOffices')
  },

  computed: {
    ...mapState('station', ['stationTableData', 'error', 'error_message']),
    ...mapGetters('station', ['stationTableData']),
  },

  methods: {
    ...mapActions('station', ['deleteStation']),

    findIndex(array, item) {
      for (let i = 0; i < array.length; i++) {
        if (isEqual(array[i], item)) return i
      }
      return -1
    },

    editItem(item) {
      this.editedIndex = this.findIndex(this.stationTableData, item)
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
<style scoped>
.v-toolbar__content {
  padding: 0 !important;
}
</style>
