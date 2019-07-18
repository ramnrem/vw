export default {
  methods: {
    t (key, opts = {}) {
      return this.$t(`${this.$options.name}.${key}`, opts)
    }
  }
}
