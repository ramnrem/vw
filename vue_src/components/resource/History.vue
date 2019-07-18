<template>
<span>
  <el-button type="info" title="История" @click="handleClick">
    <font-awesome-icon icon="history"/>
  </el-button>
  <div align="left">
    <el-dialog :visible.sync="dialogVisible" width="90%" title="История" append-to-body>
      <base-grid v-if="resource" :context-menu="[]" :resource="resource" :filtrable="true" ref="grid" :id="id" />
    </el-dialog>
  </div>
</span>
</template>

<script>
export default {
  name: 'History',
  props: {
    model: {
      required: true,
      type: Object,
    },
  },
  data() {
    return {
      dialogVisible: false,
    }
  },
  computed: {
    id() {
      return `History-${this.model.class}-${this.model.id}`
    },
    resource() {
      return this.$resource('record_logs', {
        logable_type: this.model.class,
        logable_id: this.model.id,
      })
    },
  },
  methods: {
    handleClick() {
      this.dialogVisible = true
    },
  },
}
</script>
