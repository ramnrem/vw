<template>
    <el-select
            v-model="currentValue"
            placeholder="Выбрать"
            clearable
            @change="onChange"
            style="width: 100%;">
        <el-option
                v-for="(value, key) in items"
                :key="key"
                :label="value"
                :value="key">
        </el-option>
    </el-select>
</template>

<script>
  export default {
    name: 'SelectConstant',
    props: {
      value: {
        required: true,
      },
      code: {
        required: true,
      },
      clearable: {
        required: false,
        default: false
      },
    },
    data () {
      return {
        loading: false,
        currentValue: null,
        items: [],
      }
    },
    watch: {
      currentValue (val) {
        this.$emit('input', val)
      },
      value: {
        handler (val) {
          this.currentValue = val
        },
        immediate: true
      }
    },
    created () {
      this.items = this.$store.getters[`constants/${this.code}`]
    },
    methods: {
      onChange (value) {
        this.$emit('input', value)
        this.$emit('change', value)
      },
    }
  }
</script>
