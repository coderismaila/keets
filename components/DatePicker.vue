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
    <template #activator="{ on }">
      <v-text-field
        v-model="date"
        :label="title"
        outlined
        prepend-inner-icon="mdi-calendar"
        readonly
        v-bind="textFieldProps"
        v-on="on"
      ></v-text-field>
    </template>
    <v-date-picker v-model="date">
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
      default: new Date(),
    },
    title: {
      type: String,
      default: 'Date',
    },
    // eslint-disable-next-line vue/require-default-prop
    textFieldProps: {
      type: Object,
    },
  },

  data() {
    return {
      menu: false,
      modal: false,
    }
  },
  computed: {
    date: {
      get() {
        return this.$dayjs(this.dateProp).format('YYYY-MM-DD')
      },
      set(dateProp) {
        this.$emit('update:dateProp', this.$dayjs(dateProp).toISOString())
      },
    },
  },
}
</script>
