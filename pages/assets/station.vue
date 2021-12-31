<template>
  <v-container>
    <v-data-table
      calculate-widths
      mobile-breakpoint="0"
      :headers="headers"
      :items="stationTableData"
      :items-per-page="5"
      :loading="$fetchState.pending"
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>Station</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="400px">
            <template #activator="{ on, attrs }">
              <v-btn
                tile
                color="primary"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
              >
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
                  <v-alert
                    v-if="station_error"
                    dense
                    type="error"
                    dismissible
                    >{{ station_error_message }}</v-alert
                  >
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
                      <v-radio-group
                        v-model="editedItem.stationType"
                        row
                        class="my-0"
                      >
                        <v-radio
                          label="Transmission"
                          value="TRANSMISSION"
                        ></v-radio>
                        <v-radio
                          label="Distribution"
                          value="DISTRIBUTION"
                        ></v-radio>
                      </v-radio-group>
                    </v-col>
                  </v-row>
                  <v-divider />
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
                                      (!i &&
                                        editedItem.powerTransformer.length > 1)
                                    "
                                    icon
                                    dark
                                    color="red"
                                    v-bind="attrs"
                                    @click="
                                      remove(i, editedItem.powerTransformer)
                                    "
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
                                    v-show="
                                      i ==
                                      editedItem.powerTransformer.length - 1
                                    "
                                    color="primary"
                                    small
                                    icon
                                    v-bind="attrs"
                                    @click="
                                      add(input, editedItem.powerTransformer)
                                    "
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
                <v-btn small tile @click.native="close"> Cancel </v-btn>
                <v-btn
                  small
                  tile
                  color="primary"
                  :loading="loading"
                  @click="save"
                >
                  {{ buttonText }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h7"
                >Are you sure you want to delete this item?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >Cancel</v-btn
                >
                <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                  >OK</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template #[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
    </v-data-table>
  </v-container>
</template>
<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import rules from '~/mixins/rules'

export default {
  name: 'StationPage',
  mixins: [rules],
  data() {
    return {
      panel: [0],
      title: 'Station',
      dialog: false,
      dialogDelete: false,
      loading: false,
      editedIndex: -1,
      editedItem: {
        name: '',
        stationType: '',
        areaOfficeName: '',
        powerTransformer: [
          {
            name: '',
            capacityKVA: 0,
          },
        ],
      },
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
  async fetch() {
    await this.$store.dispatch('station/getAllStations')
    await this.$store.dispatch('area-office/getAllAreaOffices')
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
  },

  watch: {
    dialog(val) {
      val || this.close()
    },

    dialogDelete(val) {
      val || this.closeDelete()
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
    },

    editItem(item) {
      this.editedIndex = this.stationTableData.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    close() {
      this.dialog = false
      this.$store.commit('station/SET_ERROR')
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    deleteItem(item) {
      this.editedIndex = this.stationTableData.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.stationTableData.splice(this.editedIndex, 1)
      this.closeDelete()
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
  },
}
</script>
