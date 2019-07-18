<template>
<div>
  <div align="right">
    <el-button type="info" plain size="small" title="Настройка" @click="handleClick">
      <font-awesome-icon icon="cogs"/>
    </el-button>
  </div>
  <div align="left">
    <el-dialog :visible.sync="dialogVisible" width="50%" title="Настройка колонок">
      <el-row type="flex" :gutter="18">
        <el-col>
          <el-select v-model="currentColumn" placeholder="Выберите колонку" style="width: 100%;">
            <el-option v-for="column in grid.columns" :key="column.id" :label="column.label" :value="column.id" />
          </el-select>
        </el-col>
        <el-col>
          <el-button type="primary" @click="handleAddColumn(currentColumn)">Добавить колонку</el-button>
        </el-col>
      </el-row>

      <div class="el-spacer"></div>

      <draggable element="el-collapse" :list="currentConfig.columns" v-if="currentConfig.columns.length > 0">

        <el-row v-for="column in currentConfig.columns" :key="column.id" class="draggable" type="flex" justify="space-between" :gutter="18">
          <el-col :span="10">
            <i class="el-icon-d-caret"></i> {{column.label}}
          </el-col>
          <el-col :span="10">
            <el-input v-model="column.label" size="mini" />
          </el-col>
          <el-col align="right" :span="4">
            <el-button size="mini" type="text" title="Удалить колонку" @click="handleRemoveColumn(column)" v-if="!disabledColumn(column)">
              <font-awesome-icon icon="times"/>
            </el-button>
          </el-col>
        </el-row>
      </draggable>

      <div class="el-spacer"></div>
      <hr/>
      <el-row type="flex">
        <el-col :span="6">
          <el-button type="text" @click="restoreDefaults">По умолчанию</el-button>
        </el-col>
        <el-col align="right" :span="18">
          <el-button type="primary" @click="storeConfig">Сохранить</el-button>
          <el-button type="default" @click="dialogVisible = false">Закрыть</el-button>
        </el-col>
      </el-row>

    </el-dialog>
  </div>
</div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  name: 'GridColumns',
  components: {
    draggable
  },
  props: {
    grid: {
      required: true,
      type: Object,
    },
    config: {
      required: true,
      type: Object,
    },
  },
  data() {
    return {
      dialogVisible: false,
      currentConfig: {
        columns: []
      },
      currentColumn: null
    }
  },
  watch: {
    config: 'assignConfig',
  },
  methods: {
    handleAddColumn(column_id) {
      if (this.currentConfig.columns.map(c => c.id).includes(column_id)) {

        this.$message.error('Колонка уже есть в списке колонок.')

        return
      }
      let column = this.findColumn(column_id)

      this.currentConfig.columns.push({
        id: column.id,
        label: column.label,
        summary: null
      })
    },
    handleRemoveColumn(column) {
      this.currentConfig.columns.splice(this.currentConfig.columns.indexOf(column), 1)
    },
    disabledColumn(column) {
      return this.findColumn(column.id).disabled
    },
    labelColumn(id) {
      return this.findColumn(id).label
    },
    assignConfig(config) {
      this.currentConfig = JSON.parse(JSON.stringify(config))
    },
    handleClick() {
      this.dialogVisible = true
    },
    storeConfig() {
      this.dialogVisible = false

      this.$emit('change', this.currentConfig)
    },
    restoreDefaults() {
      this.currentConfig.columns = []
      var columns = this.grid.columns.filter(column => column.default)
      
      columns.sort((a, b) => a.number > b.number ? 1: -1)
      
      columns.forEach(column => {
        this.handleAddColumn(column.id)
      })
    },
    findColumn(id) {
      return this.grid.columns.find(c => c.id === id)
    }
  },
}
</script>
