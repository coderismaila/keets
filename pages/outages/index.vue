<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="outages"
      mobile-breakpoint="0"
      :items-per-page="10"
      :loading="$fetchState.pending"
    >
      <template #top>
        <v-toolbar flat class="table-header">
          <v-toolbar-title>Outage</v-toolbar-title>
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
          <outage-dialog
            :dialog-prop.sync="dialog"
            :edited-item-prop.sync="editedItem"
            :edited-index-prop.sync="editedIndex"
            :stepper-prop.sync="stepper"
          />
        </v-toolbar>
      </template>
      <template #[`item.timeOut`]="{ item }">
        {{ item.timeOut | formatTime }}
      </template>
      <template #[`item.timeIn`]="{ item }">
        {{ item.timeIn | formatTime }}
      </template>
      <template #[`item.tagInTime`]="{ item }">
        {{ item.tagInTime | formatTime }}
      </template>
      <template #[`item.tagOutTime`]="{ item }">
        {{ item.tagOutTime | formatTime }}
      </template>
      <template #[`item.createdAt`]="{ item }">
        {{ item.timeIn | formatTime }}
      </template>
      <template #[`item.updatedAt`]="{ item }">
        {{ item.timeIn | formatTime }}
      </template>

      <template #[`item.actions`]="{ item }">
        <div class="d-flex">
          <v-btn icon @click="editItem(item)"
            ><v-icon small> mdi-tag-outline </v-icon></v-btn
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
import { isEqual } from 'lodash'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'OutagePage',
  data() {
    return {
      search: '',
      stepper: 1,
      dialog: false,
      editedIndex: -1,
      editedItem: {
        feederId: '',
        timeOut: null,
        timeIn: null,
        outageType: '',
        relayIndication: '',
        loadLoss: 0,
        tagNumber: null,
        tagHolderId: null,
        thirdPartyName: '',
        tagInTime: null,
        tagOutTime: null,
        cause: '',
        resolution: '',
        staffNameTCN: '',
      },
      headers: [
        { text: 'Outage ID', value: 'id', width: '50px', sortable: false },
        {
          text: 'Area Office',
          value: 'feeder.areaOffice.name',
          width: '150px',
        },
        {
          text: 'Feeder Name',
          value: 'feeder.name',
          width: '150px',
          sortable: true,
        },
        { text: 'Outage Type', value: 'outageType', width: '120px' },
        {
          text: 'Relay\n\nIndication',
          value: 'relayIndication',
          align: 'center',
          width: '150px',
        },
        { text: 'Time Out', value: 'timeOut', width: '140px' },
        { text: 'Time In', value: 'timeIn', width: '140px' },
        { text: 'Load Loss', value: 'loadLoss', width: '80px' },
        { text: 'Cause', value: 'cause', width: '180px', sortable: false },
        {
          text: 'resolution',
          value: 'resolution',
          width: '180px',
          sortable: false,
        },
        { text: 'Created By', value: 'staff.username', width: '120px' },
        { text: 'Created Date', value: 'createdAt', width: '140px' },
        { text: 'Tag No.', value: 'tagNumber', width: '100px' },
        { text: 'Tag Holder.', value: 'thirdPartyName', width: '150px' },
        { text: 'Tag In Time.', value: 'tagInTime', width: '150px' },
        { text: 'Tag Out Time.', value: 'tagOutTime', width: '150px' },
        { text: 'Updated By', value: 'staff.name', width: '150px' },
        { text: 'Updated At', value: 'updatedAt', width: '140px' },
        { text: 'Actions', value: 'actions', sortable: false, width: '100px' },
      ],
    }
  },

  async fetch() {
    await this.$store.dispatch('outage/getAllOutages')
    await this.$store.dispatch('feeder/getAllFeeders')
  },

  computed: {
    ...mapState('outage', ['outages']),
    ...mapState('feeder', ['feeders']),
  },

  methods: {
    ...mapActions('outage', ['addOutage', 'updateOutage']),

    findIndex(array, item) {
      for (let i = 0; i < array.length; i++) {
        if (isEqual(array[i], item)) return i
      }
      return -1
    },

    editItem(item) {
      this.stepper = 2
      this.editedIndex = this.findIndex(this.outages, item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
  },
}
</script>

<style>
.table-header .v-toolbar__content {
  padding: 0;
}
</style>
