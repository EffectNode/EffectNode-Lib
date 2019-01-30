<template>
<div ref="myDIV" class="myDIV"></div>
</template>

<script>
import * as Builder from '../APIs/builder.js'
export default {
  props: {
    doc: {}
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
  watch: {},
  methods: {
    renderHTML () {
      Builder.fromDocToDiv({ Doc: this.doc, Div: this.$refs['myDIV'] })
    }
  }
}
</script>

<style scoped>
.myDIV{
  margin: 0px;
  padding: 0px;
  width: 100%;
  height: 100%;
}
</style>
