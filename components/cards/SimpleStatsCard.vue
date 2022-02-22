<template>
  <v-card min-width="200px" class="px-0">
    <v-list-item class="px-2">
      <v-list-item-content>
        <v-list-item-title class="text-h4 text-center">
          {{ title }}
        </v-list-item-title>
      </v-list-item-content>

      <v-list-item-avatar class="pa-2" tile size="80" :color="color">{{
        outageType
      }}</v-list-item-avatar>
    </v-list-item>
  </v-card>
</template>
<script>
export default {
  name: 'SimpleStatsCard',
  props: {
    title: {
      type: Number,
      required: true,
    },
    outageType: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: 'grey',
    },
  },
}
</script>
