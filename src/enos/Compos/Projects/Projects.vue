<template>
  <div>
    <h1>Local Storage Projects</h1>
    <span class="linker" @click="addProject">Add Project</span>
    <ul>
      <li :key="project.projectID" v-for="project in projects">
        <input type="text" v-model="project.name" @input="saveProjects()" />

        <span class="linker" @click="$emit('load', project)">Load </span>
        <span class="linker" @click="removeProject(project)" v-if="projects.length > 1"> Remove</span>

      </li>
    </ul>
  </div>
</template>

<script>
let getID = () => '_' + Math.random().toString(36).substr(2, 9)

export default {
  props: {
    ns: {}
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
    addProject () {
      this.projects.push({
        projectID: getID(),
        name: 'my new project'
      })
      this.saveProjects()
    },
    removeProject (project) {
      this.projects.splice(this.projects.findIndex(pj => pj.projectID === project.projectID), 1)
      this.$emit('remove-project', project)
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
