<template>
  <Screen class="over-hidden">
    <Projects v-if="view === 'projects'" :ns="pjsID" @load="loadProject" @remove-projec="removeProject"></Projects>
    <Portals v-if="view === 'enos' && uiAPI" :uiAPI="uiAPI" @view="(v) => { view = v }">
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
import Projects from './Compos/Projects/Projects.vue'
import 'vue-draggable-resizable/dist/VueDraggableResizable.css'

Vue.component('vue-draggable-resizable', VueDraggableResizable)

let getID = () => '_' + Math.random().toString(36).substr(2, 9)

export default {
  props: {
    apps: {
      default () {
        return []
      }
    },
    pjsID: {
      default: 'ENPJ'
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
    Portals,
    Projects
  },
  data () {
    return {
      view: 'projects',
      uiAPI: false,
      sessionID: 0
    }
  },
  async mounted () {
    let NS = this.ns
    let sessionID = window.localStorage.getItem(NS)
    if (!sessionID) {
      window.localStorage.setItem(NS, `${NS}-@-` + Math.random().toString(36).substr(2, 9))
      sessionID = window.localStorage.getItem(NS)
    }

    if (!this.effectnode) {
      this.init({ sessionID: getID() })
    } else {
    }
  },
  methods: {
    removeProject ({ projectID }) {
      EffectNodeAPI.removeDB({ sess: projectID })
    },
    loadProject ({ projectID }) {
      this.init({ sessionID: projectID })
    },
    async init ({ sessionID }) {
      this.uiAPI = false
      this.view = 'enos'
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
    }
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
