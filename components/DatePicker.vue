<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    :return-value.sync="date"
    transition="scale-transition"
    offset-y
    min-width="auto"
  >
    <template #activator="{ on, attrs }">
      <v-text-field
        v-model="date"
        :disabled="disabledProp"
        dense
        label="Date of Birth"
        outlined
        prepend-inner-icon="mdi-calendar"
        readonly
        v-bind="attrs"
        v-on="on"
      ></v-text-field>
    </template>
    <v-date-picker v-model="date" no-title scrollable>
      <v-spacer></v-spacer>
      <v-btn text color="primary" @click="menu = false"> Cancel </v-btn>
      <v-btn text color="primary" @click="$refs.menu.save(date)"> OK </v-btn>
    </v-date-picker>
  </v-menu>
</template>
<script>
export default {
  name: 'DatePicker',
  props: {
    dateProp: {
      type: String,
      default: '',
    },
    disabledProp: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      menu: false,
      modal: false,
      menu2: false,
    }
  },
  computed: {
    date: {
      get() {
        return new Date(this.dateProp).toISOString().substring(0, 10)
      },
      set(dateProp) {
        this.$emit('update:dateProp', dateProp)
      },
    },
  },
}
</script>
