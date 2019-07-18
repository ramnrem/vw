import Vue from 'vue'

const requireContext = require.context('.', true, /.*\.vue$/)

requireContext.keys().map(file => {
  let name = file.replace(/(^.\/)|(\.vue$)/g, '')
  let context = requireContext(file)

  Vue.component(name, context.default)
})
