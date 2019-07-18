<template>
  <div>
    <el-form-item label="Заголовок" prop="caption">
      <el-input v-model="model.caption" />
    </el-form-item>
    <el-form-item label="Курс" prop="course_id">
      <autocomplete v-model="model.course_id" resource="courses{/id}" />
    </el-form-item>
    <el-row>
      <el-col :span="8">
        <el-form-item prop="default" label="Загружать по умолчанию для всех курсов">
          <el-switch v-model="model.default" active-text="Да" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="Область загрузки" prop="area">
          <el-select v-model="model.area">
            <el-option
              v-for="(label, value) in questionnaire_areas"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <div class="el-card-title">
      <h3>Вопросы</h3>
      <el-button size="small" type="primary" @click.prevent="addItem">
        <font-awesome-icon icon="plus" />
      </el-button>
    </div>
    <el-table v-if="model.items_attributes" :data="model.items_attributes">
      <el-table-column prop="question" label="Вопрос">
        <template slot-scope="scope">
          <el-input v-model="scope.row.question" />
        </template>
      </el-table-column>
      <el-table-column prop="number" label="Сортировка" width="120">
        <template slot-scope="scope">
          <el-input v-model="scope.row.number" />
        </template>
      </el-table-column>
      <el-table-column prop="not_calc" label="Не считать" width="120">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.not_calc" />
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
  name: "QuestionnaireForm",
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
        name: {
          required: true,
          message: "не может быть пустым"
        },
        contract_type: {
          required: true,
          message: "не может быть пустым"
        }
      },
      customers: []
    };
  },
  computed: {
    ...mapGetters({
      questionnaire_areas: "constants/questionnaire_areas"
    })
  },
  created() {
    if (this.model.customer) {
      this.customers.push(this.model.customer);
    }
  },
  methods: {
    addItem() {
      this.model.items_attributes.push({});
    },
    formatArea(col, index, value) {
      return this.questionnaire_areas[value];
    }
  }
};
</script>
