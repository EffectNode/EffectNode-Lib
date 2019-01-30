import Vue from 'vue/dist/vue.common'
// import Babel from '@babel/standalone'
// // import axios from 'axios'
// export function transform (src) {
//   return new Promise((resolve, reject) => {
//     try {
//       let code = Babel.transform(src, {
//         presets: ['es2015', 'stage-3', 'minify']
//       }).code
//       resolve(code)
//     } catch (ex) {
//       console.log(ex)
//       reject(new Error(ex))
//     }
//   })
// }

/* eslint-disable */
let loadNewCache = async () => await {
  // 'https://cdn.jsdelivr.net/npm/whammy@0.0.1/whammy.min.js': await import('raw-loader!../../../../public/js/lib/encoder/whammy.js'),
  // 'https://threejs.org/build/three.min.js': await import('raw-loader!../../../../public/js/lib/ThreeJS/three.min.js'),
  // 'https://threejs.org/examples/js/controls/OrbitControls.js': await import('raw-loader!../../../../public/js/lib/ThreeJS/examples/js/controls/OrbitControls.js'),
  // 'https://threejs.org/examples/js/postprocessing/EffectComposer.js': await import('raw-loader!../../../../public/js/lib/ThreeJS/examples/js/postprocessing/EffectComposer.js'),
  // 'https://threejs.org/examples/js/postprocessing/RenderPass.js': await import('raw-loader!../../../../public/js/lib/ThreeJS/examples/js/postprocessing/RenderPass.js'),
  // 'https://threejs.org/examples/js/postprocessing/ShaderPass.js': await import('raw-loader!../../../../public/js/lib/ThreeJS/examples/js/postprocessing/ShaderPass.js'),
  // 'https://threejs.org/examples/js/shaders/CopyShader.js': await import('raw-loader!../../../../public/js/lib/ThreeJS/examples/js/shaders/CopyShader.js'),
  // 'https://threejs.org/examples/js/shaders/LuminosityHighPassShader.js': await import('raw-loader!../../../../public/js/lib/ThreeJS/examples/js/shaders/LuminosityHighPassShader.js'),
  // 'https://threejs.org/examples/js/postprocessing/UnrealBloomPass.js': await import('raw-loader!../../../../public/js/lib/ThreeJS/examples/js/postprocessing/UnrealBloomPass.js')
}

