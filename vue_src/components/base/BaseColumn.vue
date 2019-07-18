<template>
  <el-table-column
    :sortable="originalColumn.sortable ? 'custom': false"
    :label="column.label"
    :prop="column.id"
    :width="originalColumn.width"
  >
    <template slot-scope="scope">
      <template v-if="scope.row[column.id]">
        <template v-if="originalColumn.type === 'state'">
          <el-badge :value="scope.row[column.id].value" :class="scope.row[column.id].id"/>
        </template>
        <template v-if="originalColumn.type === 'belongs_to'">
          <template v-if="scope.row[column.id].link">
            <a :href="`#/${scope.row[column.id].link}`">{{scope.row[column.id].value}}</a>
          </template>
          <template v-else>{{scope.row[column.id].value}}</template>
        </template>

        <template v-if="originalColumn.type === 'text'">
          <div v-html="scope.row[column.id]"/>
        </template>

        <template
          v-if="originalColumn.type === 'numeric'"
        >{{scope.row[column.id]}}</template>
        <template
          v-if="originalColumn.type === 'decimal'"
        >{{$formatter.formatCurrency(scope.row[column.id])}}</template>

        <template v-if="originalColumn.type === 'date'">{{scope.row[column.id]}}</template>

        <template v-if="originalColumn.type === 'file'">
          <img :src="scope.row[column.id].url" v-if="originalColumn.format == 'picture' && scope.row[column.id].url" class="cell__picture">
          <a          
            v-if="originalColumn.format != 'picture' && scope.row[column.id].url"
            :href="scope.row[column.id].url"
            target="_blank"
          >Скачать</a>
        </template>

        <template v-if="originalColumn.type === 'boolean'">{{scope.row[column.id] ? 'Да' : 'Нет'}}</template>
      </template>
    </template>
  </el-table-column>
</template>


<script>
export default {
  name: "BaseColumn",
  props: {
    column: {
      required: true,
      type: Object
    },
    grid: {
      required: true,
      type: Object
    }
  },
  computed: {
    originalColumn() {
      return this.findColumn(this.column.id);
    }
  },
  methods: {
    findColumn(id) {
      return this.grid.columns.find(c => c.id === id);
    }
  }
};
</script>
