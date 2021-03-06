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
        <span v-if="$vuetify.breakpoint.mdAndUp"> New Station </span>

        <v-icon dark> mdi-plus </v-icon>
      </v-btn>
    </template>
    <v-card class="py-4">
      <v-card-title>
        <span class="text-h5">{{ formTitle }}</span>
      </v-card-title>
      <v-card-text></v-card-text>
      <v-alert v-if="station_error" dense type="error" dismissible>{{
        station_error_message
      }}</v-alert>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-row>
            <v-col cols="12" class="pb-0">
              <v-text-field
                v-model="editedItem.name"
                outlined
                dense
                label="Station Name"
                :rules="[required]"
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="py-0">
              <v-combobox
                v-model="editedItem.areaOfficeName"
                :items="areaOfficeNames"
                cache-items
                :error="area_office_error"
                :error-messages="area_office_error_message"
                label="Area Office"
                outlined
                dense
                :rules="[required]"
                :loading="loading"
              ></v-combobox>
            </v-col>
            <v-col cols="12" class="py-0">
              <p class="my-0">Station Type</p>
              <v-radio-group
                v-model="editedItem.stationType"
                row
                class="my-0"
                :rules="[required]"
              >
                <v-radio label="Transmission" value="TRANSMISSION"></v-radio>
                <v-radio label="Distribution" value="DISTRIBUTION"></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>
          <v-divider v-show="!editing" />
          <v-row class="pt-4">
            <v-expansion-panels
              v-if="!editing"
              v-model="panel"
              flat
              class="elevation-0"
            >
              <v-expansion-panel>
                <v-expansion-panel-header
                  >Add Power Transformer</v-expansion-panel-header
                >
                <v-expansion-panel-content>
                  <v-row>
                    <v-col
                      v-for="(input, i) in editedItem.powerTransformer"
                      :key="i"
                      cols="12"
                    >
                      <v-text-field
                        v-model="editedItem.powerTransformer[i].name"
                        type="text"
                        outlined
                        dense
                        label="Transformer Name"
                        :rules="[required]"
                      ></v-text-field>
                      <v-select
                        v-model="editedItem.powerTransformer[i].voltageRating"
                        :items="voltageRatings"
                        item-text="text"
                        item-value="value"
                        outlined
                        dense
                        label="Voltage Rating"
                        :rules="[required]"
                      ></v-select>
                      <v-text-field
                        v-model.number="
                          editedItem.powerTransformer[i].capacityKVA
                        "
                        type="number"
                        outlined
                        dense
                        label="CapacityKVA"
                        :rules="[required]"
                      ></v-text-field>
                      <v-text-field
                        v-model="editedItem.powerTransformer[i].ratedCurrent"
                        outlined
                        dense
                        label="Rated Current(A)(optional)"
                      ></v-text-field>
                      <v-text-field
                        v-model="
                          editedItem.powerTransformer[i].transformerPeakLoadMW
                        "
                        type="number"
                        outlined
                        dense
                        label="Transformer Peak Load(MW)"
                      ></v-text-field>
                      <v-select
                        v-if="
                          editedItem.powerTransformer[i].voltageRating ===
                          '132/33KV'
                        "
                        v-model="editedItem.powerTransformer[i].sourceStationId"
                        :items="filteredSourceStations(i)"
                        item-text="name"
                        item-value="id"
                        outlined
                        dense
                        label="Source Station"
                        :rules="[required]"
                      ></v-select>
                      <v-select
                        v-if="
                          editedItem.powerTransformer[i].voltageRating ===
                          '132/33KV'
                        "
                        v-model="
                          editedItem.powerTransformer[i]
                            .sourcePowerTransformerId
                        "
                        :items="filteredSourcePowerTransformers(i)"
                        item-text="name"
                        item-value="id"
                        outlined
                        dense
                        label="Source Power Transformer"
                      ></v-select>
                      <v-select
                        v-show="editedItem.stationType === 'DISTRIBUTION'"
                        v-model="editedItem.powerTransformer[i].feeder33kvId"
                        :items="$store.getters['feeder/get33kvFeeders']"
                        item-text="name"
                        item-value="id"
                        type="number"
                        outlined
                        dense
                        label="33KV feeder"
                      ></v-select>
                      <v-tooltip bottom>
                        <template #activator="{ on, attrs }">
                          <v-btn
                            v-show="
                              i ||
                              (!i && editedItem.powerTransformer.length > 1)
                            "
                            icon
                            dark
                            color="red"
                            v-bind="attrs"
                            @click="remove(i, editedItem.powerTransformer)"
                            v-on="on"
                          >
                            <v-icon>mdi-delete-outline</v-icon>
                          </v-btn>
                        </template>
                        <span>remove</span>
                      </v-tooltip>
                      <v-tooltip bottom>
                        <template #activator="{ on, attrs }">
                          <v-btn
                            v-show="i == editedItem.powerTransformer.length - 1"
                            color="primary"
                            small
                            icon
                            v-bind="attrs"
                            @click="add(input, editedItem.powerTransformer)"
                            v-on="on"
                          >
                            <v-icon>mdi-plus</v-icon>
                          </v-btn>
                        </template>
                        <span>add</span>
                      </v-tooltip>
                    </v-col>

                    <v-col cols="12">
                      <div class="d-flex">
                        <v-spacer />
                      </div>
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-row>
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
import { mapActions, mapGetters, mapState } from 'vuex'
import rules from '~/mixins/rules'

