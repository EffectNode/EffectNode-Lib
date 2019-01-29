import Vue from 'vue'

const Components = {
  EnosBanner: require('./enos/Banner.vue').default
}

Object.keys(Components).forEach(name => {
  Vue.component(name, Components[name])
})

export default Components
