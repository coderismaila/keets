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
        <v-list-item nuxt to="/dashboard">
          <v-list-item-icon>
            <v-icon>mdi-home-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-group
          v-for="item in items"
          :key="item.title"
          v-model="item.active"
          :prepend-icon="item.icon"
          no-action
        >
          <template #activator>
            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item
            v-for="child in item.items"
            :key="child.title"
            nuxt
            :to="child.to"
          >
            <v-list-item-content>
              <v-list-item-title v-text="child.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
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
export default {
  name: 'DefaultLayout',
  data() {
    return {
      drawer: false,
      items: [
        {
          icon: 'mdi-toolbox-outline',
          title: 'Assets',
          items: [
            { title: 'Stations', to: '/assets/station' },
            { title: 'Transformers', to: '/transformer' },
            { title: 'Feeders', to: '/feeders' },
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
