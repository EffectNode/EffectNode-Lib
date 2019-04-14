import Vue from 'vue'
import App from '../App.vue'
import store from '../store'

Vue.config.productionTip = false

var main = () => {
  let baseCSS = `
      position: fixed;
      top: 0px;
      left: 0px;
      width: 100%;
      z-index: 10;
      height: 100%;
      background-color: #f1f1f1;
  `

  document.querySelector('html').style.overflow = 'hidden'

  let base = document.createElement('div')
  base.style.cssText = baseCSS
  document.body.appendChild(base)

  // let installerDiv = document.createElement('div')
  // base.appendChild(installerDiv)

  // let sizer = () => {
  //   installerDiv.style.height = (window.innerHeight) + 'px'
  // }
  // sizer()
  // window.addEventListener('resize', sizer, false)

  new Vue({
    store,
    render: h => h(App)
  }).$mount(base)
}

main()
