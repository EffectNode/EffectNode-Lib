<template>
  <div class="full ll-perspective dont-move">
    <div tag="div" class="full ll-cam" name="zoomba" :style="getGroupCSS()">

          <vue-draggable-resizable
            :key="ip.id"
            v-for="(ip, ipi) in uiAPI.portal.portals.slice().sort((a, b) => {
              let da = new Date(a.date)
              let db = new Date(b.date)
              if (da > db) {
                return 1
              } else if (da === db) {
                return 0
              } else {
                return -1
              }
            })"

            :w="ip.win.width"
            :h="ip.win.height"
            :x="ip.win.x"
            :y="ip.win.y"
            :z="ip.win.z"

            :minh="122"
            :minw="198"

            drag-handle=".touch-drag"
            drag-cancel=".cancel"
            @dragging="(x, y) => {
              onDrag(x, y, ip)
            }"
            @resizing="(x, y, w, h) => {
              onResize(x, y, w, h, ip)
            }"

            :handles="['br', 'bl', 'tl']"
            :ref="'portals_' + ip.id"
            :active="true"
            @activated="onActivated(ip)"
            :style="getWindowStyle(ip, ipi)"
            >
              <keep-alive>
                <Component
                  v-if="!ip.win.minimised"
                  :ref="`p-compo-${ip.id}`"
                  @mouseenter="() => { ip.win.active = true; }"
                  @mouseout="() => { ip.win.active = true; }"
                  @activated="onActivated(ip)"
                  class="full"
                  @click="onActivated(ip)"
                  :uiAPI="uiAPI"
                  :is="ip.app"
                  :portal="ip"
                ></Component>
              </keep-alive>
          </vue-draggable-resizable>

    </div>

    <TaskBar
      :uiAPI="uiAPI"
      ref="taskbar"
      @activated="(v) => {
        onActivated(v.portal)
      }"
      @view="(v) => {
        $emit('view', v)
      }"
      @opened="(v) => {
        opened = v
      }"
    ></TaskBar>
  </div>
</template>

<script>
// import QuotesApp from '@/enOS/Apps/QuotesApp'
// import AnimationApp from '@/enOS/Apps/AnimationApp'
// import DimensionalApp from '@/enOS/Apps/DimensionalApp'
// import ParticleSeaApp from '@/enOS/Apps/ParticleSeaApp'
// import VolumetricApp from '@/enOS/Apps/VolumetricApp'
// import ConnectorApp from '@/enOS/Apps/ConnectorApp'
// import ExecEnvApp from '@/enOS/Apps/ExecEnvApp'
// import ModEditorApp from '@/enOS/Apps/ModEditorApp'
import TaskBar from '../TaskBar/TaskBar.vue'
import * as AppList from '@/enos/AppList.js'

