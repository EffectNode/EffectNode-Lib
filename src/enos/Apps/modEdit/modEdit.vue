<template>
  <div class="full quotes-app">
    <TitleBar :portal="portal" @click="$emit('activated')" :uiAPI="uiAPI">
      <span  v-if="currentMod">
        {{ currentMod.name }}:
      </span>
      <span style="cursor: pointer; margin: 0px 6px; text-decoration: underline;" @click="view = 'inspect'">Insepctor</span>
      <span style="cursor: pointer; margin: 0px 6px; text-decoration: underline;" @click="view = 'remix'">Remixer</span>
      <span style="cursor: pointer; margin: 0px 6px; text-decoration: underline;" @click="view = 'code'">Code</span>

      <!-- <span style="cursor: pointer; margin: 0px 6px; text-decoration: underline;" @click="view = 'template'">Template</span> -->

    </TitleBar>
    <div class="content-div" @click="$emit('activated')">
      <div v-show="view === 'remix'" class="full">
         <div v-if="currentMod && currentMod.meta.length === 0">
          Effect Settings, choose to use
          <button v-show="currentMod.meta.length === 0" @click="addRange()">Value Sliders</button>
          or
          <button v-show="currentMod.meta.length === 0" @click="addTimelineTrack()">Timeline</button>
        </div>

        <RemixTimeline
          v-if="view === 'remix' && currentMod && remixmode === 'timeline'"
          @addTimelineTrack="addTimelineTrack"
          @removeMeta="removeMeta"
          @saveMeta="saveMeta"
          @saveModule="saveModule"
          :outputs="outputs"
          :currentMod="currentMod"
          :portal="portal"
        ></RemixTimeline>
        <RemixValues
          v-if="view === 'remix' && currentMod && remixmode === 'values'"
          @addRange="addRange"
          @addColor="addColor"
          @removeMeta="removeMeta"
          @saveMeta="saveMeta"

          :currentMod="currentMod"
          :portal="portal"
        ></RemixValues>
      </div>

      <div v-show="view === 'code'" class="full" ref="editor">

        <!-- <codemirror
          class="code-editor"

          ref="myCm"

          :options="cmOptions"
          @ready="onCmReady"
          @d-focus="onCmFocus"
          @d-blur="onCmBlur"
          @input="onCmCodeChange">
        </codemirror> -->

      </div>

      <!-- <div v-show="view === 'template'" v-if="currentMod">
        <div style="width: 90%; margin: 0px 5%;">
          <h1>Module Templates</h1>
          <div v-if="!templateModuleItem">
            <strong>Status: Waiting for Submission</strong>
            <button @click="cloneSubmitModule({ Doc: Doc, mod: currentMod })">
              Clone to Template Gallery
            </button>
          </div>
          <div v-if="templateModuleItem">
            <h2>Name: {{ templateModuleItem.name }}</h2>
            <h2>Status: Submitted as Template</h2>
            <br />
            <br />
            <button @click="removeTemplateBox({ mod: templateModuleItem, outputs: templateOutputs, inputs: templateInputs })">
              Remove clone from Template Gallery
            </button>
          </div>
          <h1>Templates</h1>
          <div>
            Search <input v-model="templateModuleQuery" />
            <ul>
              <li :key="tt.id" v-for="tt in templateModules.filter(tt => tt.userID === Doc.userID).filter(tt => tt.name.toLowerCase().indexOf(templateModuleQuery.toLowerCase()) !== -1)">
                {{ tt.name }}
                <button @click="cloneModule({ Doc, mod: tt })">Clone Module</button>
                <button v-if="tt.userID === Doc.userID" @click="removeTemplateBox({ mod: tt, outputs: templateOutputs, inputs: templateInputs })">
                  Remove
                </button>
              </li>
            </ul>
            <ul>
              <li :key="tt.id" v-for="tt in templateModules.filter(tt => tt.userID !== Doc.userID).filter(tt => tt.name.toLowerCase().indexOf(templateModuleQuery.toLowerCase()) !== -1)">
                {{ tt.name }}
                <button @click="cloneModule({ Doc, mod: tt })">Clone Module</button>
              </li>
            </ul>
          </div>
        </div>
      </div> -->

      <div v-show="view === 'inspect'">
        <div style="width: 90%; margin: 0px 5%;" v-if="currentMod && inputs && outputs">

          <h1>Inspector</h1>
          <h2 v-if="currentMod">{{ currentMod.name }}</h2>
          <input type="text" v-if="currentMod" v-model="currentMod.name" @input="saveModuleBox()" style="width: 400px;" />

          <h2>
            I/O Input Sockets
          </h2>
          <ul>
            <li :key="input._id" v-for="(input, ii) in inputs">
              <input type="color" v-model="input.color" @change="saveConnection(input)" style="width: 20px;" />
              <input type="text" v-model="input.color" @change="saveConnection(input)" style="width: 40px;" />
              IO.Input({{input.name === 'my socket' ? `${ii}` : `'${input.name}'`}}, handler);
              <input type="text" v-model="input.name" @input="saveConnection(input)" /> <button class="en-btn en-btn-danger" @click="removeSocket(input)">-</button>
            </li>
            <li><button class="en-btn en-btn-successful" @click="addSocket(currentMod, 'input')">+</button></li>

          </ul>
          <h2>
            I/O Output Sockets
          </h2>
          <ul>
            <li :key="output._id" v-for="(output, ii) in outputs">
              <input type="color" v-model="output.color" @change="saveConnection(output)" style="width: 20px;" />
              <input type="text" v-model="output.color" @change="saveConnection(output)" style="width: 40px;" />
              IO.Output({{output.name === 'my socket' ? `${ii}` : `'${output.name}'`}}, data);
              <input type="text" v-model="output.name" @input="saveConnection(output)" /> <button class="en-btn en-btn-danger" @click="removeSocket(output)">-</button>
            </li>
            <li><button class="en-btn en-btn-successful" @click="addSocket(currentMod, 'output')">+</button></li>
          </ul>

          <h1>Current Module</h1>
          <pre>{{ currentMod }}</pre>
          <h1>Portal</h1>
          <pre>{{ portal }}</pre>

          <h1>
            Module I/O Inspector
          </h1>
          <h2>Active & Connected Inputs</h2>
          <pre>{{ activeInputs }}</pre>
          <h2>Active & Connected Outpus</h2>
          <pre>{{ activeOutputs }}</pre>
        </div>
      </div>

      <!--
      {{ modules }}
      {{ connectors }}
      {{ pairs }}
      -->

      <!-- Lok Lok -->
      <!-- <SVGArea v-if="portal && ready" :Doc="Doc" :connectors="connectors" :modules="modules" :Data="Data" :root="root" :win="portal.win" /> -->
    </div>
  </div>
