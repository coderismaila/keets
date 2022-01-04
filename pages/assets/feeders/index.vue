<template>
  <v-container>
    <v-data-table :headers="headers" />
  </v-container>
</template>
<script>
export default {
  name: 'FeedersPage',
  data() {
    return {
      headers: [
        {
          text: 'Feeder Name',
          align: 'start',
          sortable: true,
          search: true,
          value: 'name',
          width: '300px',
        },
        { text: 'Source Station', value: 'station', width: '150px' },
        { text: 'Route Length(km)', value: 'routeLength' },
        { text: 'Area Office', value: 'areaOfficeName', width: '150px' },
        { text: 'Voltage', value: 'voltageLevel' },
        { text: 'Actions', value: 'actions', sortable: false, width: '100px' },
      ],
    }
  },
}
</script>
