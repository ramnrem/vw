<template>
    <el-badge :value="displayLabel" :class="state"/>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'StatusBadge',
    props: {
      state: {
        required: true,
        type: String,
      },
      states: {
        required: true,
        type: String,
      },
    },
    data () {
      return {
        displayLabel: '',
      }
    },
    watch: {
      state: {
        handler () {
          this.assignDisplayLabel()
          this.$forceUpdate()
        },
        immediate: true
      },
    },
    computed: {
      ...mapGetters({
        list: 'states/list',
      }),
    },
    methods: {
      assignDisplayLabel () {
        if (!this.state) return
        try {
          this.displayLabel = this.list[this.states].items[this.state].name
        } catch(ex)
        {
          console.log(ex)
        }
      },
    },
  }
</script>
