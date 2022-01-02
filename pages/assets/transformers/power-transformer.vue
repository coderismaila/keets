<template>
  <v-container>
    <v-data-table
      calculate-widths
      mobile-breakpoint="0"
      :headers="headers"
      :items="stationTableData"
      :items-per-page="5"
      :loading="$fetchState.pending"
    />
  </v-container>
</template>
<script>
export default {
  name: 'TransformerPage',
  data() {
    return {
      headers: [
        {
          text: 'Station Name',
          align: 'start',
          sortable: false,
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
}
</script>
