<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      mobile-breakpoint="900"
      clipped
      fixed
      app
    >
      <v-list nav dense>
        <nav-menu-link
          title="Dashboard"
          icon="mdi-home-outline"
          to="dashboard"
        />

        <nav-menu-link
          title="Outages"
          icon="mdi-lightning-bolt-outline"
          to="outages"
        >
        </nav-menu-link>

        <nav-menu-link
          title="Load Reading"
          icon="mdi-lightbulb-on-outline"
          to="load-reading"
        />

        <nav-menu-link
          title="Manage Users"
          icon="mdi-account-group"
          to="users"
        />
        <nav-menu-group title="Manage Assets" icon="mdi-transmission-tower">
          <nav-menu-link title="Stations" to="assets/station"></nav-menu-link>
          <nav-menu-link title="Feeders" to="assets/feeders"></nav-menu-link>
        </nav-menu-group>
      </v-list>
      <template #append>
        <div class="pa-2">
          <v-btn v-if="$auth.loggedIn" block @click="signOut"> Sign Out </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    <v-app-bar
      color="primary"
      elevate-on-scroll
      elevation="1"
      clipped-left
      fixed
      dark
      app
    >
      <v-app-bar-nav-icon
        v-if="$vuetify.breakpoint.mdAndDown"
        @click.stop="drawer = !drawer"
      />
      <v-toolbar-title v-text="htitle" />
      <v-spacer />
      <v-menu offset-y>
        <template #activator="{ on, attrs }">
          <v-btn text v-bind="attrs" v-on="on">
            {{
              $auth.loggedIn
                ? $auth.user.firstName
                  ? $auth.user.firstName + ' ' + $auth.user.lastName
                  : $auth.user.user.username
                : ''
            }}
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in profileItems"
            :key="index"
            nuxt
            :to="item.to"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer inset app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import NavMenuGroup from '~/components/nav/NavMenuGroup.vue'
import NavMenuLink from '~/components/nav/NavMenuLink.vue'
export default {
  name: 'DefaultLayout',
  components: { NavMenuGroup, NavMenuLink },

  data() {
    return {
      drawer: false,
      items: [
        {
          icon: 'mdi-toolbox-outline',
          title: 'Assets',
          items: [
            { title: 'Stations', to: '/assets/station' },
            {
              title: 'Power Transformers',
              to: '/assets/transformers/power-transformer',
            },
            {
              title: 'Distribution Transformers',
              to: '/assets/transformers/distriution-transformer',
            },
            { title: 'Feeders', to: '/assets/feeders' },
          ],
          to: '/',
        },
      ],
      profileItems: [
        { title: 'Profile', to: '/profile' },
        { title: 'Update Password', to: '/update-password' },
        { title: 'Sign Out', to: '/auth/signout' },
      ],
      htitle: 'KEETS',
    }
  },

  methods: {
    async signOut() {
      try {
        await this.$auth.logout()
        this.$router.push('/')
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error)
      }
    },
  },
}
</script>
