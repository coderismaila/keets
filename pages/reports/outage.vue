<template>
  <v-container>
    <v-card max-width="500px" flat class="mx-auto">
      <v-card-title>Outage Report</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <p>From</p>
            <date-picker :date-prop.sync="startDate" :disabled-prop="false" />
          </v-col>
          <v-col cols="12" md="6">
            <p>To</p>
            <date-picker :date-prop.sync="endDate" :disabled-prop="false" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <download-excel
              :fetch="gen"
              :fields="json_fields"
              :before-generate="startDownload"
              :before-finish="finishDownload"
              name="outage.xls"
            >
              <v-btn large width="100%" color="primary" :loading="loading"
                ><v-icon class="mr-2">mdi-download-outline</v-icon>
                Download</v-btn
              >
            </download-excel>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
import Vue from 'vue'
import JsonExcel from 'vue-json-excel'
import DatePicker from '~/components/DatePicker.vue'

Vue.component('DownloadExcel', JsonExcel)

export default {
  name: 'OutageReport',
  components: { DatePicker },
  data() {
    return {
      loading: false,
      startDate: this.$dayjs().toISOString(),
      endDate: this.$dayjs().toISOString(),
      json_fields: {
        'Area Office': 'feeder.areaOffice.name',
        Feeder: 'feeder.name',
        'Outage Type': 'outageType',
        'Relay Indication': 'relayIndication',
        'Load Loss (MW)': 'loadLoss',
        'Time Out': {
          field: 'timeOut',
          callback: (value) => {
            return this.$dayjs(value).format('YYYY-MM-DD HH:mm')
          },
        },
        'Time In': {
          field: 'timeIn',
          callback: (value) => {
            return this.$dayjs(value).format('YYYY-MM-DD HH:mm')
          },
        },
        'ResponseTime(hr)': {
          callback: (value) => {
            return this.$dayjs(value.timeIn).diff(
              this.$dayjs(value.timeOut),
              'h',
              true
            )
          },
        },
        Cause: 'cause',
        Resolution: 'resolution',
      },
      json_meta: [
        [
          {
            key: 'charset',
            value: 'utf-8',
          },
        ],
      ],
    }
  },
  methods: {
    startDownload() {
      this.loading = true
    },
    finishDownload() {
      this.loading = false
    },
    async gen() {
      const data = await this.$axios.$get(
        `/outage?startDate=${this.startDate}&endDate=${this.endDate}`
      )
      return data
    },
  },
}
</script>