</template>

<script>
// import { codemirror } from 'vue-codemirror'
import TitleBar from '../AppShared/TitleBar/TitleBar.vue'
// import 'codemirror/mode/javascript/javascript.js'
import * as brace from 'brace'
import 'brace/mode/javascript'
import 'brace/mode/glsl'
import 'brace/theme/monokai'
import 'brace/ext/searchbox'
import RemixTimeline from './RemixTimeline'
import RemixValues from './RemixValues'

// import axios from 'axios'
// import SVGArea from '../../SVGArea/Index.vue'
// import nlp from 'compromise'
// import csv from 'csvtojson'
// import { codemirror } from 'vue-codemirror'

// // require styles
// import 'codemirror/lib/codemirror.css'

// var CodeMirror = require('codemirror').default

// CodeMirror.defineMode('mymode', () => {
//   return {
//     token (stream, state) {
//       if (stream.match('const')) {
//         return 'style1'
//       } else if (stream.match('bbb')) {
//         return 'style2'
//       } else {
//         stream.next()
//         return null
//       }
//     }
//   }
// })

export default {
  components: {
    RemixValues,
    RemixTimeline,
    // codemirror,
    TitleBar// ,
    // SVGArea
  },
  props: {
    uiAPI: {},
    portal: {}
  },
  created () {
    // this.$on('resize', ({ portal }) => {
    //   this.portal = portal
    // })
  },
  data () {
    return {
      view: this.portal.data.view,
      // templateModuleQuery: '',
      Doc: false,
      Data: false,
      // root: false,
      ready: false
    }
  },
  methods: {
    // cloneSubmitModule ({ Doc, mod }) {
    //   this.Data.cloneSubmitModule({ mod, Doc })
    // },
    cloneModule ({ Doc, mod }) {
      this.Data.cloneModule({ Doc, mod, connectors: this.connectors })
      this.Data.saveDoc({ Doc })
    },
    addSocket (currentMod, type) {
      if (type === 'input' || type === 'output') {
        let ss = this.Data.makeSocket({ Doc: this.Doc, idx: this.Data.getIDX(), type, modID: currentMod.id })
        this.Data.addSocketToDoc({ Doc: this.Doc, socket: ss })
        this.Data.saveDoc({ Doc: this.Doc })
      } else {
        console.error('bad types')
      }
    },
    removeSocket (socket) {
      this.Data.removeSocketFromMod({ Doc: this.Doc, socket })
      this.Data.saveDoc({ Doc: this.Doc })
    },
    setDefaultView () {
      let defaultView = this.currentMod.meta.length > 0 ? 'remix' : 'code'
      this.portal.data.view = this.portal.data.view || defaultView
    },
    // toggleTemplatePublic () {
    //   if (this.templateModuleItem) {
    //     this.templateModuleItem.isGallery = !this.templateModuleItem.isGallery
    //     this.templateInputs.forEach((ttc) => {
    //       ttc.isGallery = !ttc.isGallery
    //     })
    //     this.templateOutputs.forEach((ttc) => {
    //       ttc.isGallery = !ttc.isGallery
    //     })
    //     this.saveTemplate()
    //   }
    // },
    // saveTemplate () {
    //   clearTimeout(this.metaDelay)
    //   this.metaDelay = setTimeout(() => {
    //     this.Data.template.modules.update(this.templateModuleItem)
    //     this.templateInputs.forEach((ttc) => {
    //       this.Data.template.connectors.update(ttc)
    //     })
    //     this.templateOutputs.forEach((ttc) => {
    //       this.Data.template.connectors.update(ttc)
    //     })
    //   }, 500)
    // },
    saveModule () {
      // this.Data.ts.modules.animate(this.currentMod)
      clearTimeout(this.modDelay)
      this.modDelay = setTimeout(() => {
        this.Data.saveDoc({ Doc: this.Doc })
        // this.Data.ts.modules.update(this.currentMod)
        this.realodIframe()
      }, 500)
    },
    removeTemplateBox ({ mod, outputs, inputs }) {
      if (window.prompt('type yes to remove this template module and its connnections?') === 'yes') {
        this.Data.removeTemplateBox({ mod, inputs, outputs })
      }
    },
    saveMeta ({ m, mi }) {
      if (m.type === 'range') {
        m.value = Number(m.value)
      }

      window.dispatchEvent(new CustomEvent('iframe-post-message', { detail: { type: 'send-module-meta', module: this.currentMod, meta: m } }))

      // this.Data.ts.modules.animate(this.currentMod)
      clearTimeout(this.metaDelay)
      this.metaDelay = setTimeout(() => {
        this.Data.saveDoc({ Doc: this.Doc })
        // this.Data.ts.modules.update(this.currentMod)
        this.realodIframe()
      }, 1500)
    },
    realodIframe () {
      window.dispatchEvent(new Event(`refresh-iframe`))
    },
    addRange () {
      this.addMeta({
        id: '_r' + (Math.random() * 1024 * 1024 * 1024).toFixed(0),
        label: 'translateX',
        type: 'range',
        min: -100,
        max: 100,
        step: 0.1,
        value: 0
      })
    },
    addColor () {
      this.addMeta({
        id: '_r' + (Math.random() * 1024 * 1024 * 1024).toFixed(0),
        label: 'color',
        type: 'color',
        value: `hsl(${(Math.random() * 360).toFixed(0)}, 50%, 50%)`
      })
    },
    addTimelineTrack () {
      this.addMeta({
        id: '_r' + (Math.random() * 1024 * 1024 * 1024).toFixed(0),
        label: window.prompt(`what's the name of the time track? like opacity, speed, amount and etc`) || 'my-track',
        type: 'timeline-track',
        value: {
          // mode: 'starting',
          // starting: 0,
          // during: 0,
          // leaving: 0,
          // timebox: 0,
          // tick: 0,
          // now: 0,

          start: 0,
          afterStart: 3,
          beforeEnd: 12,
          end: 15,
          totalTime: 15
        }
      })
    },
    addMeta (v) {
      this.currentMod.meta.push(v)
      // this.Data.ts.modules.update(this.currentMod)
      this.realodIframe()
      this.Data.saveDoc({ Doc: this.Doc })
    },
    removeMeta (v) {
      let idx = this.currentMod.meta.findIndex(e => e.id === v.id)
      this.currentMod.meta.splice(idx, 1)
      // this.Data.ts.modules.update(this.currentMod)

      this.realodIframe()
      this.Data.saveDoc({ Doc: this.Doc })
    },
    saveConnection (v) {
      this.Data.ts.connectors.update(v)
      // this.Data.ts.connectors.animate(v)
      clearTimeout(this.connTimeout)
      this.connTimeout = setTimeout(() => {
        // this.Data.ts.connectors.update(v)
      }, 500)
    },
    saveModuleBox () {
      // this.Data.ts.modules.animate(this.currentMod)
      clearTimeout(this.modTimeout)
      this.modTimeout = setTimeout(() => {
        this.realodIframe()
        // this.Data.ts.modules.update(this.currentMod)
        this.Data.saveDoc({ Doc: this.Doc })
      }, 1000)
    },
    init () {
      let Doc = this.uiAPI.Doc
      let Data = this.uiAPI.enAPI
      this.Doc = Doc
      this.Data = Data
      if (Doc) {
        // this.root = Doc.root
        this.ready = true
      }

      // console.log('OMG', )

      // this.$refs.mounter.appendChild(this.uiAPI.execEnv.Sys.$el)

      // return Hive.get({ doc: 'happy' }).then(({ Data, Doc }) => {
      //   this.Doc = Doc
      //   this.Data = Data
      //   this.root = Doc.root
      //   this.ready = true
      // })
    },

    setupBrace () {
      this.$refs.editor.innerHTML = ''
      var editor = this.editor = brace.edit(this.$refs.editor)
      editor.setTheme('ace/theme/monokai')
      editor.setFontSize(14)
      editor.setOptions({
        fontFamily: 'Inconsolata'
      })
      this.editor.$blockScrolling = Infinity

      this.$on('resize', () => {
        this.editor.resize()
      })

      this.editor.on('change', () => {
        if (this.stopWatch) {
          return
        }
        let newCode = this.editor.getValue()
        this.currentMod.src = newCode
        // this.Data.ts.modules.update(this.currentMod)
        this.saveModuleBox()
      })

      // on data down
      // this.Data.ts.modules.onLocal({
      //   handler: ({ results }) => {
      //     this.stopWatch = true
      //     // console.log(results.src)
      //     this.currentMod.src = results.src
      //     this.editor.setValue(this.currentMod.src, 1)
      //     // this.editor.moveCursorTo(0, 0)
      //     // this.editor.focus()
      //     // cm.focus()
      //     this.stopWatch = false
      //   },
      //   method: 'update'
      // })

      var session = editor.getSession()
      session.setUseWrapMode(false)
      session.setUseWorker(false)
      session.setMode('ace/mode/javascript')
      session.setOptions({ tabSize: 2, useSoftTabs: true })

      var commands = [
        {
          name: 'save',
          bindKey: { win: 'Ctrl-S', mac: 'Command-S' },
          exec: () => {
            let newCode = this.editor.getValue()
            this.currentMod.src = newCode
            // this.Data.ts.modules.update(this.currentMod)
          },
          readOnly: true // false if this command should not apply in readOnly mode
        },
        {
          name: 'multicursor',
          bindKey: { win: 'Ctrl-D', mac: 'Command-D' },
          exec: function (editor) {
            editor.selectMore(1)
          },
          // multiSelectAction: 'forEach',
          scrollIntoView: 'cursor',
          readOnly: true // false if this command should not apply in readOnly mode
        }
      ]

      commands.forEach((command) => {
        this.editor.commands.addCommand(command)
      })

      this.editor.setValue(this.currentMod.src, 1)
    }
  },
  watch: {
    currentMod (newVal, oldVal) {
      if (newVal && !oldVal) {
        let defaultView = 'inspect'
        if (this.currentMod && this.currentMod.meta.length > 0) {
          defaultView = 'remix'
        }
        this.view = defaultView
      }
    },
    view () {
      this.portal.data.view = this.view
      if (!this.editor) {
        this.setupBrace()
      }
    }
  },
  computed: {
    root () {
      if (this.Doc) {
        return this.Doc.root
      } else {
        return false
      }
    },
    // view: {
    //   get () {
    //     return this.portal.data.view || 'inspect'
    //   },
    //   set (v) {
    //     this.portal.data.view = v
    //   }
    // },
    // templateInputs () {
    //   return this.templateConnectors.filter(tm => tm.oldID === this.currentMod._id).filter((c) => {
    //     return c.type === 'input'
    //   }).slice().sort((a, b) => {
    //     return a.idx - b.idx
    //   })
    // },
    // templateOutputs () {
    //   return this.templateConnectors.filter(tm => tm.oldID === this.currentMod._id).filter((c) => {
    //     return c.type === 'output'
    //   }).slice().sort((a, b) => {
    //     return a.idx - b.idx
    //   })
    // },
    // templateModuleItem () {
    //   return this.templateModules.find(tm => tm.oldID === this.currentMod._id)
    // },
    // templateConnectors () {
    //   if (this.Doc.root.template && this.Doc.root.template.connectors) {
    //     return this.Doc.root.template.connectors
    //   } else {
    //     return []
    //   }
    // },
    // templateModules () {
    //   if (this.Doc.root.template && this.Doc.root.template.modules) {
    //     return this.Doc.root.template.modules
    //   } else {
    //     return []
    //   }
    // },
    remixmode () {
      if (this.hasTimeTrack) {
        return 'timeline'
      } else {
        return 'values'
      }
    },
    hasTimeTrack () {
      return this.meta.filter(m => m.type === 'timeline-track').length > 0
    },
    hasRange () {
      return this.meta.filter(m => m.type === 'range').length > 0
    },
    meta () {
      if (!this.currentMod) {
        return []
      }
      return this.currentMod.meta
    },
    // codemirror () {
    //   return this.$refs.myCm.codemirror
    // },
    currentMod () {
      return this.modules.find(m => m._id === this.portal.data.boxID)
    },
    inputs () {
      return this.connectors.filter((c) => {
        return c.type === 'input'
      }).slice().sort((a, b) => {
        return a.idx - b.idx
      })
    },
    outputs () {
      return this.connectors.filter((c) => {
        return c.type === 'output'
      }).slice().sort((a, b) => {
        return a.idx - b.idx
      })
    },
    activeInputs () {
      return this.connectors.filter((c) => {
        return c.socket.to && c.type === 'input'
      }).slice().sort((a, b) => {
        return a.idx - b.idx
      })
    },
    activeOutputs () {
      return this.connectors.filter((c) => {
        return c.socket.to && c.type === 'output'
      }).slice().sort((a, b) => {
        return a.idx - b.idx
      })
    },
    connectors () {
      if (this.root) {
        // let modIDs = this.root.modules.map(m => m.id)
        return this.root.connectors.filter(c => {
          return c.mod.from === this.portal.data.boxUUID
        }).slice().sort((a, b) => {
          return a.idx - b.idx
        })
        // .filter(c => {
        //   return modIDs.includes(c.mod.from) || modIDs.includes(c.mod.to)
        // })
      } else {
        return []
      }
    },
    modules () {
      if (this.root) {
        return this.root.modules
      } else {
        return []
      }
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style scoped>
@import url(../../Compos/jot.css);
/* @import url(../../CodeMirror/mirror.css); */

.quotes-app{
  /* background: linear-gradient(90deg, #eef3ff 0%, #8aa3d4 100%); */
  box-sizing: border-box;
  border-radius: 10px 10px 10px 10px;
  color: black;
  background-image: radial-gradient( circle farthest-corner at 100% 100%, rgb(193, 234, 255) 0%, rgb(255, 255, 255) 90.1% );
/* background-image: radial-gradient( circle farthest-corner at 10% 20%,  rgba(149,219,254,1) 0%, rgba(7,134,197,1) 90.1% ); */
}

.content-div{
  height: calc(100% - 30px);
  overflow: auto;
  /* -webkit-overflow-scrolling: touch;
  overflow: auto; */
}

.quotes-list{
  margin: 20px;
}

.code-editor{
  height: 100%;
  overflow: scroll;
}
</style>
