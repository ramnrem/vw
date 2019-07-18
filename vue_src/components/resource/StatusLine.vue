<template>
    <el-row type="flex" style="height: 100%; align-items: center; margin-top: -1px;">
        <el-col>
            <status-badge :state="model.aasm_state" :states="states" v-if="model.aasm_state"/>
        </el-col>
        <el-col align="right">
          <div>
            <print :model="model" :resource="resource" style="margin-right: 12px;"/>

            <history :model="model"/>
          </div>
        </el-col>
    </el-row>
</template>

<script>

  export default {
    name: 'ResourceStatusLine',
    props: {
      model: {
        required: true,
        type: Object,
      },
      states: {
        required: true,
        type: String,
      },
      resource: {
        type: [String, Object],
      },
    },
  }
</script>
