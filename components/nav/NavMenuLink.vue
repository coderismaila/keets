<template>
  <v-list-item nuxt :to="`/${to}`">
    <v-list-item-icon>
      <v-icon :x-small="!icon" class="mx-auto">
        {{ icon || alternateIcon }}
      </v-icon>
    </v-list-item-icon>

    <v-list-item-title>
      {{ title }}
    </v-list-item-title>
  </v-list-item>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: undefined,
    },
    to: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      alternateIcon: 'mdi-checkbox-blank-circle-outline',
    }
  },
}
</script>
