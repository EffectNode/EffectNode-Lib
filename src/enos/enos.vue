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
// import * as YoNetAPI from '@/enos/Compos/APIs/yoNet.js'

Vue.component('vue-draggable-resizable', VueDraggableResizable)

export default {
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
    Promise.all([
      PortalAPI.init()
    ]).then((res) => {
      this.uiAPI = {
        portal: res[0],
        // yo: YoNetAPI,
        sessionID: 'effectnode-local-session-defualt-ID'
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
