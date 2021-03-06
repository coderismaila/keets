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
        <span v-if="$vuetify.breakpoint.mdAndUp"> New Feeder </span>

        <v-icon dark> mdi-plus </v-icon>
      </v-btn>
    </template>
    <v-card class="py-4">
      <v-card-title>
        <span class="text-h5">{{ formTitle }}</span>
      </v-card-title>
      <v-card-text>
        <v-card-text>
          <v-alert v-if="feeder_error" dense type="error" dismissible>{{
            feeder_error_message
          }}</v-alert>
        </v-card-text>
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-col cols="12" class="pb-0">
              <v-text-field
                v-model="editedItem.name"
                outlined
                dense
                label="Feeder Name"
                :rules="[required]"
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="pb-0">
              <v-text-field
                v-model="editedItem.nercCode"
                outlined
                dense
                label="NERC Code"
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="pb-0">
              <v-text-field
                v-model="editedItem.kaedcoCode"
                type="text"
                outlined
                dense
                label="KAEDCO Code"
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="pb-0">
              <v-radio-group
                v-model="editedItem.voltageLevel"
                row
                label="Voltage Level"
                :rules="[required]"
              >
                <v-radio value="KV11" label="11KV" />
                <v-radio value="KV33" label="33KV" />
              </v-radio-group>
            </v-col>
            <v-col cols="12" class="pb-0">
              <v-select
                v-model="editedItem.areaOfficeId"
                :items="areaOffices"
                :error="area_office_error"
                :error-messages="area_office_error_message"
                item-text="name"
                item-value="id"
                hide-selected
                outlined
                dense
                row
                label="Area Office"
                :rules="[required]"
              />
            </v-col>

            <v-col cols="12" class="pb-0">
              <v-select
                v-model="editedItem.stationId"
                :items="filteredStations"
                :error="station_error"
                :error-messages="station_error_message"
                item-text="name"
                item-value="id"
                hide-selected
                outlined
                dense
                row
                label="Station"
                :rules="[required]"
              />
            </v-col>
            <v-col cols="12" class="pb-0">
              <v-select
                v-model="editedItem.powerTransformerId"
                :items="filteredPowerTransformers"
                :error="power_transformer_error"
                :error-messages="power_transformer_error_message"
                item-text="name"
                item-value="id"
                hide-selected
                outlined
                dense
                row
                label="Power Transformer"
                :rules="[required]"
              />
            </v-col>
            <v-col cols="12" class="pb-0">
              <v-text-field
                v-model.number="editedItem.routeLength"
                type="number"
                outlined
                dense
                label="Route Length(km)"
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="py-0"> </v-col>
          </v-form>
        </v-card-text>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn @click="close"> Cancel </v-btn>
        <v-btn color="primary" :loading="loading" @click="save">
          {{ buttonText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { Notify } from 'notiflix'
import { mapActions, mapState } from 'vuex'
import rules from '~/mixins/rules'

export default {
  name: 'FeederDialog',
  mixins: [rules],
  props: {
    dialogProp: {
      type: Boolean,
      required: true,
    },
    editedItemProp: {
      type: Object,
      required: true,
    },
    editingProp: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      editedItem: {
        name: null,
        voltageLevel: null,
        routeLength: 0,
        kaedcoCode: null,
        nercCode: null,
        areaOfficeName: null,
        powerTransformerId: null,
        stationId: null,
        areaOfficeId: null,
      },
      defaultItem: {
        name: null,
        voltageLevel: null,
        routeLength: 0,
        kaedcoCode: null,
        nercCode: null,
        areaOfficeName: null,
        powerTransformerId: null,
        stationId: null,
        areaOfficeId: null,
      },
      valid: true,
      loading: false,
      panel: [0],
    }
  },

  async fetch() {
    await this.$store.dispatch('station/getAllStations')
    await this.$store.dispatch('areaoffice/getAllAreaOffices')
    await this.$store.dispatch('power-transformer/getAllPowerTransformers')
    await this.$store.dispatch('feeder/getAllFeeders')
  },

  computed: {
    ...mapState('feeder', {
      feeders: 'feeders',
      feeder_error: 'error',
      feeder_error_message: 'error_message',
    }),

    ...mapState('station', {
      stations: 'stations',
      station_error: 'error',
      station_error_message: 'error_message',
    }),

    ...mapState('areaoffice', {
      areaOffices: 'areaOffices',
      area_office_error: 'error',
      area_office_error_message: 'error_message',
    }),

    ...mapState('power-transformer', {
      powerTransformers: 'powerTransformers',
      power_transformer_error: 'error',
      power_transformer_error_message: 'error_message',
    }),

    ...mapState('feeder', {
      feeders: 'feeders',
      feeder_error: 'error',
      feeder_error_message: 'error_message',
    }),

    filteredStations() {
      if (this.editedItem.voltageLevel === 'KV33') {
        return this.stations.filter((station) =>
          station.name.includes('132/33')
        )
      } else if (this.editedItem.voltageLevel === 'KV11') {
        return this.stations.filter((station) => station.name.includes('33/11'))
      }
      return []
    },

    filteredPowerTransformers() {
      return this.powerTransformers.filter(
        (powerTransformer) =>
          powerTransformer.stationId === this.editedItem.stationId
      )
    },

    formTitle() {
      return !this.editing ? 'New Feeder' : 'Edit Feeder'
    },
    buttonText() {
      return !this.editing ? 'Save' : 'Update'
    },
    dialog: {
      get() {
        return this.dialogProp
      },
      set(dialogProp) {
        this.$emit('update:dialogProp', dialogProp)
      },
    },

    editing: {
      get() {
        return this.editingProp
      },
      set(editingProp) {
        this.$emit('update:editingProp', editingProp)
      },
    },
  },

  watch: {
    editing(value) {
      if (value) {
        this.editedItem = this.editedItemProp
      }
    },
  },

  methods: {
    ...mapActions('feeder', ['addFeeder', 'updateFeeder']),

    async save() {
      this.loading = true
      if (this.editing) {
        await this.updateFeeder(this.editedItem)
      } else {
        await this.addFeeder(this.editedItem)
      }
      this.loading = false
      // TODO: revisit this
      if (this.feeder_error) {
        // eslint-disable-next-line no-console
        console.log(this.feeder_error_message)
      } else {
        this.close()
        Notify.success(
          `${this.editedItem.name} has been ${
            this.editing ? 'updated' : 'added'
          }`
        )
      }
    },
    close() {
      this.dialog = false
      this.$store.commit('station/SET_ERROR')
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editing = false
        this.$refs.form.reset()
      })
    },
  },
}
</script>
