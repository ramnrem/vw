<template>
    <div>
        <el-button type="text" @click="open" :loading="loading">{{label}}</el-button>
        <el-dialog :visible.sync="dialogVisible" width="90%" :title="currentTitle"  append-to-body>
            <el-tabs v-model="currentType" v-if="isList">
                <el-tab-pane v-for="type in types"
                             :label="type.label"
                             :name="type.type"
                             :key="type.type">
                    <base-grid :resource="type.resource" :context-menu="contextMenu" :filtrable="true">
                        <component :is="type.grid" mode="search"/>
                    </base-grid>
                </el-tab-pane>
            </el-tabs>
            <template v-else>
                <base-form :model="currentModel" :actions="actions">
                    <template slot-scope="scope">
                        <component :is="currentForm" :model="scope.model" mode="search"/>
                    </template>
                </base-form>
            </template>
        </el-dialog>
    </div>
</template>

<script>

  export default {
    name: 'PolymorphicSearchPage',
    props: {
      model: {
        required: true,
        type: Object
      },
      valueId: {
        required: true,
      },
      valueType: {
        required: true,
      },
      fieldId: {
        required: true,
      },
      fieldType: {
        required: true,
      },
      types: {
        required: true,
        type: Array
      }
    },
    data () {
      return {
        dialogVisible: false,
        loading: false,
        label: 'Выбрать',
        currentType: null,
        currentId: null,
        currentModel: null,
        currentTitle: '',
        isList: null
      }
    },
    computed: {
      contextMenu () {
        return [
          { label: 'Выбрать', command: this.select, primary: true },
        ]
      },
      actions () {
        return [
          { label: 'Поиск', command: this.showList, type: 'primary' },
          { label: 'Закрыть', command: this.close }
        ]
      },
      currentTypeConfig () {
        return this.types.filter(obj => obj.type === this.currentType)[0]
      },
      currentForm () {
        return this.currentTypeConfig.form
      }
    },
    watch: {
      valueType: 'setupType',
      valueId: 'setupId',
      currentType: 'assignType',
      currentId: 'assignId',
      currentModel: 'assignLabel',
      isList: 'assignTitle'
    },
    created () {
      this.currentType = this.types[0].type
      this.isList = true
    },
    methods: {
      setupType () {
        this.currentType = this.model[this.fieldType]
      },
      setupId () {
        this.currentId = this.model[this.fieldId]
        this.isList = !this.currentId
        this.fetch()
      },
      assignType (value) {
        this.$set(this.model, this.fieldType, value)
      },
      assignId (value) {
        this.$set(this.model, this.fieldId, value)
      },
      assignLabel (value) {
        if (typeof this.currentTypeConfig.valueLabel === 'function') {
          this.label = this.currentTypeConfig.valueLabel(value)
        } else if (typeof this.currentTypeConfig.valueLabel === 'string') {
          this.label = value[this.currentTypeConfig.valueLabel]
        } else {
          this.label = value.label
        }
        this.currentTitle = this.label
      },
      assignTitle (value) {
        this.currentTitle = value ? 'Поиск' : this.label
      },
      fetch () {
        if (this.currentId) {
          this.label = 'Загрузка...'
          this.loading = true
          this.currentTypeConfig.resource.get({ id: this.currentId }).then(response => {
            this.currentModel = response.data
            this.loading = false
          })
        }
      },
      select (context) {
        this.currentId = context.id
        this.currentModel = context
        this.isList = false
        this.close()
      },
      open () {
        this.dialogVisible = true
      },
      close () {
        this.dialogVisible = false
      },
      showList () {
        this.isList = true
      }
    }
  }
</script>
