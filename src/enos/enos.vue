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
import * as EffectNodeAPI from '@/enos/Compos/APIs/effectnode.js'
import * as BuilderAPI from '@/enos/Compos/APIs/builder.js'
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
      default: 'RSSID'
    },
    effectnode: {
      default: false
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

    let adder = this.apps

    if (this.effectnode) {
      adder = [
        {
          windowTitle: 'Effect Node Editor',
          compoName: 'enedit',
          App: require('./Apps/enEdit/enEdit.vue').default
        },
        {
          windowTitle: 'Animation Preview Window',
          compoName: 'enpreview',
          App: require('./Apps/enPreview/enPreview.vue').default
        },
        {
          windowTitle: 'Mod Editor Window',
          compoName: 'enmodedit',
          App: require('./Apps/modEdit/modEdit.vue').default,
          hidden: true
        },
        ...adder
      ]
    }

    AppOS.setAppList(adder)

    // effectnode
    let apis = [
      PortalAPI.init(),
      EffectNodeAPI.init({
        sessionID
      })
    ]

    Promise.all(apis)
      .then((res) => {
        let portal = res[0]
        let { Doc } = res[1]

        this.uiAPI = {
          Builder: BuilderAPI,
          projectID: sessionID,
          userID: sessionID,

          portal,
          enAPI: EffectNodeAPI,
          Doc,
          hive: {
            Data: EffectNodeAPI,
            Doc
          },
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
