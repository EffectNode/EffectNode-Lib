<template>
  <div class="hello">
    <enos v-if="moreApps" :more-apps="moreApps"></enos>
  </div>
</template>

<script>
import Compos from '../lib/index.js'
export default {
  components: {
    ...Compos
  },
  data () {
    return {
      moreApps: false
    }
  },
  mounted () {
    this.moreApps = [
      {
        windowTitle: 'Sample',
        compoName: 'SampleApp',
        App: require('./Apps/SampleApp.vue').default
      }
    ]
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
