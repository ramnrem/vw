import store from '../store'

export default (to, from, next) => {
  if (!store.getters['auth/isAuthenticated']) {
    next({ name: 'signIn' })
  } else {
    next()
  }
}
