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
    <v-stepper v-model="stepper" vertical>
      <v-sheet class="pl-8 pr-6 pt-4">
        <v-alert v-if="outage_error" type="error" dismissible>{{
          outage_error_message
        }}</v-alert>
      </v-sheet>

      <v-stepper-step step="1" :complete="stepper > 1">
        Record an Outage
      </v-stepper-step>
      <v-stepper-content step="1">
        <v-card flat class="mt-4">
          <v-form>
            <v-select
              v-model="editedItem.feederId"
              label="Feeder Name"
              :items="getUserStationFeeders"
              item-text="name"
              item-value="id"
              outlined
              dense
            />
            <v-select
              v-model="editedItem.outageType"
              label="Outage Type"
              :items="outageTypes"
              item-text="text"
              item-value="value"
              outlined
              dense
            />

            <datetime-picker
              v-model="editedItem.timeOut"
              label="Time Out"
            ></datetime-picker>

            <v-select
              v-model="editedItem.relayIndication"
              label="Relay Indication"
              outlined
              :items="relayIndications"
              item-text="text"
              item-value="value"
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

          <v-card-actions class="pa-0">
            <div class="d-flex">
              <v-btn color="primary" :loading="loading" @click="save"
                >Save</v-btn
              >
              <v-btn class="ml-2" @click="close">Cancel</v-btn>
            </div>
          </v-card-actions>
        </v-card>
      </v-stepper-content>

      <v-stepper-step step="2" :complete="stepper > 2">
        Issue Tag
      </v-stepper-step>
      <v-stepper-content step="2">
        <v-card flat class="mt-4 mb-12">
          <v-form>
            <v-text-field
              v-model.number="editedItem.tagNumber"
              label="Tag Number"
              outlined
              dense
            />
            <v-text-field
              v-model="editedItem.tagHolderId"
              label="Tag Holder Name"
              outlined
              dense
            />
            <v-text-field
              v-model="editedItem.thirdPartyName"
              label="Third Party Name"
              outlined
              dense
            />
            <datetime-picker
              v-model="editedItem.tagInTime"
              label="Tag In Time"
            ></datetime-picker>
          </v-form>
        </v-card>
        <div class="d-flex">
          <v-btn icon @click="stepper = 1"
            ><v-icon>mdi-chevron-left</v-icon></v-btn
          >
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="addTag">Save</v-btn>
          <v-btn @click="close">Cancel</v-btn>
        </div>
      </v-stepper-content>

      <v-stepper-step :complete="stepper > 3" step="3">
        Surrender Tag / Close Outage
      </v-stepper-step>
      <v-stepper-content step="3">
        <v-card flat class="mt-4 mb-12">
          <v-form>
            <datetime-picker
              v-model="editedItem.tagOutTime"
              label="Tag Out Time"
            ></datetime-picker>

            <datetime-picker
              v-model="editedItem.timeIn"
              label="Time In"
            ></datetime-picker>

            <v-textarea
              v-model="editedItem.cause"
              label="Cause"
              outlined
              dense
              height="100px"
            />
            <v-textarea
              v-model="editedItem.resolution"
              label="Resolution"
              outlined
              dense
              height="100px"
            />
            <v-text-field
              v-model="editedItem.staffNameTCN"
              label="TCN Staff Name"
              outlined
              dense
            />
          </v-form>
        </v-card>
        <v-btn color="primary" @click="surrenderTag">Save</v-btn>
        <v-btn @click="close">Cancel</v-btn>
      </v-stepper-content>
    </v-stepper>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  name: 'OutageDialog',
  props: {
    dialogProp: {
      type: Boolean,
      required: true,
    },
    editedItemProp: {
      type: Object,
      required: true,
    },
    editedIndexProp: {
      type: Number,
      required: true,
    },
    stepperProp: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      disabled: false,
      defaultItem: {
        feederId: null,
        timeOut: null,
        timeIn: null,
        outageType: '',
        relayIndication: '',
        loadLoss: 0,
        tagNumber: null,
        tagHolderId: null,
        thirdPartyName: '',
        tagInTime: null,
        tagOutTime: null,
        cause: '',
        resolution: '',
        staffNameTCN: '',
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

    dialog: {
      get() {
        return this.dialogProp
      },
      set(dialogProp) {
        this.$emit('update:dialogProp', dialogProp)
      },
    },

    editedItem: {
      get() {
        return this.editedItemProp
      },
      set(editedItemProp) {
        this.$emit('update:editedItemProp', editedItemProp)
      },
    },
    editedIndex: {
      get() {
        return this.editedIndexProp
      },
      set(editedIndexProp) {
        this.$emit('update:editedIndexProp', editedIndexProp)
      },
    },
    stepper: {
      get() {
        return this.stepperProp
      },
      set(stepperProp) {
        this.$emit('update:stepperProp', stepperProp)
      },
    },
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
  },

  methods: {
    ...mapActions('outage', ['addOutage', 'updateOutage']),

    async save() {
      this.loading = true
      this.editedItem.staffId = this.$auth.user.id
      const outage = await this.addOutage(this.editedItem)
      this.editedItem.id = outage?.id

      if (this.outage_error) {
        this.loading = false
        return
      }
      this.stepper = 2
      this.loading = false
    },

    async addTag() {
      this.loading = true

      delete this.editedItem.staffId

      await this.updateOutage(this.editedItem)

      if (this.outage_error) {
        this.loading = false
        return
      }

      this.stepper = 3
      this.loading = false
    },

    async surrenderTag(editedItem) {
      this.loading = true

      delete this.editedItem.staffId

      await this.updateOutage(this.editedItem)

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
        this.stepper = 1
      })
    },
  },
}
</script>
