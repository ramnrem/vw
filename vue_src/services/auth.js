import Vue from 'vue'

export default {

  me() {
    return Vue.http.post('profile')
    .then((response) => Promise.resolve(response.data))
    .catch((error) => Promise.reject(error));
  },
}