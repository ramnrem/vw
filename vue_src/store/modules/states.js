import Vue from 'vue'
import * as types from '../mutation-types'

// state
export const state = {
  all: {},
  loaded: false,
}

export const getters = {
  loaded: state => state.loaded,
  list: state => state.all
}

// mutations
export const mutations = {
  [types.FETCH](state, states) {
    state.all = states
    state.loaded = true
  },
}

// actions
export const actions = {
  fetch({ commit, getters }) {
    if (getters.loaded) {
      return Promise.resolve
    }

    return Vue.resource('states').get().then((response) => {
      commit(types.FETCH, response.data)
    }).catch((error) => {
      console.log(error)
    })
  },
}
