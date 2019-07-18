export const types = {
  SET_CHANGED: 'SET_CHANGED',
  SET_CALLBACK: 'SET_CALLBACK',
  SET_TITLE: 'SET_TITLE'
}

export const state = {
  changed: false,
  callback: null,
  title: null,
}

export const getters = {
  changed: state => state.changed,
  callback: state => state.callback,
  title: state => state.title
}

export const mutations = {
  [types.SET_CHANGED](state, changed) {
    state.changed = changed
  },
  [types.SET_CALLBACK](state, callback) {
    state.callback = callback
  },
  [types.SET_TITLE](state, title) {
    state.title = title
  },
}

export const actions = {
  setChanged({ commit }, changed) {
    commit(types.SET_CHANGED, changed)
  },
  setCallback({ commit }, callback) {
    commit(types.SET_CALLBACK, callback)
  },
  setTitle({ commit }, title) {
    commit(types.SET_TITLE, title)
  }
}
