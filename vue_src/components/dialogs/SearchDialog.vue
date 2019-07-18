<template>
<div>
  <el-dialog :visible.sync="dialogVisible" width="90%" :title="title"  append-to-body>
    <el-row type="flex" justify="space-between">
      <div class="l-input-search l-input-search--search-dialog">
        <base-filter v-if="gridMeta"
                     :grid="gridMeta"
                     :query="query"
                     @change-term="handleChangeTerm"
                     @apply-filter="handleApplyFilter"
                     @change-display-filter-query="handleDisplayFilterQuery"
                     ref="filter"
        />
      </div>
      <el-button type="primary" @click="handleSelectResource" v-if="multiselect && selectedItems.length > 0">Выбрать</el-button>
      <el-button type="primary" @click="handleContinue" v-if="continueable">{{continueBtnLabel}}</el-button>
      <el-button type="primary" @click="handleNewResource" v-if="createable">{{createBtnLabel}}</el-button>
    </el-row>

    <div v-if="displayFilterVaue" class="grid-filter">Текущий фильтр: {{displayFilterVaue}} &nbsp;
      <el-button size="mini" type="text" title="Сбросить фильтр" @click="handleClearFilter">
        <font-awesome-icon icon="times"/>
      </el-button>
    </div>

    <base-grid :resource="resource"
               :filtrable="true"
               :context-menu="contextMenu"
               :multiselect="multiselect"
               @selection-change="handleChangeSelection"
               ref="grid"
               @fetch="handleFetchData"
               :term="currentTerm"
               :filter-query="currentQuery"
               >
    </base-grid>

  </el-dialog>

  <create-dialog
    v-if="createable"
    ref="createDialog"
    :form="form"
    :resource="resource"
    :title="createTitle"
    :btn-label="createBtnLabel"
    :btn-hidden="true"
    @create="handleCreateResource"
    :params="params"
  />
</div>
</template>

<script>
export default {
  name: 'SearchDialog',
  props: {
    resource: {
      required: true,
      type: [Object, String],
    },
    form: {
      required: true,
      type: String,
    },
    title: {
      required: false,
      type: String,
      default: 'Поиск'
    },
    createable: {
      required: false,
      type: Boolean,
      default: false
    },
    createBtnLabel: {
      required: false,
      type: String
    },
    createTitle: {
      required: false,
      type: String,
      default: 'Новый'
    },
    continueable: {
      required: false,
      type: Boolean,
      default: false
    },
    continueBtnLabel: {
      required: false,
      type: String,
      default: "Продолжить"
    },
    multiselect: {
      required: false,
      type: Boolean,
      default: false
    },
    params: {
      required: false,
      type: Object,
      default() { return {} }
    },
    query: {
      required: false,
      type: Object
    }
  },
  data() {
    return {
      dialogVisible: false,
      selectedItems: [],
      displayFilterVaue: null,
      currentTerm: null,
      currentQuery: null,
      gridMeta: null
    }
  },
  computed: {
    contextMenu() {
      return this.multiselect ? [] : [{
        label: 'Выбрать',
        command: this.select,
        primary: true
      }, ]
    },
  },
  methods: {
    open() {
      this.dialogVisible = true
      if (this.$refs.grid) this.$refs.grid.refresh()
    },
    close() {
      this.dialogVisible = false
    },
    select(context) {
      this.$emit('select', [context.id])

      this.close()
    },
    handleFetchData(data) {
      this.gridMeta = Object.assign({}, this.gridMeta, data.meta.grid)
    },
    handleSelectResource(){
      this.$emit('select', this.selectedItems.map(item => item.id), this.selectedItems)

      this.close()
    },
    handleNewResource() {
      setTimeout(function() {
        this.$refs.createDialog.open()
      }.bind(this), 150)

      this.close()
    },
    handleCreateResource(id) {
      this.$emit('select', [id])

      this.close()
    },
    handleContinue(){
      this.$emit('continue')

      this.close()
    },
    handleChangeSelection(val){
      this.selectedItems = val
    },
    handleChangeTerm(term) {
      this.currentTerm = term
    },
    handleApplyFilter(query) {
      this.currentQuery = Object.assign({}, query)
    },
    handleDisplayFilterQuery(value) {
      this.displayFilterVaue = value
    },
    handleClearFilter() {
      this.$refs.filter.clear()
    },
  },
}
</script>
