<template>
  <v-container>
    <v-card flat>
      <v-card-title class="mb-5">Network</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <material-stats-card
              icon="mdi-transmission-tower"
              title="TCN Interfaces"
              value="30"
            />
          </v-col>
          <v-col cols="12" md="4">
            <material-stats-card
              icon="mdi-transmission-tower"
              title="33KV Feeders"
              value="30"
            />
          </v-col>
          <v-col cols="12" md="4">
            <material-stats-card
              icon="mdi-transmission-tower"
              title="11KV Feeders"
              value="30"
            />
          </v-col>
          <v-col cols="12" md="4">
            <material-stats-card
              icon="mdi-transmission-tower"
              title="Inj. Substations"
              value="56"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
import MaterialStatsCard from '~/components/cards/MaterialStatsCard.vue'
export default {
  name: 'DashboardPage',
  components: { MaterialStatsCard },
}
</script>
