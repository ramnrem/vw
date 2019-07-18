import store from '../store'

export default (to, from, next) => {
  if (!store.getters['auth/isAuthenticated'] && store.getters['auth/accessToken']) {
    store.dispatch('auth/fetchUser')
      .then(() => { next() })
      .catch(() => { next() })
  } else {
    next()
  }
}
