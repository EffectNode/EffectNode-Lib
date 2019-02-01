<template>
  <div>
    <h1>Projects in window.localStorage</h1>
    <span class="linker" @click="addProject">Add Project</span>
    <span class="linker" @click="loadProject"> Import Project</span>

    <ul>
      <li :key="project.projectID" v-for="project in projects">
        <input type="text" v-model="project.name" @input="saveProjects()" />

        <span class="linker" @click="$emit('load', project)"> Enter </span>
        <span class="linker" @click="removeProject(project)" v-if="projects.length > 1"> Remove</span>
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
      projects: []
    }
  },
  mounted () {
    this.hydrateProjects()
  },
  methods: {
    loadProject () {
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
              EffectNodeAPI.saveDB({ sess, data })
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
    exportProject ({ projectID }) {
      let db = EffectNodeAPI.loadDB({ sess: projectID })
      if (db) {
        let link = URL.createObjectURL(new Blob([JSON.stringify(db, null, '  ')], { type: 'application/json' }))
        let a = document.createElement('a')
        a.href = link
        a.download = 'project.json'
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
      if (window.confirm('delte?')) {
        this.projects.splice(this.projects.findIndex(pj => pj.projectID === project.projectID), 1)
        this.$emit('remove-project', project)
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
