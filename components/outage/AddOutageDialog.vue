<template>
  <v-dialog v-model="dialog" max-width="400px">
    <template #activator="{ on, attrs }">
      <v-btn
        tile
        color="primary"
        dark
        class="flex-inline"
        v-bind="attrs"
        v-on="on"
      >
        <span> Record Outage </span>
        <v-icon dark> mdi-plus </v-icon>
      </v-btn>
    </template>
    <v-card class="px-2 py-4">
      <v-card-title> Record Outage </v-card-title>
      <v-card-text v-show="outage_error">
        <v-alert type="error">{{ outage_error_message }}</v-alert>
      </v-card-text>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-select
            v-model="editedItem.feederId"
            label="Feeder Name"
            :items="getUserStationFeeders"
            item-text="name"
            item-value="id"
            outlined
            dense
            :rules="[required]"
          />
          <v-select
            v-model="editedItem.outageType"
            label="Outage Type"
            :items="outageTypes"
            item-text="text"
            item-value="value"
            outlined
            dense
            :rules="[required]"
          />

          <datetime-picker
            v-model="editedItem.timeOut"
            label="Time Out"
            :text-field-props="{ rules: [required, futureDate] }"
          ></datetime-picker>

          <v-select
            v-model="editedItem.relayIndication"
            label="Relay Indication"
            outlined
            :items="relayIndications"
            item-text="text"
            item-value="value"
            :rules="[required]"
            dense
          />
          <v-text-field
            v-model.number="editedItem.loadLoss"
            type="number"
            hide-spin-buttons
            label="Load Loss"
            outlined
            dense
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <div class="d-flex">
          <v-btn
            color="primary"
            :loading="loading"
            :disabled="!valid"
            @click="save"
            >Save</v-btn
          >
          <v-btn class="ml-2" @click="close">Cancel</v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import rules from '../../mixins/rules'

export default {
  name: 'AddOutage',
  mixins: [rules],
  data() {
    return {
      dialog: false,
      valid: true,
      loading: false,
      editedItem: {
        feederId: null,
        timeOut: null,
        outageType: '',
        relayIndication: '',
        loadLoss: 0,
      },
      defaultItem: {
        feederId: null,
        timeOut: null,
        outageType: '',
        relayIndication: '',
        loadLoss: 0,
      },
      outageTypes: [
        { text: 'Forced', value: 'FORCED' },
        { text: 'Emergency', value: 'EMERGENCY' },
        { text: 'Planned', value: 'PLANNED' },
        { text: 'SBT Compliance', value: 'SBT_COMPLIANCE' },
        { text: 'Frequency Control', value: 'FREQUENCY_CONTROL' },
        { text: 'System Collapse', value: 'SYSTEM_COLLAPSE' },
      ],
      relayIndications: [
        { text: 'O/C', value: 'O_C' },
        { text: 'E/F', value: 'E_F' },
        { text: 'O/C & E/F', value: 'OC_EF' },
        { text: 'No Relay Indication', value: 'NO_RELAY' },
      ],
    }
  },
  computed: {
    ...mapState('outage', {
      outages: 'outages',
      outage_error: 'error',
      outage_error_message: 'error_message',
    }),
    ...mapState('feeder', ['feeders']),

    ...mapGetters('feeder', ['getUserStationFeeders']),

    ...mapGetters('outage', ['getAllUserStationOutages']),
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
  },
  methods: {
    ...mapActions('outage', ['addOutage', 'updateOutage']),

    async save() {
      if (!this.$refs.form.validate()) return

      this.loading = true
      this.editedItem.staffId = this.$auth.user.id
      await this.addOutage(this.editedItem)

      if (this.outage_error) {
        this.loading = false
        return
      }
      this.loading = false
      this.close()
    },

    close() {
      this.dialog = false
      this.$store.commit('outage/SET_ERROR')
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.$refs.form.reset()
      })
    },
  },
}
</script>
