import Vue from 'vue'

const Components = {
  enos: require('@/enos/enos.vue').default
}

Object.keys(Components).forEach(name => {
  Vue.component(name, Components[name])
})

export default Components
