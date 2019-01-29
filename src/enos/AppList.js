export const AppList = [
  {
    windowTitle: 'Demo',
    compoName: 'SysApp',
    App: require('@/enos/Apps/SysApp/SysApp.vue').default
  }
]

export const Apps = () => AppList.reduce((c, ii) => {
  c[ii.compoName] = ii.App
  return c
}, {})

export const TypeFilter = (type) => {
  return (AppList.find(tc => tc.compoName === type) || {}).compoName
}

export const StartMenu = () => {
  return AppList.slice()
}
