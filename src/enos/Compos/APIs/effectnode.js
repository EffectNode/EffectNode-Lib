var getID = (prefix) => {
  prefix = prefix || ''
  return '_hive_' + prefix + '_' + (Math.random().toString(36).substr(2, 9))
}

export const DomModule = `/* global env */
/* eslint-disable */
let {
  Signal,
  Resources,
  sockets,
  box,
  IO,
  Input,
  Output,
  OutputAll
} = env
/* esltint-enable */
console.log('Environment is ready for you!::', box.id)

let h = {
  fillBackground: (degree) => {
    let gradBg = ''
    gradBg += 'linear-gradient(45deg, '
    gradBg += '    hsl(' + Math.floor(Math.abs(0.5 - degree) * 360)  + ', 50%, 50%), '
    gradBg += '    hsl(' + Math.floor(Math.abs(1.25 - degree) * 360)  + ', 50%, 50%) '
    gradBg += ')'

    Resources.get('rootDOM')
      .style
      .background = gradBg
  }
}

var i = 0;
Input(0, () => {
  h.fillBackground(i / 100);
  i++
  i = i % 100;
});
`

export const MainLoopModule = `/* global env */
/* eslint-disable */
let {
  Signal,
  Resources,
  sockets,
  box,
  IO,
  Input,
  Output,
  OutputAll
} = env
/* esltint-enable */
console.log('========' + 'box.name' + 'is Ready.  ========')
// sender

let startTime = performance.now();

let rAFID = 0
let event = {}
let rAF = () => {
  rAFID = window.requestAnimationFrame(rAF);

  event.time = performance.now();

  OutputAll(event);
}
rAFID = window.requestAnimationFrame(rAF);

Input('onClock', (evt) => {
  OutputAll(evt);
}, () => {
  // cancenl the loop for the recorder
  cancelAnimationFrame(rAFID);
})
  `

// let Data = {

//   makeBridge () {
//     return {
//       id: getID(),
//       line: {
//         running: true,
//         stroke: `green`
//       },
//       a: {
//         rect: {
//           x: 50,
//           y: 50,
//           w: 25,
//           h: 10,
//           stroke: ``,
//           fill: `lime`
//         },
//         marker: {
//           stroke: ``,
//           fill: `green`
//         }
//       },
//       b: {
//         rect: {
//           x: 200,
//           y: 100,
//           w: 25,
//           h: 10,
//           stroke: ``,
//           fill: `lime`
//         },
//         marker: {
//           stroke: ``,
//           fill: `green`
//         }
//       }
//     }
//   }
// }

export const NS = 'effectnode-project'

export const removeDB = ({ sess }) => {
  window.localStorage.removeItem(`${NS}-${sess}`)
}

export const saveDB = ({ sess, data }) => {
  window.localStorage.setItem(`${NS}-${sess}`, JSON.stringify(data))
}

export const loadDB = ({ sess }) => {
  let data = window.localStorage.getItem(`${NS}-${sess}`)
  if (data) {
    try {
      return JSON.parse(data)
    } catch (e) {
      console.log('bad json', e)
      return null
    }
  } else {
    return null
  }
}

export const hydrateDoc = ({ Doc }) => {
  let dbData = loadDB({ sess: Doc.sessionID })
  if (dbData) {
    Doc.root = dbData
  } else {
    let defaultJSON = require('./defaults/dom.json')
    Doc.root = defaultJSON.root
  }
}
export const saveDoc = ({ Doc }) => {
  let dbData = saveDB({ sess: Doc.sessionID, data: Doc.root })
  if (dbData) {
    Doc.root = dbData
  }
}

export const init = async (uiAPI) => {
  return new Promise(async (resolve, reject) => {
    let Doc = makeDocumentStack()
    Doc.sessionID = uiAPI.sessionID
    Doc.projectID = uiAPI.sessionID
    Doc.userID = uiAPI.sessionID

    hydrateDoc({ Doc })

    return resolve({ Doc })
  })
}

export const getToSocketByFromID = ({ Doc, fromSocketID }) => {
  let sockets = getAllSockets({ Doc })
  return sockets.find(s => s.socket.to === fromSocketID)
}

export const getModInputs = ({ Doc, modID }) => {
  let sockets = getAllSockets({ Doc })
  return sockets.filter(s => s.modID === modID && s.type === 'input')
    .slice()
    .sort((a, b) => { return a.idx - b.idx })
}

export const getModOutputs = ({ Doc, modID }) => {
  let sockets = getAllSockets({ Doc })
  return sockets.filter(s => s.modID === modID && s.type === 'output')
    .slice()
    .sort((a, b) => { return a.idx - b.idx })
}

var idxAccu = 0
export const getIDX = () => {
  idxAccu++
  return Date.now() + idxAccu
}

export const makeMod = ({ Doc, src, name }) => {
  let mod = makeModule({
    Doc,
    name: name,
    src: src,
    pos: {
      x: 50 + Math.random() * 10,
      y: 100 + Math.random() * 10
    },
    meta: JSON.parse(JSON.stringify([]))
  })

  addModToDoc({ mod, Doc })

  // inputs
  let in1 = makeSocket({ Doc, idx: getIDX(), type: 'input', modID: mod.id })
  addSocketToDoc({ socket: in1, Doc })

  let in2 = makeSocket({ Doc, idx: getIDX(), type: 'input', modID: mod.id })
  addSocketToDoc({ socket: in2, Doc })

  let in3 = makeSocket({ Doc, idx: getIDX(), type: 'input', modID: mod.id })
  addSocketToDoc({ socket: in3, Doc })

  let in4 = makeSocket({ Doc, idx: getIDX(), type: 'input', modID: mod.id })
  addSocketToDoc({ socket: in4, Doc })

  // outptus
  let out1 = makeSocket({ Doc, idx: getIDX(), type: 'output', modID: mod.id })
  addSocketToDoc({ socket: out1, Doc })

  let out2 = makeSocket({ Doc, idx: getIDX(), type: 'output', modID: mod.id })
  addSocketToDoc({ socket: out2, Doc })

  let out3 = makeSocket({ Doc, idx: getIDX(), type: 'output', modID: mod.id })
  addSocketToDoc({ socket: out3, Doc })

  let ou4 = makeSocket({ Doc, idx: getIDX(), type: 'output', modID: mod.id })
  addSocketToDoc({ socket: ou4, Doc })

  return mod
}