export default {
  name: 'StationDialog',
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
      valid: true,
      editedItem: {
        name: null,
        stationType: null,
        areaOfficeName: null,
        powerTransformer: [
          {
            name: null,
            capacityKVA: null,
            voltageRating: null,
            ratedCurrent: null,
            transformerPeakLoadMW: null,
            sourcePowerTransformerId: null,
            feeder33kvId: null,
          },
        ],
      },
      defaultItem: {
        name: null,
        stationType: null,
        areaOfficeName: null,
        powerTransformer: [
          {
            name: null,
            capacityKVA: null,
            voltageRating: null,
            ratedCurrent: null,
            transformerPeakLoadMW: null,
            sourceStationId: null,
            sourcePowerTransformerId: null,
            feeder33kvId: null,
          },
        ],
      },
      voltageRatings: [
        { text: '330/132KV', value: '330/132KV' },
        { text: '132/33KV', value: '132/33KV' },
        { text: '33/11KV', value: '33/111KV' },
      ],
      loading: false,
      panel: [0],
    }
  },

  computed: {
    ...mapState('areaoffice', {
      areaOffices: 'areaOffices',
      area_office_error: 'error',
      area_office_error_message: 'error_message',
    }),

    ...mapState('station', {
      stations: 'stations',
      station_error: 'error',
      station_error_message: 'error_message',
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

    ...mapGetters('areaoffice', ['areaOfficeNames']),

    filteredSourceStations() {
      return (i) => {
        if (this.editedItem.powerTransformer[i].voltageRating === '132/33KV') {
          return this.stations.filter((station) =>
            station.name.includes('330/132')
          )
        }
        return this.stations.filter((station) =>
          station.name.includes('132/11')
        )
      }
    },

    filteredSourcePowerTransformers() {
      return (i) =>
        this.powerTransformers.filter(
          (powerTransformer) =>
            powerTransformer.stationId ===
            this.editedItem.powerTransformer[i].sourceStationId
        )
    },

    formTitle() {
      return !this.editing ? 'New Station' : 'Edit Station'
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
    ...mapActions('station', ['addStation', 'updateStation', 'deleteStation']),

    add(object, fieldType) {
      const newObject = {}

      // eslint-disable-next-line no-unused-vars
      for (const [key, value] of Object.entries(object)) {
        newObject[key] = null
      }
      fieldType.push(newObject)
    },

    remove(index, fieldType) {
      fieldType.splice(index, 1)
    },

    async save() {
      this.loading = true
      if (this.editing) {
        await this.updateStation(this.editedItem)
      } else {
        await this.addStation(this.editedItem)
      }
      this.loading = false
      // TODO: revisit this
      if (this.station_error) {
        // eslint-disable-next-line no-console
        console.log(this.station_error_message)
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
