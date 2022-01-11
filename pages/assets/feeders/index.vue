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
            :dialog-prop.sync="dialog"
            :edited-item-prop.sync="editedItem"
            :edited-index-prop.sync="editedIndex"
          />
          <!-- Station Dialog -->
        </v-toolbar>
      </template>

      <template #[`item.actions`]="{ item }">
        <div class="d-flex">
          <v-btn icon nuxt :to="`/assets/feeders/${item.id}`">
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
import { isEqual } from 'lodash'
import { mapState } from 'vuex'

export default {
  name: 'FeedersPage',
  data() {
    return {
      search: '',
      dialog: false,
      editedIndex: -1,
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
      editedItem: {
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
    ...mapState('feeder', ['feeders']),
  },

  methods: {
    editItem(item) {
      this.editedIndex = this.findIndex(this.feeders, item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    findIndex(array, item) {
      for (let i = 0; i < array.length; i++) {
        if (isEqual(array[i], item)) return i
      }
      return -1
    },
  },
}
</script>
