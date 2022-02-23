<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="getAllUserStationOutages"
      :items-per-page="50"
      :loading="$fetchState.pending"
      mobile-breakpoint="0"
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
          <add-outage />
        </v-toolbar>
        <v-row class="my-6">
          <v-col cols="12" md="3" sm="6">
            <simple-stats-card
              :title="dailyOutages"
              outage-type="Today"
              color="red"
            />
          </v-col>
          <v-col cols="12" md="3" sm="6">
            <simple-stats-card
              :title="weeklyOutages"
              outage-type="This Week"
              color="red"
            />
          </v-col>
          <v-col cols="12" md="3" sm="6">
            <simple-stats-card
              :title="monthlyOutages"
              outage-type="This Month"
              color="red"
            />
          </v-col>
          <v-col cols="12" md="3" sm="6">
            <simple-stats-card
              :title="yearlyOutages"
              outage-type="This Year"
              color="red"
            />
          </v-col>
        </v-row>
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

      <template #[`item.status`]="{ item }">
        <v-badge
          class="badgee"
          :color="item.timeIn ? 'green' : item.tagInTime ? 'yellow' : 'red'"
        >
        </v-badge>
      </template>

      <template #[`item.actions`]="{ item }">
        <v-menu>
          <template #activator="{ on, attrs }">
            <v-btn dark icon v-bind="attrs" v-on="on">
              <v-icon small color="secondary">mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list class="">
            <v-list-item>
              <v-tooltip left>
                <template #activator="{ on, attrs }">
                  <v-btn
                    icon
                    text
                    link
                    :to="`outages/${item.id}`"
                    v-bind="attrs"
                    v-on="on"
                    ><v-icon small> mdi-eye-outline </v-icon>
                  </v-btn>
                </template>
                <span>view details</span>
              </v-tooltip>
            </v-list-item>
            <v-list-item v-if="!item.tagNumber">
              <add-tag :item="item" />
            </v-list-item>
            <v-list-item v-if="!item.tagOutTime">
              <surrender-tag :item="item" />
            </v-list-item>
          </v-list>
        </v-menu>
        <div class="d-flex"></div>
      </template>
    </v-data-table>
  </v-container>
</template>
<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import SimpleStatsCard from '~/components/cards/SimpleStatsCard.vue'
import AddOutage from '~/components/outage/AddOutageDialog.vue'
import AddTag from '~/components/outage/AddTagDialog.vue'
import SurrenderTag from '~/components/outage/SurrenderTagDialog.vue'

export default {
  name: 'OutagePage',
  components: {
    AddOutage,
    AddTag,
    SurrenderTag,
    SimpleStatsCard,
  },

  data() {
    return {
      search: '',
      dialog: false,
      headers: [
        { text: 'Actions', value: 'actions', sortable: false, align: 'center' },
        { text: 'Status', value: 'status', sortable: false, align: 'center' },
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
        {
          text: 'Load Loss(MW)',
          value: 'loadLoss',
          width: '100px',
          sortable: false,
        },
        { text: 'Created By', value: 'staff.username', width: '120px' },
        { text: 'Tag No.', value: 'tagNumber', width: '100px' },
        { text: 'Tag Holder.', value: 'thirdPartyName', width: '150px' },
        { text: 'Tag In Time.', value: 'tagInTime', width: '150px' },
        { text: 'Tag Out Time.', value: 'tagOutTime', width: '150px' },
        { text: 'Time In', value: 'timeIn', width: '140px' },
      ],
    }
  },

  async fetch() {
    await this.$store.dispatch('outage/getAllOutages')
    await this.$store.dispatch('feeder/getAllFeeders')
  },

  computed: {
    ...mapState('outage', ['outages', 'stationOutages']),
    ...mapState('feeder', ['feeders']),

    ...mapGetters('outage', [
      'getAllUserStationOutages',
      'dailyOutages',
      'weeklyOutages',
      'monthlyOutages',
      'yearlyOutages',
    ]),

    filteredOutages() {
      // get all station outage if user is a DSO belonging to a station
      // get all station outage if user is a moderator (team lead, or technical manager) belonging to an area office as the station
      // get all outage if user is admin
      return null
    },
  },

  methods: {
    ...mapActions('outage', ['addOutage', 'updateOutage']),
  },
}
</script>

<style>
.table-header .v-toolbar__content {
  padding: 0;
}
</style>