/* eslint-enable */
let jsCahce = {}
loadNewCache().then((newCahce) => {
  jsCahce = newCahce
})
function prepExec () {
  // var getID = (prefix = '') => {
  //   return '_exec_' + prefix + '_' + (1024 * 1024 * 1024 * Math.random()).toFixed(0)
  // }

  function getScript (source) {
    return new Promise((resolve, reject) => {
      window.EFFECT_NODE_HAS_URL = window.EFFECT_NODE_HAS_URL || []
      if (window.EFFECT_NODE_HAS_URL.indexOf(source) !== -1) {
        return resolve()
      }
      var script = document.createElement('script')
      var prior = document.getElementsByTagName('script')[0]
      script.onload = () => { resolve() }
      script.src = source
      prior.parentNode.insertBefore(script, prior)
    })
  }

  function loadAllJS (allJS) {
    allJS = allJS || [
      'https://cdnjs.cloudflare.com/ajax/libs/rasterizehtml/1.3.0/rasterizeHTML.allinone.js',

      'https://threejs.org/build/three.min.js',
      'https://threejs.org/examples/js/controls/OrbitControls.js',

      'https://threejs.org/examples/js/postprocessing/EffectComposer.js',
      'https://threejs.org/examples/js/postprocessing/RenderPass.js',
      'https://threejs.org/examples/js/postprocessing/ShaderPass.js',
      'https://threejs.org/examples/js/shaders/CopyShader.js',
      'https://threejs.org/examples/js/shaders/LuminosityHighPassShader.js',
      'https://threejs.org/examples/js/postprocessing/UnrealBloomPass.js'
    ]
    function loopLoad () {
      let js = allJS.shift()
      return getScript(js)
        .then(() => {
          if (allJS.length > 0) {
            return loopLoad()
          } else {
            return Promise.resolve()
          }
        })
    }
    return loopLoad()
  }
  let ExecEnv = {
    init: (uiAPI) => {
      return new Promise((resolve) => {
        let Sys = ExecEnv.makeLgocialStructure(uiAPI)
        uiAPI.execEnv = { ExecEnv, Sys }
        resolve(uiAPI)
      })
    },
    makeLgocialStructure: (uiAPI) => {
      let Signal = new Vue({})
      let MakeResources = () => {
        let api = {
          kvStore: {},
          notifiers: []
        }

        api.set = (key, value) => {
          api.kvStore[key] = value
        }
        api.get = (key) => {
          return api.kvStore[key]
        }
        let js = api.js = {}
        js.need = (key, jsArr) => {
          loadAllJS(jsArr)
            .then(() => {
              api.set(key, true)
            })
        }
        js.ensure = api.ensure = (keys) => {
          console.log(keys)
          return Promise.all(
            keys.map((key) => {
              return new Promise((resolve) => {
                if (api.get(key)) {
                  resolve(api.get(key))
                } else {
                  let interval = setInterval(() => {
                    if (api.get(key)) {
                      console.log('ensure, got', key)
                      clearTimeout(interval)
                      resolve(api.get(key))
                    }
                  }, 1000 / 20)
                }
              })
            })
          )
        }

        return api
      }
      let Resources = MakeResources()

      let modRunner = {
        props: {
          sockets: {},
          mod: {}
        },
        data () {
          return {
            inputs: this.sockets.filter(s => s.type === 'input' && s.modID === this.mod.id).slice().sort((a, b) => {
              return a.idx - b.idx
            }),
            outputs: this.sockets.filter(s => s.type === 'output' && s.modID === this.mod.id).slice().sort((a, b) => {
              return a.idx - b.idx
            }),
            cleanHandler () {},
            Signal,
            onInputArrive: {},
            function: {},
            instance: {}
          }
        },
        template: `<span>{{ mod.src }}</span>`,
        async mounted () {
          try {
            await this.instantiate()
            this.$emit('made', this.instance)
          } catch (e) {
            console.log(e)
          }
        },
        watch: {
          code () {
            clearTimeout(this.codeTimeout)
            this.codeTimeout = setTimeout(() => {
              this.instantiate()
            }, 500)
          },
          sockets: {
            deep: true,
            handler () {
              clearTimeout(this.sTimeout)
              this.sTimeout = setTimeout(() => {
                this.instantiate()
              }, 500)
            }
          }
        },
        beforeDestroy () {
          // this.sockets.forEach(i => {
          //   i.mod.to = false
          //   i.socket.to = false
          // })
          this.cleanInstance()
          this.$emit('clean', this.instance)
        },
        computed: {
          code () {
            return this.mod.src
          },
          metaJSON () {
            return JSON.stringify(this.mod.meta)
          }
        },
        methods: {
          cleanInstance () {
            if (this.instance) {
              this.sockets.filter(s => s.type === 'input' && s.modID === this.mod.id).forEach((input) => {
                Signal.$off(input.id)
              })
              this.sockets.filter(s => s.type === 'output' && s.modID === this.mod.id).forEach((output) => {
                Signal.$off(output.id)
              })
              this.$emit('refresh-sockets')
              try {
                this.instance.onClean && this.instance.onClean()
              } catch (e) {
                console.log(e)
              }
            }
          },
          readyInstance () {
            if (this.instance) {
              try {
                this.instance.onReady && this.instance.onReady()
              } catch (e) {
                console.log(e)
              }
            }
          },
          Input (mixed, onArrive, once = () => {}) {
            if (typeof mixed === 'number') {
              this.$on('input' + mixed, (v) => {
                onArrive(v)
                this.$emit('input-once' + mixed, v)
              })
              this.$once('input-once' + mixed, once)
            } else if (typeof mixed === 'string') {
              mixed = this.inputs.findIndex(so => so.name === mixed)
              this.$on('input' + mixed, (v) => {
                onArrive(v)
                this.$emit('input-once' + mixed, v)
              })
              this.$once('input-once' + mixed, once)
            } else if (typeof mixed === 'object' && mixed instanceof Array) {
              mixed.forEach(ee => {
                if (typeof ee === 'string') {
                  ee = this.inputs.findIndex(so => so.name === ee)
                }
                this.$on('input' + ee, (v) => {
                  onArrive(v)
                  this.$emit('input-once' + ee, v)
                })
                this.$once('input-once' + ee, once)
              })
            }
          },
          Output (mixed, valueToBeSent) {
            if (typeof mixed === 'number') {
              this.$emit('output' + mixed, valueToBeSent)
            } else if (typeof mixed === 'string') {
              mixed = this.outputs.findIndex(so => so.name === mixed)
              this.$emit('output' + mixed, valueToBeSent)
            } else if (typeof mixed === 'object' && mixed instanceof Array) {
              mixed.forEach(ee => {
                if (typeof ee === 'string') {
                  ee = this.outputs.findIndex(so => so.name === ee)
                }
                this.$emit('output' + ee, valueToBeSent)
              })
            }
          },
          OutputAll (valueToBeSent) {
            this.sockets.filter(s => s.type === 'output' && s.modID === this.mod.id).slice().sort((a, b) => {
              return a.idx - b.idx
            }).forEach((e, ei) => {
              this.$emit('output' + ei, valueToBeSent)
            })
          },
          instantiate () {
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                /* eslint-disable */
                try {
                  this.cleanInstance()
                  this.function = new Function('env', this.mod.src)
                  this.instance = new this.function({
                    loadAllJS,
                    Resources,
                    Signal,
                    getMeta: (key) => {
                      return ((this.mod.meta.find(e => e.label === key) || { value: { var: 0 } }).value)
                    },
                    box: this.mod,
                    sockets: this.sockets,
                    IO: this,
                    Input: this.Input,
                    Output: this.Output,
                    OutputAll: this.OutputAll,
                    inputs: this.inputs.map((e, ei) => {
                      Signal.$on(e.id, (v) => {
                        this.$emit('input' + ei, v)
                      })
                      return e
                    }),
                    outputs: this.outputs.map((e, ei) => {
                      this.$on('output' + ei, (v) => {
                        Signal.$emit(e.id, v)
                      })
                      return e
                    })
                  })
                  // console.log('INSTANCE', this.instance)
                  this.readyInstance()
                  resolve()
                } catch (e) {
                  console.log('======compiling======')
                  console.trace(e)
                  console.error(this.mod.src)
                  reject(e)
                }
                /* eslint-enable */
              })
            })
          }
        }
      }
      modRunner = Vue.component('modrunner', modRunner)

      return new Vue({
        components: {
          'modrunner': modRunner
        },
        template: `
          <div ref="systemDOM" style="width: 100%; height: 100%; position: relative;">
            <div v-if="ready" style="display: none; width: 100%; height: 100%; position: absolute; top: 0px; left: 0px;" >
              <pre>{{ modules }}</pre>
              <span style="display: none;">{{ Doc }}</span>
              <modrunner v-if="canRunSystem" :signal="Signal" @refresh-sockets="refreshSockets" :key="mod._id + mod.id" :sockets="sockets" :mod="mod" v-for="mod in modules"></modrunner>
            </div>
            <div class="rootDOM" style="width: 100%; height: 100%; position: absolute; top: 0px; left: 0px;" ref="rootDOM"></div>
          </div>
        `,
        el: document.createElement('div'),
        mounted () {
          Resources.set('rootDOM', this.$refs.rootDOM)
          this.refreshSockets()
          this.ready = true
          this.$forceUpdate()
        },
        data () {
          return {
            Doc: false,
            canRunSystem: true,
            ready: false,
            Signal,
            h: {}
          }
        },
        watch: {
          modules: {
            deep: true,
            handler () {
              this.refreshSockets()
            }
          }
        },
        methods: {
          reset () {
            Resources = MakeResources()
            Resources.set('rootDOM', this.$refs.rootDOM)
            this.refreshSockets()
            this.canRunSystem = false
            setTimeout(() => {
              this.canRunSystem = true
            }, 100)
          },
          refreshSockets () {
            this.sockets.filter(s => s.socket.to && s.type === 'output').forEach((soc) => {
              if (this.h[soc.socket.from]) {
                Signal.$off(soc.socket.from, this.h[soc.socket.from])
              }
              this.h[soc.socket.from] = (v) => {
                // console.log(soc.socket.from, soc.socket.to)
                Signal.$emit(soc.socket.to, v)
              }
              Signal.$on(soc.socket.from, this.h[soc.socket.from])
            })
          }
        },
        computed: {
          modules () {
            return uiAPI.Doc.root.modules
          },
          sockets () {
            return uiAPI.Doc.root.connectors
          },
          outputSignal () {
            return uiAPI.Doc.root.connectors.filter((c) => {
              return c.socket.to && c.socket.from && c.type === 'output'
            })
          }
        }
      })
    }
  }
  window.ExecEnv = ExecEnv
  return {
    ExecEnv
  }
}