export default {
  props: {
    uiAPI: {}
  },
  components: {
    TaskBar,
    // ParticleSeaApp,
    // DimensionalApp,
    // AnimationApp,
    // QuotesApp,
    // VolumetricApp,
    // ConnectorApp,
    // ExecEnvApp,
    // ModEditorApp,
    // YoTeachApp: require('@/enos/Apps/YoTeachApp/YoTeachApp.vue').default,
    // SysApp: require('@/enos/Apps/SysApp/SysApp.vue').default,
    // NoteApp: require('@/enos/Apps/NoteApp/NoteApp.vue').default,
    ...AppList.Apps()
  },
  data () {
    return {
      opened: false,
      resizeTimeout: 0,
      sct: 0
    }
  },
  beforeCreate () {
    let apps = AppList.Apps()
    Object.keys(apps).forEach(kn => {
      this.$options.components[kn] = apps[kn]
    })
  },
  created () {
  },
  mounted () {
    this.loadLS()
    this.loadResizer()
  },
  watch: {
    metasJSON () {
      this.shouldSave()
    },
    portalsJSON () {
      this.shouldSave()
    },
    portalLength () {
      this.shouldSave()
      this.loadResizer()
    }
  },
  computed: {
    portalLength () {
      return this.uiAPI.portal.portals.length
    },
    portalsJSON () {
      return JSON.stringify(this.uiAPI.portal.portals)
    },
    metasJSON () {
      return JSON.stringify(this.uiAPI.portal.meta)
    }
  },
  methods: {
    getGroupCSS () {
      if (this.opened) {
        return {
          filter: 'blur(20px)'
        }
      } else {
        return {
          filter: 'none'
        }
      }
    },
    loadResizer () {
      this.$nextTick(() => {
        this.uiAPI.portal.portals.forEach((ip) => {
          if (this.$refs['portals_' + ip.id]) {
            let e = this.$refs['portals_' + ip.id][0]
            if (e) {
              let br = e.$el.querySelector('.handle.handle-br')
              br.addEventListener('mousedown', () => {
                this.onActivated(ip)
              }, false)
              br.addEventListener('touchstart', () => {
                this.onActivated(ip)
              }, false)
            }
          }
        })
      })
    },
    getWindowStyle (ip, ipi) {
      // ipi = ip.win.z
      // ipi = this.uiAPI.portal.portals.length - ipi
      // let max = -this.uiAPI.portal.portals.length * 300
      return {
        transition: 'transform 0.5s',
        // transform: this.uiAPI.portal.isIn3D() ? `translateZ(-500px) rotateX(-30deg) rotateY(30deg)` : ``
        transform: this.uiAPI.portal.isIn3D() ? `rotateX(-30deg) rotateY(30deg)` : ``
      }
    },
    loadLS () {
      let items = window.localStorage.getItem(this.uiAPI.sessionID + 'portals-enos')
      let meta = window.localStorage.getItem(this.uiAPI.sessionID + 'portals-meta-enos')
      try {
        if (items && meta) {
          this.uiAPI.portal.portals = JSON.parse(items)
          this.uiAPI.portal.meta = JSON.parse(meta)
        } else {
          this.uiAPI.portal.makeSample()
          this.$refs['taskbar'].startMenu = true
        }

        this.uiAPI.portal.fixOverflow()
        this.uiAPI.portal.makeZList()
      } catch (e) {
        console.log('==== Reset ====')
        this.uiAPI.portal.portals = []
        this.uiAPI.portal.makeSample()
        console.log(e)
      }

      // this.$forceUpdate()
    },
    shouldSave () {
      this.$nextTick(() => {
        window.localStorage.setItem(this.uiAPI.sessionID + 'portals-meta-enos', JSON.stringify(this.uiAPI.portal.meta))
        window.localStorage.setItem(this.uiAPI.sessionID + 'portals-enos', JSON.stringify(this.uiAPI.portal.portals))
      })
    },
    onActivated (ip) {
      // console.log(ip)
      this.uiAPI.portal.activate(ip)

      if (!this.$options.components[ip.app]) {
        this.uiAPI.portal.removeWindow(ip)
      }

      this.$forceUpdate()

      // this.shouldSave()
    },
    onResize (x, y, width, height, p) {
      p.win.x = x
      p.win.y = y
      p.win.width = width
      p.win.height = height
      // this.shouldSave()

      let ip = p
      let compo = this.$refs[`p-compo-${ip.id}`]
      if (compo && compo[0]) {
        if (window.innerWidth < 500) {
          clearTimeout(this.resizeTimeout)
          this.resizeTimeout = setTimeout(() => {
            compo[0].$emit('resize', { portal: p })
          }, 60)
        } else {
          compo[0].$emit('resize', { portal: p })
        }
        // compo[0].$emit('resize', { portal: p })
      }
    },
    onDrag (x, y, p) {
      p.win.x = x
      p.win.y = y
      // this.shouldSave()
    }
  }
}
</script>

<style lang="css">
  .vdr{
    border: none !important;
  }
  .handle.handle-br{
    border: none !important;
    /* background: linear-gradient(90deg, #FC466B 0%, cyan 100%) !important; */
    background-image: linear-gradient( 135deg, #72EDF2 10%, #5151E5 100%) !important;
    width: 25px !important;
    height: 25px !important;
    border-radius: 50% !important;
    display: block !important;
    /* bottom: -15px;
    right: -15px; */
    z-index: 1000 !important;
    opacity: 0;
    transition: opacity 0.35s;
  }
  .handle.handle-br:hover{
    opacity: 1
  }
  .handle.handle-bl{
    border: none !important;
    /* background: linear-gradient(90deg, #FC466B 0%, cyan 100%) !important; */
    background-image: linear-gradient( 135deg, #72EDF2 10%, #5151E5 100%) !important;
    width: 25px !important;
    height: 25px !important;
    border-radius: 50% !important;
    display: block !important;
    /* bottom: -15px;
    right: -15px; */
    z-index: 1000 !important;
    opacity: 0;
    transition: opacity 0.35s;
  }
  .handle.handle-bl:hover{
    opacity: 1
  }
  .handle.handle-tl{
    border: none !important;
    /* background: linear-gradient(90deg, #FC466B 0%, cyan 100%) !important; */
    background-image: linear-gradient( 135deg, #72EDF2 10%, #5151E5 100%) !important;
    width: 25px !important;
    height: 25px !important;
    border-radius: 50% !important;
    display: block !important;
    /* bottom: -15px;
    right: -15px; */
    z-index: 1000 !important;
    opacity: 0;
    transition: opacity 0.35s;
  }
  .handle.handle-tl:hover{
    opacity: 1
  }
</style>

<style scoped>
@import url(../jot.css);
.zoomba-enter-active, .zoomba-leave-active {
  transition: all 1s;
}
.zoomba-enter, .zoomba-leave-to /* .zoomba-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: scale(0);
}
</style>
