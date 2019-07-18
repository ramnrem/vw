<template>
  <div>
    <el-form-item label="ФИО" prop="name">
      <el-input v-model="model.name" />
    </el-form-item>
    <el-row :gutter="18">
      <el-col :span="6">
        <el-form-item label="E-mail" prop="email">
          <el-input v-model="model.email" />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="Телефон" prop="phone">
          <el-input v-model="model.phone" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="18">
      <el-col :span="6">
        <el-form-item label="Код" prop="code">
          <el-input v-model="model.code" />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="Пользователь" prop="user_id">
          <autocomplete v-model="model.user_id" resource="users{/id}" />
        </el-form-item>
      </el-col>
    </el-row>
    <div class="el-spacer"></div>
    <div class="el-card-title">
      <h3>Достижение личных KPI</h3>
      <el-button size="small" type="primary" @click.prevent="addKPI">
        <font-awesome-icon icon="plus" />
      </el-button>
    </div>
    <el-table :data="model.kpis_attributes">
      <el-table-column prop="begin_date" label="Период с" width="240">
        <template slot-scope="scope">
          <el-date-picker
            :picker-options="{firstDayOfWeek:1}"
            v-model="scope.row.begin_date"
            format="dd.MM.yyyy"
            value-format="yyyy-MM-dd"
          />
        </template>
      </el-table-column>
      <el-table-column prop="end_date" label="Период по" width="240">
        <template slot-scope="scope">
          <el-date-picker
            :picker-options="{firstDayOfWeek:1}"
            v-model="scope.row.end_date"
            format="dd.MM.yyyy"
            value-format="yyyy-MM-dd"
          />
        </template>
      </el-table-column>
      <el-table-column prop="reached" label="Достиг KPI" width="120">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.reached" />
        </template>
      </el-table-column>
      <el-table-column prop="note" label="Комментарий">
        <template slot-scope="scope">
          <el-input v-model="scope.row.note" />
        </template>
      </el-table-column>
      <el-table-column prop="_destroy" label="Удалить" width="120">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row._destroy" />
        </template>
      </el-table-column>
    </el-table>
    <div class="el-spacer"></div>
    <div class="el-card-title">
      <h3>Ассистенты</h3>
      <el-button size="small" type="primary" @click.prevent="addAssistant">
        <font-awesome-icon icon="plus" />
      </el-button>
    </div>
    <el-table v-if="model.assistants_attributes" :data="model.assistants_attributes">
      <el-table-column prop="note" label="Ассистент">
        <template slot-scope="scope">
          <autocomplete v-model="scope.row.assistant_id" resource="managers{/id}" />
        </template>
      </el-table-column>
      <el-table-column prop="_destroy" label="Удалить" width="120">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row._destroy" />
        </template>
      </el-table-column>
    </el-table>
    <div class="el-spacer"></div>
    <div class="el-card-title">
      <h3>Тарифы</h3>
      <el-button size="small" type="primary" @click.prevent="addTariff">
        <font-awesome-icon icon="plus"/>
      </el-button>
    </div>
    <el-table v-if="model.manager_tariffs_attributes" :data="model.manager_tariffs_attributes">
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
          <autocomplete v-model="scope.row.tariff_id" resource="tariffs{/id}" />
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
import { mapGetters } from "vuex";

export default {
  name: "ManagerForm",
  props: {
    model: {
      required: false,
      type: Object,
      default: {}
    },
    mode: {
      required: false,
      type: String,
      default: "default"
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
    addKPI() {
      this.model.kpis_attributes.push({});
    },
    addAssistant() {
      this.model.assistants_attributes.push({});
    },
    addTariff() {
      this.model.manager_tariffs_attributes.push({});
    }
  }
};
</script>
