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
        <span v-if="$vuetify.breakpoint.mdAndUp"> Add Transformer </span>

        <v-icon dark>mdi-plus</v-icon>
      </v-btn>
    </template>
    <v-card class="py-4">
      <v-card-title>
        <span class="text-h5">{{ formTitle }}</span>
      </v-card-title>
      <v-card-text>
        <v-alert
          v-if="power_transformer_error"
          dense
          type="error"
          dismissible
          >{{ power_transformer_error_message }}</v-alert
        >
      </v-card-text>
      <v-card-text class="mt-4">
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            v-model="editedItem.name"
            outlined
            dense
            label="Power Transformer Name"
            :rules="[required]"
          ></v-text-field>
          <v-text-field
            v-model.number="editedItem.capacityKVA"
            outlined
            dense
            label="Capacity(KVA)"
            :rules="[required, isNumber]"
          ></v-text-field>
          <v-select
            v-model="editedItem.voltageRating"
            :items="voltageRatings"
            item-text="text"
            item-value="value"
            outlined
            dense
            label="Voltage Rating"
            :rules="[required]"
          ></v-select>
          <v-text-field
            v-model="editedItem.ratedCurrent"
            outlined
            dense
            label="Rated Current(optional)"
          >
          </v-text-field>
          <v-text-field
            v-model.number="editedItem.transformerPeakLoadMW"
            type="number"
            outlined
            dense
            label="Transformer Peak Load in MW(optional)"
          >
          </v-text-field>
          <div
            v-if="editedItem.voltageRating === '132/33KV'"
            class="d-flex flex-column w-full"
            style="width: 100%"
          >
            <v-select
              v-model="editedItem.sourceStationId"
              :items="filteredSourceStations"
              :error="station_error"
              :error-messages="station_error_message"
              item-text="name"
              item-value="id"
              hide-selected
              outlined
              dense
              row
              label="Source Station"
            />

            <v-select
              v-model="editedItem.sourcePowerTransformerId"
              :items="filteredSourcePowerTransformers"
              :error="power_transformer_error"
              :error-messages="power_transformer_error_message"
              item-text="name"
              item-value="id"
              hide-selected
              outlined
              dense
              row
              label="Source Power Transformer"
            />
          </div>

          <v-select
            v-if="editedItem.voltageRating === '33/11KV'"
            v-model="editedItem.feeder33kvId"
            :items="feeders"
            :error="feeder_error"
            :error-messages="feeder_error_message"
            item-text="name"
            item-value="id"
            hide-selected
            outlined
            dense
            row
            label="33KV Feeder"
          />
        </v-form>
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
  name: 'PowerTransformerDialog',
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
    },
  },

  data() {
    return {
      editedItem: {
        name: null,
        capacity: null,
        voltageRating: null,
        routeLength: null,
        ratedCurrent: null,
        transformerPeakLoadMW: null,
        sourceStationId: null,
        sourcePowerTransformerId: null,
        feeder33kvId: null,
        stationId: this.$route.params.id,
        areaOfficeId: null,
      },
      defaultItem: {
        name: null,
        capacity: null,
        voltageRating: null,
        routeLength: null,
        ratedCurrent: null,
        transformerPeakLoadMW: null,
        sourceStationId: null,
        sourcePowerTransformerId: null,
        feeder33kvId: null,
        stationId: this.$route.params.id,
        areaOfficeId: null,
      },
      valid: true,
      loading: false,
      panel: [0],
      voltageRatings: [
        { text: '330/132KV', value: '330/132KV' },
        { text: '132/33KV', value: '132/33KV' },
        { text: '33/11KV', value: '33/11KV' },
      ],
    }
  },

  async fetch() {
    await this.$store.dispatch('power-transformer/getAllPowerTransformers')
  },

  computed: {
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

    ...mapState('station', {
      stations: 'stations',
      station_error: 'error',
      station_error_message: 'error_message',
    }),

    filteredSourceStations() {
      return this.stations.filter((station) => station.name.includes('330/132'))
    },

    filteredSourcePowerTransformers() {
      return this.powerTransformers.filter(
        (powerTransformer) =>
          powerTransformer.stationId === this.editedItem.sourceStationId
      )
    },

    formTitle() {
      return !this.editing ? 'New Power Transformer' : 'Edit Power Transformer'
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
    ...mapActions('power-transformer', [
      'addPowerTransformer',
      'updatePowerTransformer',
      'deletePowerTransformer',
    ]),

    async save() {
      this.loading = true
      if (this.editing) {
        await this.updatePowerTransformer(this.editedItem)
      } else {
        await this.addPowerTransformer(this.editedItem)
      }
      this.loading = false
      // TODO: revisit this
      if (this.power_transformer_error) {
        Notify.failure(this.power_transformer_error_message)
        // eslint-disable-next-line no-console
        console.log(this.power_transformer_error_message)
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
