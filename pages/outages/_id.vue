<template>
  <v-container>
    <h2>{{ outage.outageType }} Outage on {{ outage.feeder.name }}</h2>
    <v-timeline align-top dense>
      <v-timeline-item color="red">
        <v-row class="pt-1">
          <v-col cols="12" md="3">
            <strong>{{ outage.timeOut | formatTime }}</strong>
          </v-col>
          <v-col cols="12" md="9">
            <v-card color="red">
              <v-card-text>
                <p><strong>Outage Type:</strong> {{ outage.outageType }}</p>
                <p>
                  <strong>Relay Indication:</strong>
                  {{ outage.relayIndication }}
                </p>
                <p><strong>Load Loss:</strong> {{ outage.loadLoss }}</p>
                <p><strong>Created By</strong></p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-timeline-item>
      <v-timeline-item v-if="outage.tagInTime" color="yellow">
        <v-row class="pt-1">
          <v-col cols="12" md="3">
            <strong>{{ outage.tagInTime | formatTime }}</strong>
          </v-col>
          <v-col cols="12" md="9">
            <v-card color="yellow">
              <v-card-text>
                <p>
                  <strong>Tag In Time:</strong>
                  {{ outage.tagInTime | formatTime }}
                </p>
                <p><strong>Tag Holder:</strong> {{ outage.tagHolderId }}</p>
                <p><strong>Tag Number:</strong> {{ outage.tagNumber }}</p>
                <p><strong>Tag Placed By:</strong></p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-timeline-item>
      <v-timeline-item v-if="outage.tagInTime || outage.timeIn" color="primary">
        <v-row class="pt-1">
          <v-col cols="12" md="3">
            <strong>{{ outage.timeIn | formatTime }}</strong>
          </v-col>
          <v-col cols="12" md="9">
            <v-card color="green">
              <v-card-text>
                <p>
                  <strong>Tag Out Time</strong>
                  {{ outage.tagOutTime | formatTime }}
                </p>
                <p><strong>Fault Discovered:</strong> {{ outage.cause }}</p>
                <p>
                  <strong>Resolution/Mitigation:</strong>
                  {{ outage.resolution }}
                </p>
                <p><strong>Tag Removed By:</strong></p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-timeline-item>
    </v-timeline>
  </v-container>
</template>
<script>
export default {
  name: 'OutageDetail',

  async fetch() {
    await this.$store.dispatch('outage/getAllOutages')
  },

  computed: {
    outage() {
      return this.$store.getters['outage/getOutageById'](this.$route.params.id)
    },
  },
}
</script>
