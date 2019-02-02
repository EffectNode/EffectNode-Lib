// import Vue from 'vue'
// import '@/enos/enos.vue'

const Components = {
  titlebar: require('@/enos/Apps/AppShared/TitleBar/TitleBar.vue').default,

  PreviewDiv: require('@/enos/Compos/Animator/Animator.vue').default,
  Animator: require('@/enos/Compos/Animator/Animator.vue').default,
  PreviewFrame: require('@/enos/Compos/PreviewFrame/PreviewFrame.vue').default,

  enos: require('@/enos/enos.vue').default
}

// Object.keys(Components).forEach(name => {
//   Vue.component(name, Components[name])
// })

export default Components