export const fromDocToDiv = ({ Doc, Div }) => {
  let { ExecEnv } = prepExec()
  let uiAPI = {
    Doc
  }
  console.log(Doc)
  ExecEnv.init(uiAPI).then((uiAPI) => {
    Div.appendChild(uiAPI.execEnv.Sys.$el)
  })
}

export const fromDocToHTMLProd = async ({ Doc }) => {
  // let resp = await Promise.all([

  //   // axios.get('/public/js/app/ExecEnv.js'),
  //   // axios.get('/public/js/app/vue@2.5.21.min.js'),
  //   // axios.get('/public/js/app/template.html')
  // ])
  /* eslint-disable */
  let resp = []
  resp[0] = require('raw-loader!../../../../public/js/app/ExecEnv.js.txt')
  resp[1] = require('raw-loader!../../../../public/js/app/vue@2.5.21.min.js.txt')
  resp[2] = require('raw-loader!../../../../public/js/app/template.html')
  /*
  'https://threejs.org/examples/js/controls/OrbitControls.js',

  'https://threejs.org/examples/js/postprocessing/EffectComposer.js',
  'https://threejs.org/examples/js/postprocessing/RenderPass.js',
  'https://threejs.org/examples/js/postprocessing/ShaderPass.js',
  'https://threejs.org/examples/js/shaders/CopyShader.js',
  'https://threejs.org/examples/js/shaders/LuminosityHighPassShader.js',
  'https://threejs.org/examples/js/postprocessing/UnrealBloomPass.js'
  */
  /* eslint-enable */

  let globalCache = `
    window.EFFECT_NODE_HAS_URL = ${JSON.stringify(Object.keys(jsCahce))};
  `

  Object.keys(jsCahce).forEach((url) => {
    globalCache += `
      ${jsCahce[url]}
    `
  })

  Doc = JSON.stringify(Doc)
  // console.log(resp[0])
  let execResp = resp[0] + ';'
  let vueResp = resp[1]
  let htmlResp = resp[2]
  let r = (Math.random() * 1024 * 1024 * 1024).toFixed(0)
  let injectClassName = `_inject_${r}`
  let style = `
    html, body, .${injectClassName}, .full {
      width: 100%;
      height: 100%;
      margin: 0px;
      padding: 0px;
    }
  `
  let runnerCode = `
    (function () {
      let injectClassName = '.${injectClassName}';
      let Doc = ${Doc};
      // console.log(window.ExecEnv)
      let uiAPI = {
        hive: {
          Doc
        }
      }
      window.ExecEnv.init(uiAPI).then((uiAPI) => {
        let dom = document.querySelector(injectClassName)
        dom.appendChild(uiAPI.execEnv.Sys.$el)
        window.addEventListener('resize', () => {
          window.dispatchEvent(new CustomEvent('resize-dev', { detail: { width: window.innerWidth, height: window.innerHeight } }))
        })
        window.addEventListener('message', (evt) => {
          if (evt.data && evt.data.type === 'resize') {
            window.dispatchEvent(new CustomEvent('resize-dev', { detail: { width: evt.data.width, height: evt.data.height } }))
          }

          if (evt.data && evt.data.type === 'send-module-meta') {
            let module = evt.data.module
            let meta = evt.data.meta

            let oldMod = Doc.root.modules.find(m => m.id === module.id)
            if (oldMod) {
              let oldIDX = oldMod.meta.findIndex(m => m.id === meta.id)
              if (oldMod.meta[oldIDX]) {
                oldMod.meta[oldIDX] = meta
              }
            }
          }
        }, false)
      })
    }());
  `

  htmlResp = htmlResp.replace('<!--=*+BODY_HTML+*=-->', `<div class="${injectClassName}"></div>`)
  htmlResp = htmlResp.replace('/*STYLE_HEAD*/', style)
  htmlResp = htmlResp.replace('/*VENDORS_HEAD*/', ``)
  htmlResp = htmlResp.replace('/*SCRIPT_HEAD*/', `window.global = window;\n${globalCache}\n${vueResp}\n${execResp}`)
  htmlResp = htmlResp.replace('/*SCRIPT_BODY*/', `${runnerCode}`)

  // console.log(execResp, vueResp, htmlResp)

  return htmlResp
}

export const makeHTMLLink = ({ HTML }) => {
  let blob = new Blob([HTML], { type: 'text/html' })
  let link = URL.createObjectURL(blob)
  return link
}

export const makeHTMLBase64 = ({ HTML }) => {
  let dataURL = `data:text/html,utf8,${encodeURIComponent(HTML)}`
  return dataURL
}