export const cloneModule = ({ Doc, mod, connectors = Doc.root.connectors, pos = false }) => {
  let newMod = makeModule({
    Doc,
    name: mod.name,
    src: mod.src,
    pos: pos || {
      x: mod.pos.x + 30,
      y: mod.pos.y + 30
    },
    meta: JSON.parse(JSON.stringify(mod.meta || []))
  })

  addModToDoc({ mod: newMod, Doc })

  connectors.filter(c => c.modID === mod.id).sort((a, b) => { return a.idx - b.idx })
    .forEach((e, ii) => {
      let ss = makeSocket({ Doc, idx: getIDX(), color: e.color, type: e.type, name: e.name, modID: newMod.id })
      addSocketToDoc({ socket: ss, Doc })
    })

  return newMod
}

export const getAllSockets = ({ Doc }) => {
  return Doc.root.connectors.slice().sort((a, b) => { return a.idx - b.idx })
}

export const getAllModules = ({ Doc }) => {
  return Doc.root.modules
}

export const getAllModulesOfProject = ({ Doc }) => {
  return Doc.root.modules
}

export const getAllSocketsOfProject = ({ Doc }) => {
  return Doc.root.connectors.slice().sort((a, b) => { return a.idx - b.idx })
}

export const addSocketToDoc = ({ socket, Doc }) => {
  Doc.root.connectors.push(socket)
}

export const getSocketByID = ({ id, Doc }) => {
  return Doc.root.connectors.find(s => s.socket.from === id)
}

export const addModToDoc = ({ mod, Doc }) => {
  Doc.root.modules.push(mod)
}

export const getTop = ({ Doc, socket }) => {
  let box = Doc.root.modules.find(m => m.id === socket.modID)
  let boxW = box.size.w
  // let boxH = box.size.h
  let inputs = getModInputs({ Doc, modID: box.id }) || []
  // let outputs = getModOutputs({ Doc, modID: box.id }) || []
  let inputW = boxW / (inputs.length || 3)
  // let outputW = boxW / (outputs.length || 3)

  return {
    rect: {
      x: box.pos.x + inputs.find(e => e.id === socket.id) * inputW,
      y: box.pos.y - 13,
      w: inputW,
      h: 13
    }
  }
}

export const getBottom = ({ Doc, socket }) => {
  let box = Doc.root.modules.find(m => m.id === socket.modID)
  let boxW = box.size.w
  let boxH = box.size.h
  // let inputs = getModInputs({ Doc, modID: box.id }) || []
  let outputs = getModOutputs({ Doc, modID: box.id }) || []
  // let inputW = boxW / (inputs.length || 3)
  let outputW = boxW / (outputs.length || 3)

  return {
    rect: {
      x: box.pos.x + outputs.find(e => e.id === socket.id) * outputW,
      y: box.pos.y + boxH - 13 + 13,
      w: outputW,
      h: 13
    }
  }
}

export const removeModFromDoc = ({ mod, Doc }) => {
  let modules = Doc.root.modules
  let idx = modules.findIndex(m => m.id === mod.id)
  modules.splice(idx, 1)
}

export const removeSocketFromMod = ({ Doc, socket }) => {
  let connectors = Doc.root.connectors
  let idx = connectors.findIndex(m => m._id === socket._id)
  connectors.splice(idx, 1)
}

export const makeDocumentStack = () => {
  return {
    root: {
      modules: [],
      connectors: []
    },
    versions: [
      // {
      //   date: new Date(),
      //   root: {}
      // }
    ]
  }
}

export const makeSocket = ({ Doc, oldID = '', idx = 0, type = 'input', color = '#e4e3e5', name = 'my socket', modID, projectID = Doc.projectID, isTemplate = false, isGallery = false }) => {
  let sID = getID(Doc.projectID + 'socket')
  let data = {
    userID: Doc.userID,
    projectID: projectID,
    oldID,
    id: sID,
    _id: sID,
    isTemplate,
    isGallery,
    type,
    idx,
    name,
    color,
    modID,
    mod: {
      from: modID,
      to: ''
    },
    socket: {
      from: sID,
      to: ''
    }
  }
  return data
  // let resp = await Service.connectors.add(data)
  // let obj = resp.results
  // return obj
}

export const makeModule = ({ Doc, oldID = '', src = '', name = '', pos, meta, projectID = Doc.projectID, isTemplate = false, isGallery = false }) => {
  let modID = getID(Doc.projectID + 'module')
  let data = {
    userID: Doc.userID,
    projectID: projectID,
    id: modID,
    _id: modID,
    isTemplate,
    isGallery,
    oldID,
    meta: meta || [],
    bg: '',
    name: name,
    pos: pos || {
      x: 100,
      y: 100
    },
    size: {
      w: 200,
      h: 40
    },
    src: src
  }

  // let resp = await Service.modules.add(data)
  // let obj = resp.results
  return data
}
