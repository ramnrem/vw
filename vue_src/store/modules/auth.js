import Vue from 'vue'
import Cookies from 'js-cookie'

const decodeJWTClaims = require('jwt-claims')
const CBSD_ACCESS_TOKEN = 'BITRIX_SM_CBSD_ACCESS_TOKEN'

export const types = {
  START_LOAD: 'START_LOAD',
  FINISH_LOAD: 'FINISH_LOAD',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILED: 'LOGIN_FAILED',
  SET_PROFILE: 'SET_PROFILE'
}

export const getters = {
  loading: state => state.loading,
  accessToken: state => state.accessToken,
  isAuthenticated: state => !!state.user,
  isSessionExpired: (state) => {
    if (!state.accessToken) return true

    const now = Math.floor(Date.now() / 1000)
    const claims = decodeJWTClaims(state.accessToken)

    return now > claims.exp
  },
  user: state => state.user
}

export const mutations = {
  [types.START_LOAD] (state) {
    state.loading = true
  },
  [types.FINISH_LOAD] (state) {
    state.loading = false
  },
  [types.LOGIN_SUCCESS] (state, data) {
    state.accessToken = data.session_token

    Cookies.set(CBSD_ACCESS_TOKEN, data.session_token)
  },
  [types.LOGIN_FAILED] (state) {
    state.user = null
    state.accessToken = null

    Cookies.remove(CBSD_ACCESS_TOKEN)
  },
  [types.SET_PROFILE] (state, data) {
    state.user = data
  }
}

export const state = {
  loading: false,
  user: null,
  accessToken: Cookies.get(CBSD_ACCESS_TOKEN)
}

export const actions = {
  signIn (context, credential) {
    context.commit(types.START_LOAD)

    return Vue.resource('/auth/sign_in').save(credential).then((response) => {
      context.commit(types.LOGIN_SUCCESS, response.data)
      context.commit(types.SET_PROFILE, response.data)
      context.commit(types.FINISH_LOAD)
    }).catch((error) => {
      context.commit(types.LOGIN_FAILED)
      context.commit(types.FINISH_LOAD)

      return Promise.reject(error)
    })
  },
  signOut (context) {
    context.commit(types.START_LOAD)

    return Vue.resource('/auth/sign_out').delete().then((_) => {
      context.commit(types.LOGIN_FAILED)
      context.commit(types.FINISH_LOAD)
    }).catch((error) => {
      context.commit(types.LOGIN_FAILED)
      context.commit(types.FINISH_LOAD)

      return Promise.reject(error)
    })
  },
  fetchUser (context) {
    if (context.state.user) return Promise.resolve(context.state.user)

    context.commit(types.START_LOAD)

    return Vue.resource('auth/profile').get().then((response) => {
      context.commit(types.SET_PROFILE, response.data)
      context.commit(types.FINISH_LOAD)

      return response.data
    }).catch((error) => {
      context.commit(types.LOGIN_FAILED)
      context.commit(types.FINISH_LOAD)

      return Promise.reject(error)
    })
  },
  setProfile (context, data) {
    context.commit(types.LOGIN_SUCCESS, data)
    context.commit(types.SET_PROFILE, data)
  },
  resetToken (context) {
    context.commit(types.LOGIN_FAILED)
  }
}
