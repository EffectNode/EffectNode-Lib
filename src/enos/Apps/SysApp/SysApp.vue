<template>
  <div class="full window-app">
    <TitleBar :portal="portal" @click="$emit('activated')" :uiAPI="uiAPI">
      App Template
    </TitleBar>
    <div class="content-div" @click="$emit('activated')">
    </div>
  </div>
</template>

<script>
import TitleBar from '../AppShared/TitleBar/TitleBar'

export default {
  props: {
    uiAPI: {},
    portal: {}
  },
  components: {
    TitleBar
    // Dimension
  },
  data () {
    return {
    }
  },
  mounted () {
  },
  methods: {

  }
}
</script>

<style scoped>
@import url(../../Compos/jot.css);

.window-app{
  background: white;
  /* background: linear-gradient(90deg, #4b6cb7 0%, #182848 100%); */
  box-sizing: border-box;
  border-radius: 10px 10px 10px 10px;
  color: white;

/* background-image: radial-gradient( circle farthest-corner at 10% 20%,  rgba(149,219,254,1) 0%, rgba(7,134,197,1) 90.1% ); */
}

.content-div{
  height: calc(100% - 30px);
  -webkit-overflow-scrolling: touch;
  overflow: auto;
  position: relative;
}

.quotes-list{
  margin: 20px;
}

.iframe{
  width: 100%;
  height: calc(100%);
}
</style>
