<template>
  <transition name="page" mode="out-in">
    <component v-if="layout" :is="layout"></component>
  </transition>
</template>

<script>
const requireContext = require.context(
  "./components/layouts",
  false,
  /.*\.vue$/
);

const layouts = requireContext
  .keys()
  .map(file => [file.replace(/(^.\/)|(\.vue$)/g, ""), requireContext(file)])
  .reduce((components, [name, component]) => {
    components[name] = component;
    return components;
  }, {});

export default {
  el: "#content-table",
  metaInfo: {
    meta: [{ charset: "utf-8" }]
  },
  data: () => ({
    layout: null,
    defaultLayout: "default"
  }),
  mounted() {
    this.$loading = this.$refs.loading;
  },
  methods: {
    setLayout(layout) {
      if (!layout || !layouts[layout]) {
        layout = this.defaultLayout;
      }

      this.layout = layouts[layout].default;
    }
  }
};
</script>
