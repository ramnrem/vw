import Vue from 'vue'

const types = {
  SELECT_SETTINGS: 'SELECT_SETTINGS'
}

export const state = {
  constants: {},
  documents: {}
}

export const getters = {
  constants: state => state.constants,
  documents: state => state.documents,
  defaultTimePeriod: state => [state.constants.start_time.value, state.constants.finish_time.value]
}

export const mutations = {
  [types.SELECT_SETTINGS](state, settings) {
    state.constants = settings.constants
    state.documents = settings.documents
  },
}

export const actions = {
  select(context) {
    return Vue.resource('settings').get().then((response) => {
      context.commit(types.SELECT_SETTINGS, response.data)
    }).catch((error) => {
      throw error
    })
  },
}
