<template>
  <div>
    <el-row type="flex" :gutter="18">
      <el-col>
        <el-form-item label="Название" prop="name" :rules="rules.required">
          <el-input v-model="model.name" />
        </el-form-item>
        <el-form-item label="Не выводить в общем списке" prop="no_common_show">
          <el-switch v-model="model.no_common_show" active-text="Да" />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="Название, EN" prop="name_en">
          <el-input v-model="model.name_en" />
        </el-form-item>
      </el-col>
    </el-row>
    <div class="el-card-title">
      <h3>Ресурсы</h3>
      <el-button size="small" type="primary" @click.prevent="addResourceItem">
        <font-awesome-icon icon="plus" />
      </el-button>
    </div>
    <el-table v-if="model.items_attributes" :data="model.items_attributes">
      <el-table-column prop="note" label="Ресурс">
        <template slot-scope="scope">
          <autocomplete v-model="scope.row.resource_id" resource="resources{/id}" />
        </template>
      </el-table-column>
      <el-table-column prop="_destroy" label="Удалить" width="120">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row._destroy" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "ResourceSetForm",
  props: {
    model: {
      required: false,
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      rules: {
        required: {
          required: true,
          message: "не может быть пустым"
        }
      }
    };
  }
};
</script>
