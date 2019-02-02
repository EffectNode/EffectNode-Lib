<template>
  <div>
    <h2>
      Clone From Template
    </h2>
    <ul>
      <li><span class="linker" @click="importProject"> Import Project</span></li>
    </ul>
    <ul>
      <li :key="start.name" v-for="start in starters">
         <span class="linker" @click="starterProject({ Doc: start.data })">{{ start.name }}</span>
      </li>
    </ul>

    <h1>Projects in window.localStorage</h1>
    <ul>
      <li :key="project.projectID" v-for="project in projects">
        <input type="text" v-model="project.name" @input="saveProjects()" />

        <span class="linker" @click="$emit('load', project)"> Enter </span>
        <span class="linker" @click="removeProject(project)"> Remove</span>
        <span class="linker" @click="exportProject(project)"> Export </span>
      </li>
    </ul>
  </div>
</template>

<script>
import * as EffectNodeAPI from '@/enos/Compos/APIs/effectnode.js'

let getID = () => '_' + Math.random().toString(36).substr(2, 9)

export default {
  props: {
    ns: {
      default: 'ENPJ'
    }
  },
  data () {
    return {
      starters: [],
      projects: []
    }
  },
  mounted () {
    this.starters = [
      {
        name: 'NOVA WebGL',
        data: require('./starters/nova.json')
      },
      {
        name: 'Basic DOM',
        data: require('../APIs/defaults/dom.json')
      },
      {
        name: 'Iris WebGL',
        data: require('./starters/iris.json')
      },
      {
        name: 'Star Ball WebGL',
        data: require('./starters/star-ball.json')
      },
      {
        name: 'Particle Sea WebGL',
        data: require('./starters/particle-sea.json')
      }
    ]
    this.hydrateProjects()
  },
  methods: {
    starterProject ({ Doc }) {
      let sess = getID()
      EffectNodeAPI.saveDB({ sess, data: Doc.root })
      this.projects.push({
        projectID: sess,
        name: window.prompt('new name of the imported project?') || 'imported project'
      })
      this.saveProjects()
    },
    importProject () {
      let input = document.createElement('input')
      input.type = 'file'
      input.onchange = (evt) => {
        let files = evt.target.files
        if (files[0]) {
          let sess = getID()
          let reader = new FileReader()
          reader.onload = () => {
            try {
              var data = JSON.parse(reader.result)
              EffectNodeAPI.saveDB({ sess, data: data.root })
              this.projects.push({
                projectID: sess,
                name: files[0].name// window.prompt('new name of the imported project?') || 'imported project'
              })
              this.saveProjects()
            } catch (e) {

            }
          }
          reader.readAsText(files[0])
        }
      }
      input.click()
    },
    exportProject (project) {
      let db = EffectNodeAPI.loadDB({ sess: project.projectID })
      console.log(project, db)
      if (db) {
        let link = URL.createObjectURL(new Blob([JSON.stringify({ root: db }, null, '  ')], { type: 'application/json' }))
        let a = document.createElement('a')
        a.href = link
        a.download = (window.prompt('save as?') || 'effect node') + '.json'
        a.click()
      }
    },
    addProject () {
      this.projects.push({
        projectID: getID(),
        name: 'my new project'
      })
      this.saveProjects()
    },
    removeProject (project) {
      if (window.confirm('remove project?' + project.name)) {
        this.projects.splice(this.projects.findIndex(pj => pj.projectID === project.projectID), 1)
        this.$emit('remove-project', project)
        this.saveProjects()
      }
    },
    saveProjects () {
      let nsID = window.localStorage.getItem(this.ns)
      window.localStorage.setItem(`${nsID}-projects`, JSON.stringify(this.projects))
    },
    hydrateProjects () {
      let nsID = window.localStorage.getItem(this.ns)
      let projects = window.localStorage.getItem(`${nsID}-projects`)
      if (!projects) {
        window.localStorage.setItem(`${nsID}-projects`, JSON.stringify([
          {
            projectID: getID(),
            name: 'my first project'
          }
        ]))
      }
      this.projects = JSON.parse(window.localStorage.getItem(`${nsID}-projects`))
    }
  }
}
</script>

<style scoped>
.linker{
  text-decoration: underline;
}
</style>
