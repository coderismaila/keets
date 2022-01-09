<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h2>{{ station | get('name') }}</h2>
        <p class="mt-4">
          This station is located in Birnin Gwari town and serves the whole of
          Birnin Gwari and environs.
        </p>
      </v-col>
    </v-row>

    <div>
      <v-tabs v-model="tab">
        <v-tab>Power Transformer</v-tab>
        <v-tab>Feeders</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item>Power Transformer</v-tab-item>
        <v-tab-item>Feeders</v-tab-item>
      </v-tabs-items>
    </div>
  </v-container>
</template>
<script>
// import { mapGetters } from 'vuex'

export default {
  name: 'StationDetail',
  data() {
    return {
      tab: [0],
    }
  },
  async fetch() {
    await this.$store.dispatch('station/getAllStations')
  },

  computed: {
    station() {
      return this.$store.getters['station/getStationById'](
        this.$route.params.id
      )
    },
  },

  methods: {},
}
</script>
