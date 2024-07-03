<template>
  <div class="w-100">
    <v-app-bar app clipped-left dense class="top-menu" color="white" elevation="1">
      <router-link :to="{name: 'sensor_log_event'}" class="d-flex align-center">
        <img src="@/assets/logo-black.png" height="40" />
      </router-link>
      <div class="ml-auto d-flex align-center">
        <v-divider vertical/>
        <v-btn icon small color="deep-orange accent-2" class="ml-4" @click="logout_dialog.show=true">
          <v-icon>mdi-power</v-icon>
        </v-btn>
      </div>
    </v-app-bar>

    <v-navigation-drawer app clipped absolute permanent color="white" :mini-variant="mini">
      <div class="mt-2 px-4 d-flex justify-space-between align-center">
        <template v-if="mini">
          <v-icon @click="mini = false">mdi-chevron-double-right</v-icon>
        </template>
        <template v-else>
          <div width="100"></div>
          <v-btn class="expandMenu" icon @click="mini = true">
            <v-icon>mdi-chevron-double-left</v-icon>
          </v-btn>
        </template>
      </div>
      <!-- <v-list-item v-once :to="{name: navLinks[0].subLinks[0].route}" color="primary">
        <v-list-item-avatar>
          <v-icon>{{ navLinks[0].icon }}</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{ navLinks[0].text }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item> -->
      <v-list-item v-once :to="{name: navLinks[2].subLinks[0].route}" color="primary">
        <v-list-item-avatar>
          <v-icon>{{ navLinks[2].icon }}</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{ navLinks[2].text }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <div class="subMenuWrapper">
        <v-list class="py-0 subMenu" :class="{subMenuOpen: $route.path.startsWith('/monitor')}">
          <v-list-item dense :to="{name: navLinks[2].subLinks[0].route}" color="primary lighten-2">
            <v-list-item-content>
              <v-list-item-title class="pl-14">{{ navLinks[2].subLinks[0].text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item dense :to="{name: navLinks[2].subLinks[1].route}" color="primary lighten-2">
            <v-list-item-content>
              <v-list-item-title class="pl-14">{{ navLinks[2].subLinks[1].text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item dense :to="{name: navLinks[2].subLinks[2].route}" color="primary lighten-2">
            <v-list-item-content>
              <v-list-item-title class="pl-14">{{ navLinks[2].subLinks[2].text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>            
        </v-list>
      </div>

      <v-list-item v-once :to="{name: navLinks[3].subLinks[0].route}" color="primary">
        <v-list-item-avatar>
          <v-icon>{{ navLinks[3].icon }}</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{ navLinks[3].text }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
            
      <v-list class="py-0">
        <v-list-item v-once :to="{name: navLinks[1].subLinks[0].route}" color="primary">
          <v-list-item-avatar>
            <v-icon>{{ navLinks[1].icon }}</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ navLinks[1].text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <div class="subMenuWrapper">
          <v-list class="py-0 subMenu" :class="{subMenuOpen: $route.path.startsWith('/manage')}">
            <v-list-item dense :to="{name: navLinks[1].subLinks[0].route}" color="primary lighten-2">
              <v-list-item-content>
                <v-list-item-title class="pl-14">{{ navLinks[1].subLinks[0].text }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item dense :to="{name: navLinks[1].subLinks[1].route}" color="primary lighten-2">
              <v-list-item-content>
                <v-list-item-title class="pl-14">{{ navLinks[1].subLinks[1].text }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item dense :to="{name: navLinks[1].subLinks[2].route}" color="primary lighten-2">
              <v-list-item-content>
                <v-list-item-title class="pl-14">{{ navLinks[1].subLinks[2].text }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </div>
        

        <v-list-item v-once :to="{name: navLinks[4].subLinks[0].route}" color="primary">
          <v-list-item-avatar>
            <v-icon>{{ navLinks[4].icon }}</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ navLinks[4].text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-once :to="{name: navLinks[5].subLinks[0].route}" color="primary">
          <v-list-item-avatar>
            <v-icon>{{ navLinks[5].icon }}</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ navLinks[5].text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      
    </v-navigation-drawer>

    <v-main class="page-container">
      <slot></slot>
    </v-main>

    <v-dialog v-model="logout_dialog.show" max-width="500px">
      <v-card>
        <v-card-title>Do you want to log out?</v-card-title>
        <v-card-actions>
          <v-btn tile depressed class="flex-grow-1" @click="logout()">Logout</v-btn>
          <v-btn tile depressed class="flex-grow-1" @click="logout_dialog.show = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
import axios from "axios";
export default {
  components: {},
  props: {
    source: String,
  },
  methods:{
    logout(){
      this.$session.logout();
      this.$router.push('/login')
    }
  },
  computed: {
  },
  mounted () {
  },
  data: () => ({
    mini: false,
    worktime: '00:00',
    refreshKey: Date.now(),
    navLinks: [
      {
        icon: "mdi-desktop-mac-dashboard",
        text: "Event dashboard",
        subLinks: [
          { text: "Event dashboard", route: "sensor_log_event"},
        ]
      },     
      {
        icon: "mdi-sitemap",
        text: "Fire equipment",
        subLinks: [
          { text: "Sensor management", route: "sensor_manage"},
          { text: "Repeater management", route: "repeater_manage"},
          { text: "Receiver management", route: "receiver_manage"},
        ]
      },
      {
        icon: "mdi-radio-tower",
        text: "Real time monitoring",
        subLinks: [
          { text: "Sensor status", route: "sensor_event"},
          { text: "Repeater status", route: "repeater_event"},
          { text: "Event list", route: "event_list"},
        ]
      },
      {
        icon: "mdi-chart-areaspline-variant",
        text: "Data Analysis",
        subLinks: [
          { text: "데이터 분석", route: "sensor_analysis"},
        ]
      },
      {
        icon: "mdi-account-switch",
        text: "CRM",
        subLinks: [
          { text: "CRM 관리", route: "crm_manage"},
        ]
      },      
      {
        icon: "mdi-account-plus",
        text: "User",
        subLinks: [
          { text: "사용자 관리", route: "user_manage"},
        ]
      },

    ],
    logout_dialog: {
      show: false,
    },
  }),
};
</script>

<style lang="scss">
.top-menu {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
}
.page-container {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
  background-color:#dadada;
  // background-color: #3d5f70;
  // background-image: url(../assets/bg/bg-1.jpg);
  // background-size: cover;
}

.subMenuWrapper {
  position: relative;
  overflow-x: hidden;
}
.subMenu {
  margin-top: -320px;
  transition: margin-top 0.25s;
}
.subMenu.subMenuOpen { margin-top: 0; }
</style>
