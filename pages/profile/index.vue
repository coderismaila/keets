<template>
  <v-container>
    <v-tabs v-model="tab" fixed-tabs show-arrows class="pa-0">
      <v-tab v-for="header in tabHeaders" :key="header.icon">
        <v-icon>{{ header.icon }}</v-icon>
        <span class="ml-4">{{ header.title }}</span>
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <profile-account></profile-account>
      </v-tab-item>

      <v-tab-item>
        <profile-security></profile-security>
      </v-tab-item>

      <v-tab-item>
        <profile-info></profile-info>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>
<script>
export default {
  name: 'ProfilePage',
  data() {
    return {
      tab: null,
      tabHeaders: [
        { title: 'Account', icon: 'mdi-account-outline' },
        { title: 'Security', icon: 'mdi-lock-open-outline' },
        { title: 'Info', icon: 'mdi-information-outline' },
      ],
    }
  },
}
</script>
