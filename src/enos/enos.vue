<template>
  <Screen class="over-hidden">
    <Portals v-if="uiAPI" :uiAPI="uiAPI">
    </Portals>
  </Screen>
</template>

<script>
import Vue from 'vue'
import VueDraggableResizable from 'vue-draggable-resizable'
import 'web-animations-js'
import Screen from '@/enos/Compos/Screen/Screen.vue'
import Portals from '@/enos/Compos/Portals/Portals'
import * as PortalAPI from '@/enos/Compos/APIs/portals.js'
import * as AppOS from './AppList'
import 'vue-draggable-resizable/dist/VueDraggableResizable.css'

Vue.component('vue-draggable-resizable', VueDraggableResizable)

export default {
  props: {
    apps: {
      default () {
        return []
      }
    },
    ns: {
      default: 'RandomSessionIDForEffectNodeOS'
    }
  },
  components: {
    Screen,
    Portals
  },
  data () {
    return {
      uiAPI: false
    }
  },
  async mounted () {
    let NS = this.ns
    let sessionID = window.localStorage.getItem(NS)
    if (!sessionID) {
      window.localStorage.setItem(NS, `${NS}-@-` + Number(Math.random() * 1024 * 1024 * 1024 * 1024 * 1024).toFixed(0))
      sessionID = window.localStorage.getItem(NS)
    }

    AppOS.setAppList(this.apps)

    Promise.all([
      PortalAPI.init()
    ]).then((res) => {
      let portal = res[0]
      this.uiAPI = {
        portal,
        sessionID
      }
    })
  },
  methods: {

  }
}
</script>

<style>
/*
@media screen and (min-width: 320px) and (max-width: 767px) and (orientation: landscape) {
  html {
    transform: rotate(-90deg);
    transform-origin: left top;
    width: 100vh;
    overflow-x: hidden;
    position: absolute;
    top: 100%;
    left: 0;
  }
} */
</style>

<style scoped>
@import url(./Compos/jot.css);
.over-hidden{
  overflow: hidden;
}
.avoid-clicks {
  pointer-events: none;
}

.word-lite {
  color: white;
}

</style>
