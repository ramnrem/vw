import Vue from 'vue'
import VueResource from 'vue-resource'
import ElementUI from 'element-ui'
import store from '../store'
import router from '../router'

Vue.use(VueResource)

const endpoint = process.env.VUE_APP_API_URL
Vue.http.options.root = `${endpoint}`
Vue.http.interceptors.push((request, next) => {
  request.url = request.url.search(/^api\//) === 0 ? request.url : `api/v1/${request.url}`
  const token = store.getters['auth/accessToken']
  request.headers.set('Authorization', `Bearer ${token}`)
  next((response) => {
    return new Promise((resolve, reject) => {
      if (response.ok) {
        resolve(response)
      } else if (response.status === 401) {
        store.dispatch('auth/resetToken')
        router.push({ name: 'home' })
        reject(response)
      } else if (response.status === 422) {
        reject(response)
      } else {
        ElementUI.Message.error({
          dangerouslyUseHTMLString: true,
          message: response.data.message || response.statusText
        })

        reject(response)
      }
    })
  })
})
