<template>
  <div class="hello">
    <enos v-if="myApps" :apps="myApps"></enos>
  </div>
</template>

<script>
import ENOSCompos from '../lib/index.js'
export default {
  components: {
    ...ENOSCompos
  },
  data () {
    return {
      myApps: false
    }
  },
  mounted () {
    this.myApps = [
      {
        windowTitle: 'Sample',
        compoName: 'SampleApp',
        App: require('./Apps/sample-app.vue').default
      }
    ]
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
