import * as AppList from '@/enos/AppList.js'

export const removeDB = ({ sess }) => {
  window.localStorage.removeItem(sess + 'portals-meta-enos')
  window.localStorage.removeItem(sess + 'portals-enos')
}

// import * as API from './API'
export function getID () {
  return '_' + (Math.random() * 100000000).toFixed(0)
}

var temp = {
  x: 30,
  y: 30
}

export function square (api, currentWin) {
  let avg = 360
  currentWin.win.width = avg
  currentWin.win.height = avg + 30
  currentWin.win.minimised = true
  setTimeout(() => {
    currentWin.win.minimised = false
  }, 100)
}

export function organise (api) {
  if (window.innerWidth <= 769) {
    let w = window.innerWidth - 10
    let h = 333
    api.portals.forEach((ip, idx) => {
      ip.win.x = 5
      ip.win.y = 5
      ip.win.width = w
      ip.win.height = h
      if (idx === 0) {
        ip.win.minimised = true
        setTimeout(() => {
          ip.win.minimised = false
        }, 100 * (idx + 1))
      } else {
        ip.win.minimised = true
      }
    })
  } else {
    let w = window.innerWidth - 40
    let h = window.innerHeight - 70 - 30
    api.portals.forEach((ip, idx) => {
      ip.win.x = 30 * (idx + 1)
      ip.win.y = 30 * (idx + 1)
      ip.win.width = w > 650 ? 650 : w
      ip.win.height = h > 500 ? 500 : h
      setTimeout(() => {
        ip.win.minimised = true
      }, 100)
    })

    let connectorApp = api.portals.find(a => a.app === 'enedit')
    if (connectorApp) {
      connectorApp.win.x = 20
      connectorApp.win.y = 20
      connectorApp.win.minimised = true
      setTimeout(() => {
        connectorApp.win.minimised = false
      }, 200)
    }
    let previewApp = api.portals.find(a => a.app === 'enpreview')
    if (previewApp) {
      previewApp.win.width = 400
      previewApp.win.height = 300
      previewApp.win.x = window.innerWidth - previewApp.win.width - 20
      previewApp.win.y = 20
      previewApp.win.minimised = true
      setTimeout(() => {
        previewApp.win.minimised = false
      }, 200)
    }
  }
  temp.x = 30
  temp.y = 30
}

export function makeWin (id, appName) {
  let w = window.innerWidth - 40
  let h = window.innerHeight - 70 - 30
  let win = {
    id: getID(),
    name: appName,
    width: w > 650 ? 650 : w,
    height: h > 500 ? 500 : h,
    x: 20 + temp.x,
    y: 20 + temp.y,
    z: 100000,
    active: true,
    minimised: false,
    space3D: false
  }

  temp.x += 30
  temp.y += 30

  temp.x %= 210
  temp.y %= 210

  if (window.innerWidth < 500) {
    win.width = window.innerWidth - win.x * 2.0
    temp.x = 0
    temp.y = 0
  }

  return win
}

export function makePortal ({ type, appName = 'App', data = {} }) {
  let id = getID()
  let win = makeWin(id, appName)
  let app = 'NoteApp'

  app = AppList.TypeFilter(type) || app

  // if (type === 'yoteach') {
  //   app = 'YoTeachApp'
  // } else if (type === 'sys') {
  //   app = 'SysApp'
  // } else if (type === 'note') {
  //   app = 'NoteApp'
  // }

  return {
    id,
    app,
    date: Date.now(),
    win,
    data
  }
}

export function makeSample (api) {
  if (AppList.AppList.map(e => e.compoName).includes('enedit')) {
    api.portals.push(
      makePortal({ type: 'enedit', data: {}, appName: AppList.AppList.find(e => e.compoName === 'enedit').windowTitle })
    )
  }

  if (AppList.AppList.map(e => e.compoName).includes('enpreview')) {
    api.portals.push(
      makePortal({ type: 'enpreview', data: {}, appName: AppList.AppList.find(e => e.compoName === 'enpreview').windowTitle })
    )
  }

  api.organise()
}

export function addWindow (api, args) {
  let newWin = makePortal(args)
  api.portals.push(
    newWin
  )
  sortWinZ(api, newWin)
}

export function hideWindow (api, current) {
  current.win.minimised = true
  makeZList(api)
}

export function removeWindow (api, current) {
  let idx = api.portals.findIndex(e => e.id === current.id)
  api.portals.splice(idx, 1)
}

export function fixOverflow (api) {
  let go = api.portals.reduce((c, p) => {
    let isOutView = p.win.x >= window.innerWidth || p.win.y >= window.innerHeight
    if (isOutView) {
      c = true
    }
    return c
  }, false)
  if (go) {
    api.portals.forEach((p, i) => {
      p.win.x = 50 + i * 50
      p.win.y = 50 + i * 50
      p.win.z = 10 + i
    })
  }
}

// export function sortWinZ (api, current) {
//   let idx = api.portals.findIndex(p => p.id === current.id)
//   api.portals.splice(idx, 1)
//   api.portals.push(current)
//   makeZList(api)
// }

// export function makeZList (api) {
//   api.portals.filter(e => !e.win.minimised).forEach((i, ii) => {
//     i.win.z = ii
//   })
// }

export function sortWinZ (api, current) {
  // let idx = api.portals.findIndex(p => p.id === current.id)
  // api.portals.splice(idx, 1)
  // api.portals.push(current)
  makeZList(api)
}

export function makeZList (api) {
  api.portals.slice().sort((a, b) => {
    if (a.win.active) {
      return 1
    } else {
      return -1
    }
  }).forEach((i, ii) => {
    i.win.z = ii
  })
}

export function isIn3D (api) {
  let firstPortal = api.portals[0]
  if (firstPortal) {
    return firstPortal.win.space3D
  } else {
    return false
  }
}

export function enableSpace3D (api) {
  api.portals.forEach((i, ii) => {
    i.win.space3D = true
  })
}
export function disableSpace3D (api) {
  api.portals.forEach((i, ii) => {
    i.win.space3D = false
  })
}

export function activate (api, current) {
  api.portals.forEach(i => {
    i.win.active = false
  })
  current.win.active = true
  current.win.minimised = false
  sortWinZ(api, current)
}

export function init () {
  var mod = {}
  mod.meta = {}
  mod.portals = []

  mod.makeSample = () => {
    makeSample(mod)
  }

  mod.isIn3D = () => {
    return isIn3D(mod)
  }
  mod.addWindow = (arg) => {
    addWindow(mod, arg)
  }
  mod.fixOverflow = () => {
    fixOverflow(mod)
  }
  mod.enableSpace3D = () => {
    enableSpace3D(mod)
  }
  mod.disableSpace3D = () => {
    disableSpace3D(mod)
  }
  mod.makeZList = () => {
    makeZList(mod)
  }
  mod.sortWinZ = (current) => {
    sortWinZ(mod, current)
  }
  mod.removeWindow = (current) => {
    removeWindow(mod, current)
  }
  mod.hideWindow = (current) => {
    hideWindow(mod, current)
  }
  mod.activate = (current) => {
    activate(mod, current)
  }
  mod.square = (current) => {
    square(mod, current)
  }

  mod.organise = () => {
    organise(mod)
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mod)
    }, 1)
  })
}
