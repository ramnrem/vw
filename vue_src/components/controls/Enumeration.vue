<template>
    <el-select
            v-model="currentValue"
            placeholder="Выбрать"
            @change="onChange"
            style="width: 100%;">
        <el-option
                v-for="item in items"
                :key="item.id"
                :label="item.value"
                :value="item.id">
        </el-option>
    </el-select>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'Enumeration',
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
        //this.$emit('change', val)
      },
      value: {
        handler (val) {
          this.currentValue = val
        },
        immediate: true
      }
    },
    created () {
      this.items = this.list[this.code].items
    },
    methods: {
      onChange (value) {
        this.$emit('input', value)
        this.$emit('change', value)
      },
    },
    computed: {
      id () {
        return this.$route.params.id
      },
      ...mapGetters({
        list: 'dictionary/list'
      }),
    },
  }
</script>
