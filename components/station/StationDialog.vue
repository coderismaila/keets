<template>
  <v-dialog v-model="dialog2" max-width="400px">
    <template #activator="{ on, attrs }">
      <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
        New Station
        <v-icon right dark> mdi-plus </v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ formTitle }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-alert v-if="station_error" type="error" dismissible>{{
            station_error_message
          }}</v-alert>
          <v-row>
            <v-col cols="12" class="pa-0">
              <v-text-field
                v-model="editedItem2.name"
                :rules="[required]"
                outlined
                dense
                placeholder="Station Name"
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="pa-0">
              <v-select
                v-model="editedItem2.areaOfficeName"
                :items="areaOfficeNames"
                :rules="[required]"
                cache-items
                :error="error"
                :error-messages="error_message"
                placeholder="Area Office"
                outlined
                dense
                :loading="loading"
              ></v-select>
            </v-col>
            <v-col cols="12" class="pa-0">
              <v-radio-group
                v-model="editedItem2.stationType"
                row
                :rules="[required]"
              >
                <v-radio label="Transmission" value="TRANSMISSION"></v-radio>
                <v-radio label="Distribution" value="DISTRIBUTION"></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click.native="close"> Cancel </v-btn>
        <v-btn color="primary" text @click="save"> Save </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import rules from '~/mixins/rules'

export default {
  name: 'StationDialog',
  mixins: [rules],
  props: {
    dialog: {
      required: true,
      type: Boolean,
    },
    editedIndex: {
      required: true,
      type: Number,
    },
    editedItem: {
      required: true,
      type: Object,
      name: {
        required: true,
        type: String,
      },
      stationType: {
        required: true,
        type: String,
      },
      areaOfficeName: {
        required: true,
        type: String,
      },
    },
    defaultItem: {
      required: true,
      type: Object,
    },
  },
  data() {
    return {
      loading: false,
    }
  },
  computed: {
    ...mapState('area-office', ['areaOffices', 'error', 'error_message']),
    ...mapState('station', {
      station_error: 'error',
      station_error_message: 'error_message',
    }),
    ...mapGetters('area-office', ['areaOfficeNames']),
    dialog2: {
      get() {
        return this.dialog
      },
      set(dialog) {
        this.$emit('input', dialog)
      },
    },
    editedIndex2: {
      get() {
        return this.editedIndex
      },
      set(editedIndex) {
        this.$emit('input2', editedIndex)
      },
    },
    editedItem2: {
      get() {
        return this.editedItem
      },
      set(editedItem) {
        this.$emit('input3', editedItem)
      },
    },
    defaultItem2: {
      get() {
        return this.defaultItem
      },
      set(defaultItem) {
        this.$emit('input4', defaultItem)
      },
    },
    formTitle() {
      return this.editedIndex === -1 ? 'New Station' : 'Edit Station'
    },
  },
  async created() {
    this.loading = true
    await this.$store.dispatch('area-office/getAllAreaOffices')
    this.loading = false
  },

  methods: {
    ...mapActions('station', ['addStation', 'updateStation']),

    close() {
      this.dialog2 = false
      this.$nextTick(() => {
        this.editedItem2 = Object.assign({}, this.defaultItem2)
        this.editedIndex2 = -1
      })
    },
    save() {
      if (this.editedIndex > -1) {
        this.updateStation(this.editedItem)
      } else {
        this.addStation(this.editedItem)
      }
      // TODO: revisit this
      this.close()
    },
  },
}
</script>
