<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h2>{{ station.name }}</h2>
        <p class="mt-4">
          This station is located in Birnin Gwari town and serves the whole of
          Birnin Gwari and environs.
        </p>
      </v-col>
    </v-row>
    <v-row v-if="station">
      <v-col
        v-for="transformer in station.powerTransformer"
        :key="transformer.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        xl="2"
      >
        <v-card flat>
          <v-card-title>{{ transformer | get('name') }}</v-card-title>
          <v-card-subtitle></v-card-subtitle>
          <v-card-text>
            <p>Capacity: {{ transformer.capacityKVA }}kVA</p>
            <div v-if="transformer.feeder33kv">
              <p>Source Feeder:</p>
              <ul>
                <li>{{ transformer | get('feeder33kv.name') }}</li>
              </ul>
            </div>

            <div
              v-if="transformer.feeder && transformer.feeder.length > 0"
              class="mt-4"
            >
              <p>Outgoing Feeders:</p>
              <ul>
                <li v-for="feeder in transformer.feeder" :key="feeder.id">
                  {{ feeder.name }}
                </li>
              </ul>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
// import { mapGetters } from 'vuex'

export default {
  name: 'StationDetail',
  data() {
    return {}
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
