import Vue from 'vue'
import Meta from 'vue-meta'
import store from '../store'
import { stringify, parse } from 'qs'
import Router from 'vue-router'
import { sync } from 'vuex-router-sync'
import routes from './routes'

Vue.use(Router)
Vue.use(Meta)

// The middleware for every page of the application.
const globalMiddleware = ['check-auth', 'load-dictionary', 'load-states', 'load-settings', 'check-page-changed']

// Load middleware modules dynamically.
const routeMiddleware = resolveMiddleware(
  require.context('../middleware', false, /.*\.js$/),
)

const router = createRouter()

sync(store, router)

export default router

/**
 * Create a new router instance.
 *
 * @return {Router}
 */
function createRouter() {
  const stringifyQuery = (query) => {
    if (Object.keys(query).length === 0) return ""

    console.log(query, stringify(query, { arrayFormat: 'brackets' }));

    return '?' + stringify(query, { arrayFormat: 'brackets' })
  }

  const router = new Router({
    routes
    // ,
    // stringifyQuery
  })

  router.beforeEach(beforeEach)
  router.afterEach(afterEach)

  return router
}

/**
 * Merge the the global middleware with the components middleware.
 *
 * @param  {Array} components
 * @return {Array}
 */
function getMiddleware(components) {
  const middleware = [...globalMiddleware]

  components.filter(c => c.middleware).forEach(component => {
    if (Array.isArray(component.middleware)) {
      middleware.push(...component.middleware)
    } else {
      middleware.push(component.middleware)
    }
  })

  return middleware
}

/**
 * @param  {Object} requireContext
 * @return {Object}
 */
function resolveMiddleware(requireContext) {
  return requireContext.keys()
    .map(file => [file.replace(/(^.\/)|(\.js$)/g, ''), requireContext(file)])
    .reduce((guards, [name, guard]) => ({ ...guards, [name]: guard.default }), {})
}

function beforeEach(to, from, next) {
  return new Promise((resolve, reject) => {
    const components = router.getMatchedComponents({ ...to })

    if (components.length === 0) return reject()

    resolve(components)
  }).then((components) => {
    processComponentsMiddleware(components, to, from, next)
  }).catch(() => {
    next()
  })
}

function afterEach(to, from) {
  Promise.resolve().then(() => router.app.$nextTick())
}

function processComponentsMiddleware(components, to, from, next) {
  const middleware = getMiddleware(components)

  callMiddleware(middleware, to, from, (...args) => {
    if (args.length === 0) {
      router.app.setLayout(components[0].layout || '')
    }

    next(...args)
  })
}

function callMiddleware(middleware, to, from, next) {
  const stack = middleware.reverse()

  const _next = (...args) => {
    if (args.length > 0 || stack.length === 0) return next(...args)

    const middleware = stack.pop()

    if (typeof middleware === 'function') {
      middleware(to, from, _next)
    } else if (routeMiddleware[middleware]) {
      routeMiddleware[middleware](to, from, _next)
    } else {
      throw Error(`Undefined middleware [${middleware}]`)
    }
  }

  _next()
}
