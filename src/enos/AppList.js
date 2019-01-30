// import Vue from 'vue'
export var AppList = [
  {
    windowTitle: 'Demo',
    compoName: 'SysApp',
    App: require('@/enos/Apps/SysApp/SysApp.vue').default
  }
]

var accessor = {
  get _AL () {
    return AppList.reduce((c, ii) => {
      c[ii.compoName] = ii.App
      return c
    }, {})
  }
}

export const setAppList = (apps) => {
  if (apps && apps.length > 0) {
    AppList = apps
  }
}

export const Apps = () => accessor._AL

export const TypeFilter = (type) => {
  return (AppList.find(tc => tc.compoName === type) || {}).compoName
}

export const StartMenu = () => {
  return AppList.slice().filter(e => !e.hidden)
}
