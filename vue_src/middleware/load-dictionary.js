import store from '../store'

export default (to, from, next) => {
  if (store.getters['auth/isAuthenticated']) {
    store.dispatch('dictionary/fetch')
      .then(() => {
        next()
      })
      .catch(() => {
        next()
      })
  } else {
    next()
  }
}
