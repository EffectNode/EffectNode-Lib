# Your MicroApps in 3D Space

![EffectNode OS][demo-1]

[demo-1]: https://raw.githubusercontent.com/EffectNode/EffectNode-Lib/master/public/demo/enos.png
# Demo

[Live Demo](https://codesandbox.io/s/r7oy8r2nmn)


#Demo Code

```vue

<template>
  <div class="hello"><enos v-if="myApps" :apps="myApps"></enos></div>
</template>

<script>
import ENOSCompos from "enos";
import "enos/dist/enos.css";

export default {
  components: {
    ...ENOSCompos
  },
  data() {
    return {
      myApps: false
    };
  },
  mounted() {
    this.myApps = [
      {
        windowTitle: "Sample",
        compoName: "samsam",
        App: require("./apps/samsam.vue")
      }
    ];
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello {
  height: 100%;
}
</style>


```

```vue

<template>
  <div class="full window-app">
    <titlebar @click="$emit('activated');" :portal="portal" :uiAPI="uiAPI">
      Sample App
    </titlebar>
    <div class="content-div" @click="$emit('activated');">{{ rr }} Content</div>
  </div>
</template>

<script>
import Compos from "enos";

export default {
  name: "sampleapp",
  props: {
    uiAPI: {},
    portal: {}
  },
  components: {
    ...Compos
    // Dimension
  },
  data() {
    return {
      rr: Math.random()
    };
  },
  mounted() {},
  methods: {}
};
</script>

<style scoped>
.window-app {
  background: white;
  /* background: linear-gradient(90deg, #4b6cb7 0%, #182848 100%); */
  box-sizing: border-box;
  border-radius: 10px 10px 10px 10px;
  color: black;

  /* background-image: radial-gradient( circle farthest-corner at 10% 20%,  rgba(149,219,254,1) 0%, rgba(7,134,197,1) 90.1% ); */
}

.content-div {
  height: calc(100% - 30px);
  -webkit-overflow-scrolling: touch;
  overflow: auto;
  position: relative;
}
</style>

```