<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    :return-value.sync="time"
    transition="scale-transition"
    offset-y
    max-width="290px"
    min-width="290px"
  >
    <template #activator="{ on, attrs }">
      <v-text-field
        v-model="time"
        :label="title"
        prepend-inner-icon="mdi-clock-time-four-outline"
        outlined
        dense
        readonly
        v-bind="attrs"
        v-on="on"
      ></v-text-field>
    </template>
    <v-time-picker v-model="time" full-width format="24hr">
      <v-spacer></v-spacer>
      <v-btn text color="primary" @click="menu = false"> Cancel </v-btn>
      <v-btn text color="primary" @click="$refs.menu.save(time)"> OK </v-btn>
    </v-time-picker>
  </v-menu>
</template>
<script>
export default {
  name: 'TimePicker',
  props: {
    timeProp: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: 'Time',
    },
  },
  data() {
    return {
      menu: false,
    }
  },

  computed: {
    time: {
      get() {
        return this.timeProp
      },
      set(timeProp) {
        this.$emit('update:timeProp', timeProp)
      },
    },
  },
}
</script>
