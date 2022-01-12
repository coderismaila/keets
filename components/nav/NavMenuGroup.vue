<template>
  <v-list-group>
    <template #prependIcon>
      <v-icon :class="{ 'alternate-icon-small': !icon }">
        {{ icon }}
      </v-icon>
    </template>
    <template #activator>
      <v-list-item-title>
        {{ title }}
      </v-list-item-title>
    </template>

    <slot></slot>
  </v-list-group>
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
      required: true,
    },
  },
  data() {
    return {}
  },
}
</script>
