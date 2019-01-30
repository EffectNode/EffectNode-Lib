<template>
  <div class="hello">
    <enos v-if="myApps" :effectnode="true" :apps="myApps"></enos>
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
        compoName: 'samsam',
        App: require('./Apps/samsam.vue').default
      }
    ]
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
