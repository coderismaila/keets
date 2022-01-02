<template>
  <v-dialog v-model="dialog" max-width="400px">
    <template #activator="{ on, attrs }">
      <v-btn tile color="primary" dark v-bind="attrs" v-on="on">
        New Station
        <v-icon right dark> mdi-plus </v-icon>
      </v-btn>
    </template>
    <v-card class="py-4">
      <v-card-title>
        <span class="text-h5">{{ formTitle }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-alert v-if="station_error" dense type="error" dismissible>{{
            station_error_message
          }}</v-alert>
          <v-row>
            <v-col cols="12" class="pb-0">
              <v-text-field
                v-model="editedItem.name"
                outlined
                dense
                placeholder="Station Name"
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="py-0">
              <v-combobox
                v-model="editedItem.areaOfficeName"
                :items="areaOfficeNames"
                cache-items
                :error="area_office_error"
                :error-messages="area_office_error_message"
                placeholder="Area Office"
                outlined
                dense
                :loading="loading"
              ></v-combobox>
            </v-col>
            <v-col cols="12" class="py-0">
              <p class="my-0">Station Type</p>
              <v-radio-group v-model="editedItem.stationType" row class="my-0">
                <v-radio label="Transmission" value="TRANSMISSION"></v-radio>
                <v-radio label="Distribution" value="DISTRIBUTION"></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>
          <v-divider v-show="editedIndex === -1" />
          <v-row class="pt-4">
            <v-expansion-panels
              v-show="editedIndex === -1"
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
                        v-model="input.name"
                        outlined
                        dense
                        placeholder="Transformer Name"
                      ></v-text-field>
                      <v-text-field
                        v-model.number="input.capacityKVA"
                        type="number"
                        outlined
                        dense
                        placeholder="CapacityKVA"
                      ></v-text-field>
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
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn small tile @click="close"> Cancel </v-btn>
        <v-btn small tile color="primary" :loading="loading" @click="save">
          {{ buttonText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { Notify } from 'notiflix'
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  name: 'StationDialog',
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
  },
  data() {
    return {
      // dialog: false,

      defaultItem: {
        name: '',
        stationType: '',
        areaOfficeName: '',
        powerTransformer: [
          {
            name: '',
            capacityKVA: '',
          },
        ],
      },
      loading: false,
      panel: [0],
    }
  },
  computed: {
    ...mapGetters('station', ['stationTableData']),
    ...mapState('area-office', {
      areaOffices: 'areaOffices',
      area_office_error: 'error',
      area_office_error_message: 'error_message',
    }),
    ...mapState('station', {
      station_error: 'error',
      station_error_message: 'error_message',
    }),
    ...mapGetters('area-office', ['areaOfficeNames']),

    formTitle() {
      return this.editedIndex === -1 ? 'New Station' : 'Edit Station'
    },
    buttonText() {
      return this.editedIndex === -1 ? 'Save' : 'Update'
    },
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
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
  },

  methods: {
    ...mapActions('station', ['addStation', 'updateStation', 'deleteStation']),

    add(object, fieldType) {
      const newObject = {}

      // eslint-disable-next-line no-unused-vars
      for (const [key, value] of Object.entries(object)) {
        newObject[key] = ''
      }
      fieldType.push(newObject)
    },

    remove(index, fieldType) {
      fieldType.splice(index, 1)
    },

    async save() {
      this.loading = true
      if (this.editedIndex > -1) {
        await this.updateStation(this.editedItem)
      } else {
        await this.addStation(this.editedItem)
      }
      this.loading = false
      // TODO: revisit this
      if (this.station_error) {
        return
      }
      this.close()
      Notify.success(
        `${this.editedItem.name} has been ${
          this.editedIndex > -1 ? 'updated' : 'added'
        }`
      )
    },
    close() {
      this.dialog = false
      this.$store.commit('station/SET_ERROR')
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
  },
}
</script>
