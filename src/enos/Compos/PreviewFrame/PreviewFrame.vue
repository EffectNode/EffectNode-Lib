<template>
<iframe class="iframer" v-if="enabled" :src="link" frameborder="0"></iframe>
</template>

<script>
// import * as enAPI from '../APIs/effectnode.js'
import * as Builder from '../APIs/builder.js'
export default {
  props: {
    Doc: {}
  },
  data () {
    return {
      html: '',
      link: false
    }
  },
  mounted () {
    return this.renderHTML()
  },
  methods: {
    async renderHTML () {
      let Doc = this.Doc
      let boxes = Doc.root.boxes
      let connections = Doc.root.connections
      Doc.root.modules = boxes.filter(b => b.name.toLowerCase().indexOf('video encoder') === -1)
      Doc.root.connectors = connections

      let html = await Builder.fromDocToHTMLProd({ Doc })
      this.html = html
      this.link = Builder.makeHTMLLink({ HTML: html })
    }
  }
}
</script>

<style scoped>
.iframer{
  margin: 0px;
  padding: 0px;
  width: 100%;
  height: 100%;
}
</style>
