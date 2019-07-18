<template>
  <el-badge :value="label" :class="data.attributes.aasm_state" v-if="data.attributes"/>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "ResourceStatusBadge",
  props: {
    storeNamespace: {
      required: true,
      type: String
    }
  },
  computed: {
    data() {
      return this.$store.getters[this.storeNamespace + "/data"];
    },
    label() {
      //let key = underscored(this.$store.state[this.storeNamespace].name)
      let key = this.$store.state[this.storeNamespace].name

      return this.$t(`resource.${key}.states.${this.data.attributes.aasm_state}`)
    },
    ...mapGetters({
      list: "states/list"
    })
  }
};
</script>
