<template>
  <div>
    <el-row :gutter="18" type="flex">
      <el-col>
        <el-form-item label="Имя" prop="name" :rules="rules.required">
          <el-input v-model="model.name"/>
        </el-form-item>
        <el-form-item label="Пользователь" prop="user_id" :rules="rules.required">
          <relation-select-input
            v-model="model.user_id"
            resource="users{/id}{/action_name}"
            grid="user-grid"
            form="user-form"
            value-label="name"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <div class="el-spacer"></div>
    <div class="el-card-title">
      <h3>Тарифы</h3>
      <el-button size="small" type="primary" @click.prevent="addTariff">        
        <font-awesome-icon icon="plus"/>
      </el-button>
    </div>
    <el-table v-if="model.assistant_tariffs_attributes" :data="model.assistant_tariffs_attributes">
      <el-table-column prop="start" label="Дата начала">
        <template slot-scope="scope">
          <el-date-picker
            :picker-options="{firstDayOfWeek:1}"
            v-model="scope.row.start"
            format="dd.MM.yyyy"
            value-format="yyyy-MM-dd"
          />
        </template>
      </el-table-column>
      <el-table-column prop="tariff_id" label="Тариф">
        <template slot-scope="scope">
          <autocomplete v-model="scope.row.tariff_id" resource="tariffs{/id}"/>
        </template>
      </el-table-column>
      <el-table-column prop="_destroy" label="Удалить" width="120">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row._destroy"/>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "AssistantForm",
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
  },
  methods: {
    addTariff() {
      this.model.assistant_tariffs_attributes.push({});
    }
  }
};
</script>