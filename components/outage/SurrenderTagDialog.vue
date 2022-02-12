<template>
  <v-dialog v-model="dialog" max-width="400px">
    <template #activator="{ on, attrs }">
      <v-btn icon rounded v-bind="attrs" v-on="on">
        <v-icon small>mdi-clock-outline</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title
        >Surrender Tag to {{ item.outageType }} on
        {{ item.feeder.name }}</v-card-title
      >
      <v-card-text v-show="outage_error">
        <v-alert type="error">{{ outage_error_message }}</v-alert>
      </v-card-text>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <datetime-picker
            v-model="formData.tagOutTime"
            label="Tag Out Time"
          ></datetime-picker>

          <datetime-picker
            v-model="formData.timeIn"
            label="Time In"
            :text-field-props="{ rules: [required, futureDate] }"
          ></datetime-picker>

          <v-textarea
            v-model="formData.cause"
            label="Cause"
            outlined
            dense
            height="100px"
          />
          <v-textarea
            v-model="formData.resolution"
            label="Resolution"
            outlined
            dense
            height="100px"
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
import { mapState } from 'vuex'
import rules from '~/mixins/rules'

export default {
  name: 'SurrenderTag',
  mixins: [rules],
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      dialog: false,
      valid: true,
      loading: false,
      formData: {
        tagOutTime: null,
        timeIn: null,
        cause: null,
        resolution: null,
      },
      defaultItem: {
        tagOutTime: null,
        timeIn: null,
        cause: null,
        resolution: null,
      },
    }
  },

  computed: {
    ...mapState('outage', {
      outages: 'outages',
      outage_error: 'error',
      outage_error_message: 'error_message',
    }),
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
  },

  methods: {
    async save() {
      if (!this.$refs.form.validate()) return

      this.loading = true
      this.formData = { ...this.item, ...this.formData }
      await this.$store.dispatch('outage/updateOutage', this.formData)

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
