<template>
  <v-container>
    <h2>{{ station | get('name') }}</h2>

    <div class="mt-4">
      <v-tabs v-model="tab">
        <v-tab>Power Transformer</v-tab>
        <v-tab>Feeders</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item><power-transformer-tab /></v-tab-item>
        <v-tab-item>Feeders</v-tab-item>
      </v-tabs-items>
    </div>
  </v-container>
</template>
<script>
import PowerTransformerTab from '~/components/station/PowerTransformerTab.vue'
// import { mapGetters } from 'vuex'

export default {
  name: 'StationDetail',
  components: { PowerTransformerTab },

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
